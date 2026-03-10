import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* 🔹 Dummy data (UNCHANGED — your original data) */
const sessions = [
  {
    id: 1,
    category: "success",
    title:
      "Alumni Success Story - Shubham Kumar Chandravanshi (Deloitte), Dhruvkumar Patel (Myntra), Jay Patel (QloudX)",
    description:
      "The Alumni Connect Session at the Student Research Lab, M. M. Patel Students Research Project Cell, KSV, brought together students and alumni for an insightful interaction focused on industry exposure, career journeys, and key professional learnings.",
    type: "video",
    media: ["/Sessions/Alumni-Success-Shubham-Dhruvkumar-Jay/video-2.mp4"],
    linkedin:
      "https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7417800043421843456-rV2a?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
    date: "3rd Jan 2026",
  },
  {
    id: 2,
    category: "success",
    title:
      "Alumni Success Story - Manan Darji (Google), Dhwani Jakhaniya (AMD)",
    description:
      "Alumni of the CE Department, LDRP ITR, KSV conducted an insightful interaction session highlighting focused effort, mentorship, and adaptability for professional growth.",
    type: "video",
    media: ["/Sessions/Alumni-Success-Manan-Dhwani/video-1.mp4"],
    linkedin:
      "https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrc-activity-7413813644284682240-u9XF?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
    date: "27th Dec 2025",
  },
  {
    id: 3,
    category: "learning",
    title: "Written and Verbal Articulation of Algorithmic Concepts",
    description:
      "At the Students Research Lab under the M. M. Patel Students Research Project Cell, KSV (MMPSRPC), Kadi Sarva Vishwavidyalaya, Gandhinagar, an academic session focused on efficient analysis of recursive problems using structured and optimized approaches. Students solved advanced problem sets requiring quick evaluation and accurate case identification, showcasing how complex recurrences can be simplified through methodical thinking. Such application-driven learning strengthens analytical sharpness, improves performance under time constraints, and reinforces a results-oriented academic mindset 🚀💡.",
    type: "video",
    media: ["/Sessions/Articulation-of-Algorithmic-Concepts/video-3.mp4"],
    linkedin:
      "https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-svkm-activity-7412364021376413696-DFUn?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
    date: "12th Feb 2026",
  },
  {
    id: 4,
    category: "learning",
    title: "Algorithm Optimization Through Recurrence Analysis",
    description:
      "At the Students Research Lab under the M. M. Patel Students Research Project Cell, KSV (MMPSRPC), Kadi Sarva Vishwavidyalaya, Gandhinagar, students participated in an interactive session focused on algorithm optimization, applying concepts through discussion and collaborative teamwork. The activity strengthened their logical understanding and fostered a structured problem-solving approach. The Students Research Lab at KSV continues to cultivate a dynamic academic environment that sharpens minds and promotes 360° student development across disciplines 🚀💡.",
    type: "video",
    media: ["/Sessions/Algorithm-Optimization/video-1.mp4"],
    linkedin:
      "https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-svkm-activity-7411274469664759809-rDsK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
    date: "25th Feb 2026",
  },
  {
    id: 5,
    category: "learning",
    title: "A Glimpse into the Research Culture at MMPSRPC Students Research Lab",
    description:
      "The MMPSRPC Students Research Lab at KSV fosters an environment where students move beyond routine academic learning and develop a strong research mindset. Through weekly discussions, spontaneous exercises, and collaborative interactions, students strengthen their analytical thinking, communication skills, and ability to explore ideas with depth.This culture of learning encourages curiosity, teamwork, and thoughtful exploration, helping students transform simple ideas into structured and meaningful academic work.",
    type: "video",
    media: ["/Sessions/Learning-Cullture-of-MMPSRPC-SRL/video-6.mp4"],
    linkedin:
      "https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-studentsresearchlab-activity-7405172370459668481-6zQI?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
    date: "",
  },
  {
    id: 6,
    category: "success",
    title: "Alumni Success Story - Dhruvkumar Patel (Myntra)",
    description:
      "🎓 Alumni Connect Session at LDRP-ITR, KSV! Mr. Dhruvkumar Patel shared valuable insights on research-driven career growth and technical excellence.",
    type: "photo",
    media: [
      "/Sessions/Alumni-Success-Dhruvkumar/img-1.jpg",
      "/Sessions/Alumni-Success-Dhruvkumar/img-2.jpg",
      "/Sessions/Alumni-Success-Dhruvkumar/img-3.jpg",
      "/Sessions/Alumni-Success-Dhruvkumar/img-4.jpg",
      "/Sessions/Alumni-Success-Dhruvkumar/img-5.jpg",
    ],
    linkedin:
      "https://www.linkedin.com/posts/mmpsrpc_ksv-ldrpitr-mmpsrpc-activity-7393559476517273600-F8s-?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
    date: "8th Nov 2025",
  },
];

/* 🔥 Image Carousel */
const ImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      2600
    );
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="w-full h-full relative pointer-events-none">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
    </div>
  );
};

const Sessions = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredSessions =
    activeTab === "all"
      ? sessions
      : sessions.filter((s) => s.category === activeTab);

  return (
    <div
      className="relative pt-[112px] lg:pt-[128px] pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F2EFE8] overflow-hidden"
    >
      {/* Unique Mesh Gradient Background - Enhanced Beige in Right Corner */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f8e6c1]/40 via-[#EAE4D5]/30 to-[#f8e6c1]/60" />

        {/* Animated Glow Spheres - Diagonal Orientation */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -30, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-15%] right-[-15%] w-[900px] h-[900px] bg-[#E6B800]/20 rounded-full blur-[140px] pointer-events-none"
        />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-[#f8e6c1]/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Subtle SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300887b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zm30 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-5xl lg:text-7xl font-black font-serif text-secondary-dark mb-6">
            SRL Sessions
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { key: "all", label: "All Sessions" },
            { key: "learning", label: "Learning Sessions" },
            { key: "success", label: "Success Stories Sessions" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition ${activeTab === tab.key
                ? "bg-secondary text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {filteredSessions.map((session) => (
            <motion.a
              key={session.id}
              href={session.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -6, scale: 1.012 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="group block bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.12)] transform-gpu will-change-transform"
            >
              {/* MEDIA */}
              <div className="h-64 lg:h-72 bg-white overflow-hidden">
                {session.type === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain pointer-events-none transform-gpu"
                  >
                    <source src={session.media[0]} type="video/mp4" />
                  </video>
                ) : (
                  <ImageCarousel images={session.media} />
                )}
              </div>

              {/* TEXT (smooth hover reveal) */}
              <div className="px-6 pb-6 pt-4">
                <h3 className="text-lg lg:text-xl font-bold text-slate-800 font-serif leading-tight">
                  {session.title}
                </h3>

                <div className="max-h-52 opacity-100 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-52 lg:group-hover:opacity-100 transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden will-change-[max-height,opacity]">
                  <div className="text-xs text-slate-500 mt-2">
                    📅 {session.date}
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mt-2 line-clamp-3">
                    {session.description}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center text-slate-500 mt-20">
            No items to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;