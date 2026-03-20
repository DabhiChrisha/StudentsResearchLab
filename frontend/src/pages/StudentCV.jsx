import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Mail, ArrowLeft, Linkedin, Github, GraduationCap, Loader2, User, BookOpen, ExternalLink } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://studentsresearchlab-1.onrender.com';

export default function StudentCV() {
    const { studentId } = useParams();
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Fetch CV data from backend with retry
    useEffect(() => {
        let retryCount = 0;
        let isActive = true;

        const fetchCV = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/cv/${studentId}`);
                if (!res.ok) throw new Error("Backend not ready");

                const json = await res.json();
                
                if (json.cv === null) {
                    if (isActive) {
                        setNotFound(true);
                        setLoading(false);
                    }
                    return;
                }

                if (isActive) {
                    setCvData(json.cv);
                    setLoading(false);
                }
            } catch (err) {
                console.warn("CV fetch failed, retrying...", err);
                retryCount++;
                if (retryCount >= 5) {
                    if (isActive) {
                        setNotFound(true);
                        setLoading(false);
                    }
                } else if (isActive) {
                    setTimeout(fetchCV, 3000);
                }
            }
        };

        fetchCV();
        return () => { isActive = false; };
    }, [studentId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Helper: check if a value has real content
    const hasValue = (val) => val && val !== "-" && val !== "" && val !== "[]";

    // Parse research areas from comma-separated string
    const researchAreas = useMemo(() => {
        if (!cvData?.research_area || !hasValue(cvData.research_area)) return [];
        return cvData.research_area.split(",").map(s => s.trim()).filter(s => s && s !== "-");
    }, [cvData]);

    // Parse array fields (hackathons, research_papers, patents, projects, etc.)
    const parseArrayField = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val.filter(v => v && v !== "-");
        if (typeof val === "string") {
            const trimmed = val.trim();
            if (trimmed === "[]" || trimmed === "" || trimmed === "-") return [];
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed.filter(v => v && v !== "-");
            } catch { /* not JSON */ }
            // Comma-separated fallback
            return trimmed.split(",").map(s => s.trim()).filter(s => s && s !== "-");
        }
        return [];
    };

    // Build extra fields dynamically from Supabase columns not explicitly rendered
    const knownKeys = new Set([
        "id", "enrollment_no", "student_name", "research_work_summary",
        "research_area", "department", "semester", "batch", "email",
        "linkedin", "linkedin_url", "github", "scholar", "reflection", "photo",
        "created_at", "updated_at", "updated_by", "hackathons", "research_papers",
        "patents", "projects", "contact_no", "division", "roles",
        "is_student_member", "branch",
    ]);

    const extraFields = cvData
        ? Object.entries(cvData).filter(([k, v]) => {
            if (knownKeys.has(k)) return false;
            if (v === null || v === undefined || v === "-" || v === "") return false;
            if (Array.isArray(v) && v.length === 0) return false;
            if (typeof v === "string" && (v.trim() === "[]" || v.trim() === "")) return false;
            return true;
        })
        : [];

    // Parsed array fields from Supabase
    const hackathons = cvData ? parseArrayField(cvData.hackathons) : [];
    const researchPapers = cvData ? parseArrayField(cvData.research_papers) : [];
    const patents = cvData ? parseArrayField(cvData.patents) : [];
    const projects = cvData ? parseArrayField(cvData.projects) : [];

    // --- Basic Details fields ---
    // Support both linkedin_url and linkedin column names
    const linkedinUrl = cvData?.linkedin_url || cvData?.linkedin || null;
    const emailVal = cvData?.email || null;
    const isStudentMember = cvData?.is_student_member;
    const branchVal = cvData?.branch || null;

    const hasLinkedin = hasValue(linkedinUrl);
    const hasEmail = hasValue(emailVal);
    const hasMemberStatus = isStudentMember !== undefined && isStudentMember !== null && isStudentMember !== "-" && isStudentMember !== "";
    const hasBranch = hasValue(branchVal);

    // Check if ALL basic details are missing
    const allBasicMissing = !hasLinkedin && !hasEmail && !hasMemberStatus && !hasBranch;

    // Format student member status
    const memberStatusDisplay = () => {
        if (!hasMemberStatus) return null;
        if (typeof isStudentMember === "boolean") return isStudentMember ? "Yes" : "No";
        const val = String(isStudentMember).toLowerCase().trim();
        if (val === "true" || val === "yes" || val === "1") return "Yes";
        if (val === "false" || val === "no" || val === "0") return "No";
        return isStudentMember; // Return actual text value
    };

    const fallbackTag = (
        <span className="text-slate-400 text-sm font-medium italic">Not provided yet 🚧</span>
    );

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#e3eef0] flex flex-col items-center justify-center font-sans gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading CV profile...</p>
            </div>
        );
    }

    // Not found state
    if (notFound || !cvData) {
        return (
            <div className="min-h-screen bg-[#0b0f0e] flex flex-col items-center justify-center font-sans text-white">
                <h1 className="text-xl font-bold mb-4 uppercase tracking-widest">Profile Not Found</h1>
                <p className="text-slate-400 text-sm mb-6">No CV data is available for this member in the database.</p>
                <Link to="/researchers" className="text-secondary hover:text-white flex items-center gap-2 border-b border-secondary/20 pb-1 font-bold transition-all">
                    <ArrowLeft size={16} /> Back to Roster
                </Link>
            </div>
        );
    }

    const secondaryColor = "#00887b";

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

            <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
                {/* Header Information */}
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-slate-900">
                        <span style={{ color: secondaryColor }}>{cvData.student_name || "-"}</span>
                    </h1>

                    <div className="flex flex-wrap gap-2 text-sm font-bold text-slate-600 mb-8">
                        {hasValue(cvData.enrollment_no) && (
                            <span>{cvData.enrollment_no}</span>
                        )}
                        {hasValue(cvData.department) && (
                            <>
                                {hasValue(cvData.enrollment_no) && <span className="text-slate-300">·</span>}
                                <span>{cvData.department}</span>
                            </>
                        )}
                        {hasValue(cvData.semester) && (
                            <>
                                <span className="text-slate-300">·</span>
                                <span>Semester {cvData.semester}</span>
                            </>
                        )}
                        {hasValue(cvData.batch) && (
                            <>
                                <span className="text-slate-300">·</span>
                                <span>Batch {cvData.batch}</span>
                            </>
                        )}
                    </div>

                    {hasValue(cvData.reflection) && (
                        <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-[650px] font-medium">
                            {cvData.reflection}
                        </p>
                    )}
                </header>

                {/* ===== Basic Details Section ===== */}
                <section className="mb-20">
                    <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Basic Details</h2>

                    {allBasicMissing ? (
                        <div className="p-8 rounded-3xl bg-white/40 border border-black/5 text-center">
                            <p className="text-slate-500 text-base font-medium">
                                This member is still building their profile ✨ Check back soon!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* LinkedIn */}
                            <div className="p-6 rounded-2xl bg-white/40 border border-black/5 flex items-start gap-4 hover:bg-white/60 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-[#0077b5]/10 flex items-center justify-center flex-shrink-0">
                                    <Linkedin size={18} className="text-[#0077b5]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">LinkedIn</p>
                                    {hasLinkedin ? (
                                        <a
                                            href={linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-[#0077b5] hover:underline flex items-center gap-1.5 break-all"
                                        >
                                            View Profile <ExternalLink size={12} />
                                        </a>
                                    ) : fallbackTag}
                                </div>
                            </div>

                            {/* Gmail / Email */}
                            <div className="p-6 rounded-2xl bg-white/40 border border-black/5 flex items-start gap-4 hover:bg-white/60 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <Mail size={18} className="text-red-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Email</p>
                                    {hasEmail ? (
                                        <a
                                            href={`mailto:${emailVal}`}
                                            className="text-sm font-semibold text-red-600 hover:underline break-all"
                                        >
                                            {emailVal}
                                        </a>
                                    ) : fallbackTag}
                                </div>
                            </div>

                            {/* Student Member Status */}
                            <div className="p-6 rounded-2xl bg-white/40 border border-black/5 flex items-start gap-4 hover:bg-white/60 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                    <User size={18} className="text-secondary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Student Member</p>
                                    {hasMemberStatus ? (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                                            memberStatusDisplay() === "Yes"
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : memberStatusDisplay() === "No"
                                                ? "bg-red-50 text-red-600 border border-red-200"
                                                : "bg-slate-50 text-slate-700 border border-slate-200"
                                        }`}>
                                            {memberStatusDisplay() === "Yes" && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                                            {memberStatusDisplay() === "No" && <span className="w-2 h-2 rounded-full bg-red-400" />}
                                            {memberStatusDisplay()}
                                        </span>
                                    ) : fallbackTag}
                                </div>
                            </div>

                            {/* Branch */}
                            <div className="p-6 rounded-2xl bg-white/40 border border-black/5 flex items-start gap-4 hover:bg-white/60 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <BookOpen size={18} className="text-amber-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Branch</p>
                                    {hasBranch ? (
                                        <span className="text-sm font-semibold text-slate-800">{branchVal}</span>
                                    ) : fallbackTag}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Research Work Summary */}
                {hasValue(cvData.research_work_summary) && (
                    <section className="mb-20">
                        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Research Work Summary</h2>
                        <div className="p-8 rounded-3xl bg-white/40 border border-black/5">
                            <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                                {cvData.research_work_summary}
                            </p>
                        </div>
                    </section>
                )}

                {/* Research Areas */}
                {researchAreas.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Research Areas</h2>
                        <div className="flex flex-wrap gap-3">
                            {researchAreas.map((area, i) => (
                                <span key={i} className="px-4 py-2 rounded-full bg-white/60 border border-secondary/10 text-slate-700 text-sm font-semibold">
                                    {area}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Research Papers */}
                {researchPapers.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Research Papers</h2>
                        <div className="space-y-6 pl-2">
                            {researchPapers.map((paper, i) => (
                                <div key={i} className="group relative">
                                    <div className="absolute -left-4 top-2 bottom-2 w-[2px] bg-secondary/0 group-hover:bg-secondary/50 transition-all rounded-full" />
                                    <h3 className="text-base font-black text-slate-900 tracking-tight mb-1 group-hover:translate-x-1 transition-transform">{paper}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Patents */}
                {patents.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Patents</h2>
                        <div className="space-y-6 pl-2">
                            {patents.map((patent, i) => (
                                <div key={i} className="group relative">
                                    <div className="absolute -left-4 top-2 bottom-2 w-[2px] bg-secondary/0 group-hover:bg-secondary/50 transition-all rounded-full" />
                                    <h3 className="text-base font-black text-slate-900 tracking-tight mb-1 group-hover:translate-x-1 transition-transform">{patent}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Projects</h2>
                        <div className="space-y-6 pl-2">
                            {projects.map((project, i) => (
                                <div key={i} className="group relative">
                                    <div className="absolute -left-4 top-2 bottom-2 w-[2px] bg-secondary/0 group-hover:bg-secondary/50 transition-all rounded-full" />
                                    <h3 className="text-base font-black text-slate-900 tracking-tight mb-1 group-hover:translate-x-1 transition-transform">{project}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Hackathons */}
                {hackathons.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Hackathons</h2>
                        <div className="flex flex-wrap gap-3">
                            {hackathons.map((hack, i) => (
                                <span key={i} className="px-4 py-2 rounded-full bg-white/60 border border-secondary/10 text-slate-700 text-sm font-semibold">
                                    {hack}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Extra CV Fields from Supabase */}
                {extraFields.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Additional Details</h2>
                        <div className="space-y-4">
                            {extraFields.map(([key, value]) => (
                                <div key={key} className="p-6 rounded-2xl bg-white/40 border border-black/5">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                        {key.replace(/_/g, " ")}
                                    </p>
                                    <p className="text-sm text-slate-700 font-medium whitespace-pre-line">
                                        {Array.isArray(value) ? value.join(", ") : String(value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer Section */}
                <footer className="pt-20 border-t border-black/5 flex flex-col md:flex-row justify-end items-center gap-8">
                    <div className="flex gap-6 text-slate-400 items-center">
                        {hasValue(cvData.github) && (
                            <a href={cvData.github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                                <Github size={18} />
                            </a>
                        )}
                        {hasLinkedin && (
                            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                                <Linkedin size={18} />
                            </a>
                        )}
                        {hasEmail && (
                            <a href={`mailto:${emailVal}`} className="hover:text-slate-900 transition-colors">
                                <Mail size={18} />
                            </a>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">SRL © 2025</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
