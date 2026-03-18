import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, X, FileText, Eye, Star } from "lucide-react";
import studentsData from "../data/srlStudents.json";
import { supabase } from "../lib/supabaseClient";
import ChromaGrid from "../components/react-bits/ChromaGrid";
import GradientText from "../components/GradientText";


// --- Main Researchers Component ---
export default function Researchers() {
    const [activeStudent, setActiveStudent] = useState(null);
    const [batchMap, setBatchMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Fetch batch data from Supabase students_details table
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const { data, error } = await supabase
                    .from("students_details")
                    .select("enrollment_no, batch");
                if (error) {
                    console.error("Error fetching batch data:", error);
                    return;
                }
                const map = {};
                (data || []).forEach((row) => {
                    if (row.enrollment_no && row.batch) {
                        map[row.enrollment_no.trim().toUpperCase()] = row.batch;
                    }
                });
                setBatchMap(map);
            } catch (err) {
                console.error("Failed to fetch batch data:", err);
            }
        };
        fetchBatches();
    }, []);

    // Minimal artificial loading to show the skeleton transition smoothly 
    // without blocking on the heavy Supabase network call above.
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Sort students: semester ascending (1→8), then first name alphabetical (A→Z)
    // Exception: Poojan Ghetiya is always placed at the very bottom
    const sortedStudents = useMemo(() => {
        const getFirstName = (name) => (name || "").split(" ")[0].toLowerCase();

        const copy = [...studentsData];
        copy.sort((a, b) => {
            // Exception: Poojan Ghetiya always goes to the bottom
            const aIsPoojan = (a.student_name || "").toLowerCase().startsWith("poojan");
            const bIsPoojan = (b.student_name || "").toLowerCase().startsWith("poojan");
            if (aIsPoojan && !bIsPoojan) return 1;
            if (!aIsPoojan && bIsPoojan) return -1;

            // Primary: semester ascending
            const sa = Number(a.semester) || 0;
            const sb = Number(b.semester) || 0;
            if (sa !== sb) return sa - sb;

            // Secondary: first name alphabetical (A→Z)
            return getFirstName(a.student_name).localeCompare(getFirstName(b.student_name));
        });
        return copy;
    }, []);

    // Separate Research Assistants
    const researchAssistants = useMemo(() => {
        return sortedStudents.filter((s) => (s.roles || []).includes("Research Assistant"));
    }, [sortedStudents]);

    // Members (exclude RAs)
    const members = useMemo(() => {
        return sortedStudents.filter((s) => !(s.roles || []).includes("Research Assistant"));
    }, [sortedStudents]);

    const chromaItems = useMemo(() => {
        return members.map((s) => {
            const enrollKey = (s.enrollment_no || "").trim().toUpperCase();
            const batch = batchMap[enrollKey] || s.batch || null;
            return {
                id: s.enrollment_no || s.student_name.toLowerCase().replace(/\s+/g, "-"),
                enrollment: s.enrollment_no,
                image: s.photo || "/students/schoolstudent.png",
                title: s.student_name,
                subtitle: `${s.department} • Semester ${s.semester}`,
                batch,
                department: s.department,
                semester: s.semester,
                reflection: s.reflection || "",
                researchWorks: s.researchWorks || [],
                research: s.research || [],
                achievements: s.achievements || [],
                papersPublished: s.papersPublished || s.researchWorks || [],
                hackathons: s.hackathons || [],
                email: s.email || "",
                linkedin: s.linkedin || "",
                gradient: "linear-gradient(160deg,#fbe8c1,#167d8d)",
            };
        });
    }, [members, batchMap]);

    const openModalFor = (s) => {
        const hackathonPool = [
            "AI Jam 2025",
            "DataSprint Challenge",
            "Hack the Climate",
            "Quantum Code Quest",
            "UI/UX Hackathon",
            "Open Source Sprint",
        ];

        const defaults = {
            research: ["Research Area 1", "Research Area 2", "Research Area 3"],
            researchWorks: ["Sample Paper 1", "Sample Paper 2"],
            achievements: ["Achievement 1", "Achievement 2"],
            papersPublished: ["Project A", "Project B"],
            hackathons: [],
        };

        const enrollKey = (s.enrollment_no || s.enrollment || "").trim().toUpperCase();
        const batch = batchMap[enrollKey] || s.batch || null;
        const student = {
            ...defaults,
            ...s,
            title: s.student_name || s.title,
            subtitle: s.subtitle || `${s.department} • Semester ${s.semester}`,
            batch,
        };

        // Ensure every profile has some hackathon sample data even if the source provided none
        if (!Array.isArray(s.hackathons) || s.hackathons.length === 0) {
            student.hackathons = [...hackathonPool]
                .sort(() => 0.5 - Math.random())
                .slice(0, 2);
        }

        setActiveStudent(student);
    };
    const closeModal = () => setActiveStudent(null);

    // Close modal on ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && activeStudent) {
                closeModal();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [activeStudent]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[120px] lg:pt-[136px] pb-12 min-h-screen bg-white"
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-5xl lg:text-7xl font-black font-serif bg-gradient-to-r from-secondary to-slate-900 bg-clip-text text-transparent mb-4 tracking-tight leading-none">
                        The Minds Behind <br /><span className="text-secondary">Innovation</span>
                    </h1>
                    <p className="text-slate-500 text-xl leading-relaxed font-light max-w-2xl mx-auto">
                        Our lab is powered by curious minds dedicated to solving real-world challenges through systematic research, mentorship, and cross-functional collaboration.
                    </p>
                </div>

                {/* Research Assistants — Highlighted */}
                {researchAssistants.length > 0 && (
                    <div className="mb-16 px-4 py-12 bg-primary/30 rounded-[3rem] border border-secondary/10 relative overflow-hidden">
                        {/* Background Decorative */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] -mr-32 -mt-32" />

                        <div className="mb-10 flex justify-center">
                            <GradientText
                                colors={["#0b3d3a", "#c9a24d", "#0b3d3a", "#0b3d3a"]}
                                animationSpeed={3}
                                showBorder={false}
                                animateOnHover={true}
                                className="text-4xl sm:text-5xl font-serif font-black px-4 py-2"
                            >
                                Research Assistants
                            </GradientText>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                            {isLoading ? (
                                [...Array(2)].map((_, idx) => (
                                    <div key={idx} className="group relative overflow-hidden rounded-[2.5rem] bg-gray-200/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border border-gray-100 animate-pulse">
                                        <div className="relative shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300 flex items-center justify-center"></div>
                                        <div className="flex-1 text-center sm:text-left w-full flex flex-col gap-3">
                                            <div className="h-8 bg-gray-300 rounded-md w-3/4 mx-auto sm:mx-0"></div>
                                            <div className="h-4 bg-gray-300 rounded-md w-1/2 mx-auto sm:mx-0 mb-2"></div>
                                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                                <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                                                <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                                                <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                                            </div>
                                            <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                                                <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                                                <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                researchAssistants.map((ra) => {
                                    const enrollKey = (ra.enrollment_no || "").trim().toUpperCase();
                                const batch = batchMap[enrollKey] || ra.batch || null;
                                
                                return (
                                <motion.article
                                    key={ra.enrollment_no || ra.student_name}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-gradient-to-br from-white to-secondary/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border border-white transition-all duration-500 hover:to-secondary/20"
                                >
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-secondary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                                        <button
                                            onClick={() => openModalFor({
                                                id: ra.enrollment_no || ra.student_name.toLowerCase().replace(/\s+/g, "-"),
                                                enrollment: ra.enrollment_no,
                                                image: ra.photo || "/students/schoolstudent.png",
                                                title: ra.student_name,
                                                subtitle: ra.department + " • Semester " + ra.semester,
                                                batch: batch,
                                                reflection: ra.reflection || "",
                                                email: ra.email || "",
                                                linkedin: ra.linkedin || "",
                                                researchWorks: ra.researchWorks || [],
                                                research: ra.research || [],
                                                achievements: ra.achievements || [],
                                            })}
                                            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500 group"
                                        >
                                            <img src={ra.photo || "/students/schoolstudent.png"} alt={ra.student_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 rounded-full bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <span className="text-[10px] text-white font-black uppercase tracking-widest bg-secondary px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">See Profile</span>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-3xl font-black font-serif mb-1 bg-gradient-to-r from-secondary to-slate-900 bg-clip-text text-transparent group-hover:text-secondary transition-colors">
                                            {ra.student_name}
                                        </h3>
                                        <div className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4">
                                            Research Assistant • {ra.department}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
                                            {ra.research.slice(0, 3).map((domain, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-white/50 border border-secondary/10 text-slate-600 text-xs font-bold">
                                                    {domain}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            {ra.email && (
                                                <a href={`mailto:${ra.email}`} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-secondary hover:text-white transition-all">
                                                    <Mail size={18} />
                                                </a>
                                            )}
                                            {ra.linkedin && (
                                                <a href={ra.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-secondary hover:text-white transition-all">
                                                    <Linkedin size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                                );
                            })
                        )}
                        </div>
                    </div>
                )}

                {/* Members grid */}
                <div className="mb-16">
                    <div className="mb-10 flex justify-center">
                        <GradientText
                            colors={["#0b3d3a", "#c9a24d", "#0b3d3a", "#0b3d3a"]}
                            animationSpeed={3}
                            showBorder={false}
                            animateOnHover={true}
                            className="text-5xl sm:text-6xl font-serif font-black px-4 py-2"
                        >
                            Student Members
                        </GradientText>
                    </div>
                    <ChromaGrid items={chromaItems} onImageClick={(s) => openModalFor(s)} isLoading={isLoading} />
                </div>

            </div>

            {/* MODAL */}
            <AnimatePresence>
                {activeStudent && (
                    <div className="fixed inset-0 z-[160] flex flex-col items-center justify-center p-4 md:p-16 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative mt-8 bg-white max-w-5xl w-full rounded-3xl shadow-2xl overflow-hidden max-h-[94vh]"
                        >
                            {/* Header Buttons */}
                            <div className="absolute top-4 right-4 z-20 flex gap-2">
                                <button
                                    onClick={closeModal}
                                    className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-secondary hover:text-white transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.2fr_1fr] gap-6 p-6 h-full overflow-hidden">
                                {/* Profile Card (left) */}
                                <div className="rounded-3xl bg-slate-50 shadow-sm p-6 flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 rounded-full" />
                                        <div className="relative w-36 h-36 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                                            <img
                                                src={activeStudent.image || "/students/schoolstudent.png"}
                                                alt={activeStudent.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black font-serif bg-gradient-to-r from-secondary to-slate-900 bg-clip-text text-transparent">
                                            {activeStudent.title}
                                        </h3>
                                        <p className="text-secondary font-black text-sm uppercase tracking-widest">
                                            {activeStudent.subtitle}
                                        </p>
                                        {activeStudent.batch && (
                                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                                                Batch: {activeStudent.batch}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-6 w-full">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                                            Reflection
                                        </p>
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="text-sm text-slate-700 leading-relaxed"
                                        >
                                            {activeStudent.reflection || "Being part of SRL has been an incredible learning journey, where collaborative research and structured mentorship made a real impact."}
                                        </motion.p>
                                    </div>
                                </div>

                                {/* Research Areas (middle) */}
                                <div className="rounded-3xl bg-slate-50 shadow-sm p-6 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-base font-black uppercase tracking-widest text-slate-500">
                                            Research Areas
                                        </h4>
                                        <span className="text-xs font-bold text-secondary">{activeStudent.research.length} areas</span>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {(activeStudent.research || []).map((area, idx) => (
                                            <span key={idx} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                                                {area}
                                            </span>
                                        ))}
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="mt-6 rounded-2xl bg-white border border-slate-100 p-4 shadow-sm"
                                    >
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                                            Key Metrics
                                        </p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">Research Works</span>
                                                <span className="text-lg font-black text-slate-900">{(activeStudent.researchWorks || []).length}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">Achievements</span>
                                                <span className="text-lg font-black text-slate-900">{(activeStudent.achievements || []).length}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">Papers Published</span>
                                                <span className="text-lg font-black text-slate-900">{(activeStudent.papersPublished || []).length}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: 0.1 }}
                                        className="mt-6 rounded-2xl bg-white border border-slate-100 p-4 shadow-sm"
                                    >
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                                            Achievements
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                                            {(activeStudent.achievements || []).map((achievement, idx) => (
                                                <li key={idx}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>

                                {/* Ongoing Projects + Hackathons (right) */}
                                <div className="rounded-3xl bg-slate-50 shadow-sm p-6 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
                                            Papers Published
                                        </p>
                                        <ul className="space-y-3">
                                            {(activeStudent.papersPublished || []).map((proj, idx) => (
                                                <li key={idx} className="text-sm text-slate-700">
                                                    • {proj}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                                            Hackathons
                                        </p>
                                        <ul className="space-y-2 text-sm text-slate-700">
                                            {(activeStudent.hackathons || []).map((hack, idx) => (
                                                <li key={idx}>• {hack}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <a
                                            href={`/cv/${activeStudent.enrollment}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary-dark transition-all text-sm font-bold"
                                        >
                                            <FileText size={16} />
                                            View Full CV
                                        </a>
                                        {activeStudent.linkedin && (
                                            <a
                                                href={activeStudent.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-secondary transition-all text-sm font-bold"
                                            >
                                                <Linkedin size={16} />
                                                LinkedIn
                                            </a>
                                        )}
                                        {activeStudent.email && (
                                            <a
                                                href={`mailto:${activeStudent.email}`}
                                                className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-secondary hover:text-white transition-all text-sm font-bold"
                                            >
                                                <Mail size={16} />
                                                Email
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Global CSS for Reflection Animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0D9488;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0b3d3a;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
        </motion.div>
    );
}
