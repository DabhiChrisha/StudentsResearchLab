import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  Download,
  Search,
  Users,
  ShieldCheck,
  FileText,
  Bookmark,
  PlusCircle,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

/* ================= CONSTANTS ================= */

// UI category labels → must match event_type values in the DB exactly
const CATEGORIES = ["All", "Conference", "Journal", "Book Chapter", "Poster Presentation"];

// Maps DB event_type to a display label for the UI
const EVENT_TYPE_LABEL = {
  Conference: "Conference",
  Journal: "Journal",
  Book: "Book Chapter",
  "Poster Presentation": "Poster",
};

/* ================= HELPERS ================= */

function formatAuthors(authorsStr) {
  if (!authorsStr) return [];
  return authorsStr.split(",").map((a) => a.trim()).filter(Boolean);
}

function formatDate(raw) {
  if (!raw) return null;
  // Show just the year if we can extract it
  const m = raw.match(/\b(20\d{2})\b/);
  if (m) return m[1];
  return raw;
}

/* ================= PUBLICATION CARD ================= */

const PublicationCard = ({ pub, index }) => {
  const backgrounds = [
    { bg: "from-teal-500 to-emerald-400", border: "border-teal-500" },
    { bg: "from-emerald-500 to-teal-400", border: "border-emerald-500" },
    { bg: "from-teal-600 to-emerald-500", border: "border-teal-600" },
  ];
  const theme = backgrounds[index % backgrounds.length];
  const authors = formatAuthors(pub.student_authors);
  const dateLabel = formatDate(pub.date_raw);
  const typeLabel = EVENT_TYPE_LABEL[pub.event_type] || pub.event_type || "Publication";

  // Derive category badge colour by category
  const isScoped = (pub.category || "").toLowerCase().includes("scopus");
  const isReview = (pub.category || "").toLowerCase().includes("review");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full"
    >
      <div
        className={`h-full relative rounded-2xl sm:rounded-3xl overflow-visible bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col border-5 sm:border-6 md:border-8 w-full ${theme.border}`}
      >
        {/* Top gradient header */}
        <div
          className={`relative bg-gradient-to-br ${theme.bg} p-4 sm:p-5 md:p-6 flex-none min-h-32 sm:min-h-40 md:min-h-44 flex flex-col justify-between rounded-t-lg overflow-hidden`}
        >
          {/* Type badge */}
          <div className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6 z-20">
            <div className="px-3 py-1.5 rounded-full bg-white/95 text-slate-700 text-xs sm:text-sm font-bold shadow-md backdrop-blur-sm">
              {typeLabel}
            </div>
          </div>

          {/* Date badge */}
          {dateLabel && (
            <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 right-4 sm:right-5 md:right-6 z-20">
              <div className="px-3 py-1.5 rounded-full bg-white/95 text-slate-700 text-xs sm:text-sm font-medium shadow-md flex items-center gap-1.5 backdrop-blur-sm">
                <Calendar size={14} />
                {dateLabel}
              </div>
            </div>
          )}
        </div>

        {/* Content card */}
        <div className="flex-1 p-2 sm:p-3 md:p-4 flex items-center justify-center">
          <motion.div
            initial={{ rotateZ: 0 }}
            whileInView={{ rotateZ: -2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full h-full bg-white rounded-lg sm:rounded-xl border-2 sm:border-3 border-slate-200 shadow-md p-2 sm:p-3 md:p-4 flex flex-col overflow-y-auto"
          >
            <h3 className="text-xs sm:text-sm md:text-base font-bold font-serif text-slate-800 mb-2 line-clamp-3 leading-tight">
              {pub.title}
            </h3>

            {/* Authors */}
            <div className="mb-2 flex items-start gap-1.5">
              <FileText size={12} className="text-slate-400 shrink-0 mt-0.5" />
              <div className="text-[9px] sm:text-[10px] font-medium text-slate-700 leading-snug line-clamp-2">
                {authors.slice(0, 5).join(", ")}
                {authors.length > 5 && ` +${authors.length - 5} more`}
              </div>
            </div>

            {/* Venue */}
            <div className="mb-2 flex items-start gap-1.5">
              <ShieldCheck size={12} className="text-teal-500 shrink-0 mt-0.5" />
              <div className="text-[9px] sm:text-[10px] text-slate-600 leading-snug font-serif italic line-clamp-2">
                {pub.venue}
              </div>
            </div>

            {/* Category tag */}
            <div className="mb-3 flex flex-wrap gap-1">
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                  isScoped
                    ? "bg-teal-50 text-teal-700"
                    : isReview
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                #{(pub.category || "").toUpperCase()}
              </span>
              {pub.author_count_srl > 0 && (
                <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                  <Users size={8} /> {pub.author_count_srl} SRL
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-2 border-t border-slate-100 flex justify-end">
              <span className="text-[9px] text-slate-400 font-medium">{pub.institute}</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className={`h-5 sm:h-6 md:h-7 bg-gradient-to-r ${theme.bg} shadow-sm rounded-b-lg`} />
      </div>
    </motion.div>
  );
};

/* ================= YEAR PICKER MODAL ================= */

const YearPickerModal = ({ isOpen, onClose, years, selectedYear, onSelectYear, buttonRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        style={{ position: "fixed", top: `${position.top}px`, left: `${position.left}px`, zIndex: 50 }}
        className="bg-white rounded-xl shadow-xl border border-slate-200 p-4"
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xs">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => { onSelectYear(year); onClose(); }}
              className={`py-2 sm:py-2.5 px-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                selectedYear === year
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        {selectedYear && (
          <button
            onClick={() => { onSelectYear(null); onClose(); }}
            className="w-full mt-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors text-sm"
          >
            Clear Year
          </button>
        )}
      </motion.div>
    </>
  );
};

/* ================= SKELETON ================= */

const SkeletonCard = () => (
  <div className="h-80 rounded-3xl bg-white shadow-md border-8 border-slate-200 flex flex-col overflow-hidden animate-pulse">
    <div className="h-40 bg-slate-200" />
    <div className="flex-1 p-4 flex flex-col gap-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
  </div>
);

/* ================= MAIN ================= */

const Publications = () => {
  const [allPublications, setAllPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const yearButtonRef = useRef(null);

  // Fetch all publications once on mount (client-side filter for instant UX)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/publications`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) {
          setAllPublications(json.publications || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load publications:", err);
          setError("Could not load publications. Please try again.");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Derive unique years from fetched data
  const availableYears = React.useMemo(() => {
    const years = new Set(allPublications.map((p) => p.year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a);
  }, [allPublications]);

  // Client-side filtering — instant, no extra API calls
  const filteredPublications = React.useMemo(() => {
    return allPublications.filter((pub) => {
      const matchesCat =
        activeCategory === "All" || pub.event_type === activeCategory;

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        (pub.title || "").toLowerCase().includes(q) ||
        (pub.student_authors || "").toLowerCase().includes(q) ||
        (pub.venue || "").toLowerCase().includes(q) ||
        (pub.category || "").toLowerCase().includes(q);

      const matchesYear = !selectedYear || pub.year === selectedYear;

      return matchesCat && matchesQuery && matchesYear;
    });
  }, [allPublications, activeCategory, searchQuery, selectedYear]);

  // Export filtered publications to Excel
  const exportToExcel = useCallback(() => {
    if (filteredPublications.length === 0) {
      alert("No publications to export");
      return;
    }
    const headers = ["Title", "Authors", "Venue", "Date", "Event Type", "Category", "SRL Authors", "Institute"];
    const rows = filteredPublications.map((p) => [
      p.title,
      p.student_authors,
      p.venue,
      p.date_raw || "",
      p.event_type,
      p.category,
      p.author_count_srl,
      p.institute,
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Publications");
    XLSX.writeFile(wb, `srl_publications_${new Date().toISOString().split("T")[0]}.xlsx`);
  }, [filteredPublications]);

  return (
    <div className="relative pt-8 lg:pt-12 pb-40 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F2EFE8] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f8e6c1]/60 via-[#EAE4D5]/40 to-[#00887b]/20" />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#E6B800]/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300887b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zm30 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl lg:text-7xl font-black font-serif text-secondary-dark mb-3 uppercase tracking-tight"
          >
            Publications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 text-lg max-w-xl mx-auto leading-snug"
          >
            Explore our latest research papers, journals, and book chapters
            driving innovation forward.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <Link
              to="/add-publication"
              className="bg-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Add Publication
            </Link>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/50 p-2 sm:p-4 rounded-3xl border border-slate-200 shadow-sm">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search + year + export */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search papers, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-full py-3 h-[44px] pl-11 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm hover:border-slate-300"
                />
              </div>
              <button
                ref={yearButtonRef}
                onClick={() => setShowYearPicker(true)}
                className={`shrink-0 h-[44px] px-3 sm:px-4 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  selectedYear
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Calendar size={18} />
                <span className="hidden sm:inline">{selectedYear || "Year"}</span>
              </button>
              <button
                onClick={exportToExcel}
                title="Export to Excel"
                className="shrink-0 h-[44px] px-3 sm:px-4 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(activeCategory !== "All" || searchQuery || selectedYear) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 bg-teal-50/50 p-3 sm:p-4 rounded-2xl border border-teal-200/50"
            >
              <span className="text-xs sm:text-sm font-semibold text-teal-700">Active Filters:</span>
              {activeCategory !== "All" && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-700 font-medium border border-teal-200">
                  {activeCategory}
                  <button onClick={() => setActiveCategory("All")} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                </motion.div>
              )}
              {searchQuery && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-700 font-medium border border-teal-200">
                  <Search size={13} />{searchQuery}
                  <button onClick={() => setSearchQuery("")} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                </motion.div>
              )}
              {selectedYear && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-700 font-medium border border-teal-200">
                  <Calendar size={13} />{selectedYear}
                  <button onClick={() => setSelectedYear(null)} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                </motion.div>
              )}
              <button
                onClick={() => { setActiveCategory("All"); setSearchQuery(""); setSelectedYear(null); }}
                className="ml-auto text-teal-600 hover:text-teal-700 font-bold text-xs sm:text-sm underline"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </div>

        <YearPickerModal
          isOpen={showYearPicker}
          onClose={() => setShowYearPicker(false)}
          years={availableYears}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          buttonRef={yearButtonRef}
        />

        {/* Results count */}
        {loading ? (
          <p className="text-sm sm:text-base text-slate-600 font-medium mb-6">Loading publications...</p>
        ) : error ? (
          <p className="text-sm text-red-500 font-medium mb-6">{error}</p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-slate-600 font-medium mb-6"
          >
            Showing{" "}
            <span className="font-bold text-teal-600">{filteredPublications.length}</span>{" "}
            of <span className="font-bold">{allPublications.length}</span> publications
          </motion.p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPublications.length > 0 ? (
                filteredPublications.map((pub, index) => (
                  <PublicationCard key={pub.id} pub={pub} index={index} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center text-slate-500 py-12 text-lg font-semibold"
                >
                  No publications found.
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Publications;
