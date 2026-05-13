const prisma = require("../lib/prisma");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/imageUpload");

// Reject any URL that isn't a full https address so relative/internal paths
// never reach the database.
const sanitizeMediaUrls = (urls) => {
  if (!Array.isArray(urls)) return [];
  return urls.filter((url) => {
    if (!url || typeof url !== "string") return false;
    if (!url.startsWith("https://")) {
      console.warn(`[Sessions] Dropping invalid media URL (not a full https URL): ${url}`);
      return false;
    }
    return true;
  });
};

/**
 * GET /api/admin/sessions
 */
exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await prisma.sessionContent.findMany({
      orderBy: { serial_no: "desc" },
    });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/sessions
 */
exports.createSession = async (req, res, next) => {
  try {
    const { date_raw, session_date, title, description, category, linkedin_url, image_url, media_urls, mediaUrls } = req.body;
    // Support both snake_case and camelCase
    const resolvedMediaUrls = media_urls || mediaUrls || [];



    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    // Handle file upload if a file is present — append to media_urls
    let uploadedUrl = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "srl_sessions",
          req.file.originalname
        );
        if (!uploadResult || !uploadResult.url || !uploadResult.url.startsWith("https://")) {
          throw new Error(`Cloudinary upload returned invalid response: ${JSON.stringify(uploadResult)}`);
        }
        uploadedUrl = uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          error: "Upload failed",
          message: uploadError.message || "Failed to upload media to Cloudinary",
        });
      }
    }

    const isVideoMedia = (url) => {
      if (!url) return false;
      const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".quicktime"];
      const urlLower = url.toLowerCase();
      return (
        videoExtensions.some((ext) => urlLower.includes(ext)) ||
        urlLower.includes("/video/upload/")
      );
    };

    // Only keep URLs that are full https addresses; drop relative/internal paths
    const baseMediaUrls = sanitizeMediaUrls(Array.isArray(resolvedMediaUrls) ? resolvedMediaUrls : []);
    const finalMediaUrls = uploadedUrl ? [...baseMediaUrls, uploadedUrl] : baseMediaUrls;
    
    // Auto-detect type from media_urls
    const detectedType = finalMediaUrls.length > 0 && isVideoMedia(finalMediaUrls[0]) ? "video" : "image";


    // Get the max serial_no and calculate the next one
    const maxSerialNo = await prisma.sessionContent.findFirst({
      orderBy: { serial_no: "desc" },
      select: { serial_no: true },
    });

    const nextSerialNo = (maxSerialNo?.serial_no || 0) + 1;

    const session = await prisma.sessionContent.create({
      data: {
        serial_no: nextSerialNo,
        date_raw: date_raw || null,
        session_date: session_date ? new Date(session_date) : null,
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category ? category.trim() : null,
        type: detectedType,
        linkedin_url: linkedin_url ? linkedin_url.trim() : null,
        image_url: image_url || null,
        media_urls: finalMediaUrls,
        created_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (error) {
    console.error("Create session error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Conflict",
        message: "Duplicate entry error",
      });
    }
    next(error);
  }
};

/**
 * PUT /api/admin/sessions/:id
 */
exports.updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date_raw, session_date, title, description, category, type, linkedin_url, image_url, media_urls, mediaUrls } = req.body;
    // Support both snake_case and camelCase
    const resolvedMediaUrls = media_urls || mediaUrls;

    const isVideoMedia = (url) => {
      if (!url) return false;
      const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".quicktime"];
      const urlLower = url.toLowerCase();
      return (
        videoExtensions.some((ext) => urlLower.includes(ext)) ||
        urlLower.includes("/video/upload/")
      );
    };

    const updateData = {};
    if (date_raw !== undefined) updateData.date_raw = date_raw;
    if (session_date !== undefined) updateData.session_date = session_date ? new Date(session_date) : null;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) {
      updateData.type = type;
    }

    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (image_url !== undefined) updateData.image_url = image_url;

    // Handle file upload if a file is present — append to media_urls
    let uploadedUrl = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "srl_sessions",
          req.file.originalname
        );
        if (!uploadResult || !uploadResult.url || !uploadResult.url.startsWith("https://")) {
          throw new Error(`Cloudinary upload returned invalid response: ${JSON.stringify(uploadResult)}`);
        }
        uploadedUrl = uploadResult.url;
      } catch (uploadError) {
        return res.status(500).json({
          error: "Upload failed",
          message: uploadError.message || "Failed to upload media to Cloudinary",
        });
      }
    }

    if (uploadedUrl) {
      // Only keep valid https URLs from the body, then append the newly uploaded one
      const baseMediaUrls = sanitizeMediaUrls(Array.isArray(resolvedMediaUrls) ? resolvedMediaUrls : []);
      const finalUrls = [...baseMediaUrls, uploadedUrl];
      updateData.media_urls = finalUrls;

      // Auto-detect type if not explicitly provided
      if (type === undefined) {
        updateData.type = isVideoMedia(finalUrls[0]) ? "video" : "image";
      }
    } else if (resolvedMediaUrls !== undefined) {
      // Sanitize body-provided URLs — drop any non-https paths
      const sanitized = sanitizeMediaUrls(Array.isArray(resolvedMediaUrls) ? resolvedMediaUrls : []);
      updateData.media_urls = sanitized;
      // Auto-detect type if not explicitly provided
      if (type === undefined && sanitized.length > 0) {
        updateData.type = isVideoMedia(sanitized[0]) ? "video" : "image";
      }
    }



    const session = await prisma.sessionContent.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Session updated successfully",
      data: session,
    });
  } catch (error) {
    console.error("Update session error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Session not found",
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/admin/sessions/:id
 */
exports.deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.sessionContent.delete({
      where: { id: parseInt(id) },
    });
    res.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Session not found",
      });
    }
    next(error);
  }
};
