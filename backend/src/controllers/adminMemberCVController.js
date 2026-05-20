const prisma = require("../lib/prisma");
const { broadcast } = require("../utils/sseManager");

const serializeForJson = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, val) => (typeof val === "bigint" ? val.toString() : val))
  );

let memberCvColumnsCache = null;

const MEMBER_CV_SELECTABLE_FIELDS = [
  "id",
  "enrollment_no",
  "student_name",
  "hackathons",
  "research_papers",
  "created_at",
  "updated_at",
  "department",
  "institute",
  "organization",
  "research_work",
  "leadership",
  "awards",
  "certifications",
  "additional_achievements",
  "internships",
  "reflection",
  "linkedin_id",
  "research_areas",
  "branch",
];

const MEMBER_CV_WRITABLE_FIELDS = [
  "student_name",
  "linkedin_id",
  "department",
  "institute",
  "organization",
  "reflection",
  "branch",
  "research_areas",
  "hackathons",
  "research_papers",
  "research_work",
  "leadership",
  "awards",
  "certifications",
  "additional_achievements",
  "internships",
  "updated_at",
];

async function getMemberCvColumns() {
  if (memberCvColumnsCache) return memberCvColumnsCache;

  // Cast column_name to text because Postgres `name` type may be unsupported
  // by the Prisma raw deserializer (P2010). Casting ensures Prisma receives
  // a supported type (text -> string).
  const rows = await prisma.$queryRaw`
    SELECT column_name::text as column_name
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'member_cv_profiles'
  `;

  memberCvColumnsCache = new Set(rows.map((r) => r.column_name));
  return memberCvColumnsCache;
}

function buildMemberCvSelect(existingColumns) {
  const select = {};
  for (const field of MEMBER_CV_SELECTABLE_FIELDS) {
    if (existingColumns.has(field)) {
      select[field] = true;
    }
  }
  return select;
}

function filterMemberCvDataByColumns(data, existingColumns) {
  const filtered = {};
  for (const field of MEMBER_CV_WRITABLE_FIELDS) {
    if (existingColumns.has(field) && Object.prototype.hasOwnProperty.call(data, field)) {
      filtered[field] = data[field];
    }
  }
  return filtered;
}

/**
 * GET /api/admin/member-cv?enrollment_no=...
 */
exports.getMemberCVByEnrollment = async (req, res, next) => {
  try {
    const { enrollment_no } = req.query;
    const requestUser = req.user;

    if (!enrollment_no) {
      return res.status(400).json({
        success: false,
        message: "enrollment_no query parameter is required",
      });
    }

    if (requestUser && !requestUser.isAdmin) {
      const requestedEnrollment = String(enrollment_no);
      const userEnrollment = String(requestUser.enrollmentNo || "");
      if (!userEnrollment || requestedEnrollment !== userEnrollment) {
        return res.status(403).json({ success: false, message: "You can only view your own profile" });
      }
    }

    const existingColumns = await getMemberCvColumns();
    const memberCVSelect = buildMemberCvSelect(existingColumns);

    const memberCV = await prisma.memberCvProfile.findUnique({
      where: { enrollment_no: String(enrollment_no) },
      select: {
        ...memberCVSelect,
        patents: true,
        students_details: {
          select: {
            batch: true,
            profile_image: true,
          },
        },
      },
    });


    if (!memberCV) {
      return res.json({ success: true, data: null, message: "No CV profile found - using defaults" });
    }

    const serialized = serializeForJson(memberCV);
    // Merge fields from students_details so the frontend can display them
    serialized.batch = memberCV.students_details?.batch || null;
    serialized.profile_image = memberCV.students_details?.profile_image || null;

    res.json({ success: true, data: serialized });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/member-cv
 */
exports.updateMemberCV = async (req, res, next) => {
  try {
    const {
      enrollment_no,
      student_name,
      linkedin_id,
      batch,
      department,
      institute,
      organization,
      reflection,
      profile_image,
      branch,
      research_areas,
      hackathons,
      research_papers,
      research_work,
      leadership,
      awards,
      certifications,
      additional_achievements,
      internships,
      patents,
    } = req.body;

    if (!enrollment_no) {
      return res.status(400).json({ success: false, message: "enrollment_no is required" });
    }

    const requestUser = req.user;
    if (requestUser && !requestUser.isAdmin) {
      if (String(enrollment_no) !== String(requestUser.enrollmentNo || "")) {
        return res.status(403).json({ success: false, message: "You can only edit your own profile" });
      }
    }

    const existingColumns = await getMemberCvColumns();

    const existingMemberCV = await prisma.memberCvProfile.findUnique({
      where: { enrollment_no: String(enrollment_no) },
      select: { id: true },
    });

    let memberCV;

    // The database is missing the `department` column; treat the incoming
    // `department` value as the `branch` field (they are the same in this
    // deployment). Do not attempt to read/write `department` on the
    // `member_cv_profiles` table to avoid P2022 errors.
    const cvData = {
      student_name:    student_name || undefined,
      linkedin_id:     linkedin_id ?? null,
      institute:       institute ?? null,
      organization:    organization ?? null,
      reflection:      reflection ?? null,
      // Map department -> branch when branch not provided
      branch:          branch ?? department ?? null,
      research_areas:          research_areas          || [],
      hackathons:              hackathons              || [],
      research_papers:         research_papers         || [],
      research_work:           research_work           || [],
      leadership:              leadership              || [],
      awards:                  awards                  || [],
      certifications:          certifications          || [],
      additional_achievements: additional_achievements || [],
      internships:             internships             || [],
    };

    const safeCvData = filterMemberCvDataByColumns(cvData, existingColumns);

    if (existingMemberCV) {
      memberCV = await prisma.memberCvProfile.update({
        where: { enrollment_no: String(enrollment_no) },
        data: {
          ...safeCvData,
          ...(existingColumns.has("updated_at") ? { updated_at: new Date() } : {}),
        },
      });
    } else {
      // For create, student_name is required — use "Unknown" as fallback
      const { student_name: _sn, ...cvDataWithoutName } = safeCvData;
      memberCV = await prisma.memberCvProfile.create({
        data: {
          ...(existingColumns.has("enrollment_no") ? { enrollment_no: String(enrollment_no) } : {}),
          ...(existingColumns.has("student_name") ? { student_name: student_name || "Unknown" } : {}),
          ...cvDataWithoutName,
        },
      });
    }

    // profile_image lives in students_details — update it there if provided
    if (batch !== undefined || profile_image !== undefined) {
      try {
        // use updateMany to avoid throwing if the students_details row doesn't exist
        const studentDetailData = {};
        if (batch !== undefined) studentDetailData.batch = String(batch || "").trim();
        if (profile_image !== undefined) studentDetailData.profile_image = profile_image || null;

        if (Object.keys(studentDetailData).length > 0) {
          await prisma.studentsDetail.updateMany({
            where: { enrollment_no: String(enrollment_no) },
            data: studentDetailData,
          });
        }
      } catch (e) {
        console.warn(`[Member CV] studentsDetail update warning for ${enrollment_no}:`, e?.message || e);
      }
    }

    // Sync patents if provided (merge: upsert so existing patents are preserved)
    if (Array.isArray(patents)) {
      try {
        // For each patent, upsert (create if not exists, update if exists by application_number)
        for (const p of patents) {
          if (!p || (!p.patent_title && !p.application_number)) continue; // skip invalid entries

          const appNumber = p.application_number || null;
          if (!appNumber) continue; // require application_number as unique key

          await prisma.patents.upsert({
            where: { application_number: appNumber },
            update: {
              patent_title: p.patent_title || "",
              application_date: p.application_date ? new Date(p.application_date) : undefined,
              application_status: p.application_status || "Filed",
            },
            create: {
              enrollment_no: String(enrollment_no),
              patent_title: p.patent_title || "",
              application_date: p.application_date ? new Date(p.application_date) : undefined,
              application_status: p.application_status || "Filed",
              application_number: appNumber,
            },
          });
        }
      } catch (e) {
        console.error(`[Member CV] patents sync error for ${enrollment_no}:`, e?.message || e);
        // don't fail the whole request for patents sync; continue
      }
    }

    broadcast("student_changed", { enrollment_no: String(enrollment_no) });

    const refreshedMemberCVSelect = buildMemberCvSelect(existingColumns);
    const refreshedMemberCV = await prisma.memberCvProfile.findUnique({
      where: { enrollment_no: String(enrollment_no) },
      select: {
        ...refreshedMemberCVSelect,
        patents: true,
        students_details: {
          select: {
            batch: true,
            profile_image: true,
          },
        },
      },
    });

    const serialized = serializeForJson(refreshedMemberCV || memberCV);
    serialized.batch = refreshedMemberCV?.students_details?.batch || null;
    serialized.profile_image = refreshedMemberCV?.students_details?.profile_image || null;

    res.json({ success: true, data: serialized, message: "CV profile updated successfully" });
  } catch (error) {
    console.error("[Member CV] Update error:", error);
    next(error);
  }
};

/**
 * GET /api/admin/member-cv/all  (admin only)
 */
exports.getAllMemberCVs = async (req, res, next) => {
  try {
    const existingColumns = await getMemberCvColumns();
    const memberCVSelect = buildMemberCvSelect(existingColumns);

    // Use dynamic select so we query only columns that exist in this DB.
    const memberCVs = await prisma.memberCvProfile.findMany({
      select: {
        ...memberCVSelect,
        patents: true,
        students_details: {
          select: { batch: true, profile_image: true },
        },
      },
      ...(existingColumns.has("updated_at") ? { orderBy: { updated_at: "desc" } } : {}),
    });

    const serialized = serializeForJson(memberCVs).map((profile) => ({
      ...profile,
      batch: profile.students_details?.batch || null,
      profile_image: profile.students_details?.profile_image || null,
    }));

    res.json({ success: true, data: serialized, count: memberCVs.length });
  } catch (error) {
    next(error);
  }
};
