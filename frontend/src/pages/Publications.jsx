import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ExternalLink, Download, Search, Users, ShieldCheck, FileText, Bookmark, PlusCircle, X, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { getImageUrl } from "../lib/imageUrl";
import { API_BASE_URL, API_HEADERS } from "../config/apiConfig";

/* ================= DATA ================= */
const categories = ["All", "Conference", "Journal", "Book Chapter", "Poster Presentation", "Patents"];

/* ================= COMPONENTS ================= */

const PublicationCard = ({ pub, index, exportToExcel }) => {
  const [linkedinImage, setLinkedinImage] = useState(null);

  // Premium green theme gradients
  const backgrounds = [
    "from-teal-500 to-teal-600",
    "from-green-500 to-green-600",
    "from-emerald-500 to-emerald-600",
    "from-cyan-500 to-teal-500",
    "from-teal-400 to-green-500",
    "from-green-600 to-emerald-700",
    "from-teal-600 to-cyan-600",
    "from-emerald-400 to-teal-500",
  ];

  const bgClass = backgrounds[index % backgrounds.length];

  // Dark border colors matching theme
  const borderColors = [
    "border-teal-800",
    "border-green-800",
    "border-emerald-800",
    "border-cyan-800",
    "border-teal-800",
    "border-green-900",
    "border-teal-900",
    "border-emerald-900",
  ];

  const borderColor = borderColors[index % borderColors.length];

  // Varying card heights for visual interest - tall and thin
  const cardHeights = [
    "min-h-[260px]",
    "min-h-[240px]",
    "min-h-[230px]",
    "min-h-[270px]",
    "min-h-[250px]",
    "min-h-[235px]",
    "min-h-[260px]",
    "min-h-[245px]",
    "min-h-[240px]",
    "min-h-[250px]",
    "min-h-[235px]",
    "min-h-[260px]",
  ];

  const cardHeight = cardHeights[index % cardHeights.length];

  // Map background class to explicit gradient colors for fallback
  const gradientColorMap = {
    "from-teal-500 to-teal-600": "linear-gradient(to bottom right, #14b8a6, #0d9488)",
    "from-green-500 to-green-600": "linear-gradient(to bottom right, #22c55e, #16a34a)",
    "from-emerald-500 to-emerald-600": "linear-gradient(to bottom right, #10b981, #059669)",
    "from-cyan-500 to-teal-500": "linear-gradient(to bottom right, #06b6d4, #14b8a6)",
    "from-teal-400 to-green-500": "linear-gradient(to bottom right, #2dd4bf, #22c55e)",
    "from-green-600 to-emerald-700": "linear-gradient(to bottom right, #16a34a, #047857)",
    "from-teal-600 to-cyan-600": "linear-gradient(to bottom right, #0d9488, #0891b2)",
    "from-emerald-400 to-teal-500": "linear-gradient(to bottom right, #4ade80, #14b8a6)",
  };

  const fallbackGradient = gradientColorMap[bgClass] || "linear-gradient(to bottom right, #14b8a6, #0d9488)";

  // Fetch preview image from link with enhanced parameters and multiple sources
  useEffect(() => {
    const abortController = new AbortController();

    const fetchImage = async () => {
      // Check if publication has custom background image - use it with highest priority
      if (pub.backgroundImage) {
        setLinkedinImage(getImageUrl(pub.backgroundImage));
        return;
      }

      if (!pub.link || !pub.link.startsWith("http")) return;

      // Primary attempts with microlink API
      const primaryAttempts = [
        `https://api.microlink.io?url=${encodeURIComponent(pub.link)}&screenshot=true&fullpage=false&viewport.width=1200&viewport.height=630`,
        `https://api.microlink.io?url=${encodeURIComponent(pub.link)}&screenshot=true&page=1`,
        `https://api.microlink.io?url=${encodeURIComponent(pub.link)}`,
      ];

      // Try primary attempts
      for (const microlinkUrl of primaryAttempts) {
        try {
          const response = await fetch(microlinkUrl, {
            signal: abortController.signal,
          });

          if (response.ok) {
            const data = await response.json();

            // Try multiple image sources in order
            if (data.data?.image?.url && data.data.image.url.length > 0) {
              setLinkedinImage(data.data.image.url);
              return;
            } else if (data.data?.screenshot?.url && data.data.screenshot.url.length > 0) {
              setLinkedinImage(data.data.screenshot.url);
              return;
            } else if (data.data?.logo?.url && data.data.logo.url.length > 0) {
              setLinkedinImage(data.data.logo.url);
              return;
            }
          }
        } catch (err) {
          // Continue to next attempt
          continue;
        }
      }

      // Secondary fallback: try URL2PNG service
      try {
        const screenshotUrl = `https://v1.screenshot.11ty.dev/${encodeURIComponent(pub.link)}/opengraph/`;
        const response = await fetch(screenshotUrl, {
          signal: abortController.signal,
        });

        if (response.ok) {
          setLinkedinImage(screenshotUrl);
          return;
        }
      } catch (err) {
        // Continue
      }

      // Tertiary fallback: try thum.io
      try {
        const thumbUrl = `https://image.thum.io/get/width/1200/height/630/crop/smart/${encodeURIComponent(pub.link)}`;
        const headResponse = await fetch(thumbUrl, {
          method: 'HEAD',
          signal: abortController.signal,
        });

        if (headResponse.ok) {
          setLinkedinImage(thumbUrl);
          return;
        }
      } catch (err) {
        // Continue
      }

      // Final fallback: try open graph meta tags
      try {
        const ogResponse = await fetch(pub.link, {
          signal: abortController.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (ogResponse.ok) {
          const html = await ogResponse.text();
          // Try multiple OG tag formats
          const ogMatches = [
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/),
            html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/),
            html.match(/<meta\s+property=["']twitter:image["']\s+content=["']([^"']+)["']/),
          ];

          for (const match of ogMatches) {
            if (match && match[1] && match[1].length > 0) {
              setLinkedinImage(match[1]);
              return;
            }
          }
        }
      } catch (err) {
        // Fallback to gradient - will be shown automatically
      }

      // If all attempts fail, the fallbackGradient will be visible
    };

    // Set a timeout to ensure we don't wait forever
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 8000);

    fetchImage().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [pub.link]);

  // Get the clickable link for the card header
  const getHeaderLink = () => {
    const link = pub.link || "";
    if (link.startsWith("http")) {
      return link;
    }
    return "#";
  };

  const headerLink = getHeaderLink();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${cardHeight} hover:rotate-0 hover:translate-y-0 transition-all duration-500`}
    >
      {/* OUTER CARD WITH THICK BORDER - BIG CARD */}
      <div className={`h-full relative rounded-2xl sm:rounded-3xl overflow-visible shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col border-5 sm:border-6 md:border-8 ${borderColor}`}
        style={{
          background: fallbackGradient,
        }}
      >

        {/* TOP GRADIENT SECTION WITH BACKGROUND IMAGE - CLICKABLE */}
        <a
          href={headerLink}
          target={headerLink !== "#" ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className={`relative p-4 sm:p-5 md:p-6 flex-none min-h-32 sm:min-h-40 md:min-h-44 flex flex-col justify-between rounded-t-lg overflow-hidden ${headerLink !== "#" ? 'cursor-pointer hover:opacity-90' : 'cursor-default'} transition-opacity duration-300`}
          style={{
            // Green/teal gradient as background
            background: fallbackGradient,
            // Show image on top
            ...(linkedinImage && {
              backgroundImage: `url('${getImageUrl(linkedinImage)}')`,
              backgroundSize: pub.useContainBackground ? "contain" : (pub.link && pub.link.includes('ieeexplore') ? "cover" : "75%"),
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }),
          }}
        >
          {/* Green gradient shows behind and around the image */}

          {/* Badges - positioned absolutely to appear above image */}
          <div className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6 z-20">
            <div className="px-3 py-1.5 rounded-full bg-white/95 text-slate-700 text-xs sm:text-sm font-bold shadow-md backdrop-blur-sm">
              {pub.category}
            </div>
          </div>

          <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 right-4 sm:right-5 md:right-6 z-20">
            <div className="px-3 py-1.5 rounded-full bg-white/95 text-slate-700 text-xs sm:text-sm font-medium shadow-md flex items-center gap-1.5 backdrop-blur-sm">
              <Calendar size={14} />
              {pub.date}
            </div>
          </div>
        </a>

        {/* SMALL INNER CARD - White content card with SIMPLIFIED design */}
        <div className="flex-1 p-1.5 sm:p-2 md:p-3 flex items-center justify-center">
          <div className="w-full h-full bg-white/95 rounded-lg sm:rounded-xl border-2 sm:border-3 border-slate-200 shadow-md p-2.5 sm:p-3 md:p-4 flex flex-col overflow-y-auto">
            {/* Inner Card Content */}
            <>
              {/* Title */}
              <h3 className="text-sm sm:text-base md:text-base font-bold font-serif text-slate-900 mb-1.5 line-clamp-2 leading-tight">
                {pub.title}
              </h3>

              {/* Authors section */}
              <div className="mb-1.5 text-xs sm:text-sm font-bold text-white bg-teal-600 px-2 py-0.5 rounded leading-snug">
                <span>Authors: {pub.authors.join(", ")}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 mb-1.5 line-clamp-2 leading-relaxed">
                {pub.description}
              </p>

              {/* Published in - italicized */}
              <div className="mb-1.5 text-xs sm:text-sm text-slate-600 leading-snug italic font-normal">
                Published in: {pub.venue}
              </div>

              {/* Tags */}
              <div className="mb-1.5 flex flex-wrap gap-1">
                {pub.tags.map((tag, i) => (
                  <span key={i} className="text-[9px] sm:text-[10px] font-bold text-slate-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </>

            {/* Footer with Action Buttons and Publisher */}
            <div className="mt-auto pt-1.5 sm:pt-2 border-t border-slate-200 flex flex-col gap-1.5">
              {/* Action Button - Link to Paper or By: for Patents */}
              <div className="flex justify-between items-center">
                {pub.category === "Patents" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">By:</span>
                    {pub.ipo && (
                      <img
                        src={getImageUrl(pub.ipo.logo)}
                        alt={pub.ipo.name}
                        className="h-8 object-contain"
                        title={pub.ipo.name}
                      />
                    )}
                  </div>
                ) : pub.link && pub.link.startsWith("http") ? (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <FileDown size={14} />
                    Paper
                  </a>
                ) : pub.link ? (
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <FileDown size={14} />
                    Paper
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400">
                    <FileDown size={14} />
                    Not Available
                  </span>
                )}
              </div>

              {/* Publisher Section - Not shown for Poster Presentations */}
              {pub.category !== "Poster Presentation" && pub.publishers && pub.publishers.length > 0 && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">Publisher:</span>
                  <div className="flex gap-1.5 items-center">
                    {pub.publishers.map((publisherItem, idx) => (
                      <img
                        key={idx}
                        src={getImageUrl(publisherItem.logo)}
                        alt={publisherItem.name}
                        className={`object-contain ${publisherItem.name === "Springer" ? "h-6" : publisherItem.name === "NASCENT MR" ? "h-14" : publisherItem.name === "74th IPC Pharma Exhibition" ? "h-10" : "h-6"}`}
                        title={publisherItem.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SOLID BAR */}
        <div className={`h-5 sm:h-6 md:h-7 bg-gradient-to-r ${bgClass} shadow-sm rounded-b-lg`}></div>
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

  useEffect(() => {
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
            venue: pub.venue || "",
            date: pub.date || (pub.year ? String(pub.year) : ""),
            category: pub.event_type || "",
            description: pub.description || "",
            link: pub.paper_url || "#",
            tags: Array.isArray(pub.tags) ? pub.tags : [],
            status: pub.category || undefined,
            year: pub.year || null,
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPublications = publications.filter((pub) => {
    const matchesCat = activeCategory === "All" || pub.category === activeCategory;
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
            Explore our latest research papers, journals, and book chapters driving innovation forward.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <Link to="/add-publication" className="bg-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-teal-700 transition-colors inline-flex items-center gap-2">
              <PlusCircle size={20} />
              Add Publications
            </Link>
          </motion.div>
        </div>

        {/* Filters and Search Hub */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-2 bg-slate-50/50 p-1.5 sm:p-2.5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto lg:overflow-visible w-full lg:w-auto lg:scrollbar-hide py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === cat
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
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
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
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
              className="flex flex-wrap items-center gap-1.5 bg-teal-50/50 p-2 sm:p-3 rounded-2xl border border-teal-200/50"
            >
              <span className="text-xs font-semibold text-teal-700">Filters:</span>

              {activeCategory !== "All" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-teal-200"
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
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-teal-200"
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
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-teal-200"
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
                className="ml-auto text-teal-600 hover:text-teal-700 font-bold text-xs underline"
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

        {loading ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-base text-slate-600 font-medium mb-6">
            Loading publications...
          </motion.p>
        ) : error ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-base text-red-500 font-medium mb-6">
            Failed to load publications. Please try again later.
          </motion.p>
        ) : filteredPublications.length > 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-base text-slate-600 font-medium mb-6">
            Showing <span className="font-bold text-teal-600">{filteredPublications.length}</span> of <span className="font-bold">{publications.length}</span> publications
          </motion.p>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-base text-slate-600 font-medium mb-6">
            No publications found.
          </motion.p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col h-[350px] animate-pulse">
                  <div className="flex justify-between items-start mb-5">
                    <div className="h-6 w-24 bg-teal-50 rounded-full"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 md:h-8 w-3/4 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 w-full bg-gray-200 rounded-md mb-2"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded-md mb-6"></div>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-4 h-4 rounded bg-gray-200 mt-1 shrink-0"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-4 h-4 rounded bg-gray-200 mt-1 shrink-0"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="mt-auto border-t border-slate-100 pt-5 flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                      <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
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
