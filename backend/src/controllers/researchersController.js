const prisma = require('../lib/prisma');
const { filterOutTestAndAdminUsers } = require('../lib/adminUtils');

// GET /api/researchers
exports.getResearchers = async (req, res, next) => {
    try {
        // Fetch all student details
        const details = await prisma.studentsDetail.findMany();

        // Filter out admin and test users from details
        const filteredDetails = filterOutTestAndAdminUsers(details);

        // Fetch all CV profiles for extended info
        const profiles = await prisma.memberCvProfile.findMany();

        // Fetch all publications to aggregate counts
        const allPubs = await prisma.publication.findMany({
          select: {
            title: true,
            enrollment_nos: true,
          },
        });

        const profileMap = {};
        (profiles || []).forEach(p => {
            const en = (p.enrollment_no || "").trim().toUpperCase();
            profileMap[en] = p;
        });

        const researchers = (filteredDetails || []).map(s => {
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
};

// POST /api/researchers/sync
exports.syncResearchers = async (req, res, next) => {
    try {
        const { type, data } = req.body;

        if (type === 'achievements') {
            for (const [name, info] of Object.entries(data)) {
                const student = await prisma.studentsDetail.findFirst({
                  where: {
                    student_name: {
                      contains: name,
                      mode: 'insensitive',
                    },
                  },
                });

                if (student) {
                    const en = student.enrollment_no;
                    // Fetch existing projects data to partially update
                    const current = await prisma.memberCvProfile.findUnique({
                      where: {
                        enrollment_no: en,
                      },
                      select: {
                        projects: true,
                      },
                    });

                    let extended = {};
                    try { 
                      if (current && current.projects) {
                        extended = typeof current.projects === 'string' ? JSON.parse(current.projects) : current.projects;
                      }
                    } catch(e){}

                    extended.achievements_extended = info;
                    
                    await prisma.memberCvProfile.upsert({
                      where: { enrollment_no: en },
                      update: {
                        hackathons: JSON.stringify(info.hackathons || []),
                        research_area: Array.isArray(info.researchWork) ? info.researchWork.join(',') : "",
                        projects: JSON.stringify(extended), // Using projects as JSON store
                      },
                      create: {
                        enrollment_no: en,
                        hackathons: JSON.stringify(info.hackathons || []),
                        research_area: Array.isArray(info.researchWork) ? info.researchWork.join(',') : "",
                        projects: JSON.stringify(extended),
                      },
                    });
                }
            }
        } else if (type === 'publications') {
            for (const [name, pubs] of Object.entries(data)) {
                const student = await prisma.studentsDetail.findFirst({
                  where: {
                    student_name: {
                      contains: name,
                      mode: 'insensitive',
                    },
                  },
                });

                if (student) {
                    const en = student.enrollment_no;
                    const current = await prisma.memberCvProfile.findUnique({
                      where: { enrollment_no: en },
                      select: { projects: true },
                    });

                    let extended = {};
                    try { 
                      if (current && current.projects) {
                        extended = typeof current.projects === 'string' ? JSON.parse(current.projects) : current.projects;
                      }
                    } catch(e){}

                    extended.srlPublications = pubs;

                    await prisma.memberCvProfile.upsert({
                      where: { enrollment_no: en },
                      update: {
                        projects: JSON.stringify(extended),
                      },
                      create: {
                        enrollment_no: en,
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
};
