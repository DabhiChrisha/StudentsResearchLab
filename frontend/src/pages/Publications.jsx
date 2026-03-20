import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ExternalLink, Download, Search, Users, ShieldCheck, FileText, Bookmark, PlusCircle, X, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';

/* ================= DATA ================= */
const publicationsData = [
  {
    id: 1,
    title: "Casebook on AI and Gender Empowerment",
    authors: ["Janki Chitroda", "Yashvi Chavda", "Krishna Bhatt"],
    venue: "IndiaAI Impact Summit in collaboration with UN Women India",
    date: "Feb 2026",
    category: "Book Chapter",
    description: "Featured among the prestigious 23 global research works published in the Casebook on AI and Gender Empowerment. The research focuses on inclusive AI innovation and empowerment.",
    link: "https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7429466085311098880-XDnV",
    tags: ["AI", "Gender Empowerment", "UN Women"],
    publishers: [{name: "UN Women", logo: "/UN%20Women.png"}, {name: "MeitY", logo: "/MeitY.png"}],
  },
  {
    id: 2,
    title: "EfficientNetB3 Adapted Hybrid UNet with Attention Guided Decoding for Urban Scene Segmentation",
    authors: ["Ayushi Joddha", "Manasvi Shah", "Swayam Kalburgi"],
    venue: "13th IEEE International Conference on Intelligent Systems and Embedded Design (ISED 2025)",
    date: "Dec 2025",
    category: "Conference",
    description: "This paper proposes a novel adapted hybrid UNet using EfficientNetB3 to perform robust urban scene segmentation by selectively attending to salient spatial features.",
    link: "https://www.linkedin.com/posts/mmpsrpc_ksv-ldrpitr-mmpsrpc-activity-7413814908217344000-JmvS",
    tags: ["Computer Vision", "Segmentation", "IEEE Xplore"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
  },
  {
    id: 3,
    title: "Generative AI as a Catalyst in Indian Education Ecosystems",
    authors: ["Henit Panchal", "Hetvi Hinsu", "Heny Patel"],
    venue: "AAMLAD-2025 (Springer CCIS)",
    date: "Nov 2025",
    category: "Conference",
    description: "An analysis of how generative AI paradigms can be adopted to personalize learning paths, scale assessment models, and bridge educational disparities in India.",
    link: "https://www.linkedin.com/posts/mmpsrpc_ksv-researchexcellence-studentachievement-activity-7412352256806920192-MoVv",
    tags: ["Generative AI", "EdTech", "Springer"],
    publishers: [{name: "Springer", logo: "/springer.png"}],
  },
  {
    id: 4,
    title: "SHAP-Enhanced Outbreak Forecasting: Interpretable Multi-Modal Learning for Waterborne Disease Prediction",
    authors: ["Krish Patel", "Jenish Sorathiya"],
    venue: "NASCENT MR 2025",
    date: "Dec 2025",
    category: "Conference",
    description: "Utilizes interpretable multi-modal learning approaches wrapped with SHAP values for explaining and predicting the outbreak probabilities of specific waterborne diseases.",
    link: "https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7407377566589759488-qigD",
    tags: ["Healthcare", "XAI", "Forecasting"],
    publishers: [{name: "NASCENT MR", logo: "/Vmrfsalem.png"}],
  },
  {
    id: 5,
    title: "Enhancing Data Mining Techniques for Identifying Health Risk Patterns in Underserved Populations",
    authors: ["Hemant Pande", "Honey Modha"],
    venue: "NASCENT MR 2025",
    date: "Dec 2025",
    category: "Conference",
    description: "Focuses on advanced data mining strategies to uncover hidden health risk variables from unstructured clinical datasets representing underserved demographics.",
    link: "https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7407377566589759488-qigD",
    tags: ["Data Mining", "Healthcare", "Analytics"],
    publishers: [{name: "NASCENT MR", logo: "/Vmrfsalem.png"}],
  },
  {
    id: 6,
    title: "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
    authors: ["Students Research Lab"],
    venue: "AISTS 2025 (IEEE Xplore)",
    date: "Nov 2025",
    category: "Conference",
    description: "An empirical study evaluating how Explainable AI interfaces shape human decision-making processes, cognitive dependency, and productivity in complex task environments.",
    link: "https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7398590758359912448-l4bb",
    tags: ["XAI", "Cognitive Computing", "IEEE Xplore"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
  },
  {
    id: 7,
    title: "TrafficEye: Intelligent Traffic Optimization Using Deep Learning Approach",
    authors: ["Students Research Lab"],
    venue: "AIMV-2025 (IEEE Xplore)",
    date: "Oct 2025",
    category: "Conference",
    description: "A deep learning framework to optimize traffic flow operations dynamically, detecting congestion points and redirecting flows intelligently to minimize overall latency.",
    link: "https://www.linkedin.com/posts/mmpsrpc_ksv-mmpsrpc-researchexcellence-activity-7389603335164743680-rS1B",
    tags: ["Deep Learning", "Smart City", "IEEE Xplore"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
  },
  {
    id: 8,
    title: "Improving Urban Road Safety: Enhancing Pedestrian Safety Through Automated Traffic Signal Control and Law Enforcement",
    authors: ["Students Research Lab"],
    venue: "International Conference on Data Science, Computation and Security 2024 (Springer LNNS)",
    date: "Nov 2024",
    category: "Book Chapter",
    description: "Proposed automated mechanisms using edge computing architectures integrated with urban traffic signal networks to improve pedestrian safety conditions and automate crosswalk law enforcement.",
    link: "https://www.linkedin.com/posts/mmpsrpc_springer-researchpublication-datascience-activity-7368163507625746434-vjXc",
    tags: ["Smart City", "Edge Computing", "Springer"],
    publishers: [{name: "Springer", logo: "/springer.png"}],
  },
  {
    id: 9,
    title: "AI-Driven Healthcare Analytics System",
    authors: ["Nancy Patel", "Kandarp Gajjar", "Patel Ridham", "Patel Krutika"],
    venue: "Patent Application",
    date: "Mar 2026",
    category: "Patents",
    description: "Complete Patent: AI-Driven Healthcare Analytics System - An innovative system for analyzing healthcare data using advanced machine learning algorithms.",
    link: "#",
    tags: ["Healthcare", "AI", "Analytics"],
    status: "Under Examination",
    inventors: ["Nancy Patel", "Kandarp Gajjar", "Patel Ridham", "Patel Krutika"],
    logoInfo: "/ksv.png",
    supportedBy: [{name: "KSV", logo: "/ksv.png"}, {name: "MMPSRPC", logo: "/mm.png"}],
    ipo: {name: "IPO", logo: "/IPO.jpeg"}
  }
];

const categories = ["All", "Conference", "Journal", "Book Chapter", "Patents"];

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
    "min-h-[280px]",
    "min-h-[260px]",
    "min-h-[250px]",
    "min-h-[290px]",
    "min-h-[270px]",
    "min-h-[255px]",
    "min-h-[285px]",
    "min-h-[265px]",
  ];

  const cardHeight = cardHeights[index % cardHeights.length];

  // Fetch LinkedIn preview image
  useEffect(() => {
    const fetchLinkedInImage = async () => {
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(pub.link)}`);
        const data = await response.json();
        if (data.data?.image?.url) {
          setLinkedinImage(data.data.image.url);
        }
      } catch (error) {
        console.log("Could not fetch LinkedIn image");
      }
    };
    if (pub.link) {
      fetchLinkedInImage();
    }
  }, [pub.link]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${cardHeight} hover:rotate-0 hover:translate-y-0 transition-all duration-500`}
    >
      {/* OUTER CARD WITH THICK BORDER - BIG CARD */}
      <div className={`h-full relative rounded-2xl sm:rounded-3xl overflow-visible bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col border-5 sm:border-6 md:border-8 ${borderColor}`}>

        {/* TOP GRADIENT SECTION WITH BACKGROUND IMAGE - CLICKABLE */}
        <a 
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative bg-gradient-to-br ${bgClass} p-4 sm:p-5 md:p-6 flex-none min-h-32 sm:min-h-40 md:min-h-44 flex flex-col justify-between rounded-t-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-300 bg-cover bg-center`}
          style={{
            backgroundImage: pub.category === "Patents" 
              ? "url('/inn.png')" 
              : linkedinImage 
                ? `url('${linkedinImage}')`
                : `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay to ensure badges are readable */}
          {(linkedinImage || pub.category === "Patents") && (
            <div className="absolute inset-0 bg-black/40 opacity-60 pointer-events-none rounded-t-lg" />
          )}

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
          <div className="w-full h-full bg-white rounded-lg sm:rounded-xl border-2 sm:border-3 border-slate-200 shadow-md p-2.5 sm:p-3 md:p-4 flex flex-col overflow-y-auto">
            {/* Inner Card Content */}
            {pub.category === "Patents" ? (
              <>
                {/* Patent Card Layout */}
                <h3 className="text-sm sm:text-base md:text-base font-bold font-serif text-slate-900 mb-1.5 leading-tight">
                  Filed for complete Patent
                </h3>

                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">Status:</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Under Examination
                  </span>
                </div>

                {pub.supportedBy && (
                  <div className="mb-1.5 flex flex-col gap-1.5">
                    <div className="text-xs sm:text-sm text-slate-600 font-semibold">Supported by:</div>
                    <div className="flex items-center gap-2">
                      {pub.supportedBy.map((sup, idx) => (
                        <img key={idx} src={sup.logo} alt={sup.name} className="h-8 sm:h-10 object-contain" />
                      ))}
                    </div>
                  </div>
                )}


                <div className="text-xs sm:text-sm font-bold text-white bg-teal-600 px-2 py-0.5 rounded leading-snug">
                  <span>Inventors: {pub.authors.join(", ")}</span>
                </div>
              </>
            ) : (
              <>
                {/* Regular Publication Card Layout - MATCHING IMAGE DESIGN */}
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
            )}

            {/* Footer with Action Buttons and Publisher */}
            <div className="mt-auto pt-1.5 sm:pt-2 border-t border-slate-200 flex flex-col gap-1.5">
              {/* Action Button - Paper only */}
              <div className="flex justify-between items-center">
                {pub.category !== "Patents" ? (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors"
                  >
                    <FileText size={13} />
                    Paper
                  </a>
                ) : (
                  pub.ipo && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-slate-600">IPO:</span>
                      <img src={pub.ipo.logo} alt={pub.ipo.name} className="h-6 object-contain" />
                    </div>
                  )
                )}
              </div>

              {/* Publisher Section - unchanged */}
              {pub.publishers && pub.publishers.length > 0 && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">Publisher:</span>
                  <div className="flex gap-1.5 items-center">
                    {pub.publishers.map((publisherItem, idx) => (
                      <img 
                        key={idx} 
                        src={publisherItem.logo} 
                        alt={publisherItem.name} 
                        className={`object-contain ${publisherItem.name === "Springer" ? "h-6" : publisherItem.name === "NASCENT MR" ? "h-14" : "h-6"}`}
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

        {/* Clear Selection Button */}
        {selectedYear && (
          <button
            onClick={() => {
              onSelectYear(null);
              onClose();
            }}
            className="w-full mt-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors text-sm"
          >
            Clear Year
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Filtering logic
  const filteredPublications = publicationsData.filter((pub) => {
    const matchesCat = activeCategory === "All" || pub.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesQuery =
      (pub.title || "").toLowerCase().includes(searchLower) ||
      (Array.isArray(pub.authors) ? pub.authors.join(", ") : pub.authors || "").toLowerCase().includes(searchLower) ||
      (pub.venue || "").toLowerCase().includes(searchLower) ||
      (Array.isArray(pub.tags) ? pub.tags.join(", ") : pub.tags || "").toLowerCase().includes(searchLower);

    let matchesYear = true;
    if (selectedYear) {
      // Try to extract year from pub.date
      const pubYear = parseInt((pub.date && pub.date.match(/\d{4}/)?.[0]) || 0);
      matchesYear = pubYear === selectedYear;
    }
    return matchesCat && matchesQuery && matchesYear;
  });

  // Export to Excel function with multiple sheets (Conference as main sheet)
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

    // Add sheets in order - Conference first as main sheet
    categoryList.forEach((category) => {
      const items = groupedData[category];
      if (items.length > 0) {
        // Prepare rows with headers
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

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, ws, category);
      }
    });

    // Generate Excel file
    XLSX.writeFile(workbook, `publications_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="relative pt-8 lg:pt-12 pb-40 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F2EFE8] overflow-hidden">
      {/* Unique Mesh Gradient Background - Darkened */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f8e6c1]/60 via-[#EAE4D5]/40 to-[#00887b]/20" />

        {/* Animated Glow Spheres - Diagonal Orientation */}
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


        {/* Subtle SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300887b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zm30 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
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
        <div className="flex flex-col gap-4 mb-12">
          {/* Categories and Controls Row */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/50 p-2 sm:p-4 rounded-3xl border border-slate-200 shadow-sm">
            {/* Categories Tab */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide py-1">
              {categories.map((cat) => (
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

            {/* Search and Year Picker */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              {/* Search Box */}
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

              {/* Year Picker Button */}
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
              {/* Export to Excel Button */}
              <button
                onClick={() => exportToExcel(filteredPublications)}
                title="Export to Excel"
                className="shrink-0 h-[44px] px-3 sm:px-4 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600"
              >
                <FileDown size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>            </div>
          </div>

          {/* Active Filters Display */}
          {(activeCategory !== "All" || searchQuery || selectedYear) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 bg-teal-50/50 p-3 sm:p-4 rounded-2xl border border-teal-200/50"
            >
              <span className="text-xs sm:text-sm font-semibold text-teal-700">Active Filters:</span>
              
              {activeCategory !== "All" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-700 font-medium border border-teal-200"
                >
                  {activeCategory}
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}

              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-700 font-medium border border-teal-200"
                >
                  <Search size={13} />
                  {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}

              {selectedYear && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-700 font-medium border border-teal-200"
                >
                  <Calendar size={13} />
                  {selectedYear}
                  <button
                    onClick={() => setSelectedYear(null)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}

              {/* Clear All Button */}
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                  setSelectedYear(null);
                }}
                className="ml-auto text-teal-600 hover:text-teal-700 font-bold text-xs sm:text-sm underline"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </div>

        {/* Year Picker Modal */}
        <YearPickerModal
          isOpen={showYearPicker}
          onClose={() => setShowYearPicker(false)}
          years={allYears}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          buttonRef={yearButtonRef}
        />

        {/* Results Counter */}
        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-slate-600 font-medium mb-6"
          >
            Loading publications...
          </motion.p>
        ) : filteredPublications.length > 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-slate-600 font-medium mb-6"
          >
            Showing <span className="font-bold text-teal-600">{filteredPublications.length}</span> of <span className="font-bold">{publicationsData.length}</span> publications
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-slate-600 font-medium mb-6"
          >
            No publications found.
          </motion.p>
        )}

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            ) : loading ? null : (
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
