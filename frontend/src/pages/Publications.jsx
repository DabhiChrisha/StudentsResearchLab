import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ExternalLink, Download, Search, Users, ShieldCheck, FileText, Bookmark, PlusCircle, X, FileDown, Lock } from "lucide-react";
import * as XLSX from 'xlsx';
import { getImageUrl } from "../lib/imageUrl";
import { API_BASE_URL, API_HEADERS } from "../config/apiConfig";

/* ================= DATA ================= */
const categories = ["All", "Conference", "Journal", "Book Chapter", "Poster Presentation", "Patents"];

/* ================= COMPONENTS ================= */

const PublicationCard = ({ pub, index, exportToExcel }) => {
  // Use website theme colors
  const colorScheme = { 
    from: "from-secondary", 
    to: "to-secondary-dark", 
    light: "bg-secondary-light", 
    accent: "text-secondary-dark" 
  };
  const [logoFailed, setLogoFailed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const publisherLogoUrl = !logoFailed ? getImageUrl(pub.publisherLogoUrl) : null;
  const isPoster = pub.category === "Poster" || pub.category === "Poster Presentation";
  const isConference = pub.category === "Conference";
  const presentedOnDate = pub.presented_on || pub.presentedOn || pub.conference_date || "";
  const hasHiddenDetails = Boolean(pub.publisher || pub.venue || publisherLogoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="sm:flex sm:flex-col sm:h-full"
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-500 overflow-hidden group flex flex-col relative cursor-pointer sm:h-full"
        style={{backgroundImage: `url('/study.webp')`, backgroundSize: '100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
        animate={{ minHeight: isExpanded ? "auto" : undefined }}
        onClick={() => setIsExpanded((current) => !current)}
      >
        
        {/* Watermark Overlay */}
        <div className="absolute inset-0 bg-white/75 pointer-events-none"></div>
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
        
        {/* PREMIUM GRADIENT HEADER */}
        <div className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} px-6 sm:px-8 py-1.5 relative overflow-hidden flex items-center justify-center flex-shrink-0`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16 blur-2xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-1">
            {/* Category - Modern text styling */}
            <p className="text-white text-lg font-bold tracking-widest">
              {(pub.category || "Publication").toUpperCase()}
            </p>
            
            {/* Underline accent */}
            <div className="h-0.5 w-20 bg-white/60 rounded-full -mt-2.5"></div>
            
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 space-y-1.5 overflow-hidden">
          
          {/* Title */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {pub.title}
            </h3>
          </div>

          {/* Authors - Highlighted */}
          <div className={`${colorScheme.light} h-12 p-2 rounded-lg flex items-start gap-2 overflow-hidden`}>
            <Users size={12} className={`${colorScheme.accent} mt-0.5 flex-shrink-0`} />
            <p className={`text-xs ${colorScheme.accent} font-bold line-clamp-2`}>
              {pub.authors && pub.authors.length > 0 
                ? pub.authors.join(", ") 
                : pub.first_author || "Unknown Author"}
            </p>
          </div>

          {/* KEY DATES Section Header */}
          <div className="mt-1 mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Details</p>
          </div>

          {/* Details Grid - Labels on left, values on right */}
          <div className="space-y-1 text-xs">
            {/* Published Date */}
            {pub.date && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-600" />
                  <span className="font-semibold text-slate-700">Published Date:</span>
                </div>
                <span className="text-slate-600">{pub.date.split('T')[0]}</span>
              </div>
            )}

            {/* Presented On - Poster only */}
            {isPoster && presentedOnDate && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-600" />
                  <span className="font-semibold text-slate-700">Presented On:</span>
                </div>
                <span className="text-slate-600">{presentedOnDate.split('T')[0]}</span>
              </div>
            )}

            {/* Conference Date */}
            {isConference && pub.conference_date && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-600" />
                  <span className="font-semibold text-slate-700">Conference Dates:</span>
                </div>
                <span className="text-slate-600">{pub.conference_date.split('T')[0]}</span>
              </div>
            )}

            {hasHiddenDetails && (
            <div className={`hidden sm:block overflow-hidden transition-all duration-300 ease-out ${isExpanded ? "mt-2 max-h-28 opacity-100" : "mt-0 max-h-0 opacity-0 group-hover:mt-2 group-hover:max-h-28 group-hover:opacity-100"}`}>
              <div className="rounded-lg border border-slate-200 bg-white/75 p-2">
                <div className="min-w-0 space-y-1">
                  {pub.publisher && (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <BookOpen size={14} className="flex-shrink-0 text-slate-600" />
                      <span className="flex-shrink-0 font-semibold text-slate-700">Publisher:</span>
                      <span className="min-w-0 truncate text-slate-600">{pub.publisher}</span>
                    </div>
                  )}

                  {pub.venue && (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Bookmark size={14} className="flex-shrink-0 text-slate-600" />
                      <span className="flex-shrink-0 font-semibold text-slate-700">Venue:</span>
                      <span className="min-w-0 truncate text-slate-600">{pub.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Mobile expand indicator */}
          <div className="flex justify-center sm:hidden mt-1 mb-0.5">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-slate-400"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          </div>

          {/* Mobile-only expanded details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="mobile-expanded"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden sm:hidden"
              >
                <div className="border-t border-slate-100 mx-3 pt-2 pb-1 space-y-1.5 text-xs">
                  {pub.publisher && (
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={13} className="text-slate-500 shrink-0" />
                      <span className="font-semibold text-slate-700">Publisher:</span>
                      <span className="text-slate-600">{pub.publisher}</span>
                    </div>
                  )}
                  {pub.venue && (
                    <div className="flex items-center gap-1.5">
                      <Bookmark size={13} className="text-slate-500 shrink-0" />
                      <span className="font-semibold text-slate-700">Venue:</span>
                      <span className="text-slate-600 break-words">{pub.venue}</span>
                    </div>
                  )}
                  {pub.description && (
                    <div className="pt-1">
                      <p className="text-slate-600 leading-relaxed">{pub.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Paper Link - Bottom */}
          <div className="mt-auto pt-2 border-t border-gray-200 flex items-center justify-between gap-3">
            {pub.link && pub.link.startsWith("http") ? (
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95`}
              >
                <ExternalLink size={11} />
                <span className="text-xs">
                  {pub.category === "Conference" 
                    ? "View Paper" 
                    : pub.category === "Journal"
                    ? "View Journal"
                    : pub.category === "Book Chapter"
                    ? "View Book Chapter"
                    : pub.category === "Patent"
                    ? "View Patent"
                    : pub.category === "Poster" || pub.category === "Poster Presentation"
                    ? "View Poster"
                    : `View ${pub.category || "Publication"}`}
                </span>
              </a>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg">
                <Lock size={11} />
                <span className="text-xs">No Link</span>
              </div>
            )}
            <div className="ml-auto flex h-14 w-32 sm:h-16 sm:w-40 flex-shrink-0 items-center justify-center self-center p-0">
              {publisherLogoUrl ? (
                <img
                  src={publisherLogoUrl}
                  alt={`${pub.publisher || "Publisher"} logo`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Logo</span>
              )}
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ================= YEAR PICKER MODAL ================= */
const YearPickerModal = ({ isOpen, onClose, years, selectedYear, onSelectYear, buttonRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
      />

      {/* Dropdown Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 50,
        }}
        className="bg-white rounded-xl shadow-xl border border-slate-200 p-4"
      >
        {/* Year Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xs">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                onSelectYear(year);
                onClose();
              }}
              className={`py-2 sm:py-2.5 px-2 rounded-lg font-bold text-sm transition-all duration-300 ${selectedYear === year
                ? "bg-secondary text-white shadow-md shadow-secondary/30"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              {year}
            </button>
          ))}
        </div>

          {selectedYear && (
            <button
              onClick={() => {
                onSelectYear(null);
                onClose();
              }}
              className="w-full mt-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors text-sm"
            >
              Clear Selection
            </button>
          )}
        </motion.div>
    </>
  );
};


/* ================= MAIN ================= */
const Publications = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const yearButtonRef = useRef(null);

  // Extract all unique years from data (2020 to current year)
  const allYears = Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 2020 + i).reverse();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublications = (opts) => {
    if (!opts?.silent) setLoading(true);
    fetch(`${API_BASE_URL}/api/publications`, { headers: API_HEADERS })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ publications: data }) => {
        setPublications(
          (data || []).map((pub) => ({
            id: pub.id,
            title: pub.title,
            authors: pub.student_authors
              ? pub.student_authors.split(",").map((a) => a.trim()).filter(Boolean)
              : [],
            first_author: pub.first_author || "",
            venue: pub.venue || "",
            date: pub.date || (pub.year ? String(pub.year) : ""),
            category: pub.event_type || "",
            description: pub.description || "",
            link: pub.paper_url || "#",
            tags: Array.isArray(pub.tags) ? pub.tags : [],
            status: pub.category || undefined,
            year: pub.year || null,
            publisher: pub.publisher || pub.custom_publisher_name || "",
            publisherLogoUrl: pub.logo_url || pub.publisher_logo_url || "",
            conference_date: pub.conference_date || "",
          }))
        );
      })
      .catch((err) => {
        if (!opts?.silent) setError(err.message);
      })
      .finally(() => {
        if (!opts?.silent) setLoading(false);
      });
  };

  // Initial load
  useEffect(() => { fetchPublications(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Live admin updates — silent background refresh (no full-page loading state)
  useEffect(() => {
    const onLive = (e) => {
      const t = e.detail?.type;
      if (t === "publication_approved" || t === "publication_changed") {
        fetchPublications({ silent: true });
      }
    };
    window.addEventListener("srl:live-update", onLive);
    return () => window.removeEventListener("srl:live-update", onLive);
  }, []);

  const filteredPublications = publications.filter((pub) => {
    const matchesCat =
      activeCategory === "All" ||
      (pub.category || "").toLowerCase().includes(activeCategory.toLowerCase()) ||
      activeCategory.toLowerCase().includes((pub.category || "").toLowerCase());
    const searchLower = searchQuery.toLowerCase();
    const matchesQuery =
      (pub.title || "").toLowerCase().includes(searchLower) ||
      (Array.isArray(pub.authors) ? pub.authors.join(", ") : pub.authors || "").toLowerCase().includes(searchLower) ||
      (pub.venue || "").toLowerCase().includes(searchLower) ||
      (Array.isArray(pub.tags) ? pub.tags.join(", ") : pub.tags || "").toLowerCase().includes(searchLower);

    let matchesYear = true;
    if (selectedYear) {
      const pubYear = parseInt((pub.date && pub.date.match(/\d{4}/)?.[0]) || 0);
      matchesYear = pubYear === selectedYear;
    }
    return matchesCat && matchesQuery && matchesYear;
  });

  const exportToExcel = (data) => {
    if (data.length === 0) {
      alert("No publications to export");
      return;
    }

    const headers = ["ID", "Title", "Authors", "Venue", "Date", "Category", "Description", "Tags", "Status", "Inventors"];
    const workbook = XLSX.utils.book_new();

    // Group data by category
    const categoryList = ["Conference", "Journal", "Book Chapter", "Patents"];
    const groupedData = {};

    categoryList.forEach(cat => {
      groupedData[cat] = data.filter(pub => pub.category === cat);
    });

    categoryList.forEach((category) => {
      const items = groupedData[category];
      if (items.length > 0) {
        const rows = items.map(pub => ([
          pub.id,
          pub.title,
          pub.authors.join("; "),
          pub.venue,
          pub.date,
          pub.category,
          pub.description,
          pub.tags.join("; "),
          pub.status || "-",
          pub.inventors ? pub.inventors.join("; ") : "-"
        ]));
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, ws, category);
      }
    });

    XLSX.writeFile(workbook, `publications_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="relative pt-6 lg:pt-8 pb-32 px-3 sm:px-4 lg:px-6 min-h-screen bg-[#F2EFE8] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f8e6c1]/60 via-[#EAE4D5]/40 to-[#00887b]/20" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#E6B800]/15 rounded-full blur-[150px] pointer-events-none"
        />
        <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300887b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zm30 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black font-serif text-secondary-dark mb-3 uppercase tracking-tight"
          >
            Publications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 text-lg max-w-xl mx-auto leading-snug"
          >
            Explore our latest research papers, journals, and book chapters driving innovation forward.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <Link to="/add-publication" className="bg-secondary text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-secondary-dark transition-colors inline-flex items-center gap-2">
              <PlusCircle size={20} />
              Add Publications
            </Link>
          </motion.div>
        </div>

        {/* Filters and Search Hub */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-2 bg-slate-50/50 p-1.5 sm:p-2.5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar w-full lg:w-auto py-0.5 pb-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === cat
                    ? "bg-secondary text-white shadow-md shadow-secondary/20"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search and Year Picker */}
            <div className="flex items-center gap-1.5 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none lg:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search papers, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-full py-2 h-9 pl-9 pr-3 text-xs sm:text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm hover:border-slate-300"
                />
              </div>

              <button
                ref={yearButtonRef}
                onClick={() => setShowYearPicker(true)}
                className={`shrink-0 h-9 px-2.5 sm:px-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 ${selectedYear
                  ? "bg-secondary text-white shadow-md shadow-secondary/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <Calendar size={15} />
                <span className="hidden sm:inline text-xs">{selectedYear || "Year"}</span>
              </button>
              <button
                onClick={() => exportToExcel(filteredPublications)}
                title="Export to Excel"
                className="shrink-0 h-9 px-2.5 sm:px-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600"
              >
                <FileDown size={15} />
                <span className="hidden sm:inline text-xs">Export</span>
              </button>
            </div>
          </div>

          {(activeCategory !== "All" || searchQuery || selectedYear) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-1.5 bg-secondary/5 p-2 sm:p-3 rounded-2xl border border-secondary/30"
            >
              <span className="text-xs font-semibold text-secondary">Filters:</span>

              {activeCategory !== "All" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-secondary/20"
                >
                  {activeCategory}
                  <button onClick={() => setActiveCategory("All")} className="hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </motion.div>
              )}

              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-secondary/20"
                >
                  <Search size={12} />
                  {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </motion.div>
              )}

              {selectedYear && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-secondary/20"
                >
                  <Calendar size={12} />
                  {selectedYear}
                  <button onClick={() => setSelectedYear(null)} className="hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </motion.div>
              )}

              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                  setSelectedYear(null);
                }}
                className="ml-auto text-secondary hover:text-secondary-dark font-bold text-xs underline"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </div>

        <YearPickerModal
          isOpen={showYearPicker}
          onClose={() => setShowYearPicker(false)}
          years={allYears}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          buttonRef={yearButtonRef}
        />

        {!loading && error ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-base text-red-500 font-medium mb-6">
            Failed to load publications. Please try again later.
          </motion.p>
        ) : !loading && filteredPublications.length > 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-base text-slate-600 font-medium mb-6">
            Showing <span className="font-bold text-secondary">{filteredPublications.length}</span> of <span className="font-bold">{publications.length}</span> publications
          </motion.p>
        ) : !loading ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-base text-slate-600 font-medium mb-6">
            No publications found.
          </motion.p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 sm:items-stretch">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col h-[350px]" aria-busy="true" aria-label="Loading publication">
                  <div className="flex justify-between items-start mb-5">
                    <div className="h-6 w-24 skeleton-bone rounded-full"></div>
                    <div className="h-4 w-16 skeleton-bone rounded"></div>
                  </div>
                  <div className="h-6 md:h-8 w-3/4 skeleton-bone rounded-md mb-4"></div>
                  <div className="h-4 w-full skeleton-bone rounded-md mb-2"></div>
                  <div className="h-4 w-5/6 skeleton-bone rounded-md mb-6"></div>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-4 h-4 rounded skeleton-bone mt-1 shrink-0"></div>
                    <div className="h-4 w-1/2 skeleton-bone rounded"></div>
                  </div>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-4 h-4 rounded skeleton-bone mt-1 shrink-0"></div>
                    <div className="h-4 w-2/3 skeleton-bone rounded"></div>
                  </div>
                  <div className="mt-auto border-t border-slate-100 pt-5 flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 skeleton-bone rounded-md"></div>
                      <div className="h-5 w-12 skeleton-bone rounded-md"></div>
                    </div>
                    <div className="w-10 h-10 rounded-full skeleton-bone"></div>
                  </div>
                </div>
              ))
            ) : filteredPublications.length > 0 ? (
              filteredPublications.map((pub, index) => (
                <PublicationCard key={pub.id} pub={pub} index={index} exportToExcel={exportToExcel} />
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
        </div>

      </div>
    </div>
  );
};

export default Publications;
