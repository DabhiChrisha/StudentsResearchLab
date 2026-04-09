const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

// Helper to parse comma-separated or JSON list strings into arrays
function parseList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    // Try JSON parse first
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Not JSON, assume comma-separated
    }
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

router.get("/researchers", async (req, res, next) => {
  try {
    // 1. Fetch all student details
    const { data: students, error: studentsError } = await supabase
      .from("students_details")
      .select("*");

    if (studentsError) throw studentsError;

    // 2. Fetch all CV profiles for extended info (research areas, work summary)
    const { data: profiles, error: profilesError } = await supabase
      .from("member_cv_profiles")
      .select("*");

    const profileMap = {};
    (profiles || []).forEach((p) => {
      if (p.enrollment_no) {
        profileMap[p.enrollment_no.trim().toUpperCase()] = p;
      }
    });

    // 3. Format researchers
    const researchers = students.map((s) => {
      const enroll = (s.enrollment_no || "").trim().toUpperCase();
      const profile = profileMap[enroll] || {};
      
      // Determine roles based on student_name and member_type
      const raNames = ["Kandarp Gajjar", "Nancy Patel", "Poojan Ghetiya"];
      const isRA = raNames.some(name => (s.student_name || "").includes(name));
      const roles = [];
      if (isRA) roles.push("Research Assistant");
      if (s.member_type) roles.push(s.member_type);
      if (roles.length === 0) roles.push("Member");

      return {
        student_name: s.student_name,
        enrollment_no: s.enrollment_no,
        semester: s.semester || "6",
        department: s.department || "CE",
        photo: s.profile_image || "/students/schoolstudent.png",
        email: s.email || "",
        linkedin: "", // Social links not in students_details table yet
        reflection: profile.research_work_summary || "",
        research: parseList(profile.research_area),
        roles: roles,
        // Empty placeholders for modal counts handled via separate API calls in frontend
        papersPublished: [],
        researchWorks: [],
        hackathons: parseList(profile.hackathons),
      };
    });

    res.json({ researchers });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
