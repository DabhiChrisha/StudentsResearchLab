import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/apiConfig";

/* Image Carousel for photo-type sessions */
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
          loading="lazy"
          decoding="async"
          key={i}
          src={img}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

/* Skeleton card while loading */
const SessionSkeleton = () => (
  <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.12)] animate-pulse">
    <div className="h-64 lg:h-72 bg-slate-200" />
    <div className="px-6 pb-6 pt-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
    </div>
  </div>
);

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sessions`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ sessions: data }) => setSessions(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredSessions =
    activeTab === "all"
      ? sessions
      : sessions.filter((s) => s.category === activeTab);

  return (
    <div className="relative pt-8 lg:pt-12 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F2EFE8] overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f8e6c1]/40 via-[#EAE4D5]/30 to-[#f8e6c1]/60" />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-[#f8e6c1]/20 rounded-full blur-[80px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300887b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zm30 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
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
              className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                activeTab === tab.key
                  ? "bg-secondary text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center text-red-500 mt-10 text-sm">
            Failed to load sessions. Please try again later.
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SessionSkeleton key={i} />
              ))
            : filteredSessions.map((session) => (
                <motion.a
                  key={session.id}
                  href={session.linkedin_url}
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
                        <source src={session.media_urls?.[0]} type="video/mp4" />
                      </video>
                    ) : (
                      <ImageCarousel images={session.media_urls || []} />
                    )}
                  </div>

                  {/* TEXT (smooth hover reveal) */}
                  <div className="px-6 pb-6 pt-4">
                    <h3 className="text-lg lg:text-xl font-bold text-slate-800 font-serif leading-tight">
                      {session.title}
                    </h3>

                    <div className="max-h-52 opacity-100 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-52 lg:group-hover:opacity-100 transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden will-change-[max-height,opacity]">
                      {session.date_raw && (
                        <div className="text-xs text-slate-500 mt-2">
                          📅 {session.date_raw}
                        </div>
                      )}
                      <p className="text-slate-600 text-sm leading-relaxed mt-2 line-clamp-3">
                        {session.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
        </div>

        {!loading && !error && filteredSessions.length === 0 && (
          <div className="text-center text-slate-500 mt-20">
            No sessions to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
