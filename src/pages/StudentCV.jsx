import React, { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Mail, ArrowLeft, Linkedin, Github, FileText, GraduationCap, X, ExternalLink } from "lucide-react";
import studentsData from "../data/srlStudents.json";

export default function StudentCV() {
    const { studentId } = useParams();

    // Find student
    const student = useMemo(() => {
        return studentsData.find(
            (s) =>
                s.enrollment_no === studentId ||
                s.student_name.toLowerCase().replace(/\s+/g, "-") === studentId
        );
    }, [studentId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!student) {
        return (
            <div className="min-h-screen bg-[#0b0f0e] flex flex-col items-center justify-center font-sans text-white">
                <h1 className="text-xl font-bold mb-4 uppercase tracking-widest">Profile Not Found</h1>
                <Link to="/researchers" className="text-secondary hover:text-white flex items-center gap-2 border-b border-secondary/20 pb-1 font-bold transition-all">
                    <ArrowLeft size={16} /> Back to Roster
                </Link>
            </div>
        );
    }

    // Color constants from previous turn
    const secondaryColor = "#00887b"; // Teal accent

    return (
        <div className="min-h-screen bg-[#e3eef0] text-slate-800 font-sans selection:bg-secondary/10 selection:text-secondary">
            {/* Top Navbar Simulation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#e3eef0]/80 backdrop-blur-md border-b border-black/5">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-black text-sm">
                            SRL
                        </div>
                        <Link to="/" className="text-xs font-bold text-slate-900 hover:text-secondary transition-colors uppercase tracking-widest">Home</Link>
                    </div>
                    <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <Link to="/researchers" className="hover:text-slate-900 transition-colors">Researchers</Link>
                        <Link to="/achievements" className="hover:text-slate-900 transition-colors">Achievements</Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                {/* Header Information */}
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-slate-900">
                        <span style={{ color: secondaryColor }}>{student.student_name}</span>
                    </h1>

                    <div className="flex flex-wrap gap-2 text-sm font-bold text-slate-600 mb-8">
                        <span>{student.roles?.[0] || "Researcher"}</span>
                        <span className="text-slate-300">-</span>
                        <span>{student.department} specialist</span>
                        <span className="text-slate-300">-</span>
                        <span>AI/ML Engineer</span>
                    </div>

                    <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-[650px] font-medium">
                        {student.reflection || "I build scalable systems and conduct research at the intersection of data science and academic excellence. My work focuses on pushing the boundaries of scholarly engagement."}
                    </p>

                    <div className="flex flex-wrap gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <a href="#" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                            <FileText size={14} className="text-slate-400" /> Resume
                        </a>
                        <a href="#" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                            <GraduationCap size={14} className="text-slate-400" /> Scholar
                        </a>
                        <a href="#" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                            <Github size={14} className="text-slate-400" /> GitHub
                        </a>
                        <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                            <Linkedin size={14} className="text-slate-400" /> LinkedIn
                        </a>
                        <a href={`mailto:${student.email}`} className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                            <Mail size={14} className="text-slate-400" /> Email
                        </a>
                    </div>
                </header>

                {/* Experience Section */}
                <section className="mb-20">
                    <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Experience</h2>
                    <div className="space-y-6">
                        {(student.experience || [
                            { title: "Student Researcher", company: "Student Research Lab", location: student.department + " Hub", date: "Jan 2024 — Present", desc: "Contributing to the systematic investigation and implementation of academic modules within the SRL ecosystem. Focused on scalability and research excellence." }
                        ]).map((exp, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white/40 border border-black/5 hover:bg-white/60 transition-all group">
                                <div className="flex flex-col md:flex-row justify-between mb-2">
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{exp.title}</h3>
                                    <span className="text-sm font-bold text-slate-400">{exp.date}</span>
                                </div>
                                <div className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                                    {exp.company} <span className="text-slate-200">·</span> {exp.location}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    {exp.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects Section */}
                <section className="mb-20">
                    <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Projects</h2>
                    <div className="space-y-12 pl-2">
                        {student.researchWorks?.map((work, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute -left-4 top-2 bottom-2 w-[2px] bg-secondary/0 group-hover:bg-secondary/50 transition-all rounded-full" />
                                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 group-hover:translate-x-1 transition-transform">{work}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    A systematic investigation and technical implementation within the {student.department} ecosystem. Focused on scalability, rigor, and academic brilliance.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Research Publications */}
                <section className="mb-20">
                    <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Research Publications</h2>
                    <div className="space-y-10 pl-2">
                        {student.achievements?.filter(a => a.toLowerCase().includes('paper') || a.toLowerCase().includes('publication') || a.toLowerCase().includes('ieee') || a.toLowerCase().includes('conference')).length > 0 ? (
                            student.achievements.map((a, i) => (
                                <div key={i} className="group">
                                    <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">{a}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Presented at Peer Viewed Academic Assembly, 2024</p>
                                </div>
                            ))
                        ) : (
                            <div className="group">
                                <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">A Novel Approach to Predict the Research Outcomes Using Regression</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">SRL International Conference for Scholarly Practice (SICSP), 2024</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="pt-20 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                            View Resume <ExternalLink size={14} />
                        </a>
                    </div>
                    <div className="flex gap-6 text-slate-400 items-center">
                        <Github size={18} className="hover:text-slate-900 cursor-pointer transition-colors" />
                        <Linkedin size={18} className="hover:text-slate-900 cursor-pointer transition-colors" />
                        <Mail size={18} className="hover:text-slate-900 cursor-pointer transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">SRL © 2025</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
