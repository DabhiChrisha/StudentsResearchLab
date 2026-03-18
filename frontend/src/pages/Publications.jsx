import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, ExternalLink, Download, Search, Users, ShieldCheck, FileText, Bookmark } from "lucide-react";

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
  }
];

const categories = ["All", "Conference", "Journal", "Book Chapter", "Patents"];

/* ================= COMPONENTS ================= */

const PublicationCard = ({ pub, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Decorative background glow on hover */}
      <div className="absolute top-0 right-0 -m-20 w-40 h-40 bg-teal-100 rounded-full blur-[50px] opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
      
      {/* Header Tag */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wider border border-teal-100/50">
          {pub.category === "Conference" && <Users size={14} className="text-teal-600" />}
          {pub.category === "Journal" && <Bookmark size={14} className="text-teal-600" />}
          {pub.category === "Book Chapter" && <BookOpen size={14} className="text-teal-600" />}
          {pub.category}
        </div>
        <div className="inline-flex items-center text-slate-400 text-sm font-medium">
          <Calendar size={14} className="mr-1.5" />
          {pub.date}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 grow">
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 leading-tight mb-4 group-hover:text-teal-800 transition-colors">
          {pub.title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {pub.description}
        </p>

        {/* Authors */}
        <div className="mb-6 flex items-start gap-2">
          <FileText size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="text-sm font-medium text-slate-700 leading-snug">
            {pub.authors.join(", ")}
          </div>
        </div>

        {/* Venue */}
        <div className="mb-6 flex items-start gap-2">
          <ShieldCheck size={16} className="text-teal-500 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-600 leading-snug font-serif italic">
            {pub.venue}
          </div>
        </div>
      </div>

      {/* Footer / Meta Data */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-100 relative z-10 mt-auto">
        <div className="flex flex-wrap gap-2">
          {pub.tags.map((tag, i) => (
            <span key={i} className="text-[11px] font-semibold tracking-wide text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
        
        <a
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 shrink-0 w-10 h-10 rounded-full bg-teal-50 hover:bg-teal-600 text-teal-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
          title="View Publication"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    </motion.div>
  );
};

/* ================= MAIN ================= */
const Publications = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPublications = publicationsData.filter((pub) => {
    const matchesCat = activeCategory === "All" || pub.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesQuery = 
      pub.title.toLowerCase().includes(searchLower) ||
      pub.authors.some(a => a.toLowerCase().includes(searchLower)) ||
      pub.venue.toLowerCase().includes(searchLower) ||
      pub.tags.some(t => t.toLowerCase().includes(searchLower));

    return matchesCat && matchesQuery;
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
        </div>

        {/* Filters and Search Hub */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-12 bg-slate-50/50 p-2 sm:p-4 rounded-3xl border border-slate-200 shadow-sm">
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

          {/* Search Box */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search papers, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-3 h-[44px] pl-11 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm hover:border-slate-300"
            />
          </div>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPublications.length > 0 ? (
              filteredPublications.map((pub, index) => (
                <PublicationCard key={pub.id} pub={pub} index={index} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No publications found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Publications;
