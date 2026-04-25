import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFetch, fetchWithTimeout } from "../hooks/useFetch";
import { API_BASE_URL } from "../config/apiConfig";
import { ExternalLink, X } from "lucide-react";
import { getImageUrl } from "../lib/imageUrl";

const Activities = () => {
  const [modal, setModal] = useState(null); // activity object or null
  const sectionRef = useRef(null);

  const {
    data: activities = [],
    loading,
    error,
  } = useFetch(async () => {
    const json = await fetchWithTimeout(`${API_BASE_URL}/api/activities`);
    return json.data || [];
  });

  return (
    <div
      ref={sectionRef}
      className="relative pt-8 lg:pt-12 pb-20 px-6 min-h-screen bg-[#F2EFE8] overflow-hidden"
    >
      {/* Unique Mesh Gradient Background - Minimal Dark Teal & Enhanced Beige */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#006d62]/10 via-[#F2EFE8] to-[#f8e6c1]/60" />

        {/* Static Glow Spheres (Animations removed for performance/framerate) */}
        <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-[#006d62]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[900px] h-[900px] bg-[#E6B800]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-[#f8e6c1]/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Subtle SVG Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300887b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zm30 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold uppercase tracking-tighter text-secondary-dark mb-6 scale-in-center">
            ACTIVITIES
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-500 font-medium">
            Discover the various initiatives and events organized by Students
            Research Lab to foster a culture of innovation and excellence.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 items-stretch">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden min-h-[270px] md:min-h-[290px] animate-pulse border border-gray-100"
              >
                <div className="w-full bg-gray-200 aspect-[4/3]"></div>
                <div className="flex flex-col flex-1 p-5 pt-4">
                  <div className="h-6 md:h-7 bg-gray-200 rounded-md w-3/4 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/3 mx-auto mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Error */}
        {error && (
          <div className="text-center text-red-500 py-20 text-lg">
            Unable to load data. Please try again.
          </div>
        )}
        {/* No Data */}
        {!loading && !error && activities.length === 0 && (
          <div className="text-center text-gray-400 py-20 text-lg">
            Nothing here yet - but exciting things are on the way!
          </div>
        )}

        {/* Activities Grid */}
        {!loading && !error && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 items-stretch">
            {[...activities]
              .sort((a, b) => {
                // Use 'sequence' or 'order' field; fallback to id or 0
                const aSeq = a.sequence ?? a.order ?? a.id ?? 0;
                const bSeq = b.sequence ?? b.order ?? b.id ?? 0;
                return aSeq - bSeq;
              })
              .map((act, i) => (
                <div
                  key={act.id || i}
                  className="bg-white rounded-2xl shadow-lg transition cursor-pointer flex flex-col group min-h-[270px] md:min-h-[290px] neon-gradient-border"
                  onClick={() => setModal(act)}
                >
                  {/* Always show the image at the top */}
                  <div className="w-full bg-gray-100 overflow-hidden rounded-2xl flex items-center justify-center aspect-[4/3]">
                    {(() => {
                      // Prefer signedPhotoUrl, fallback to public URL if not present
                      let url = act.Photo ? (act.Photo.startsWith("http") ? act.Photo : getImageUrl(act.Photo)) : null;
                      if (url) {
                        if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
                          return (
                            <video
                              src={getImageUrl(url)}
                              className="object-contain w-full h-full mx-auto my-auto bg-black"
                              controls
                              autoPlay={false}
                              muted
                              playsInline
                              preload="metadata"
                              poster={getImageUrl("/video-poster.png")}
                            >
                              Sorry, your browser doesn't support embedded
                              videos.
                            </video>
                          );
                        } else if (
                          url.match(
                            /\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?.*)?$/i,
                          )
                        ) {
                          return (
                            <img
                              loading="lazy"
                              decoding="async"
                              src={getImageUrl(url)}
                              alt={act.title + " (debug: " + url + ")"}
                              className="object-contain w-full h-full mx-auto my-auto rounded-2xl"
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                display: "block",
                              }}
                            />
                          );
                        } else {
                          // fallback: try to show as image if URL exists
                          return (
                            <img
                              loading="lazy"
                              decoding="async"
                              src={getImageUrl(url)}
                              alt={act.title + " (debug: " + url + ")"}
                              className="object-contain w-full h-full mx-auto my-auto"
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                display: "block",
                              }}
                            />
                          );
                        }
                      }
                      return (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                          No Image
                        </div>
                      );
                    })()}
                  </div>
                  {/* Title below the image */}
                  <div className="flex flex-col flex-1 p-5 pt-4">
                    <div className="font-bold text-lg md:text-xl text-gray-900 mb-2 text-center line-clamp-2">
                      {act.title}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold mb-2 text-center">
                      {act.date}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              style={{ alignItems: "flex-start", paddingTop: "5.5rem" }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 flex flex-col md:flex-row gap-6 relative border-2 border-sky-100 modal-neon-border"
                style={{ minHeight: 400, maxHeight: 500 }}
              >
                {/* Image */}
                {(modal?.signedPhotoUrl || modal?.Photo) && (
                  <div className="md:w-1/2 w-full bg-gray-100 flex items-center justify-center rounded-3xl overflow-hidden">
                    {(() => {
                      let url = modal.Photo ? (modal.Photo.startsWith("http") ? modal.Photo : getImageUrl(modal.Photo)) : null;
                      if (url && url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
                        return (
                          <video
                            src={getImageUrl(url)}
                            className="object-contain w-full h-full max-h-[340px] mx-auto my-auto bg-black"
                            controls
                            autoPlay={false}
                            muted
                            playsInline
                            preload="metadata"
                            poster={getImageUrl("/video-poster.png")}
                          >
                            Sorry, your browser doesn't support embedded videos.
                          </video>
                        );
                      } else if (
                        url &&
                        url.match(/\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?.*)?$/i)
                      ) {
                        return (
                          <img
                            loading="lazy"
                            decoding="async"
                            src={getImageUrl(url)}
                            alt={modal.title + " (debug: " + url + ")"}
                            className="object-contain w-full h-full max-h-[340px] mx-auto my-auto rounded-3xl"
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              display: "block",
                            }}
                          />
                        );
                      } else if (url) {
                        return (
                          <img
                            loading="lazy"
                            decoding="async"
                            src={getImageUrl(url)}
                            alt={modal.title + " (debug: " + url + ")"}
                            className="object-contain w-full h-full max-h-[340px] mx-auto my-auto rounded-3xl"
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              display: "block",
                            }}
                          />
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0 justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex-1">
                      {modal.title}
                    </h2>
                    {modal.year && (
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
                        {modal.year}
                      </span>
                    )}
                  </div>
                  {modal.link && (
                    <a
                      href={modal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-700 font-semibold text-sm mb-3 hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2.001 3.597 4.599v5.597z" />
                      </svg>
                      <span>(View Post)</span>
                    </a>
                  )}
                  <div className="flex-1 min-h-0">
                    <span className="font-bold text-gray-700 text-base">
                      Brief:{" "}
                    </span>
                    <div
                      className="overflow-y-auto pr-2 text-gray-700 text-base"
                      style={{ maxHeight: "calc(100% - 2rem)" }}
                    >
                      {modal.brief || modal.description}
                    </div>
                  </div>
                  <div
                    className="text-gray-400 text-xs pt-2"
                    style={{ marginTop: "auto" }}
                  >
                    {modal.date}
                  </div>
                </div>
                {/* Close Button */}
                <button
                  onClick={() => setModal(null)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow text-gray-700"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Activities;
