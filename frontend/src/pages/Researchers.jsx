import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, Github, X, FileText, Eye, Star, Award, Settings, Library, Quote } from "lucide-react";
// import studentsData from "../data/srlStudents.json"; // REPLACED with backend fetch
import ChromaGrid from "../components/react-bits/ChromaGrid";
import GradientText from "../components/GradientText";
import { useSupabaseQuery, fetchWithTimeout } from '../hooks/useSupabaseQuery';
import { API_BASE_URL } from '../config/apiConfig';


// --- Main Researchers Component ---
export default function Researchers() {
    const [activeStudent, setActiveStudent] = useState(null);
    const [studentsData, setStudentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [papersLoading, setPapersLoading] = useState(false);
    const [modalDataLoading, setModalDataLoading] = useState(false);
    const [cardStats, setCardStats] = useState({ stats_by_name: {}, hackathons_by_enrollment: {} });
    const retryRef = useRef(null);
    const [showAllHackathons, setShowAllHackathons] = useState(false);

    const { data: bMap } = useSupabaseQuery(async () => {
        const json = await fetchWithTimeout(`${API_BASE_URL}/api/leaderboard`); // Re-using leaderboard for batch/enrollment mapping
        const map = {};
        (json.leaderboard || []).forEach((row) => {
            if (row.enrollment_no && row.batch) {
                map[row.enrollment_no.trim().toUpperCase()] = row.batch;
            }
        });
        return map;
    });

    const batchMap = bMap || {};

    // Minimal artificial loading to show the skeleton transition smoothly 
    // without blocking on the heavy Supabase network call above.
    useEffect(() => {
        let isCancelled = false;
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/researchers`);
                const data = await response.json();
                if (!isCancelled) {
                    setStudentsData(data.researchers || []);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Failed to fetch researchers:", err);
                if (!isCancelled) setIsLoading(false);
            }
        };
        fetchData();
        return () => { isCancelled = true; };
    }, []);

    // Fetch batch stats for all members (cards show real Supabase data)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await fetchWithTimeout(`${API_BASE_URL}/api/batch-member-stats`);
                if (!cancelled) setCardStats(data || { stats_by_name: {}, hackathons_by_enrollment: {} });
            } catch (e) {
                console.error('Failed to fetch batch member stats:', e);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Sort students: semester ascending (1→8), then first name alphabetical (A→Z)
    // Exception: Poojan Ghetiya is always placed at the very bottom
    const sortedStudents = useMemo(() => {
        const getFirstName = (name) => (name || "").split(" ")[0].toLowerCase();

        // Filter out "admin" card
        const filtered = studentsData.filter(s => (s.student_name || "").toLowerCase() !== "admin");
        
        const copy = [...filtered];
        copy.sort((a, b) => {
            // Exception: Poojan Ghetiya always goes to the bottom
            const aName = (a.student_name || "").toLowerCase();
            const bName = (b.student_name || "").toLowerCase();
            const aIsPoojan = aName.includes("poojan") && aName.includes("ghetiya");
            const bIsPoojan = bName.includes("poojan") && bName.includes("ghetiya");
            
            if (aIsPoojan && !bIsPoojan) return 1;
            if (!aIsPoojan && bIsPoojan) return -1;

            // Primary: semester ascending
            const sa = parseInt(a.semester) || 0;
            const sb = parseInt(b.semester) || 0;
            if (sa !== sb) return sa - sb;

            // Secondary: Name alphabetical (A→Z)
            return aName.localeCompare(bName);
        });
        return copy;
    }, [studentsData]);

    // Separate Research Assistants
    const researchAssistants = useMemo(() => {
        return sortedStudents
            .filter((s) => (s.roles || []).includes("Research Assistant"))
            .map(s => ({ ...s, gradient: "linear-gradient(135deg, #e5e1baff 100%, #7af8c6ff 100%)" }));
    }, [sortedStudents]);

    // Members (exclude RAs)
    const members = useMemo(() => {
        return sortedStudents.filter((s) => !(s.roles || []).includes("Research Assistant"));
    }, [sortedStudents]);

    const chromaItems = useMemo(() => {
        return members.map((s) => {
            const enrollKey = (s.enrollment_no || "").trim().toUpperCase();
            const batch = (batchMap || {})[enrollKey] || s.batch || null;
            const nameStats = cardStats.stats_by_name[s.student_name] || {};
            const hackCount = cardStats.hackathons_by_enrollment[enrollKey];

            const srlPubs = s.srlPublications || [];
            const ongoingCount = srlPubs.filter(p => p.category === "Paper under Review").length;
            const publishedCount = srlPubs.length > 0 ? (srlPubs.length - ongoingCount) : (nameStats.papers_published_count ?? s.papersPublished?.length ?? "--");

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
                email: s.email || "",
                linkedin: s.linkedin || "",
                researchWorksCount: nameStats.research_works_count ?? s.researchWorks?.length ?? "--",
                hackathonsCount: hackCount ?? s.hackathons?.length ?? "--",
                papersPublishedCount: publishedCount,
                ongoingProjectsCount: ongoingCount,
                hackathons: s.hackathons || [],
                papers: s.papersPublished || [],
                research_areas: s.research || [],
                achievements_extended: s.achievements_extended || null,
                srlPublications: s.srlPublications || [],
                gradient: "linear-gradient(135deg, #dcfce7 0%, #fef9c3 100%)",
            };
        });
    }, [members, batchMap, cardStats]);

    const openModalFor = (s) => {
        const enrollKey = (s.enrollment_no || s.enrollment || "").trim().toUpperCase();
        const batch = (batchMap || {})[enrollKey] || s.batch || null;
        const student = {
            ...s,
            title: s.student_name || s.title,
            subtitle: s.subtitle || `${s.department} • Semester ${s.semester}`,
            batch,
        };

        setActiveStudent(student);
    };
    const closeModal = () => {
        setActiveStudent(null);
        setShowAllHackathons(false);
        setPapersLoading(false);
        setModalDataLoading(false);
        if (retryRef.current) {
            clearTimeout(retryRef.current);
            retryRef.current = null;
        }
    };

    // Derive active student's metrics from the single source of truth (cardStats)
    const activeMetrics = useMemo(() => {
        if (!activeStudent) return null;
        const name = (activeStudent.title || activeStudent.student_name || "").trim();
        const enrollKey = (activeStudent.enrollment || "").trim().toUpperCase();
        const nameStats = cardStats.stats_by_name[name] || {};
        const hackCount = cardStats.hackathons_by_enrollment[enrollKey];

        // Process publications to separate ongoing (under review) from published
        const srlPubs = activeStudent.srlPublications || [];
        const underReviewPubs = srlPubs.filter(p => p.category === "Paper under Review");
        const ongoingFromSrl = underReviewPubs.length;

        const publishedFromSrlCount = srlPubs.length - ongoingFromSrl;

        // Base counts from cardStats if available, otherwise from activeStudent
        const basePapersCount = nameStats.papers_published_count ?? activeStudent.papersPublishedCount ?? 0;

        // We subtract ongoing from the published count if they were bundled
        // However, usually papersPublishedCount in the main JSON is the absolute published count.
        // It's safer to use the filtered count if srlPublications is present.
        const actualPapersCount = srlPubs.length > 0 ? publishedFromSrlCount : basePapersCount;

        return {
            research_works_count: nameStats.research_works_count ?? activeStudent.researchWorksCount,
            hackathons_count: hackCount ?? activeStudent.hackathonsCount,
            papers_published_count: actualPapersCount,
            ongoing_projects_count: ongoingFromSrl, // Use under review papers as ongoing projects
            research_areas: (nameStats.research_areas && nameStats.research_areas.length > 0) ? nameStats.research_areas : (activeStudent.research_areas || []),
            hackathons: (nameStats.hackathons_list && nameStats.hackathons_list.length > 0) ? nameStats.hackathons_list : (activeStudent.hackathons || []),
            papers: (nameStats.papers && nameStats.papers.length > 0) ? nameStats.papers : (activeStudent.papers || []),
            filteredSrlPublications: srlPubs.filter(p => p.category !== "Paper under Review"),
        };
    }, [activeStudent, cardStats]);

    // Fetch papers + metrics when modal opens — writes back into cardStats
    useEffect(() => {
        if (!activeStudent) return;

        const enrollmentNo = activeStudent.enrollment || activeStudent.enrollment_no || "";
        if (!enrollmentNo.trim()) return;

        let cancelled = false;
        let attempt = 0;
        const maxRetries = 3;
        const retryDelay = 3000;
        const encodedEnroll = encodeURIComponent(enrollmentNo.trim().toUpperCase());
        const studentName = (activeStudent.title || activeStudent.student_name || "").trim();
        const encodedName = encodeURIComponent(studentName);
        const enrollKey = enrollmentNo.trim().toUpperCase();

        const fetchUnifiedData = async () => {
            setPapersLoading(true);
            setModalDataLoading(true);
            try {
                const data = await fetchWithTimeout(`${API_BASE_URL}/api/papers/${encodedName}?enrollment_no=${encodedEnroll}`);

                if (!cancelled && data) {
                    // Write fetched data back into the single source of truth
                    setCardStats(prev => ({
                        stats_by_name: {
                            ...prev.stats_by_name,
                            [studentName]: {
                                research_works_count: data.research_works_count ?? 0,
                                papers_published_count: data.papers_published_count ?? 0,
                                research_areas: data.research_areas || [],
                                hackathons_list: data.hackathons || [],
                                papers: data.papers || [],
                            },
                        },
                        hackathons_by_enrollment: {
                            ...prev.hackathons_by_enrollment,
                            [enrollKey]: data.hackathons_count ?? 0,
                        },
                    }));
                    setPapersLoading(false);
                    setModalDataLoading(false);
                }
            } catch (err) {
                console.error(`Failed to fetch modal data (attempt ${attempt + 1}):`, err);
                attempt++;
                if (!cancelled && attempt < maxRetries) {
                    retryRef.current = setTimeout(fetchUnifiedData, retryDelay);
                } else if (!cancelled) {
                    setPapersLoading(false);
                    setModalDataLoading(false);
                }
            }
        };

        fetchUnifiedData();

        return () => {
            cancelled = true;
            if (retryRef.current) {
                clearTimeout(retryRef.current);
                retryRef.current = null;
            }
        };
    }, [activeStudent]);

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
            className="pt-10 lg:pt-14 pb-12 min-h-screen bg-white"
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl font-black font-serif bg-gradient-to-r from-secondary to-slate-900 bg-clip-text text-transparent mb-3 tracking-tight leading-none">
                        The Minds Behind <br /><span className="text-secondary">Innovation</span>
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed font-light max-w-2xl mx-auto">
                        Our lab is powered by curious minds dedicated to solving real-world challenges through systematic research, mentorship, and cross-functional collaboration.
                    </p>
                </div>

                {/* Research Assistants — Highlighted */}
                {researchAssistants.length > 0 && (
                    <div className="mb-16 px-4 py-12 bg-gradient-to-br from-secondary/[0.03] via-white to-secondary/[0.05] rounded-[2.5rem] border border-secondary/10 relative overflow-hidden">
                        {/* Background Decorative Elements */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] -mr-64 -mt-64 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 blur-[100px] -ml-32 -mb-32 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#0b3d3a_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />

                        <div className="mb-10 flex justify-center">
                            <GradientText
                                colors={["#0b3d3a", "#c9a24d", "#0b3d3a", "#0b3d3a"]}
                                animationSpeed={3}
                                showBorder={false}
                                animateOnHover={true}
                                className="text-3xl sm:text-4xl font-serif font-black px-4 py-2"
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
                                    const batch = (batchMap || {})[enrollKey] || ra.batch || null;
                                    const raOngoingCount = (ra.srlPublications || []).filter(p => p.category === "Paper under Review").length;
                                    const raPublishedCount = (ra.srlPublications || []).length > 0 ? ((ra.srlPublications || []).length - raOngoingCount) : (ra.papersPublished?.length ?? 0);

                                    return (
                                        <motion.article
                                            key={ra.enrollment_no || ra.student_name}
                                            whileHover={{ y: -8, scale: 1.01 }}
                                            style={{ background: ra.gradient }}
                                            className="group relative overflow-hidden rounded-[2rem] shadow-xl bg-white/40 backdrop-blur-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 border border-white/60 transition-all duration-700 hover:shadow-[0_30px_60px_-12px_rgba(11,61,58,0.15)]"
                                        >
                                            {/* Spotlight Effect - Hidden by default, shown on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                            <div className="relative shrink-0">
                                                {/* Animated Ring on Hover */}
                                                <div className="absolute -inset-2 rounded-full border-2 border-secondary/0 group-hover:border-secondary/20 group-hover:scale-110 transition-all duration-700" />
                                                <div className="absolute inset-0 bg-secondary blur-3xl opacity-10 group-hover:opacity-30 transition-opacity rounded-full" />

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
                                                        hackathons: ra.hackathons || [],
                                                        papers: ra.papersPublished || [],
                                                        research_areas: ra.research || [],
                                                        achievements_extended: ra.achievements_extended || null,
                                                        srlPublications: ra.srlPublications || [],
                                                        researchWorksCount: ra.researchWorks?.length ?? "--",
                                                        hackathonsCount: ra.hackathons?.length ?? "--",
                                                        papersPublishedCount: raPublishedCount,
                                                        ongoingProjectsCount: raOngoingCount,
                                                    })}
                                                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-[0_15px_40px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-700 group/img"
                                                >
                                                    <img
                                                        loading="lazy"
                                                        decoding="async"
                                                        src={ra.photo || "/students/schoolstudent.png"}
                                                        alt={ra.student_name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[4px]">
                                                        <div className="bg-white/90 px-3 py-1 rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                            <span className="text-[9px] text-secondary font-black uppercase tracking-[0.2em]">Profile</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>

                                            <div className="flex-1 text-center sm:text-left relative z-10">
                                                <div className="inline-flex items-center gap-2 mb-2 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary"></span>
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary">
                                                        Research Assistant
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl sm:text-3xl font-black font-serif mb-1 text-slate-900 tracking-tight leading-tight group-hover:text-secondary transition-colors duration-500">
                                                    {ra.student_name}
                                                </h3>

                                                <div className="text-[12px] font-bold text-slate-500 mb-4 flex items-center justify-center sm:justify-start gap-2">
                                                    <span>{ra.department}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span>Semester {ra.semester}</span>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                                                    {(ra.research || []).length > 0 ? (
                                                        ra.research.slice(0, 3).map((domain, i) => (
                                                            <span key={i} className="px-3 py-1 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-700 text-[10px] font-bold tracking-tight hover:border-secondary/30 transition-all">
                                                                {domain}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">No focus areas</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                                    {ra.email && (
                                                        <a href={`mailto:${ra.email}`} className="group/btn relative p-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:border-secondary hover:bg-secondary hover:text-white transition-all duration-500 shadow-sm">
                                                            <Mail size={16} className="transition-transform group-hover/btn:scale-110" />
                                                        </a>
                                                    )}
                                                    {ra.linkedin && (
                                                        <a href={ra.linkedin} target="_blank" rel="noopener noreferrer" className="group/btn relative p-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:border-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all duration-500 shadow-sm">
                                                            <Linkedin size={16} className="transition-transform group-hover/btn:scale-110" />
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
                    <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-2">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student <span className="text-secondary">Members</span></h2>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
                            {members.length} Student Members
                        </div>
                    </div>
                    <ChromaGrid items={chromaItems} onImageClick={(s) => openModalFor(s)} isLoading={isLoading} />
                </div>

            </div>

            <AnimatePresence>
                {activeStudent && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white/90 backdrop-blur-3xl max-w-7xl w-full rounded-[3.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)] overflow-hidden max-h-[85vh] mt-16 md:mt-20 border border-white/40 flex flex-col group/modal"
                        >
                            {/* Animated Background Decorative Elements */}
                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 blur-[150px] -mr-96 -mt-96 rounded-full animate-pulse pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] -ml-64 -mb-64 rounded-full pointer-events-none" />
                            <div className="absolute inset-0 bg-[radial-gradient(#0b3d3a_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.05] pointer-events-none" />
                            
                            {/* Science/Tech Watermark */}
                            <div className="absolute bottom-10 right-10 text-[10rem] font-black text-secondary/[0.02] select-none pointer-events-none tracking-tighter uppercase leading-none">
                                Research
                            </div>
                            {/* Header / Close Button */}
                            <div className="absolute top-4 right-6 z-30">
                                <button
                                    onClick={closeModal}
                                    className="p-2.5 rounded-xl bg-slate-100/80 backdrop-blur-md text-slate-500 hover:bg-secondary hover:text-white transition-all duration-500 group shadow-md"
                                >
                                    <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            <div className="relative flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0">
                                    {/* Left Column: Visual Profile - REDESIGNED */}
                                    <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-2xl p-10 lg:p-14 border-r border-white/40 flex flex-col relative z-10">
                                        <div className="lg:sticky lg:top-0 space-y-10">
                                            {/* Design Accent */}
                                            <div className="w-16 h-1 bg-teal-500/40 rounded-full mb-2" />
                                            
                                            <div className="relative group/profile mx-auto lg:mx-0 w-max">
                                                <div className="absolute -inset-6 bg-teal-500/10 blur-[60px] rounded-full opacity-60 group-hover/profile:opacity-100 transition-opacity duration-700" />
                                                <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-[3rem] overflow-hidden border-[8px] border-white shadow-2xl transition-transform duration-700 group-hover/profile:scale-[1.03]">
                                                    <img loading="lazy" decoding="async"
                                                        src={activeStudent.image || "/students/schoolstudent.png"}
                                                        alt={activeStudent.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 text-center lg:text-left">
                                                <div>
                                                    <h3 className="text-3xl lg:text-4xl font-black font-serif text-slate-900 tracking-tight leading-none mb-2">
                                                        {activeStudent.title}
                                                    </h3>
                                                    <p className="text-slate-500 font-bold text-lg">
                                                        Researcher, SEM {activeStudent.semester}
                                                    </p>
                                                </div>
                                                
                                                {activeStudent.reflection && (
                                                    <div className="pt-6 border-t border-black/5">
                                                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-3">Reflection:</h4>
                                                        <p className="text-[15px] font-medium leading-relaxed text-slate-600 italic">
                                                            "{activeStudent.reflection}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Social Feed Icons */}
                                            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                                                {activeStudent.linkedin && (
                                                    <a href={activeStudent.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50">
                                                        <Linkedin size={20} />
                                                    </a>
                                                )}
                                                <a href={`mailto:${activeStudent.email}`} className="w-12 h-12 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50">
                                                    <Mail size={20} />
                                                </a>
                                                {activeStudent.github && (
                                                    <a href={activeStudent.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50">
                                                        <Github size={20} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Intelligence Grid - REDESIGNED */}
                                    <div className="p-10 lg:p-14 space-y-10 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Knowledge Domains */}
                                            <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500">
                                                <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-3 mb-8">
                                                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                                                    Knowledge Domains:
                                                </h4>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {(activeMetrics?.research_areas || []).map((area, i) => (
                                                        <span key={i} className="px-5 py-2.5 rounded-full bg-teal-50/80 border border-teal-100 text-teal-800 text-[11px] font-black uppercase tracking-wider shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500">
                                                <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-3 mb-8">
                                                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                                                    Hackathons & Achievements:
                                                </h4>
                                                <ul className="space-y-4">
                                                    {((activeMetrics?.hackathons || []).length > 0) ? (
                                                        (showAllHackathons 
                                                            ? (activeMetrics?.hackathons || [])
                                                            : (activeMetrics?.hackathons || []).slice(0, 4)
                                                        ).map((h, i) => (
                                                            <li key={i} className="flex items-start gap-4 text-[13px] font-bold text-slate-700">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                                                                <span className="leading-tight">{h}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-[12px] text-slate-400 italic font-medium">No hackathons recorded</li>
                                                    )}
                                                </ul>

                                                {(activeMetrics?.hackathons || []).length > 4 && (
                                                    <button 
                                                        onClick={() => setShowAllHackathons(!showAllHackathons)}
                                                        className="mt-6 text-[11px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-700 transition-colors flex items-center gap-2"
                                                    >
                                                        {showAllHackathons ? "Show Less" : `View All ${activeMetrics.hackathons.length} Hackathons`}
                                                        <div className={`w-1 h-1 rounded-full bg-teal-500 transition-transform ${showAllHackathons ? 'rotate-180' : ''}`} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Papers Published & Analytics */}
                                            <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500">
                                                <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-3 mb-8">
                                                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                                                    Papers Published & Year:
                                                </h4>
                                                <ul className="space-y-4 mb-10">
                                                    {(activeMetrics?.papers || []).slice(0, 2).map((p, i) => (
                                                        <li key={i} className="flex items-start gap-4 text-[13px] font-bold text-slate-700 leading-tight">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                                            <span>{p}</span>
                                                        </li>
                                                    ))}
                                                    {(!activeMetrics?.papers || activeMetrics.papers.length === 0) && (
                                                        <li className="text-[12px] text-slate-400 italic">No publications yet</li>
                                                    )}
                                                </ul>

                                                <div className="pt-8 border-t border-black/5">
                                                    <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-3 mb-6">
                                                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                                                        Execution Analytics:
                                                    </h4>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {[
                                                            { label: "Ongoing", val: activeMetrics?.ongoing_projects_count ?? 0 },
                                                            { label: "Research", val: activeMetrics?.research_works_count ?? 0 },
                                                            { label: "Hack", val: activeMetrics?.papers_published_count ?? 0, label_alt: "Papers" }
                                                        ].map((m, i) => (
                                                            <div key={i} className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100/50 text-center">
                                                                <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{m.label_alt || m.label}</p>
                                                                <p className="text-xl font-black text-teal-700">{m.val}</p>
                                                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{m.label}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Leadership & Awards */}
                                            <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 flex flex-col">
                                                <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-3 mb-8">
                                                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                                                    Leadership & Awards:
                                                </h4>
                                                <div className="space-y-4 flex-1">
                                                    {[
                                                        ...(activeStudent.achievements_extended?.leadership || []).slice(0, 2).map(l => ({ text: l, icon: <Library size={16} />, color: "teal" })),
                                                        ...(activeStudent.achievements_extended?.awards || []).slice(0, 1).map(a => ({ text: a, icon: <Star size={16} />, color: "amber" }))
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-4 rounded-3xl bg-white shadow-sm border border-slate-50 flex items-center gap-5 hover:border-teal-200 transition-colors">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 shrink-0`}>
                                                                {item.icon}
                                                            </div>
                                                            <p className="text-[11px] font-bold text-slate-700 leading-snug line-clamp-2 uppercase">
                                                                {item.text}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* Contact Me Button at the bottom of the right panel, or centered */}
                                                <div className="mt-auto pt-10 flex justify-center">
                                                    <button 
                                                        onClick={() => window.location.href = `mailto:${activeStudent.email}`}
                                                        className="px-12 py-4 rounded-full bg-teal-800 text-white text-[12px] font-black uppercase tracking-[0.3em] hover:bg-teal-900 hover:scale-105 transition-all shadow-xl shadow-teal-900/20"
                                                    >
                                                        CONTACT
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-up { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
                .animate-scroll-up { animation: scroll-up 30s linear infinite; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(13, 148, 136, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(13, 148, 136, 0.5); }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </motion.div>
    );
}
