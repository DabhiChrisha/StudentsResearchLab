import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ExternalLink, Download, Search, Users, ShieldCheck, FileText, Bookmark, PlusCircle, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

/* ================= DATA ================= */
// Dynamic publications data from Supabase
const categories = ["All", "Conference", "Journal", "Book Chapter", "Patents"];

const Publications = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const yearButtonRef = useRef(null);
  const [publicationsData, setPublicationsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch publications from Supabase
  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("publications").select("*");
      if (error) {
        console.error("Error fetching publications:", error);
        setPublicationsData([]);
      } else {
        setPublicationsData(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    };
    fetchPublications();
  }, []);

  // Extract all unique years from data (2020 to current year)
  const allYears = Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 2020 + i).reverse();

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

  return (
    <div className="relative pt-[112px] lg:pt-[128px] pb-40 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F2EFE8] overflow-hidden">
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
            </div>
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
            {filteredPublications.length > 0 && !loading ? (
              filteredPublications.map((pub, index) => (
                <PublicationCard key={pub.id || index} pub={pub} index={index} />
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
