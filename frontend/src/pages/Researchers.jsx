import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, X, FileText } from "lucide-react";
import studentsData from "../data/srlStudents.json";
import ChromaGrid from "../components/react-bits/ChromaGrid";
import GradientText from "../components/GradientText";


// --- Main Researchers Component ---
export default function Researchers() {
    const [activeStudent, setActiveStudent] = useState(null);

    // Prepare sorted students: group by semester (numeric ascending), within each semester sort by name
    const sortedStudents = useMemo(() => {
        const copy = [...studentsData];
        copy.sort((a, b) => {
            const sa = Number(a.semester) || 0;
            const sb = Number(b.semester) || 0;
            if (sa !== sb) return sa - sb;
            return (a.student_name || "").localeCompare(b.student_name || "");
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
        return members.map((s) => ({
            id: s.enrollment_no || s.student_name.toLowerCase().replace(/\s+/g, "-"),
            enrollment: s.enrollment_no,
            image: s.photo || "/students/schoolstudent.png",
            title: s.student_name,
            subtitle: `${s.department} • Semester ${s.semester}`,
            email: s.email || "",
            linkedin: s.linkedin || "",
            researchWorks: s.researchWorks || [],
            research: s.research || [],
            achievements: s.achievements || [],
            gradient: "linear-gradient(160deg,#fbe8c1,#167d8d)",
        }));
    }, [members]);

    const openModalFor = (s) => setActiveStudent(s);
    const closeModal = () => setActiveStudent(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-6 pb-40 min-h-screen bg-white"
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-24 text-center">
                    <h1 className="text-5xl lg:text-7xl font-black font-serif text-slate-900 mb-6 tracking-tight leading-none">
                        The Minds Behind <br /><span className="text-secondary">Innovation</span>
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed font-light max-w-2xl mx-auto">
                        Our lab is powered by curious minds dedicated to solving real-world challenges through systematic research, mentorship, and cross-functional collaboration.
                    </p>
                </div>

                {/* Research Assistants — Highlighted */}
                {researchAssistants.length > 0 && (
                    <div className="mb-24 px-4 py-16 bg-primary/30 rounded-[3rem] border border-secondary/10 relative overflow-hidden">
                        {/* Background Decorative */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] -mr-32 -mt-32" />

                        <div className="mb-12 flex justify-center">
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
                            {researchAssistants.map((ra) => (
                                <motion.article
                                    key={ra.enrollment_no || ra.student_name}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-gradient-to-br from-white to-secondary/10 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 border border-white transition-all duration-500 hover:to-secondary/20"
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
                                        <h3 className="text-2xl font-black text-slate-800 font-serif mb-1 group-hover:text-secondary transition-colors">{ra.student_name}</h3>
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-4">Research Assistant • {ra.department}</div>

                                        <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
                                            {ra.research.slice(0, 3).map((domain, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-white/50 border border-secondary/10 text-slate-600 text-[10px] font-bold">
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
                            ))}
                        </div>
                    </div>
                )}

                {/* Members grid */}
                <div className="mb-24">
                    <div className="mb-12 flex justify-center">
                        <GradientText
                            colors={["#0b3d3a", "#c9a24d", "#0b3d3a", "#0b3d3a"]}
                            animationSpeed={3}
                            showBorder={false}
                            animateOnHover={true}
                            className="text-4xl sm:text-5xl font-serif font-black px-4 py-2"
                        >
                            Student Members
                        </GradientText>
                    </div>
                    <ChromaGrid items={chromaItems} onImageClick={(s) => openModalFor(s)} />
                </div>

            </div>

            {/* MODAL */}
            <AnimatePresence>
                {activeStudent && (
                    <div className="fixed inset-0 z-[160] flex flex-col items-center justify-start p-4 md:p-20 overflow-hidden">
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
                            className="relative mt-8 bg-white max-w-6xl w-full rounded-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
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

                            <div className="flex flex-col md:flex-row h-full overflow-hidden">
                                {/* Image Sidebar */}
                                <div className="md:w-[32%] bg-primary/20 flex flex-col items-center justify-center p-8 md:p-12 shrink-0">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 rounded-full" />
                                        <div className="relative w-40 h-40 md:w-72 md:h-72 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                                            <img src={activeStudent.image || "/students/schoolstudent.png"} alt={activeStudent.title} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-10 md:p-14 lg:p-16 overflow-y-auto scrollbar-none">
                                    <h3 className="text-3xl font-black text-slate-900 font-serif mb-1.5">{activeStudent.title}</h3>
                                    <p className="text-secondary font-black text-xs uppercase tracking-widest mb-10">{activeStudent.subtitle}</p>

<<<<<<< Updated upstream
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">The SRL Journey</h4>
                                            <p className="text-lg font-serif italic text-slate-700 leading-relaxed">
                                                “{activeStudent.reflection}”
                                            </p>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
=======
                                    <div className="space-y-8">
                                        <div className="grid sm:grid-cols-2 gap-8">
>>>>>>> Stashed changes
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Research Areas</h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {activeStudent.research.map((r, i) => (
                                                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold">
                                                            {r}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Achievements</h4>
                                                <ul className="space-y-1.5">
                                                    {activeStudent.achievements.map((a, i) => (
                                                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                                                            {a}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Research Works</h4>
                                            <ul className="grid sm:grid-cols-2 gap-3">
                                                {activeStudent.researchWorks.map((w, i) => (
                                                    <li key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                                        <a
                                            href={`/cv/${activeStudent.enrollment}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary-dark transition-all text-xs font-bold shadow-lg"
                                        >
                                            <FileText size={16} />
                                            View Full CV
                                        </a>
                                        {activeStudent.linkedin && (
                                            <a href={activeStudent.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-secondary transition-all text-xs font-bold">
                                                <Linkedin size={16} />
                                                LinkedIn
                                            </a>
                                        )}
                                        {activeStudent.email && (
                                            <a href={`mailto:${activeStudent.email}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-secondary hover:text-white transition-all text-xs font-bold">
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
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes
        </motion.div>
    );
}
