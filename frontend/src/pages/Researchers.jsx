import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, Github, X, FileText, Eye, Star, Award, Settings, Library, Quote, BookOpen, FlaskConical, Trophy } from "lucide-react";
import ChromaGrid from "../components/react-bits/ChromaGrid";
import GradientText from "../components/GradientText";
import { useFetch, fetchWithTimeout } from '../hooks/useFetch';
import { API_BASE_URL, API_HEADERS } from '../config/apiConfig';
import { getImageUrl } from '../lib/imageUrl';

// ─── helpers ──────────────────────────────────────────────────────────────────

// Safely coerce any API value to an array
function toArr(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(item => {
        // Keep objects (like research papers) and non-empty strings
        if (typeof item === 'object' && item !== null) return true;
        if (typeof item === 'string') return item.trim() !== '';
        return Boolean(item);
    });
    if (typeof val === 'string') {
        const t = val.trim();
        if (!t || t === '[]') return [];
        try { const p = JSON.parse(t); if (Array.isArray(p)) return p.filter(Boolean); } catch (_) {}
        return t.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
}

// ─── Main Researchers Component ───────────────────────────────────────────────
export default function Researchers() {
    const [activeStudent, setActiveStudent] = useState(null);
    const [studentsData, setStudentsData]   = useState([]);
    const [isLoading, setIsLoading]         = useState(true);
    const [showAllHackathons, setShowAllHackathons] = useState(false);

    // Leaderboard → batch mapping
    const { data: bMap } = useFetch(async () => {
        const json = await fetchWithTimeout(`${API_BASE_URL}/api/leaderboard`);
        const map = {};
        (json.leaderboard || []).forEach(row => {
            if (row.enrollment_no && row.batch)
                map[row.enrollment_no.trim().toUpperCase()] = row.batch;
        });
        return map;
    });
    const batchMap = bMap || {};

    // Main researcher fetch
    useEffect(() => {
        let isCancelled = false;
        (async () => {
            try {
                const res  = await fetch(`${API_BASE_URL}/api/researchers`, { headers: API_HEADERS });
                const data = await res.json();
                if (!isCancelled) {
                    setStudentsData(data.researchers || []);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Failed to fetch researchers:", err);
                if (!isCancelled) setIsLoading(false);
            }
        })();
        return () => { isCancelled = true; };
    }, []);

    // ── sorting ───────────────────────────────────────────────────────────────
    const sortedStudents = useMemo(() => {
        const filtered = studentsData.filter(s => (s.student_name || '').toLowerCase() !== 'admin');
        return [...filtered].sort((a, b) => {
            const aName = (a.student_name || '').toLowerCase();
            const bName = (b.student_name || '').toLowerCase();
            const aIsPoojan = aName.includes('poojan') && aName.includes('ghetiya');
            const bIsPoojan = bName.includes('poojan') && bName.includes('ghetiya');
            if (aIsPoojan && !bIsPoojan) return 1;
            if (!aIsPoojan && bIsPoojan) return -1;
            const sa = parseInt(a.semester) || 0;
            const sb = parseInt(b.semester) || 0;
            if (sa !== sb) return sa - sb;
            return aName.localeCompare(bName);
        });
    }, [studentsData]);

    const researchAssistants = useMemo(() =>
        sortedStudents
            .filter(s => toArr(s.roles).includes('Research Assistant'))
            .map(s => ({ ...s, gradient: 'linear-gradient(135deg, #e5e1baff 100%, #7af8c6ff 100%)' })),
        [sortedStudents]);

    const members = useMemo(() =>
        sortedStudents.filter(s => !toArr(s.roles).includes('Research Assistant')),
        [sortedStudents]);

    // ── build ChromaGrid items ────────────────────────────────────────────────
    // All arrays now come directly from srl_student_profiles via the API.
    const chromaItems = useMemo(() => {
        return members.map(s => {
            const enrollKey = (s.enrollment_no || '').trim().toUpperCase();
            const batch     = batchMap[enrollKey] || s.batch || null;

            // All arrays come directly from srl_student_profiles via /api/researchers
            const hackathonsArr      = toArr(s.hackathons);
            const papersPublishedArr = toArr(s.papersPublished);
            const researchWorksArr   = toArr(s.researchWorks);
            const ongoingResearchArr = toArr(s.ongoingResearch);
            const srlPubs            = toArr(s.srlPublications);

            // Split srl_publications into published vs under-review (kept separate from
            // ongoing_research so the PAPERS count is never reduced by ongoing_research items)
            const srlUnderReview = srlPubs.filter(p => p.category === 'Paper under Review').length;
            const srlPublished   = srlPubs.length > 0 ? srlPubs.length - srlUnderReview : 0;

            // PAPERS: structured srl pubs (non-review) → simple papers_published list → publications table
            const publishedCount = srlPubs.length > 0
                ? srlPublished
                : papersPublishedArr.length || s.publicationsCount || '--';

            // ONGOING: papers currently under review + explicit ongoing_research projects
            const ongoingCount = srlUnderReview + ongoingResearchArr.length;

            return {
                id:                    s.enrollment_no || s.student_name.toLowerCase().replace(/\s+/g, '-'),
                enrollment:            s.enrollment_no,
                image:                 getImageUrl(s.photo || '/students/schoolstudent.png'),
                title:                 s.student_name,
                subtitle:              `${s.department} • Semester ${s.semester}`,
                batch,
                department:            s.department,
                semester:              s.semester,
                reflection:            s.reflection || '',
                email:                 s.email || '',
                linkedin:              s.linkedin || '',
                // counts — all from srl_student_profiles arrays
                researchWorksCount:    researchWorksArr.length || '--',
                hackathonsCount:       hackathonsArr.length    || '--',
                papersPublishedCount:  publishedCount,
                ongoingProjectsCount:  ongoingCount,
                // full arrays
                hackathons:            hackathonsArr,
                papers:                papersPublishedArr,
                researchWorks:         researchWorksArr,
                ongoingResearch:       toArr(s.ongoingResearch),
                achievements:          toArr(s.achievements),
                research_areas:        toArr(s.research),
                achievements_extended: s.achievements_extended || null,
                srlPublications:       srlPubs,
                metadata:              s.metadata || null,
                gradient:              'linear-gradient(135deg, #dcfce7 0%, #fef9c3 100%)',
            };
        });
    }, [members, batchMap]);

    // ── modal helpers ─────────────────────────────────────────────────────────

    // Build a uniform modal-student object from either a chromaItem or an RA record
    const buildModalStudent = useCallback((s) => {
        const enrollKey = (s.enrollment_no || s.enrollment || '').trim().toUpperCase();
        const batch     = batchMap[enrollKey] || s.batch || null;
        return {
            ...s,
            title:    s.student_name || s.title,
            subtitle: s.subtitle || `${s.department} • Semester ${s.semester}`,
            batch,
        };
    }, [batchMap]);

    const openModalFor = useCallback((s) => {
        setActiveStudent(buildModalStudent(s));
    }, [buildModalStudent]);

    const closeModal = () => {
        setActiveStudent(null);
        setShowAllHackathons(false);
    };

    // ── derived modal metrics ─────────────────────────────────────────────────
    // All data comes directly from the /api/researchers response embedded in
    // activeStudent — no supplemental fetches needed.
    const activeMetrics = useMemo(() => {
        if (!activeStudent) return null;

        const srlPubs        = toArr(activeStudent.srlPublications);
        const underReview    = srlPubs.filter(p => p.category === 'Paper under Review');
        const ongoingResearch = toArr(activeStudent.ongoingResearch);
        const papersArr      = toArr(activeStudent.papers);

        // Published = non-review srl pubs OR simple papers list
        const published = srlPubs.length > 0
            ? srlPubs.length - underReview.length
            : papersArr.length;

        return {
            research_works_count:    toArr(activeStudent.researchWorks).length,
            hackathons_count:        toArr(activeStudent.hackathons).length,
            papers_published_count:  published,
            // Papers under review + explicit ongoing_research projects
            ongoing_projects_count:  underReview.length + ongoingResearch.length,
            // full arrays — all from srl_student_profiles
            research_areas:          toArr(activeStudent.research_areas),
            hackathons:              toArr(activeStudent.hackathons),
<<<<<<< Updated upstream
            papers:                  papersArr,
=======
            papers:                  papersArr.filter(p => {
                const title = typeof p === 'object' && p !== null ? p.title : p;
                return !String(title).toLowerCase().startsWith('ongoing');
            }),
>>>>>>> Stashed changes
            researchWorks:           toArr(activeStudent.researchWorks),
            achievements:            toArr(activeStudent.achievements),
            ongoingResearch:         toArr(activeStudent.ongoingResearch),
            filteredSrlPublications: srlPubs.filter(p => p.category !== 'Paper under Review'),
            underReviewSrlPubs:      underReview,
        };
    }, [activeStudent]);

    // ESC to close
    useEffect(() => {
        const onKey = e => { if (e.key === 'Escape' && activeStudent) closeModal(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [activeStudent]);

    // ─── render ───────────────────────────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-10 lg:pt-14 pb-12 min-h-screen bg-white"
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl font-black font-serif bg-gradient-to-r from-secondary to-slate-900 bg-clip-text text-transparent mb-3 tracking-tight leading-none">
                        The Minds Behind <br /><span className="text-secondary">Innovation</span>
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed font-light max-w-2xl mx-auto">
                        Our lab is powered by curious minds dedicated to solving real-world challenges through systematic research, mentorship, and cross-functional collaboration.
                    </p>
                </div>

                {/* ── Research Assistants ─────────────────────────────────── */}
                {(isLoading || researchAssistants.length > 0) && (
                    <div className="mb-16 px-4 py-12 bg-gradient-to-br from-secondary/[0.03] via-white to-secondary/[0.05] rounded-[2.5rem] border border-secondary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] -mr-64 -mt-64 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 blur-[100px] -ml-32 -mb-32 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#0b3d3a_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />

                        <div className="mb-10 flex justify-center">
                            <GradientText
                                colors={["#0b3d3a", "#c9a24d", "#0b3d3a", "#0b3d3a"]}
                                animationSpeed={3} showBorder={false} animateOnHover={true}
                                className="text-4xl sm:text-5xl font-serif font-black px-4 py-2"
                            >
                                Research Assistants
                            </GradientText>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                            {isLoading ? (
                                [...Array(2)].map((_, idx) => (
                                    <div key={idx} className="relative overflow-hidden rounded-[2rem] shadow-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 border border-white/60 animate-pulse" style={{ background: "linear-gradient(135deg, #e5e1baff 100%, #7af8c6ff 100%)" }}>

                                        {/* Avatar with white border ring */}
                                        <div className="shrink-0 relative">
                                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-black/15 border-4 border-white shadow-[0_15px_40px_rgba(0,0,0,0.08)]" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 text-center sm:text-left w-full flex flex-col gap-2.5">
                                            {/* Badge pill */}
                                            <div className="h-5 w-32 bg-black/10 rounded-full self-center sm:self-start" />
                                            {/* Name — two lines mimic serif heading */}
                                            <div className="h-7 bg-black/10 rounded-lg w-3/4 mx-auto sm:mx-0" />
                                            <div className="h-5 bg-black/[0.07] rounded-lg w-1/2 mx-auto sm:mx-0" />
                                            {/* Dept + semester */}
                                            <div className="h-3 bg-black/[0.06] rounded-md w-2/5 mx-auto sm:mx-0" />
                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-0.5">
                                                {[88, 116, 80].map((w, i) => (
                                                    <div key={i} className="h-6 bg-white/60 rounded-lg border border-black/10" style={{ width: w }} />
                                                ))}
                                            </div>
                                            {/* Social buttons pushed to bottom */}
                                            <div className="mt-auto flex items-center justify-center sm:justify-start gap-2 pt-1">
                                                <div className="w-9 h-9 bg-white/60 rounded-xl border border-black/10" />
                                                <div className="w-9 h-9 bg-white/60 rounded-xl border border-black/10" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                researchAssistants.map(ra => {
                                    const enrollKey      = (ra.enrollment_no || '').trim().toUpperCase();
                                    const batch          = batchMap[enrollKey] || ra.batch || null;
                                    const raSrlPubs      = toArr(ra.srlPublications);
                                    const raSrlUnderReview = raSrlPubs.filter(p => p.category === 'Paper under Review').length;
                                    // ONGOING: papers under review + explicit ongoing_research items
                                    const raOngoing      = raSrlUnderReview + toArr(ra.ongoingResearch).length;
                                    // PAPERS: non-review srl pubs OR simple papers_published list
                                    const raPublished    = raSrlPubs.length > 0 ? raSrlPubs.length - raSrlUnderReview : toArr(ra.papersPublished).length;
                                    const raHackathons   = toArr(ra.hackathons);
                                    const raResearchWorks = toArr(ra.researchWorks);

                                    return (
                                        <motion.article
                                            key={ra.enrollment_no || ra.student_name}
                                            whileHover={{ y: -8, scale: 1.01 }}
                                            style={{ background: ra.gradient }}
                                            className="group relative overflow-hidden rounded-[2rem] shadow-xl bg-white/40 backdrop-blur-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 border border-white/60 transition-all duration-700 hover:shadow-[0_30px_60px_-12px_rgba(11,61,58,0.15)] cursor-pointer"
                                            onClick={() => openModalFor({
                                                id:                    ra.enrollment_no || ra.student_name.toLowerCase().replace(/\s+/g, '-'),
                                                enrollment:            ra.enrollment_no,
                                                image:                 getImageUrl(ra.photo || '/students/schoolstudent.png'),
                                                title:                 ra.student_name,
                                                subtitle:              `${ra.department} • Semester ${ra.semester}`,
                                                batch,
                                                reflection:            ra.reflection || '',
                                                email:                 ra.email || '',
                                                linkedin:              ra.linkedin || '',
                                                hackathons:            raHackathons,
                                                papers:                toArr(ra.papersPublished),
                                                researchWorks:         raResearchWorks,
                                                achievements:          toArr(ra.achievements),
                                                ongoingResearch:       toArr(ra.ongoingResearch),
                                                research_areas:        toArr(ra.research),
                                                achievements_extended: ra.achievements_extended || null,
                                                srlPublications:       raSrlPubs,
                                                metadata:              ra.metadata || null,
                                                researchWorksCount:    raResearchWorks.length || '--',
                                                hackathonsCount:       raHackathons.length || '--',
                                                papersPublishedCount:  raPublished,
                                                ongoingProjectsCount:  raOngoing,
                                            })}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                            {/* Avatar */}
                                            <div className="relative shrink-0">
                                                <div className="absolute -inset-3 rounded-full border-2 border-secondary/0 group-hover:border-secondary/25 group-hover:scale-110 transition-all duration-700" />
                                                <div className="absolute inset-0 bg-secondary blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-700 rounded-full" />
                                                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-[0_15px_40px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-700">
                                                    <img loading="lazy" decoding="async"
                                                        src={getImageUrl(ra.photo || '/students/schoolstudent.png')}
                                                        alt={ra.student_name}
                                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[1.5px]"
                                                    />
                                                    <div aria-hidden="true" className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <div className="absolute inset-0 rounded-full flex items-end justify-center pointer-events-none pb-5">
                                                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/40 opacity-0 scale-75 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
                                                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white drop-shadow-sm whitespace-nowrap">View Profile</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 text-center sm:text-left relative z-10 flex flex-col">
                                                <div className="inline-flex items-center gap-2 mb-2 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 self-center sm:self-start">
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary" />
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary">Research Assistant</span>
                                                </div>
                                                <h3 className="text-2xl sm:text-3xl font-black font-serif mb-1 text-slate-900 tracking-tight leading-tight group-hover:text-secondary transition-colors duration-500">
                                                    {ra.student_name}
                                                </h3>
                                                <div className="text-[12px] font-bold text-slate-500 mb-3 flex items-center justify-center sm:justify-start gap-2">
                                                    <span>{ra.department}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span>Semester {ra.semester}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                                                    {toArr(ra.research).length > 0 ? (
                                                        toArr(ra.research).slice(0, 3).map((domain, i) => (
                                                            <span key={i} className="px-3 py-1 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-700 text-[10px] font-bold tracking-tight">
                                                                {domain}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">No focus areas</span>
                                                    )}
                                                </div>

                                                {/* Bottom row: social links */}
                                                <div className="mt-auto flex items-center gap-2 pt-1" onClick={e => e.stopPropagation()}>
                                                    {ra.email && (
                                                        <a href={`mailto:${ra.email}`} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:border-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm">
                                                            <Mail size={15} />
                                                        </a>
                                                    )}
                                                    {ra.linkedin && (
                                                        <a href={ra.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:border-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all duration-300 shadow-sm">
                                                            <Linkedin size={15} />
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

                {/* ── Members grid ────────────────────────────────────────── */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-2">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student <span className="text-secondary">Members</span></h2>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
                            {members.length} Student Members
                        </div>
                    </div>
                    <ChromaGrid items={chromaItems} onImageClick={openModalFor} isLoading={isLoading} />
                </div>
            </div>

            {/* ── Profile Modal ─────────────────────────────────────────── */}
            <AnimatePresence>
                {activeStudent && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white/90 backdrop-blur-3xl max-w-7xl w-full rounded-[3.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)] overflow-hidden max-h-[85vh] mt-16 md:mt-20 border border-white/40 flex flex-col group/modal"
                        >
                            {/* Decorative BG */}
                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 blur-[150px] -mr-96 -mt-96 rounded-full animate-pulse pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] -ml-64 -mb-64 rounded-full pointer-events-none" />
                            <div className="absolute inset-0 bg-[radial-gradient(#0b3d3a_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.05] pointer-events-none" />
                            <div className="absolute bottom-10 right-10 text-[10rem] font-black text-secondary/[0.02] select-none pointer-events-none tracking-tighter uppercase leading-none">Research</div>

                            {/* Close */}
                            <div className="absolute top-4 right-6 z-30">
                                <button onClick={closeModal} className="p-2.5 rounded-xl bg-slate-100/80 backdrop-blur-md text-slate-500 hover:bg-secondary hover:text-white transition-all duration-500 group shadow-md">
                                    <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            <div className="relative flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0">

                                    {/* ── Left: Visual Profile ──────────────────────── */}
                                    <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-2xl p-10 lg:p-14 border-r border-white/40 flex flex-col relative z-10">
                                        <div className="lg:sticky lg:top-0 space-y-10">
                                            <div className="w-16 h-1 bg-teal-500/40 rounded-full mb-2" />

                                            {/* Avatar */}
                                            <div className="relative group/profile mx-auto lg:mx-0 w-max">
                                                <div className="absolute -inset-6 bg-teal-500/10 blur-[60px] rounded-full opacity-60 group-hover/profile:opacity-100 transition-opacity duration-700" />
                                                <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-[3rem] overflow-hidden border-[8px] border-white shadow-2xl transition-transform duration-700 group-hover/profile:scale-[1.03]">
                                                    <img loading="lazy" decoding="async"
                                                        src={getImageUrl(activeStudent.image || '/students/schoolstudent.png')}
                                                        alt={activeStudent.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Name & role */}
                                            <div className="space-y-4 text-center lg:text-left">
                                                <div>
                                                    <h3 className="text-3xl lg:text-4xl font-black font-serif text-slate-900 tracking-tight leading-none mb-2">
                                                        {activeStudent.title}
                                                    </h3>
                                                    <p className="text-slate-500 font-bold text-lg">Researcher, SEM {activeStudent.semester}</p>
                                                </div>

                                                {/* Reflection quote */}
                                                {activeStudent.reflection && (
                                                    <div className="pt-6 border-t border-black/5">
                                                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-3">Reflection:</h4>
                                                        <p className="text-[15px] font-medium leading-relaxed text-slate-600 italic">
                                                            "{activeStudent.reflection}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Social links */}
                                            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                                                {activeStudent.linkedin && (
                                                    <a href={activeStudent.linkedin} target="_blank" rel="noopener noreferrer"
                                                        className="w-12 h-12 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50">
                                                        <Linkedin size={20} />
                                                    </a>
                                                )}
                                                <a href={`mailto:${activeStudent.email}`}
                                                    className="w-12 h-12 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50">
                                                    <Mail size={20} />
                                                </a>
                                                {activeStudent.github && (
                                                    <a href={activeStudent.github} target="_blank" rel="noopener noreferrer"
                                                        className="w-12 h-12 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50">
                                                        <Github size={20} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Right: Intelligence Grid ──────────────────── */}
                                    <div className="p-10 lg:p-14 space-y-10 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                            {/* Panel 1: Knowledge Domains */}
                                            <ModalPanel title="Knowledge Domains">
                                                <div className="flex flex-wrap gap-2.5">
                                                    {(activeMetrics?.research_areas || []).length > 0 ? (
                                                        activeMetrics.research_areas.map((area, i) => (
                                                            <span key={i} className="px-5 py-2.5 rounded-full bg-teal-50/80 border border-teal-100 text-teal-800 text-[11px] font-black uppercase tracking-wider shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                                                {area}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <EmptyHint text="No focus areas recorded" />
                                                    )}
                                                </div>
                                            </ModalPanel>

                                            {/* Panel 2: Hackathons */}
                                            <ModalPanel title="Hackathons & Achievements">
                                                <ul className="space-y-4">
                                                    {(activeMetrics?.hackathons || []).length > 0 ? (
                                                        (showAllHackathons
                                                            ? activeMetrics.hackathons
                                                            : activeMetrics.hackathons.slice(0, 4)
                                                        ).map((h, i) => (
                                                            <li key={i} className="flex items-start gap-4 text-[13px] font-bold text-slate-700">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                                                                <span className="leading-tight">{h}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li><EmptyHint text="No hackathons recorded" /></li>
                                                    )}
                                                </ul>
                                                {(activeMetrics?.hackathons || []).length > 4 && (
                                                    <button
                                                        onClick={() => setShowAllHackathons(v => !v)}
                                                        className="mt-6 text-[11px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-700 transition-colors flex items-center gap-2"
                                                    >
                                                        {showAllHackathons ? 'Show Less' : `View All ${activeMetrics.hackathons.length} Hackathons`}
                                                        <div className={`w-1 h-1 rounded-full bg-teal-500 transition-transform ${showAllHackathons ? 'rotate-180' : ''}`} />
                                                    </button>
                                                )}
                                            </ModalPanel>

                                            {/* Panel 3: Papers + Analytics */}
                                            <ModalPanel title="Papers Published & Year">
                                                <ul className="space-y-4 mb-10">
                                                    {(activeMetrics?.papers || []).slice(0, 2).map((p, i) => {
                                                        const isObject = typeof p === 'object' && p !== null;
                                                        const title = isObject ? p.title : p;
                                                        const link = isObject ? p.link : null;
                                                        const status = isObject ? p.status : null;
                                                        return (
                                                            <li key={i} className="flex items-start gap-4 text-[13px] font-bold text-slate-700 leading-tight justify-between">
                                                                <div className="flex items-start gap-4 flex-1">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                                                    <div className="flex-1">
                                                                        <span>{title}</span>
                                                                        {status && (
                                                                            <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${
                                                                                status === 'ongoing' || status === 'in-progress'
                                                                                    ? 'bg-blue-100 text-blue-700'
                                                                                    : 'bg-green-100 text-green-700'
                                                                            }`}>
                                                                                {(status === 'ongoing' || status === 'in-progress') ? '🔄 Ongoing' : '✓ Completed'}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {link && link.trim() && (
                                                                    <a href={link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                                                        </svg>
                                                                    </a>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                    {(!activeMetrics?.papers?.length) && <li><EmptyHint text="No publications yet" /></li>}
                                                </ul>
                                                <div className="pt-8 border-t border-black/5">
                                                    <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-3 mb-6">
                                                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                                                        Execution Analytics:
                                                    </h4>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {[
                                                            { label: 'Projects',  val: activeMetrics?.ongoing_projects_count ?? 0,   alt: 'Ongoing' },
                                                            { label: 'Hackathons', val: activeMetrics?.hackathons_count ?? 0,          alt: 'Total' },
                                                            { label: 'Published',  val: activeMetrics?.papers_published_count ?? 0,    alt: 'Research' },
                                                        ].map((m, i) => (
                                                            <div key={i} className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100/50 text-center">
                                                                <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{m.alt}</p>
                                                                <p className="text-xl font-black text-teal-700">{m.val}</p>
                                                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{m.label}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </ModalPanel>

                                            {/* Panel 4: Leadership & Awards */}
                                            <ModalPanel title="Leadership & Awards">
                                                <div className="space-y-4 flex-1">
                                                    {[
                                                        ...toArr(activeStudent.achievements_extended?.leadership).slice(0, 2).map(l => ({ text: l, icon: <Library size={16} />, color: 'teal' })),
                                                        ...toArr(activeStudent.achievements_extended?.awards).slice(0, 1).map(a => ({ text: a, icon: <Star size={16} />, color: 'amber' })),
                                                        ...toArr(activeMetrics?.achievements).slice(0, 2).map(a => ({ text: a, icon: <Trophy size={16} />, color: 'teal' })),
                                                    ].length > 0 ? (
                                                        [
                                                            ...toArr(activeStudent.achievements_extended?.leadership).slice(0, 2).map(l => ({ text: l, icon: <Library size={16} />, color: 'teal' })),
                                                            ...toArr(activeStudent.achievements_extended?.awards).slice(0, 1).map(a => ({ text: a, icon: <Star size={16} />, color: 'amber' })),
                                                            ...toArr(activeMetrics?.achievements).slice(0, 2).map(a => ({ text: a, icon: <Trophy size={16} />, color: 'teal' })),
                                                        ].map((item, i) => (
                                                            <div key={i} className="p-4 rounded-3xl bg-white shadow-sm border border-slate-50 flex items-center gap-5 hover:border-teal-200 transition-colors">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 shrink-0`}>
                                                                    {item.icon}
                                                                </div>
                                                                <p className="text-[11px] font-bold text-slate-700 leading-snug line-clamp-2 uppercase">{item.text}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <EmptyHint text="No awards or leadership recorded" />
                                                    )}
                                                </div>
                                            </ModalPanel>

                                            {/* Panel 5: Research Works (from srl_student_profiles.research_works) */}
                                            {toArr(activeMetrics?.researchWorks).length > 0 && (
                                                <ModalPanel title="Research Works" icon={<FlaskConical size={14} className="text-teal-500" />}>
                                                    <ul className="space-y-4">
                                                        {toArr(activeMetrics.researchWorks).map((w, i) => (
                                                            <li key={i} className="flex items-start gap-4 text-[13px] font-bold text-slate-700 leading-tight">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                                                                <span>{w}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </ModalPanel>
                                            )}

                                            {/* Panel 6: SRL Publications (structured — previously computed but never rendered) */}
                                            {toArr(activeMetrics?.filteredSrlPublications).length > 0 && (
                                                <ModalPanel title="SRL Publications" icon={<BookOpen size={14} className="text-teal-500" />}>
                                                    <ul className="space-y-5">
                                                        {toArr(activeMetrics.filteredSrlPublications).map((pub, i) => (
                                                            <li key={i} className="space-y-1">
                                                                <p className="text-[12px] font-black text-slate-800 leading-snug">{pub.title}</p>
                                                                {pub.venue && (
                                                                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wide">{pub.venue}</p>
                                                                )}
                                                                <div className="flex flex-wrap gap-2 mt-1">
                                                                    {pub.type && (
                                                                        <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-[9px] font-black text-teal-700 uppercase tracking-wider">{pub.type}</span>
                                                                    )}
                                                                    {pub.date && (
                                                                        <span className="text-[10px] font-medium text-slate-400">{pub.date}</span>
                                                                    )}
                                                                    {pub.conferenceGrant && (
                                                                        <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[9px] font-black text-amber-700 uppercase tracking-wider">Grant</span>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </ModalPanel>
                                            )}

                                            {/* Panel 7: Ongoing Research */}
                                            {toArr(activeMetrics?.ongoingResearch).length > 0 && (
                                                <ModalPanel title="Ongoing Research">
                                                    <ul className="space-y-4">
                                                        {toArr(activeMetrics.ongoingResearch).map((r, i) => (
                                                            <li key={i} className="flex items-start gap-4 text-[13px] font-bold text-slate-700 leading-tight">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                                                                <span>{r}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </ModalPanel>
                                            )}

                                            {/* Panel 8: Dynamic Metadata — renders any future fields added via admin portal */}
                                            {activeStudent.metadata && Object.keys(activeStudent.metadata).length > 0 && (
                                                <ModalPanel title="Additional Info">
                                                    <dl className="space-y-3">
                                                        {Object.entries(activeStudent.metadata).map(([key, val]) => {
                                                            if (val === null || val === undefined || val === '') return null;
                                                            const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                                            const display = Array.isArray(val)
                                                                ? val.join(', ')
                                                                : typeof val === 'object'
                                                                    ? JSON.stringify(val)
                                                                    : String(val);
                                                            return (
                                                                <div key={key} className="flex gap-3">
                                                                    <dt className="text-[10px] font-black text-slate-400 uppercase tracking-wide shrink-0 w-28">{label}</dt>
                                                                    <dd className="text-[12px] font-bold text-slate-700 leading-snug">{display}</dd>
                                                                </div>
                                                            );
                                                        })}
                                                    </dl>
                                                </ModalPanel>
                                            )}

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
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(13, 148, 136, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(13, 148, 136, 0.5); }
            `}} />
        </motion.div>
    );
}

// ─── small reusable modal panel ───────────────────────────────────────────────

function ModalPanel({ title, icon, children }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 flex flex-col">
            <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                {icon && icon}
                {title}:
            </h4>
            {children}
        </div>
    );
}

function EmptyHint({ text }) {
    return <p className="text-[12px] text-slate-400 italic font-medium">{text}</p>;
}

// ─── Modal Skeleton ───────────────────────────────────────────────────────────
function ModalSkeleton() {
    return (
        <div className="relative bg-white/90 backdrop-blur-3xl max-w-7xl w-full rounded-[3.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)] overflow-hidden max-h-[85vh] mt-16 md:mt-20 border border-white/40 flex flex-col group/modal">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 blur-[150px] -mr-96 -mt-96 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] -ml-64 -mb-64 rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#0b3d3a_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.05] pointer-events-none" />

            {/* Close Button Skeleton */}
            <div className="absolute top-4 right-6 z-30">
                <div className="p-2.5 rounded-xl bg-slate-200 animate-pulse w-9 h-9"></div>
            </div>

            <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0">

                    {/* ── Left: Visual Profile Skeleton ──────────────────────── */}
                    <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-2xl p-10 lg:p-14 border-r border-white/40 flex flex-col relative z-10">
                        <div className="lg:sticky lg:top-0 space-y-10">
                            <div className="w-16 h-1 bg-slate-200 rounded-full animate-pulse" />

                            {/* Avatar Skeleton */}
                            <div className="relative group/profile mx-auto lg:mx-0 w-max">
                                <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-[3rem] bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
                            </div>

                            {/* Name & Role Skeleton */}
                            <div className="space-y-4 text-center lg:text-left">
                                <div className="space-y-3">
                                    <div className="h-8 bg-slate-200 rounded-lg w-5/6 mx-auto lg:mx-0 animate-pulse"></div>
                                    <div className="h-5 bg-slate-150 rounded-lg w-4/6 mx-auto lg:mx-0 animate-pulse"></div>
                                </div>

                                {/* Reflection Skeleton */}
                                <div className="pt-6 border-t border-black/5">
                                    <div className="h-3 bg-slate-150 rounded-md w-20 mb-3 animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-3.5 bg-slate-150 rounded-md w-full animate-pulse"></div>
                                        <div className="h-3.5 bg-slate-150 rounded-md w-5/6 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links Skeleton */}
                            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Panels Grid Skeleton ──────────────────────── */}
                    <div className="p-10 lg:p-14 space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Panel 1 Skeleton */}
                            <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse"></div>
                                    <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
                                </div>
                                <div className="space-y-2">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="h-6 bg-slate-100 rounded-full w-4/5 animate-pulse"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Panel 2 Skeleton */}
                            <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse"></div>
                                    <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
                                </div>
                                <div className="space-y-3">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 animate-pulse"></div>
                                            <div className="h-3 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Panel 3 Skeleton */}
                            <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse"></div>
                                    <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
                                </div>
                                <div className="space-y-3 mb-8">
                                    {[0, 1].map(i => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 animate-pulse"></div>
                                            <div className="h-3 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8 border-t border-black/5">
                                    <div className="h-4 bg-slate-200 rounded-md w-40 mb-6 animate-pulse"></div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="p-3 rounded-2xl bg-slate-100 animate-pulse h-16"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Panel 4 Skeleton */}
                            <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse"></div>
                                    <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
                                </div>
                                <div className="space-y-3">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="p-4 rounded-3xl bg-white border border-slate-50 flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                                            <div className="h-3 bg-slate-100 rounded w-4/5 animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
