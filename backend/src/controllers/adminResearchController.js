const prisma = require("../lib/prisma");
const { broadcast } = require("../utils/sseManager");
const { syncStudentFromJoinRequest } = require("../lib/syncStudentFromJoinRequest");
const { sendApprovalEmail, sendRejectionEmail, isValidEmail } = require("../services/emailService");
const { deleteFromCloudinary, extractPublicId } = require("../utils/imageUpload");
const os = require("os");
const path = require("path");

const serializeForJson = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, val) => (typeof val === "bigint" ? val.toString() : val))
  );

const getJoinStatusFile = () => {
  const dataDir =
    process.env.VERCEL || process.env.NODE_ENV === "production"
      ? path.join(os.tmpdir(), "srl-data")
      : path.join(__dirname, "..", "data");

  return {
    dataDir,
    statusFile: path.join(dataDir, "join_status.json"),
  };
};

/**
 * Get all research papers - GET /api/admin/research
 */
exports.getResearch = async (req, res, next) => {
  try {
    const papers = await prisma.researchPaper.findMany({
      include: { paper_authors: true },
      orderBy: { created_at: "desc" },
    });

    res.json({
      success: true,
      data: papers || [],
    });
  } catch (error) {
    console.error("Get research error:", error);
    next(error);
  }
};

/**
 * Create research paper - POST /api/admin/research
 */
exports.createResearch = async (req, res, next) => {
  try {
    const { title, authors = [], publishing_year, link_to_paper, link_to_pdf, type_of_event } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    const paper = await prisma.researchPaper.create({
      data: {
        title,
        publishing_year: publishing_year || new Date().getFullYear(),
        link_to_paper: link_to_paper || null,
        link_to_pdf: link_to_pdf || null,
        type_of_event: type_of_event || null,
        paper_authors: {
          create: Array.isArray(authors)
            ? authors.map((author) => ({
                author_name: author,
                is_srl_member: null,
              }))
            : [],
        },
      },
      include: { paper_authors: true },
    });

    res.status(201).json({
      success: true,
      message: "Research paper created successfully",
      data: paper,
    });
  } catch (error) {
    console.error("Create research error:", error);
    next(error);
  }
};

/**
 * Update research paper - PUT /api/admin/research/:id
 */
exports.updateResearch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, file_url, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (file_url) updateData.link_to_paper = file_url;

    const paper = await prisma.researchPaper.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { paper_authors: true },
    });

    res.json({
      success: true,
      message: "Research paper updated successfully",
      data: paper,
    });
  } catch (error) {
    console.error("Update research error:", error);
    next(error);
  }
};

/**
 * Delete research paper - DELETE /api/admin/research/:id
 */
exports.deleteResearch = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.researchPaper.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Research paper deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Research paper not found",
      });
    }
    console.error("Delete research error:", error);
    next(error);
  }
};

/**
 * Get all join requests - GET /api/admin/join-requests
 * Merges in locally-stored statuses from JSON file (no DB column yet).
 */
exports.getJoinRequests = async (req, res, next) => {
  try {
    const requests = await prisma.joinUs.findMany({
      orderBy: { created_at: "desc" },
    });

    // Load statuses from local JSON file (if exists)
    const fs = require("fs");
    const { statusFile } = getJoinStatusFile();
    let statuses = {};
    try {
      if (fs.existsSync(statusFile)) {
        const raw = fs.readFileSync(statusFile, "utf8");
        statuses = JSON.parse(raw || "{}");
      }
    } catch (err) {
      console.error("Failed to read join_status.json:", err.message);
      statuses = {};
    }

    const merged = serializeForJson(requests || []).map((r) => ({
      ...r,
      status: statuses[String(r.id)] || "pending",
    }));

    res.json({
      success: true,
      data: merged,
    });
  } catch (error) {
    console.error("Get join requests error:", error);
    next(error);
  }
};

/**
 * Approve/Reject join request - PUT /api/admin/join-requests/:id
 */
exports.updateJoinRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawStatus = String(req.body.status || '').trim().toLowerCase();
    const normalizedStatusMap = {
      approved: 'approved',
      approve: 'approved',
      accepted: 'approved',
      rejected: 'rejected',
      reject: 'rejected',
      declined: 'rejected',
      pending: 'pending',
    };
    const status = normalizedStatusMap[rawStatus];

    console.log(`[Join Request] updateJoinRequest called for id=${id} status=${rawStatus} normalized=${status} by admin=${req.admin?.email}`);
    if (!status) {
      return res.status(400).json({
        error: "Invalid input",
        message: "status must be 'pending', 'approved' or 'rejected'",
      });
    }

    const joinRequest = await prisma.joinUs.findUnique({
      where: { id: BigInt(id) },
    });

    console.log(`[Join Request] fetched joinRequest id=${id} email=${joinRequest?.email} status=${joinRequest?.status}`);

    if (!joinRequest) {
      return res.status(404).json({
        error: "Not found",
        message: "Join request not found",
      });
    }

    const currentStatus = String(joinRequest.status || '').trim().toLowerCase();
    if (currentStatus === status) {
      return res.status(409).json({
        error: "Conflict",
        message: `Join request is already ${status}`,
      });
    }

    let updatedResumeLink = joinRequest.resume_link;
    if (status === "rejected" && joinRequest.resume_link) {
      const publicId = extractPublicId(joinRequest.resume_link);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId, "raw");
          console.log(`[Join Request] Deleted rejected resume from Cloudinary: ${publicId}`);
        } catch (err) {
          console.error("Failed to delete resume from Cloudinary:", err);
        }
      }
      updatedResumeLink = null;
    }

    // Update status in the database FIRST — capture the updated record
    const updatedJoinRequest = await prisma.joinUs.update({
      where: { id: BigInt(id) },
      data: { status: status, resume_link: updatedResumeLink },
    });

    let syncedStudent = null;
    if (status === "approved") {
      // Use the fresh DB record for further processing and email
      const freshRequest = updatedJoinRequest || joinRequest;

      const { student, created } = await syncStudentFromJoinRequest(freshRequest);
      syncedStudent = serializeForJson(student);
      console.log(
        `[Join Request] ${created ? "Created" : "Updated"} student ${student.enrollment_no} from approved request ${id}`,
      );

      const recipientEmail = String(freshRequest.email || "").trim();
      if (!recipientEmail || !isValidEmail(recipientEmail)) {
        console.error(
          `[Join Request] Approval email skipped for request ${id}: invalid applicant email '${freshRequest.email}'`,
        );
      } else {
        console.log(
          `[Join Request] Approval email execution starting for request ${id}: sending to ${recipientEmail}`,
        );

        try {
          const info = await sendApprovalEmail({ to: recipientEmail, studentName: freshRequest.name });
          console.log(
            `[Approval Email] Sent approval email for request ${id} to ${recipientEmail}: accepted=${JSON.stringify(
              info.accepted,
            )}, rejected=${JSON.stringify(info.rejected)}, messageId=${info.messageId}`,
          );
        } catch (emailErr) {
          console.error(
            `[Email Error] Failed to send approval email to ${recipientEmail} for request ID ${id}:`,
            emailErr,
          );
        }
      }
    }

    if (status === "rejected") {
      const recipientEmail = String(joinRequest.email || "").trim();
      if (!recipientEmail || !isValidEmail(recipientEmail)) {
        console.error(
          `[Join Request] Rejection email skipped for request ${id}: invalid applicant email '${joinRequest.email}'`,
        );
      } else {
        console.log(
          `[Join Request] Rejection email execution starting for request ${id}: sending to ${recipientEmail}`,
        );

        try {
          const info = await sendRejectionEmail({ to: recipientEmail, studentName: joinRequest.name });
          console.log(
            `[Rejection Email] Sent rejection email for request ${id} to ${recipientEmail}: accepted=${JSON.stringify(
              info.accepted,
            )}, rejected=${JSON.stringify(info.rejected)}, messageId=${info.messageId}`,
          );
        } catch (emailErr) {
          console.error(
            `[Email Error] Failed to send rejection email to ${recipientEmail} for request ID ${id}:`,
            emailErr,
          );
        }
      }
    }

    // Persist status to local JSON file (legacy fallback)
    const fs = require("fs");
    const { dataDir, statusFile } = getJoinStatusFile();

    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    let statuses = {};
    if (fs.existsSync(statusFile)) {
      const raw = fs.readFileSync(statusFile, "utf8");
      statuses = JSON.parse(raw || "{}");
    }

    statuses[String(id)] = status;
    fs.writeFileSync(statusFile, JSON.stringify(statuses, null, 2), "utf8");

    broadcast("join_request_changed", { id, status, action: "updated" });
    res.json({
      success: true,
      message:
        status === "approved"
          ? "Join request approved and student record synced"
          : "Join request status saved",
      data: { id, status, student: syncedStudent },
    });
  } catch (error) {
    console.error("Update join request error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message:
          error.message ||
          "A student with this enrollment or email already exists",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Approval failed",
      message: "Failed to update join request",
    });
  }
};

/**
 * Delete join request - DELETE /api/admin/join-requests/:id
 */
exports.deleteJoinRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const joinRequest = await prisma.joinUs.findUnique({
      where: { id: BigInt(id) },
    });

    if (!joinRequest) {
      return res.status(404).json({
        error: "Not found",
        message: "Join request not found",
      });
    }

    if (joinRequest.resume_link) {
      const publicId = extractPublicId(joinRequest.resume_link);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId, "raw");
          console.log(`[Join Request] Deleted resume from Cloudinary for deleted request ${id}`);
        } catch (err) {
          console.error("Failed to delete resume from Cloudinary:", err);
        }
      }
    }

    await prisma.joinUs.delete({
      where: { id: BigInt(id) },
    });

    broadcast("join_request_changed", { id, action: "deleted" });
    res.json({
      success: true,
      message: "Join request deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Join request not found",
      });
    }
    console.error("Delete join request error:", error);
    next(error);
  }
};

/**
 * Get join request resume - GET /api/admin/join-requests/:id/resume
 * Proxies the PDF from Cloudinary so it can be displayed inline
 */
exports.getJoinRequestResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const joinRequest = await prisma.joinUs.findUnique({
      where: { id: BigInt(id) },
    });

    if (!joinRequest || !joinRequest.resume_link) {
      return res.status(404).json({
        error: "Not found",
        message: "Resume not found for this request",
      });
    }

    // Fetch the PDF from Cloudinary
    console.log(`[getJoinRequestResume] Fetching from Cloudinary: ${joinRequest.resume_link}`);
    const response = await fetch(joinRequest.resume_link, {
      headers: {
        "User-Agent": "Mozilla/5.0", // some CDNs block headless fetches
      },
    });
    if (!response.ok) {
      console.error(`[getJoinRequestResume] Fetch failed. Status: ${response.status} ${response.statusText}, URL: ${joinRequest.resume_link}`);
      throw new Error(`Failed to fetch from Cloudinary: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="resume_${id}.pdf"`);
    res.send(buffer);
  } catch (error) {
    console.error("Get join request resume error:", error);
    next(error);
  }
};
