const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

/**
 * GET /api/researchers
 * Returns all students listed in srlStudents.json logic but fetched from DB.
 * Merges students_details and member_cv_profiles.
 */
router.get("/researchers", async (req, res, next) => {
    try {
        // Fetch all student details
        const { data: details, error: detailsError } = await supabase
            .from("students_details")
            .select("*");

        if (detailsError) {
            if (detailsError.code === "42P01") return res.json({ researchers: [], warning: "students_details table missing" });
            throw detailsError;
        }

        // Fetch all CV profiles for extended info
        const { data: profiles, error: profilesError } = await supabase
            .from("member_cv_profiles")
            .select("*");

        if (profilesError && profilesError.code !== "42P01") throw profilesError;

        // Fetch all publications to aggregate counts
        const { data: allPubs } = await supabase
            .from("publications")
            .select("title, enrollment_nos");

        const profileMap = {};
        (profiles || []).forEach(p => {
            const en = (p.enrollment_no || "").trim().toUpperCase();
            profileMap[en] = p;
        });

        const researchers = (details || []).map(s => {
            const en = (s.enrollment_no || "").trim().toUpperCase();
            const prof = profileMap[en] || {};
            
            // Try to parse full data from 'projects' column which we use as a JSON store
            let extended = {};
            try {
                if (prof.projects) {
                    extended = typeof prof.projects === 'string' ? JSON.parse(prof.projects) : prof.projects;
                }
            } catch (e) {
                // ignore parse errors
            }

            // Aggregate publications for this student
            const studentPubs = (allPubs || []).filter(p => {
                const nos = (p.enrollment_nos || "").split(",").map(n => n.trim().toUpperCase());
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
                research: prof.research_area ? prof.research_area.split(',').map(r => r.trim()) : (extended.research || []),
                researchWorksCount: studentPubs.length || (extended.papersPublishedCount ?? 0),
                hackathonsCount: prof.hackathons ? (Array.isArray(prof.hackathons) ? prof.hackathons.length : prof.hackathons.split(',').length) : (extended.hackathonsCount ?? 0),
                achievements_extended: extended.achievements_extended || null,
                srlPublications: extended.srlPublications || []
            };
        });

        res.json({ researchers });
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/researchers/sync
 */
router.post("/researchers/sync", async (req, res, next) => {
    try {
        const { type, data } = req.body;

        if (type === 'achievements') {
            for (const [name, info] of Object.entries(data)) {
                const { data: student } = await supabase
                    .from("students_details")
                    .select("enrollment_no")
                    .ilike("student_name", name)
                    .single();

                if (student) {
                    const en = student.enrollment_no;
                    // Fetch existing projects data to partially update
                    const { data: current } = await supabase.from("member_cv_profiles").select("projects").eq("enrollment_no", en).single();
                    let extended = {};
                    try { if (current && current.projects) extended = typeof current.projects === 'string' ? JSON.parse(current.projects) : current.projects; } catch(e){}

                    extended.achievements_extended = info;
                    
                    await supabase
                        .from("member_cv_profiles")
                        .upsert({
                            enrollment_no: en,
                            hackathons: JSON.stringify(info.hackathons || []),
                            research_area: Array.isArray(info.researchWork) ? info.researchWork.join(',') : "",
                            projects: JSON.stringify(extended) // Using projects as JSON store
                        }, { onConflict: 'enrollment_no' });
                }
            }
        } else if (type === 'publications') {
            for (const [name, pubs] of Object.entries(data)) {
                const { data: student } = await supabase
                    .from("students_details")
                    .select("enrollment_no")
                    .ilike("student_name", name)
                    .single();

                if (student) {
                    const en = student.enrollment_no;
                    const { data: current } = await supabase.from("member_cv_profiles").select("projects").eq("enrollment_no", en).single();
                    let extended = {};
                    try { if (current && current.projects) extended = typeof current.projects === 'string' ? JSON.parse(current.projects) : current.projects; } catch(e){}

                    extended.srlPublications = pubs;

                    await supabase
                        .from("member_cv_profiles")
                        .upsert({
                            enrollment_no: en,
                            projects: JSON.stringify(extended)
                        }, { onConflict: 'enrollment_no' });
                }
            }
        }

        res.json({ message: "Sync successful" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
