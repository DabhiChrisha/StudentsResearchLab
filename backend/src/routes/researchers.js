const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/researchers", async (req, res, next) => {
  try {
    const [details, profiles, allPubs] = await Promise.all([
      prisma.studentsDetail.findMany(),
      prisma.memberCvProfile.findMany(),
      prisma.publication.findMany({ select: { title: true, enrollment_nos: true } }),
    ]);

    const profileMap = {};
    profiles.forEach((p) => {
      const en = (p.enrollment_no || "").trim().toUpperCase();
      profileMap[en] = p;
    });

    const researchers = details.map((s) => {
      const en = (s.enrollment_no || "").trim().toUpperCase();
      const prof = profileMap[en] || {};

      let extended = {};
      try {
        if (prof.projects) {
          extended = typeof prof.projects === "string" ? JSON.parse(prof.projects) : prof.projects;
        }
      } catch (e) {
        // ignore
      }

      const studentPubs = allPubs.filter((p) => {
        const nos = (p.enrollment_nos || "").split(",").map((n) => n.trim().toUpperCase());
        return nos.includes(en);
      });

      return {
        student_name: s.student_name,
        enrollment_no: en,
        photo: s.profile_image || extended.photo || "/students/schoolstudent.png",
        department: s.department || extended.department || "CE",
        semester: s.semester || extended.semester || "6th",
        batch: s.batch || extended.batch || "-",
        email: extended.email || "",
        linkedin: extended.linkedin || "",
        reflection: extended.reflection || "",
        roles: extended.roles ? extended.roles : (en ? ["Member"] : []),
        research: prof.research_area
          ? prof.research_area.split(",").map((r) => r.trim())
          : (extended.research || []),
        researchWorksCount: studentPubs.length || (extended.papersPublishedCount ?? 0),
        hackathonsCount: prof.hackathons
          ? (Array.isArray(prof.hackathons) ? prof.hackathons.length : String(prof.hackathons).split(",").length)
          : (extended.hackathonsCount ?? 0),
        achievements_extended: extended.achievements_extended || null,
        srlPublications: extended.srlPublications || [],
      };
    });

    res.json({ researchers });
  } catch (err) {
    next(err);
  }
});

router.post("/researchers/sync", async (req, res, next) => {
  try {
    const { type, data } = req.body;

    if (type === "achievements") {
      for (const [name, info] of Object.entries(data)) {
        const student = await prisma.studentsDetail.findFirst({
          where: { student_name: { contains: name, mode: "insensitive" } },
          select: { enrollment_no: true },
        });

        if (student) {
          const en = student.enrollment_no;
          const current = await prisma.memberCvProfile.findUnique({
            where: { enrollment_no: en },
            select: { projects: true },
          });

          let extended = {};
          try {
            if (current?.projects) {
              extended = typeof current.projects === "string" ? JSON.parse(current.projects) : current.projects;
            }
          } catch (e) {}

          extended.achievements_extended = info;

          await prisma.memberCvProfile.upsert({
            where: { enrollment_no: en },
            create: {
              enrollment_no: en,
              student_name: name,
              hackathons: JSON.stringify(info.hackathons || []),
              research_area: Array.isArray(info.researchWork) ? info.researchWork.join(",") : "",
              projects: JSON.stringify(extended),
            },
            update: {
              hackathons: JSON.stringify(info.hackathons || []),
              research_area: Array.isArray(info.researchWork) ? info.researchWork.join(",") : "",
              projects: JSON.stringify(extended),
            },
          });
        }
      }
    } else if (type === "publications") {
      for (const [name, pubs] of Object.entries(data)) {
        const student = await prisma.studentsDetail.findFirst({
          where: { student_name: { contains: name, mode: "insensitive" } },
          select: { enrollment_no: true },
        });

        if (student) {
          const en = student.enrollment_no;
          const current = await prisma.memberCvProfile.findUnique({
            where: { enrollment_no: en },
            select: { projects: true },
          });

          let extended = {};
          try {
            if (current?.projects) {
              extended = typeof current.projects === "string" ? JSON.parse(current.projects) : current.projects;
            }
          } catch (e) {}

          extended.srlPublications = pubs;

          await prisma.memberCvProfile.upsert({
            where: { enrollment_no: en },
            create: {
              enrollment_no: en,
              student_name: name,
              projects: JSON.stringify(extended),
            },
            update: {
              projects: JSON.stringify(extended),
            },
          });
        }
      }
    }

    res.json({ message: "Sync successful" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
