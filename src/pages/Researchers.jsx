import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, X, FileText } from "lucide-react";
import studentsData from "../data/srlStudents.json";
import ChromaGrid from "../components/react-bits/ChromaGrid";
import GradientText from "../components/GradientText";

// --- StudentReflections Component ---
function StudentReflections() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Filter only students who have reflections
        const withReflections = studentsData.filter(
            (student) => student.reflection && student.reflection.trim() !== ""
        );
        setStudents(withReflections);
        setLoading(false);
    }, []);

    return (
        <section className="relative py-24 bg-[#0b0f0e] text-white overflow-hidden rounded-[3rem] my-16 mx-4 sm:mx-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="text-4xl font-semibold tracking-tight font-serif">
                        Student Reflections
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto font-light">
                        How being part of SRL reshaped the way students think, research, and execute.
                    </p>
                </div>

                {/* Animated Container */}
                <div className="relative h-[400px] overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Loading reflections…
                        </div>
                    ) : students.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No reflections available yet.
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col gap-6 animate-scroll-up hover:[animation-play-state:paused]">
                            {[...students, ...students, ...students].map((student, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                                >
                                    <p className="text-gray-200 leading-relaxed italic">
                                        “{student.reflection}”
                                    </p>

                                    <div className="mt-4">
                                        <p className="font-medium text-secondary">{student.student_name}</p>
                                        <p className="text-xs text-gray-400">
                                            {student.department} · {student.semester} Semester
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Fade Effects */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0b0f0e] to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0b0f0e] to-transparent" />
        </section>
    );
}

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
            image: s.photo,
            title: s.student_name,
            subtitle: `${s.department} • Semester ${s.semester}`,
            email: s.email || "",
            linkedin: s.linkedin || "",
            reflection: s.reflection || "",
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
            className="pt-32 pb-40 min-h-screen bg-white"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                                image: ra.photo,
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
                                            <img src={ra.photo} alt={ra.student_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
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
                    <ChromaGrid items={chromaItems} onImageClick={(s) => s.reflection && openModalFor(s)} />
                </div>

                {/* Reflections Section */}
                <StudentReflections />

            </div>

            {/* MODAL */}
            <AnimatePresence>
                {activeStudent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                            className="relative bg-white max-w-5xl w-full rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Header Buttons */}
                            <div className="absolute top-6 right-6 z-20 flex gap-2">
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-secondary hover:text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row h-full overflow-hidden">
                                {/* Image Sidebar */}
                                <div className="md:w-1/3 bg-primary/20 flex flex-col items-center justify-center p-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 rounded-full" />
                                        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                                            <img src={activeStudent.image} alt={activeStudent.title} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-10 md:p-14 overflow-y-auto">
                                    <h3 className="text-3xl font-black text-slate-900 font-serif mb-2">{activeStudent.title}</h3>
                                    <p className="text-secondary font-black text-xs uppercase tracking-widest mb-8">{activeStudent.subtitle}</p>

                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">The SRL Journey</h4>
                                            <p className="text-xl font-serif italic text-slate-700 leading-relaxed">
                                                “{activeStudent.reflection}”
                                            </p>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Research Areas</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {activeStudent.research.map((r, i) => (
                                                        <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                                            {r}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Achievements</h4>
                                                <ul className="space-y-2">
                                                    {activeStudent.achievements.map((a, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                                                            {a}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Research Works</h4>
                                            <ul className="grid sm:grid-cols-2 gap-4">
                                                {activeStudent.researchWorks.map((w, i) => (
                                                    <li key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 font-medium">
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                                        <a
                                            href={`/cv/${activeStudent.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-white hover:bg-secondary-dark transition-all text-sm font-bold shadow-lg"
                                        >
                                            <FileText size={18} />
                                            View Full CV
                                        </a>
                                        {activeStudent.linkedin && (
                                            <a href={activeStudent.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white hover:bg-secondary transition-all text-sm font-bold">
                                                <Linkedin size={18} />
                                                LinkedIn
                                            </a>
                                        )}
                                        {activeStudent.email && (
                                            <a href={`mailto:${activeStudent.email}`} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-secondary hover:text-white transition-all text-sm font-bold">
                                                <Mail size={18} />
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
      `}} />
        </motion.div>
    );
}
