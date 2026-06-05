import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Linkedin,
  Github,
  X,
  FileText,
  Eye,
  Star,
  Award,
  Settings,
  Library,
  Quote,
  BookOpen,
  FlaskConical,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ChromaGrid from "../components/react-bits/ChromaGrid";
import GradientText from "../components/GradientText";
import { useFetch, fetchWithTimeout } from "../hooks/useFetch";
import { API_BASE_URL, API_HEADERS } from "../config/apiConfig";
import { getImageUrl } from "../lib/imageUrl";

// ─── helpers ──────────────────────────────────────────────────────────────────

// Safely coerce any API value to an array
function toArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    const t = val.trim();
    if (!t || t === "[]") return [];
    try {
      const p = JSON.parse(t);
      if (Array.isArray(p)) return p.filter(Boolean);
    } catch (_) {}
    return t
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

// Parse certifications — supports old string array OR new {name, url} objects.
// Always returns [{name, url}] for uniform consumption.
function parseCertifications(val) {
  const arr = toArr(val);
  return arr.map((item) => {
    if (typeof item === "string" && item.trim()) return { name: item.trim(), url: "" };
    if (typeof item === "object" && item !== null && (item.name || item.url)) {
      return { name: item.name || "", url: item.url || "" };
    }
    return null;
  }).filter(Boolean);
}

// ─── Main Researchers Component ───────────────────────────────────────────────
export default function Researchers() {
  const [activeStudent, setActiveStudent] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllHackathons, setShowAllHackathons] = useState(false);
  // Certificates modal state
  const [activeCertStudent, setActiveCertStudent] = useState(null); // { name, certs: [{name,url}] }

  // ── RA skeleton count ─────────────────────────────────────────────────────
  // Persisted to localStorage so subsequent page visits show the correct
  // skeleton count instead of an arbitrary hardcoded default.
  // Key: 'srl_ra_count'. Default: 2 (safe fallback for first-ever visit).
  const [cachedRaCount, setCachedRaCount] = useState(() => {
    try {
      const stored = localStorage.getItem('srl_ra_count');
      return stored !== null ? Math.max(1, parseInt(stored, 10) || 2) : 2;
    } catch { return 2; }
  });

  // Leaderboard → batch mapping
  const { data: bMap } = useFetch(async () => {
    const json = await fetchWithTimeout(`${API_BASE_URL}/api/leaderboard`);
    const map = {};
    (json.leaderboard || []).forEach((row) => {
      if (row.enrollment_no && row.batch)
        map[row.enrollment_no.trim().toUpperCase()] = row.batch;
    });
    return map;
  });
  const batchMap = bMap || {};

  // Main researcher fetch
  const fetchResearchers = useCallback(async (signal) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/researchers`, {
        headers: API_HEADERS,
        cache: "no-store",
        signal,
      });
      const data = await res.json();
      const researchers = data.researchers || [];
      setStudentsData(researchers);

      // Persist actual RA count so next page load shows matching skeleton
      const raCount = researchers.filter((r) =>
        Array.isArray(r.roles)
          ? r.roles.includes('Research Assistant')
          : String(r.roles || '').includes('Research Assistant')
      ).length;
      if (raCount > 0) {
        try { localStorage.setItem('srl_ra_count', String(raCount)); } catch { /* ignore */ }
        setCachedRaCount(raCount);
      }
    } catch (err) {
      if (err.name !== "AbortError")
        console.error("Failed to fetch researchers:", err);
    } finally {
      // Don't clear loading when the request was intentionally aborted (e.g. StrictMode cleanup)
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetchResearchers(controller.signal);

    const onVisible = () => {
      if (document.visibilityState === "visible")
        fetchResearchers(new AbortController().signal);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      controller.abort();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchResearchers]);

  useEffect(() => {
    const onLive = (e) => {
      if (e.detail?.type === "student_changed") {
        fetchResearchers(new AbortController().signal);
      }
    };
    window.addEventListener("srl:live-update", onLive);
    return () => window.removeEventListener("srl:live-update", onLive);
  }, [fetchResearchers]);

  // ── sorting ───────────────────────────────────────────────────────────────
  const sortedStudents = useMemo(() => {
    const filtered = studentsData.filter(
      (s) => (s.student_name || "").toLowerCase() !== "admin",
    );
    return [...filtered].sort((a, b) => {
      const aName = (a.student_name || "").toLowerCase();
      const bName = (b.student_name || "").toLowerCase();
      const aIsPoojan = aName.includes("poojan") && aName.includes("ghetiya");
      const bIsPoojan = bName.includes("poojan") && bName.includes("ghetiya");
      if (aIsPoojan && !bIsPoojan) return 1;
      if (!aIsPoojan && bIsPoojan) return -1;
      // Sort by batch string DESC (e.g. "2025-29" > "2024-28"), then name ASC
      const ba = (a.batch || "").trim();
      const bb = (b.batch || "").trim();
      if (ba !== bb) return bb.localeCompare(ba); // newer batch first
      return aName.localeCompare(bName);
    });
  }, [studentsData]);

  const researchAssistants = useMemo(
    () =>
      sortedStudents
        .filter((s) => toArr(s.roles).includes("Research Assistant"))
        .map((s) => ({
          ...s,
          gradient: "linear-gradient(135deg, #e5e1baff 100%, #7af8c6ff 100%)",
        })),
    [sortedStudents],
  );

  // Keep cachedRaCount in sync with actual loaded count
  // (belt-and-suspenders in case fetchResearchers fires before state settles)
  useEffect(() => {
    if (!isLoading && researchAssistants.length > 0) {
      setCachedRaCount(researchAssistants.length);
      try { localStorage.setItem('srl_ra_count', String(researchAssistants.length)); } catch { /* ignore */ }
    }
  }, [isLoading, researchAssistants.length]);

  // Active student members — show all non-graduated students, including RAs
  const members = useMemo(
    () =>
      sortedStudents.filter((s) => s.member_type_effective !== "Graduated"),
    [sortedStudents],
  );

  // Graduated alumni — include all students whose effective member type is "Graduated"
  const graduatedMembers = useMemo(
    () =>
      sortedStudents.filter(
        (s) => s.member_type_effective === "Graduated",
      ),
    [sortedStudents],
  );

  // ── build ChromaGrid items ────────────────────────────────────────────────
  // All arrays now come directly from srl_student_profiles via the API.
  const chromaItems = useMemo(() => {
    return members.map((s) => {
      const enrollKey = (s.enrollment_no || "").trim().toUpperCase();
      const batch = batchMap[enrollKey] || s.batch || null;

      // All arrays come directly from srl_student_profiles via /api/researchers
      const hackathonsArr = toArr(s.hackathons);
      const srlPubs = toArr(s.srlPublications);

      const rawPapers = toArr(s.research_papers || s.papersPublished);
      const parsedPapers = rawPapers.map(item => {
        if (typeof item === 'string') {
          return { title: item, status: item.toLowerCase().includes('ongoing') ? 'ongoing' : 'completed' };
        }
        if (typeof item === 'object' && item !== null) {
          return {
            title: item.title || item.name || "",
            status: item.status || "completed"
          };
        }
        return null;
      }).filter(Boolean);
      const completedPapers = parsedPapers.filter(p => p.status !== 'ongoing').map(p => p.title).filter(Boolean);
      const ongoingPapersList = parsedPapers.filter(p => p.status === 'ongoing').map(p => p.title).filter(Boolean);

      const rawWork = toArr(s.research_work || s.researchWorks);
      const parsedWork = rawWork.map(w => {
        if (typeof w === 'string') return { title: w, status: w.toLowerCase().startsWith('ongoing') ? 'ongoing' : 'completed' };
        if (typeof w === 'object' && w !== null) {
          return {
            title: w.title || w.description || "",
            status: w.status || "completed"
          };
        }
        return null;
      }).filter(Boolean);
      const completedWork = parsedWork.filter(w => w.status !== 'ongoing').map(w => w.title).filter(Boolean);
      const ongoingWorkList = parsedWork.filter(w => w.status === 'ongoing').map(w => w.title).filter(Boolean);

      const totalOngoingProjects = ongoingPapersList.concat(ongoingWorkList);

      const srlUnderReview = srlPubs.filter(
        (p) => p.category === "Paper under Review",
      ).length;
      const srlPublished =
        srlPubs.length > 0 ? srlPubs.length - srlUnderReview : 0;

      const publishedCount =
        srlPubs.length > 0
          ? srlPublished
          : completedPapers.length || s.publicationsCount || "--";

      const ongoingCount = srlUnderReview + totalOngoingProjects.length;

      return {
        id:
          s.enrollment_no || s.student_name.toLowerCase().replace(/\s+/g, "-"),
        enrollment: s.enrollment_no,
        image: getImageUrl(
          s.profile_image || s.photo || "/students/schoolstudent.png",
        ),
        title: s.student_name,
        subtitle: `${s.department} • Batch ${s.batch || ''}`,
        batch,
        department: s.department,
        reflection: s.reflection || "",
        email: s.email || "",
        linkedin: s.linkedin || "",
        researchWorksCount: completedWork.length || "--",
        hackathonsCount: hackathonsArr.length || "--",
        papersPublishedCount: publishedCount,
        ongoingProjectsCount: ongoingCount,
        // Send raw database fields forward so activeMetrics can parse them too
        research_papers: rawPapers,
        research_work: rawWork,
        hackathons: hackathonsArr,
        achievements: toArr(s.achievements),
        certifications: toArr(s.certifications),
        research_areas: toArr(s.research),
        achievements_extended: s.achievements_extended || null,
        srlPublications: srlPubs,
        patents: toArr(s.patents),
        metadata: s.metadata || null,
        gradient: "linear-gradient(135deg, #dcfce7 0%, #fef9c3 100%)",
      };
    });
  }, [members, batchMap]);

  // ── build ChromaGrid items for Graduated Alumni ──────────────────────────
  const graduatedChromaItems = useMemo(() => {
    return graduatedMembers.map((s) => {
      const enrollKey = (s.enrollment_no || "").trim().toUpperCase();
      const batch = batchMap[enrollKey] || s.batch || null;

      const hackathonsArr = toArr(s.hackathons);
      const srlPubs = toArr(s.srlPublications);

      const rawPapers = toArr(s.research_papers || s.papersPublished);
      const parsedPapers = rawPapers.map(item => {
        if (typeof item === 'string') {
          return { title: item, status: item.toLowerCase().includes('ongoing') ? 'ongoing' : 'completed' };
        }
        if (typeof item === 'object' && item !== null) {
          return { title: item.title || item.name || "", status: item.status || "completed" };
        }
        return null;
      }).filter(Boolean);
      const completedPapers = parsedPapers.filter(p => p.status !== 'ongoing').map(p => p.title).filter(Boolean);
      const ongoingPapersList = parsedPapers.filter(p => p.status === 'ongoing').map(p => p.title).filter(Boolean);

      const rawWork = toArr(s.research_work || s.researchWorks);
      const parsedWork = rawWork.map(w => {
        if (typeof w === 'string') return { title: w, status: w.toLowerCase().startsWith('ongoing') ? 'ongoing' : 'completed' };
        if (typeof w === 'object' && w !== null) {
          return { title: w.title || w.description || "", status: w.status || "completed" };
        }
        return null;
      }).filter(Boolean);
      const completedWork = parsedWork.filter(w => w.status !== 'ongoing').map(w => w.title).filter(Boolean);
      const ongoingWorkList = parsedWork.filter(w => w.status === 'ongoing').map(w => w.title).filter(Boolean);

      const totalOngoingProjects = ongoingPapersList.concat(ongoingWorkList);
      const srlUnderReview = srlPubs.filter(p => p.category === "Paper under Review").length;
      const srlPublished = srlPubs.length > 0 ? srlPubs.length - srlUnderReview : 0;
      const publishedCount = srlPubs.length > 0
        ? srlPublished
        : completedPapers.length || s.publicationsCount || "--";
      const ongoingCount = srlUnderReview + totalOngoingProjects.length;

      return {
        id: s.enrollment_no || s.student_name.toLowerCase().replace(/\s+/g, "-"),
        enrollment: s.enrollment_no,
        image: getImageUrl(s.profile_image || s.photo || "/students/schoolstudent.png"),
        title: s.student_name,
        subtitle: `${s.department} • Batch ${s.batch || ''}`,
        batch,
        department: s.department,
        reflection: s.reflection || "",
        email: s.email || "",
        linkedin: s.linkedin || "",
        researchWorksCount: completedWork.length || "--",
        hackathonsCount: hackathonsArr.length || "--",
        papersPublishedCount: publishedCount,
        ongoingProjectsCount: ongoingCount,
        research_papers: rawPapers,
        research_work: rawWork,
        hackathons: hackathonsArr,
        achievements: toArr(s.achievements),
        certifications: toArr(s.certifications),
        research_areas: toArr(s.research),
        achievements_extended: s.achievements_extended || null,
        srlPublications: srlPubs,
        patents: toArr(s.patents),
        metadata: s.metadata || null,
        // Distinct gradient for graduated alumni — muted slate/lavender palette
        gradient: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
      };
    });
  }, [graduatedMembers, batchMap]);

  // ── modal helpers ─────────────────────────────────────────────────────────

  // Build a uniform modal-student object from either a chromaItem or an RA record
  const buildModalStudent = useCallback(
    (s) => {
      const enrollKey = (s.enrollment_no || s.enrollment || "")
        .trim()
        .toUpperCase();
      const batch = batchMap[enrollKey] || s.batch || null;
      return {
        ...s,
        title: s.student_name || s.title,
        subtitle: s.subtitle || `${s.department} • Batch ${s.batch || ''}`,
        batch,
      };
    },
    [batchMap],
  );

  const openModalFor = useCallback(
    (s) => {
      setActiveStudent(buildModalStudent(s));
    },
    [buildModalStudent],
  );

  const closeModal = () => {
    setActiveStudent(null);
    setShowAllHackathons(false);
  };

  const openCertsFor = (studentName, certsRaw) => {
    const certs = parseCertifications(certsRaw);
    setActiveCertStudent({ name: studentName, certs });
  };

  const closeCertsModal = () => setActiveCertStudent(null);

  // ── derived modal metrics ─────────────────────────────────────────────────
  // All data comes directly from the /api/researchers response embedded in
  // activeStudent — no supplemental fetches needed.
  const activeMetrics = useMemo(() => {
    if (!activeStudent) return null;

    const srlPubs = toArr(activeStudent.srlPublications);
    const underReview = srlPubs.filter(
      (p) => p.category === "Paper under Review",
    );
    const patents = toArr(activeStudent.patents);

    // Instead of activeStudent.papers and ongoingResearch, we'll parse the raw DB fields
    // which should now be in activeStudent.research_papers and activeStudent.research_work.
    // Let's use activeStudent.research_papers directly if available, fallback to papers.
    const rawPapers = toArr(activeStudent.research_papers || activeStudent.papers);
    
    // Parse research papers the same way Member CV does
    const parsedPapers = rawPapers.map(item => {
      if (typeof item === 'string') {
        return { title: item, status: item.toLowerCase().includes('ongoing') ? 'ongoing' : 'completed' };
      }
      if (typeof item === 'object' && item !== null) {
        return {
          title: item.title || item.name || "",
          link: item.link || "",
          status: item.status || "completed"
        };
      }
      return null;
    }).filter(Boolean);

    const completedPapers = parsedPapers.filter(p => p.status !== 'ongoing').map(p => p.title).filter(Boolean);
    const ongoingPapersList = parsedPapers.filter(p => p.status === 'ongoing').map(p => p.title).filter(Boolean);

    // Parse research work the same way Member CV does
    const rawWork = toArr(activeStudent.research_work || activeStudent.researchWorks);
    const parsedWork = rawWork.map(w => {
      if (typeof w === 'string') return { title: w, status: w.toLowerCase().startsWith('ongoing') ? 'ongoing' : 'completed' };
      if (typeof w === 'object' && w !== null) {
        return {
          title: w.title || w.description || "",
          status: w.status || "completed"
        };
      }
      return null;
    }).filter(Boolean);

    const completedWork = parsedWork.filter(w => w.status !== 'ongoing').map(w => w.title).filter(Boolean);
    const ongoingWorkList = parsedWork.filter(w => w.status === 'ongoing').map(w => w.title).filter(Boolean);

    // Combine ongoing
    const totalOngoingProjects = ongoingPapersList.concat(ongoingWorkList);

    // Published = non-review srl pubs OR completed papers
    const published =
      srlPubs.length > 0
        ? srlPubs.length - underReview.length
        : completedPapers.length;

    return {
      research_works_count: completedWork.length,
      hackathons_count: toArr(activeStudent.hackathons).length,
      papers_published_count: published,
      // Papers under review + explicit ongoing projects
      ongoing_projects_count: underReview.length + totalOngoingProjects.length,
      // full arrays
      research_areas: toArr(activeStudent.research_areas),
      hackathons: toArr(activeStudent.hackathons),
      papers: completedPapers,
      researchWorks: completedWork,
      achievements: toArr(activeStudent.achievements),
      ongoingResearch: totalOngoingProjects,
      filteredSrlPublications: srlPubs.filter(
        (p) => p.category !== "Paper under Review",
      ),
      underReviewSrlPubs: underReview,
      patents: patents,
    };
  }, [activeStudent]);

  // ESC to close — skip if cert lightbox is currently open (it handles its own ESC)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && activeStudent && !document.body.dataset.certOpen)
        closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeStudent]);

  // Body scroll lock + ScrollToTop signal for the profile modal
  useEffect(() => {
    if (!activeStudent) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.modalOpen = "true";   // ← hides ScrollToTop button
    return () => {
      document.body.style.overflow = prev;
      delete document.body.dataset.modalOpen;
    };
  }, [activeStudent]);

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="pt-10 lg:pt-14 pb-12 min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-black font-serif bg-gradient-to-r from-secondary to-slate-900 bg-clip-text text-transparent mb-3 tracking-tight leading-none">
            The Minds Behind <br />
            <span className="text-secondary">Innovation</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed font-light max-w-2xl mx-auto">
            Our lab is powered by curious minds dedicated to solving real-world
            challenges through systematic research, mentorship, and
            cross-functional collaboration.
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
                animationSpeed={3}
                showBorder={false}
                animateOnHover={true}
                className="text-4xl sm:text-5xl font-serif font-black px-4 py-2 text-center"
              >
                Research Assistants
              </GradientText>
            </div>

            {/* Derive responsive grid class based on actual RA count */}
            {(() => {
              // During loading: use cachedRaCount (from localStorage) so skeleton
              // layout exactly mirrors the final loaded layout — no layout shift.
              // After load: use actual researchAssistants.length.
              const displayCount = isLoading ? cachedRaCount : researchAssistants.length;

              // Shared grid class used by BOTH skeleton and loaded state
              const gridClass =
                displayCount === 1
                  ? 'flex justify-center'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto';

              return (
            <div className={gridClass}>
              {isLoading
                ? [...Array(displayCount)].map((_, idx) => (
                  <div
                    key={idx}
                    aria-hidden="true"
                    className={`relative overflow-hidden rounded-[2rem] shadow-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 border border-white/60${displayCount === 1 ? " w-full max-w-xl" : ""}`}
                    style={{ background: "linear-gradient(135deg, #e5e1baff 100%, #7af8c6ff 100%)" }}
                  >
                    {/* Avatar — matches actual: relative shrink-0, w-24 h-24 sm:w-28 sm:h-28, rounded-full, border-4 border-white */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full skeleton-bone border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]" />
                    </div>

                    {/* Content — matches actual: flex-1, text-center sm:text-left, flex flex-col */}
                    <div className="flex-1 text-center sm:text-left relative z-10 flex flex-col w-full">
                      {/* Badge pill — matches: inline-flex rounded-full mb-2, self-center sm:self-start */}
                      <div className="h-5 w-36 skeleton-bone rounded-full mb-2 self-center sm:self-start" />

                      {/* Name h3 — matches: text-2xl font-black font-serif mb-0.5 */}
                      <div className="h-7 skeleton-bone rounded-lg w-4/5 mb-0.5 mx-auto sm:mx-0" />

                      {/* Dept + batch row — matches: mb-2, flex items-center gap-2 */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <div className="h-3 skeleton-bone rounded-md w-16" />
                        <div className="w-1 h-1 rounded-full bg-black/10 shrink-0" />
                        <div className="h-3 skeleton-bone rounded-md w-20" />
                      </div>

                      {/* Research tags row — matches: flex flex-wrap gap-1.5 mb-2 */}
                      <div className="flex flex-wrap gap-1.5 mb-2 justify-center sm:justify-start">
                        {[80, 108, 72].map((w, i) => (
                          <div
                            key={i}
                            className="h-5 bg-white/60 rounded-lg border border-black/[0.08]"
                            style={{ width: w }}
                          />
                        ))}
                      </div>

                      {/* Social button row — matches: mt-auto flex gap-2 pt-0.5, p-2 rounded-md buttons */}
                      <div className="mt-auto flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                        <div className="w-[31px] h-[31px] bg-white/60 rounded-md border border-black/[0.08]" />
                        <div className="w-[31px] h-[31px] bg-white/60 rounded-md border border-black/[0.08]" />
                        <div className="w-[31px] h-[31px] bg-white/60 rounded-md border border-black/[0.08]" />
                      </div>
                    </div>
                  </div>
                  ))
                : researchAssistants.map((ra) => {
                    const enrollKey = (ra.enrollment_no || "")
                      .trim()
                      .toUpperCase();
                    const batch = batchMap[enrollKey] || ra.batch || null;
                    const raSrlPubs = toArr(ra.srlPublications);
                    const raSrlUnderReview = raSrlPubs.filter(
                      (p) => p.category === "Paper under Review",
                    ).length;
                    // ONGOING: papers under review + explicit ongoing_research items
                    const raOngoing =
                      raSrlUnderReview + toArr(ra.ongoingResearch).length;
                    // PAPERS: non-review srl pubs OR simple papers_published list
                    const raPublished =
                      raSrlPubs.length > 0
                        ? raSrlPubs.length - raSrlUnderReview
                        : toArr(ra.papersPublished).length;
                    const raHackathons = toArr(ra.hackathons);
                    const raResearchWorks = toArr(ra.researchWorks);

                    return (
                      <motion.article
                        key={ra.enrollment_no || ra.student_name}
                        whileHover={{ y: -8, scale: 1.01 }}
                        style={{ background: ra.gradient }}
                        className={`group relative overflow-hidden rounded-[2rem] shadow-xl bg-white/40 backdrop-blur-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 border border-white/60 transition-all duration-700 hover:shadow-[0_30px_60px_-12px_rgba(11,61,58,0.15)] cursor-pointer${displayCount === 1 ? " w-full max-w-xl" : ""}`}
                        onClick={() =>
                          openModalFor({
                            id:
                              ra.enrollment_no ||
                              ra.student_name
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            enrollment: ra.enrollment_no,
                            image: getImageUrl(
                              ra.profile_image ||
                                ra.photo ||
                                "/students/schoolstudent.png",
                            ),
                            title: ra.student_name,
                            subtitle: `${ra.department} • Batch ${ra.batch || ''}`,
                            batch,
                            reflection: ra.reflection || "",
                            email: ra.email || "",
                            linkedin: ra.linkedin || "",
                            hackathons: raHackathons,
                            papers: toArr(ra.papersPublished),
                            researchWorks: raResearchWorks,
                            achievements: toArr(ra.achievements),
                            ongoingResearch: toArr(ra.ongoingResearch),
                            certifications: toArr(ra.certifications),
                            research_areas: toArr(ra.research),
                            achievements_extended:
                              ra.achievements_extended || null,
                            srlPublications: raSrlPubs,
                            patents: toArr(ra.patents),
                            metadata: ra.metadata || null,
                            researchWorksCount: raResearchWorks.length || "--",
                            hackathonsCount: raHackathons.length || "--",
                            papersPublishedCount: raPublished,
                            ongoingProjectsCount: raOngoing,
                          })
                        }
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="absolute -inset-3 rounded-full border-2 border-secondary/0 group-hover:border-secondary/25 group-hover:scale-110 transition-all duration-700" />
                          <div className="absolute inset-0 bg-secondary blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-700 rounded-full" />
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-700">
                            <img
                              loading="lazy"
                              decoding="async"
                              src={getImageUrl(
                                ra.profile_image ||
                                  ra.photo ||
                                  "/students/schoolstudent.png",
                              )}
                              alt={ra.student_name}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[1.5px]"
                            />
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 rounded-full flex items-end justify-center pointer-events-none pb-5">
                              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/40 opacity-0 scale-75 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.08em] text-white drop-shadow-sm whitespace-nowrap">
                                  View Profile
                                </span>
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
                            <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.18em] text-secondary">
                              Research Assistant
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-2xl font-black font-serif mb-0.5 text-slate-900 tracking-tight leading-tight group-hover:text-secondary transition-colors duration-500">
                            {ra.student_name}
                          </h3>
                          <div className="text-[12px] font-bold text-slate-500 mb-2 flex items-center justify-center sm:justify-start gap-2">
                            <span>{ra.department}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>Batch {ra.batch || ''}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-2 justify-center sm:justify-start">
                            {toArr(ra.research).length > 0 ? (
                              toArr(ra.research)
                                .slice(0, 3)
                                .map((domain, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-700 text-[12px] font-bold tracking-tight"
                                  >
                                    {domain}
                                  </span>
                                ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                No focus areas
                              </span>
                            )}
                          </div>

                          {/* Bottom row: social links */}
                          <div
                            className="mt-auto flex items-center gap-2 pt-0.5 justify-center sm:justify-start"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {ra.email && (
                              <a
                                href={`mailto:${ra.email}`}
                                className="p-2 rounded-md bg-slate-50 text-slate-400 border border-slate-200 hover:border-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm"
                              >
                                <Mail size={15} />
                              </a>
                            )}
                            {ra.linkedin && (
                              <a
                                href={ra.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-md bg-slate-50 text-slate-400 border border-slate-200 hover:border-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all duration-300 shadow-sm"
                              >
                                <Linkedin size={15} />
                              </a>
                            )}
                            {/* Certificates button — opens CertificatesModal */}
                            <button
                              type="button"
                              title="Certificates"
                              aria-label={`View certificates for ${ra.student_name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                openCertsFor(ra.student_name, ra.certifications);
                              }}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[13px] font-black uppercase tracking-wider shadow-sm hover:bg-teal-500 hover:text-white transition-all duration-300"
                            >
                              <Award size={15} />
                              <span>CERTIFICATES</span>
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
            </div>
              );
            })()}
          </div>
        )}

        {/* ── Members grid ────────────────────────────────────────── */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Student <span className="text-secondary">Members</span>
            </h2>
            {isLoading ? (
              <div className="w-32 h-6 skeleton-bone rounded-full" />
            ) : (
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
                {members.length} Student Members
              </div>
            )}
          </div>
          <ChromaGrid
            items={chromaItems}
            onImageClick={openModalFor}
            onCertClick={(item) => openCertsFor(item.title, item.certifications)}
            isLoading={isLoading}
            skeletonCount={12}
          />
        </div>

        {/* ── Graduated Alumni ─────────────────────────────────────── */}
        {(isLoading || graduatedMembers.length > 0) && (
          <div className="mb-16">
            {/* Section header — same structure as Student Members */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Graduated{" "}
                <span className="text-slate-500">Alumni</span>
              </h2>
              {isLoading ? (
                <div className="w-32 h-6 skeleton-bone rounded-full" />
              ) : (
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
                  {graduatedMembers.length} Alumni
                </div>
              )}
            </div>

            {/* Subtle description line */}
            <p className="text-slate-400 text-sm mb-8 -mt-4 font-medium">
              Members who have completed their undergraduate program and graduated from the lab.
            </p>

            {/* ChromaGrid with muted graduated items */}
            <div className="opacity-85">
              <ChromaGrid
                items={graduatedChromaItems}
                onImageClick={openModalFor}
                onCertClick={(item) => openCertsFor(item.title, item.certifications)}
                isLoading={isLoading}
                skeletonCount={6}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Profile Modal ─────────────────────────────────────────── */}
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
              {/* Decorative BG */}
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 blur-[150px] -mr-96 -mt-96 rounded-full animate-pulse pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] -ml-64 -mb-64 rounded-full pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#0b3d3a_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.05] pointer-events-none" />
              <div className="absolute bottom-10 right-10 text-[10rem] font-black text-secondary/[0.02] select-none pointer-events-none tracking-tighter uppercase leading-none">
                Research
              </div>

              {/* Close */}
              <div className="absolute top-4 right-6 z-30">
                <button
                  onClick={closeModal}
                  className="p-2.5 rounded-xl bg-slate-100/80 backdrop-blur-md text-slate-500 hover:bg-secondary hover:text-white transition-all duration-500 group shadow-md"
                >
                  <X
                    size={18}
                    className="group-hover:rotate-90 transition-transform duration-500"
                  />
                </button>
              </div>

              <div className="relative flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-0">
                  {/* ── Left: Visual Profile ──────────────────────── */}
                  <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-2xl p-6 lg:p-8 border-r border-white/40 flex flex-col relative z-10">
                    <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
                      <div className="w-16 h-1 bg-teal-500/40 rounded-full mb-2" />

                      {/* Avatar */}
                      <div className="relative group/profile mx-auto w-max">
                        <div className="absolute -inset-6 bg-teal-500/10 blur-[60px] rounded-full opacity-60 group-hover/profile:opacity-100 transition-opacity duration-700" />
                        <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl transition-transform duration-700 group-hover/profile:scale-[1.03]">
                          <img
                            loading="lazy"
                            decoding="async"
                            src={getImageUrl(
                              activeStudent.image ||
                                "/students/schoolstudent.png",
                            )}
                            alt={activeStudent.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Name & role */}
                      <div className="space-y-3 text-center lg:text-left">
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-black font-serif text-slate-900 tracking-tight leading-none mb-1">
                            {activeStudent.title}
                          </h3>
                          <p className="text-slate-500 font-bold text-sm">
                            Researcher, Batch {activeStudent.batch || ''}
                          </p>
                        </div>

                        {/* Reflection quote */}
                        {activeStudent.reflection && (
                          <div className="pt-3 border-t border-black/5">
                            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-3">
                              Reflection:
                            </h4>
                            <p className="text-[15px] font-medium leading-relaxed text-slate-600 italic">
                              "{activeStudent.reflection}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Social links */}
                      <div className="flex items-center justify-center lg:justify-start gap-3 pt-3">
                        {activeStudent.linkedin && (
                          <a
                            href={activeStudent.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                        <a
                          href={`mailto:${activeStudent.email}`}
                          className="w-10 h-10 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50"
                        >
                          <Mail size={18} />
                        </a>
                        {activeStudent.github && (
                          <a
                            href={activeStudent.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-teal-100/50 flex items-center justify-center text-teal-700 hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-sm border border-white/50"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        <button
                          type="button"
                          title="View certificates"
                          aria-label={`View certificates for ${activeStudent.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openCertsFor(activeStudent.title, activeStudent.certifications);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              openCertsFor(activeStudent.title, activeStudent.certifications);
                            }
                          }}
                          className="inline-flex items-center gap-3 px-3 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[13px] font-black uppercase tracking-wider shadow-sm hover:bg-teal-500 hover:text-white transition-all duration-300 select-none"
                        >
                          <Award size={16} />
                          <span className="">CERTIFICATES</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Right: Intelligence Grid ──────────────────── */}
                  <div className="p-6 lg:p-8 space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Panel 1: Knowledge Domains */}
                      <ModalPanel title="Knowledge Domains" className="p-2">
                        <div className="flex flex-wrap gap-1.5">
                          {(activeMetrics?.research_areas || []).length > 0 ? (
                            activeMetrics.research_areas.map((area, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-full bg-teal-50/80 border border-teal-100 text-teal-800 text-[12px] font-black uppercase tracking-wider shadow-sm hover:shadow-sm transition-all"
                              >
                                {area}
                              </span>
                            ))
                          ) : (
                            <EmptyHint text="No focus areas recorded" />
                          )}
                        </div>
                      </ModalPanel>

                      {/* Panel 2: Hackathons */}
                      <ModalPanel
                        title="Hackathons & Achievements"
                        className="p-4"
                      >
                        <ul className="space-y-2.5">
                          {(activeMetrics?.hackathons || []).length > 0 ? (
                            (showAllHackathons
                              ? activeMetrics.hackathons
                              : activeMetrics.hackathons.slice(0, 4)
                            ).map((h, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-[15px] font-bold text-slate-700"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                                <span className="leading-tight">{h}</span>
                              </li>
                            ))
                          ) : (
                            <li>
                              <EmptyHint text="No hackathons recorded" />
                            </li>
                          )}
                        </ul>
                        {(activeMetrics?.hackathons || []).length > 4 && (
                          <button
                            onClick={() => setShowAllHackathons((v) => !v)}
                            className="mt-6 text-[11px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-700 transition-colors flex items-center gap-2"
                          >
                            {showAllHackathons
                              ? "Show Less"
                              : `View All ${activeMetrics.hackathons.length} Hackathons`}
                            <div
                              className={`w-1 h-1 rounded-full bg-teal-500 transition-transform ${showAllHackathons ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </ModalPanel>

                      {/* Panel 3: Papers + Analytics */}
                      <ModalPanel title="Papers Published & Year" compact className="">
                        <ul className="space-y-1 mb-1">
                          {(activeMetrics?.papers || [])
                            .slice(0, 2)
                            .map((p, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-[13px] font-bold text-slate-700 leading-tight"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          {!activeMetrics?.papers?.length && (
                            <li>
                              <EmptyHint text="No publications yet" />
                            </li>
                          )}
                        </ul>
                          <div className="pt-3 border-t border-black/5">
                          <h4 className="text-[16px] font-black text-slate-900 flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-teal-500" />
                            Execution Analytics:
                          </h4>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              {
                                label: "Projects",
                                val: activeMetrics?.ongoing_projects_count ?? 0,
                                alt: "Ongoing",
                              },
                              {
                                label: "Hackathons",
                                val: activeMetrics?.hackathons_count ?? 0,
                                alt: "Total",
                              },
                              {
                                label: "Published",
                                val: activeMetrics?.papers_published_count ?? 0,
                                alt: "Research",
                              },
                            ].map((m, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-2xl bg-teal-50/50 border border-teal-100/50 text-center"
                              >
                                <p className="text-[9px] font-black uppercase text-slate-800 mb-1">
                                  {m.alt}
                                </p>
                                <p className="text-lg font-black text-teal-700">
                                  {m.val}
                                </p>
                                <p className="text-[9px] font-bold text-slate-800 uppercase tracking-tighter">
                                  {m.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </ModalPanel>

                      {/* Panel 4: Leadership & Awards */}
                      <ModalPanel title="Leadership & Awards" compact className="">
                        <div className="flex-1 flex flex-col justify-center space-y-1">
                          {[
                            ...toArr(
                              activeStudent.achievements_extended?.leadership,
                            )
                              .slice(0, 2)
                              .map((l) => ({
                                text: l,
                                icon: <Library size={20} />,
                                color: "teal",
                              })),
                            ...toArr(
                              activeStudent.achievements_extended?.awards,
                            )
                              .slice(0, 1)
                              .map((a) => ({
                                text: a,
                                icon: <Star size={20} />,
                                color: "amber",
                              })),
                            ...toArr(activeMetrics?.achievements)
                              .slice(0, 2)
                              .map((a) => ({
                                text: a,
                                icon: <Trophy size={20} />,
                                color: "teal",
                              })),
                          ].length > 0 ? (
                            [
                              ...toArr(
                                activeStudent.achievements_extended?.leadership,
                              )
                                .slice(0, 2)
                                .map((l) => ({
                                  text: l,
                                  icon: <Library size={20} />,
                                  color: "teal",
                                })),
                              ...toArr(
                                activeStudent.achievements_extended?.awards,
                              )
                                .slice(0, 1)
                                .map((a) => ({
                                  text: a,
                                  icon: <Star size={20} />,
                                  color: "amber",
                                })),
                              ...toArr(activeMetrics?.achievements)
                                .slice(0, 2)
                                .map((a) => ({
                                  text: a,
                                  icon: <Trophy size={20} />,
                                  color: "teal",
                                })),
                            ].map((item, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-2xl bg-white shadow-sm border border-slate-50 flex justify-center items-center gap-2 hover:border-teal-200 transition-colors"
                              >
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 shrink-0`}
                                >
                                  {item.icon}
                                </div>
                                <div className="flex-1 items-center justify-center">
                                  <span className="text-[12px] font-bold text-slate-700 uppercase">
                                    {item.text}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <EmptyHint text="No awards or leadership recorded" />
                          )}
                        </div>
                      </ModalPanel>

                      {/* Panel 5: Research Works (from srl_student_profiles.research_works) */}
                      {toArr(activeMetrics?.researchWorks).length > 0 && (
                        <ModalPanel
                          title="Research Works"
                          icon={
                            <FlaskConical size={14} className="text-teal-500" />
                          }
                        >
                          <ul className="space-y-4">
                            {toArr(activeMetrics.researchWorks).map((w, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-4 text-[14px] font-bold text-slate-700 leading-tight"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </ModalPanel>
                      )}

                      {/* Panel 6: SRL Publications (structured — previously computed but never rendered) */}
                      {toArr(activeMetrics?.filteredSrlPublications).length >
                        0 && (
                        <ModalPanel
                          title="SRL Publications"
                          icon={
                            <BookOpen size={14} className="text-teal-500" />
                          }
                        >
                          <ul className="space-y-5">
                            {toArr(activeMetrics.filteredSrlPublications).map(
                              (pub, i) => (
                                <li key={i} className="space-y-1">
                                  <p className="text-[14px] font-black text-slate-800 leading-snug">
                                    {pub.title}
                                  </p>
                                  {pub.venue && (
                                    <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wide">
                                      {pub.venue}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {pub.type && (
                                      <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-[10px] font-black text-teal-700 uppercase tracking-wider">
                                        {pub.type}
                                      </span>
                                    )}
                                    {pub.date && (
                                      <span className="text-[11px] font-medium text-slate-400">
                                        {pub.date}
                                      </span>
                                    )}
                                    {pub.conferenceGrant && (
                                      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-700 uppercase tracking-wider">
                                        Grant
                                      </span>
                                    )}
                                  </div>
                                </li>
                              ),
                            )}
                          </ul>
                        </ModalPanel>
                      )}

                      {/* Panel 7: Patents */}
                      {toArr(activeMetrics?.patents).length > 0 && (
                        <ModalPanel
                          title="Patents"
                          icon={<Award size={14} className="text-amber-500" />}
                        >
                          <ul className="space-y-5">
                            {toArr(activeMetrics.patents).map((patent, i) => (
                              <li key={i} className="space-y-1">
                                <p className="text-[14px] font-black text-slate-800 leading-snug">
                                  {patent.patent_title || "Untitled Patent"}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {patent.application_number && (
                                    <span className="text-[11px] font-medium text-slate-500">
                                      No: {patent.application_number}
                                    </span>
                                  )}
                                  {patent.application_status && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-700 uppercase tracking-wider">
                                      {patent.application_status}
                                    </span>
                                  )}
                                  {patent.application_date && (
                                    <span className="text-[11px] font-medium text-slate-400">
                                      {new Date(
                                        patent.application_date,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </ModalPanel>
                      )}

                      {/* Panel 8: Dynamic Metadata — renders any future fields added via admin portal */}
                      {activeStudent.metadata &&
                        Object.keys(activeStudent.metadata).length > 0 && (
                          <ModalPanel title="Additional Info">
                            <dl className="space-y-3">
                              {Object.entries(activeStudent.metadata).map(
                                ([key, val]) => {
                                  if (
                                    val === null ||
                                    val === undefined ||
                                    val === ""
                                  )
                                    return null;
                                  const label = key
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase());
                                  const display = Array.isArray(val)
                                    ? val.join(", ")
                                    : typeof val === "object"
                                      ? JSON.stringify(val)
                                      : String(val);
                                  return (
                                    <div key={key} className="flex gap-3">
                                      <dt className="text-[11px] font-black text-slate-400 uppercase tracking-wide shrink-0 w-28">
                                        {label}
                                      </dt>
                                      <dd className="text-[13px] font-bold text-slate-700 leading-snug">
                                        {display}
                                      </dd>
                                    </div>
                                  );
                                },
                              )}
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

      {/* ── Certificates Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {activeCertStudent && (
          <CertificatesModal
            studentName={activeCertStudent.name}
            certs={activeCertStudent.certs}
            onClose={closeCertsModal}
          />
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(13, 148, 136, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(13, 148, 136, 0.5); }
            `,
        }}
      />
    </div>
  );
}

// ─── small reusable modal panel ───────────────────────────────────────────────

function ModalPanel({ title, icon, children, className = "", compact = false }) {
  const padding = compact ? "p-3" : "p-6";
  const base =
    "rounded-[1.25rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-400 flex flex-col";
  return (
    <div className={`${padding} ${base} ${className}`.trim()}>
      <h4 className={`text-[16px] font-black text-slate-900 flex items-center gap-3 ${compact ? 'mb-2' : 'mb-4'}`}>
        <div className="w-2 h-2 rounded-full bg-teal-500" />
        {icon && icon}
        {title}:
      </h4>
      {children}
    </div>
  );
}

function EmptyHint({ text }) {
  return (
    <p className="text-[14px] text-slate-400 italic font-medium">{text}</p>
  );
}

// ─── Certificate Lightbox (fullscreen, navigable, body-scroll-locked) ─────────────────
function CertificatesModal({ studentName, certs, onClose }) {
  const uploadedCerts = (certs || []).filter((c) => c.url);
  const nameCerts     = (certs || []).filter((c) => !c.url);
  const total         = uploadedCerts.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction,  setDirection]  = useState(1);   // 1 = forward, -1 = backward
  const [imgErr,     setImgErr]     = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);
  const thumbsRef = useRef(null);

  // ─ Body scroll lock + signal ScrollToTop to hide ──────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.certOpen = "true";
    return () => {
      document.body.style.overflow = prev;
      delete document.body.dataset.certOpen;
    };
  }, []);

  // ─ Reset per-cert state when cert changes ─────────────────────────────
  useEffect(() => {
    setImgErr(false);
    setImgLoaded(false);
  }, [currentIdx]);

  // ─ Scroll active thumbnail into view ──────────────────────────────────
  useEffect(() => {
    if (!thumbsRef.current) return;
    const active = thumbsRef.current.querySelector('[data-active="true"]');
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentIdx]);

  // ─ Directional navigation ─────────────────────────────────────────────
  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIdx((i) => (i + 1) % total);
  }, [total]);
  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIdx((i) => (i - 1 + total) % total);
  }, [total]);

  // ─ Keyboard: ESC / ← → — capture phase so profile modal doesn't also fire ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
      } else if (e.key === "ArrowRight" && total > 1) goNext();
      else if (e.key === "ArrowLeft"  && total > 1) goPrev();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose, goNext, goPrev, total]);

  const current   = uploadedCerts[currentIdx];
  const hasImages = total > 0;

  // ── Shared easing curves ───────────────────────────────────────────────
  const EASE_OUT = [0.22, 1, 0.36, 1];   // fast decelerate — snappy entrance

  // ── Directional slide variants for certificate images ─────────────────
  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d * 38, scale: 0.98 }),
    center: {     opacity: 1, x: 0,      scale: 1    },
    exit:   (d) => ({ opacity: 0, x: d * -38, scale: 0.98 }),
  };

  // ── No-image fallback (name-only chips) ───────────────────────────────
  if (!hasImages) {
    return (
      <motion.div
        className="fixed inset-0 z-[500] flex items-center justify-center p-4"
        style={{ paddingTop: "80px", willChange: "opacity" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{    opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.93, y: 14 }}
          animate={{ scale: 1,    y: 0  }}
          exit={{    scale: 0.93, y: 14 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/40"
          style={{ willChange: "transform" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Award className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-black text-slate-900">Certifications</h3>
              </div>
              <p className="text-sm text-slate-400 font-medium">{studentName}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-teal-500 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>
          {nameCerts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {nameCerts.map((c, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-sm font-bold">
                  {c.name || "Unnamed"}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-6">No certificates added yet.</p>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // ── Full lightbox ──────────────────────────────────────────────────────
  return (
    <motion.div
      className="fixed inset-0 z-[500] flex flex-col"
      style={{ paddingTop: "64px", willChange: "opacity" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Tint — root opacity drives the fade, no blur = zero repaint cost */}
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />

      {/* ── Content — scale+y only (transform = GPU composited; root opacity handles fade) ── */}
      <motion.div
        className="relative flex flex-col h-full"
        initial={{ scale: 0.95, y: 14 }}
        animate={{ scale: 1,    y: 0  }}
        exit={{    scale: 0.97, y: -8 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        style={{ willChange: "transform" }}
      >

        {/* ── Top bar ── */}
        <div className="flex items-center justify-end px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {total > 1 && (
              <span className="text-white/60 text-xs font-black tabular-nums bg-white/10 px-2.5 py-1 rounded-full">
                {currentIdx + 1} / {total}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/25 hover:scale-110 active:scale-95 transition-all"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Image area ── */}
        <div className="flex-1 min-h-0 relative overflow-hidden">

          {/* Left nav arrow */}
          {total > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-teal-500/80 hover:border-teal-400 hover:scale-110 active:scale-95 transition-all backdrop-blur-sm shadow-lg"
              aria-label="Previous certificate"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Name + image stacked — fills the absolute container */}
          <div className="absolute inset-0 flex flex-col items-center px-14 sm:px-20 py-2">

            {/* Cert name — fades with direction */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`name-${currentIdx}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y:  0 }}
                exit={{    opacity: 0, y:  6 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                className="text-white font-black text-xl sm:text-2xl text-center mb-4 px-4 max-w-2xl tracking-tight leading-snug shrink-0"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.7)", willChange: "transform, opacity" }}
              >
                {current?.name || `Certificate ${currentIdx + 1}`}
              </motion.p>
            </AnimatePresence>

            {/* Image slide — directional, popLayout for instant swap */}
            <div className="relative flex-1 min-h-0 w-full">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={currentIdx}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ willChange: "transform, opacity" }}
                >
                  {!imgErr && current?.url ? (
                    <>
                      {/* Pulse skeleton — visible while image loads */}
                      {!imgLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div
                            className="rounded-2xl bg-white/8 animate-pulse"
                            style={{ width: "min(60vw, 420px)", height: "min(44vh, 300px)" }}
                          />
                        </div>
                      )}
                      {/* Image — CSS transition fade-in on load (zero JS overhead) */}
                      <img
                        src={current.url}
                        alt={current.name || `Certificate ${currentIdx + 1}`}
                        className="block max-w-full max-h-full object-contain rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.55)]"
                        loading="eager"
                        draggable={false}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgErr(true)}
                        style={{
                          opacity: imgLoaded ? 1 : 0,
                          transition: "opacity 240ms ease",
                          willChange: "opacity",
                        }}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-white/30">
                      <Award size={56} />
                      <p className="text-sm font-medium">Image unavailable</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right nav arrow */}
          {total > 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-teal-500/80 hover:border-teal-400 hover:scale-110 active:scale-95 transition-all backdrop-blur-sm shadow-lg"
              aria-label="Next certificate"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* ── Bottom bar ── */}
        <div className="shrink-0 px-4 sm:px-6 pb-4 pt-2 space-y-3">

          {/* Thumbnail strip */}
          {total > 1 && (
            <div
              ref={thumbsRef}
              className="flex gap-2 justify-center overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {uploadedCerts.map((cert, i) => (
                <button
                  key={i}
                  data-active={i === currentIdx ? "true" : "false"}
                  onClick={() => {
                    setDirection(i > currentIdx ? 1 : -1);
                    setCurrentIdx(i);
                  }}
                  className={`flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === currentIdx
                      ? "border-teal-400 scale-105 shadow-lg shadow-teal-500/30"
                      : "border-white/15 opacity-45 hover:opacity-75 hover:border-white/40"
                  }`}
                  aria-label={`View certificate ${i + 1}`}
                >
                  <img
                    src={cert.url}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Name-only cert chips */}
          {nameCerts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center">
              {nameCerts.map((cert, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-white/10 text-white/65 text-[11px] font-semibold border border-white/15"
                >
                  {cert.name || "Unnamed"}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
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
        <div className="skeleton-bone rounded-xl w-9 h-9"></div>
      </div>

      <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-0">
          {/* ── Left: Visual Profile Skeleton ──────────────────────── */}
          <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-2xl p-10 lg:p-14 border-r border-white/40 flex flex-col relative z-10">
            <div className="lg:sticky lg:top-8 lg:self-start space-y-10">
              <div className="w-16 h-1 skeleton-bone rounded-full" />

              {/* Avatar Skeleton */}
              <div className="relative group/profile mx-auto w-max">
                <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-[3rem] skeleton-bone"></div>
              </div>

              {/* Name & Role Skeleton */}
              <div className="space-y-4 text-center lg:text-left">
                <div className="space-y-3">
                  <div className="h-8 skeleton-bone rounded-lg w-5/6 mx-auto lg:mx-0"></div>
                  <div className="h-5 skeleton-bone rounded-lg w-4/6 mx-auto lg:mx-0"></div>
                </div>

                {/* Reflection Skeleton */}
                <div className="pt-6 border-t border-black/5">
                  <div className="h-3 skeleton-bone rounded-md w-20 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3.5 skeleton-bone rounded-md w-full"></div>
                    <div className="h-3.5 skeleton-bone rounded-md w-5/6"></div>
                  </div>
                </div>
              </div>

              {/* Social Links Skeleton */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full skeleton-bone"
                  ></div>
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
                  <div className="w-2 h-2 rounded-full skeleton-bone"></div>
                  <div className="h-4 skeleton-bone rounded-md w-32"></div>
                </div>
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-6 skeleton-bone rounded-full w-4/5"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Panel 2 Skeleton */}
              <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full skeleton-bone"></div>
                  <div className="h-4 skeleton-bone rounded-md w-32"></div>
                </div>
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full skeleton-bone mt-1.5"></div>
                      <div className="h-3 skeleton-bone rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel 3 Skeleton */}
              <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full skeleton-bone"></div>
                  <div className="h-4 skeleton-bone rounded-md w-32"></div>
                </div>
                <div className="space-y-3 mb-8">
                  {[0, 1].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full skeleton-bone mt-1.5"></div>
                      <div className="h-3 skeleton-bone rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-black/5">
                  <div className="h-4 skeleton-bone rounded-md w-40 mb-6"></div>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="skeleton-bone rounded-2xl h-16"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panel 4 Skeleton */}
              <div className="p-10 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full skeleton-bone"></div>
                  <div className="h-4 skeleton-bone rounded-md w-32"></div>
                </div>
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-3xl bg-white border border-slate-50 flex items-center gap-5"
                    >
                      <div className="w-10 h-10 rounded-full skeleton-bone shrink-0"></div>
                      <div className="h-3 skeleton-bone rounded w-4/5"></div>
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
