import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { API_BASE_URL } from "../config/apiConfig";

/* 🎊 Confetti helper */
const fireConfetti = () => {
  const duration = 1200;
  const end = Date.now() + duration;
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};

/* Skeleton card while loading */
const CardSkeleton = () => (
  <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white animate-pulse">
    <div className="aspect-[4/3] bg-slate-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  </div>
);

/* ================= CARD ================= */
const Card = ({ item, onClick }) => (
  <motion.div
    layout
    transition={{ type: "spring", stiffness: 140, damping: 22 }}
    whileHover={{ y: -6 }}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="relative cursor-pointer rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white group"
  >
    <div className="aspect-[4/3] overflow-hidden bg-white">
      {item.type === "image" && item.media_urls?.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="w-full h-full"
        >
          {item.media_urls.map((img, index) => (
            <SwiperSlide key={index} className="!flex !items-center !justify-center">
              <img
                loading="lazy"
                decoding="async"
                src={img}
                alt={item.title}
                className="block max-w-full max-h-full object-contain mx-auto"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : item.type === "video" && item.media_urls?.length > 0 ? (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <video
            src={item.media_urls[0]}
            muted
            loop
            autoPlay
            playsInline
            className="block max-w-full max-h-full object-contain mx-auto"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100">
          <span className="text-slate-400 text-sm">No media</span>
        </div>
      )}
    </div>

    <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-5 text-white">
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p className="text-sm opacity-80">{item.date_raw}</p>
      <p className="text-xs mt-1 opacity-70">Click to view details</p>
    </div>
  </motion.div>
);

/* ================= MAIN ================= */
const Achievements = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailHeight, setDetailHeight] = useState(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const detailRef = useRef(null);
  const hadSelectionRef = useRef(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/achievements`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ achievements }) => setData(achievements || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const remaining = data.filter((d) => d.id !== selected?.id);

  useEffect(() => {
    if (selected) {
      hadSelectionRef.current = true;
      setTimeout(() => {
        (headerRef.current || detailRef.current)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 280);
      return;
    }

    if (!selected && hadSelectionRef.current) {
      setTimeout(() => {
        (headerRef.current || sectionRef.current)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
      hadSelectionRef.current = false;
    }
  }, [selected]);

  useEffect(() => {
    if (!selected || !detailRef.current) return;

    const panel = detailRef.current;
    const syncHeight = () => {
      const nextHeight = panel.offsetHeight || null;
      setDetailHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    };

    const rafId = requestAnimationFrame(syncHeight);
    window.addEventListener("resize", syncHeight);

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(syncHeight);
      observer.observe(panel);

      return () => {
        cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener("resize", syncHeight);
      };
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", syncHeight);
    };
  }, [selected]);

  const handleSelect = (item) => {
    setSelected(item);
    fireConfetti();
  };

  return (
    <div
      ref={sectionRef}
      className="relative pt-8 lg:pt-12 pb-40 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F2EFE8] overflow-hidden"
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f8e6c1]/60 via-[#EAE4D5]/40 to-[#00887b]/20" />
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
        <div
          ref={headerRef}
          style={{ scrollMarginTop: "calc(var(--navbar-height, 80px) + 12px)" }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl lg:text-7xl font-black font-serif text-secondary-dark mb-3 uppercase tracking-tight">
            Achievements
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-snug">
            Celebrating the milestones and scholarly breakthroughs of our
            dedicated researchers.
          </p>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* BEFORE CLICK — grid view */}
        {!loading && !selected && (
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.map((item) => (
              <Card key={item.id} item={item} onClick={() => handleSelect(item)} />
            ))}
          </motion.div>
        )}

        {/* AFTER CLICK — detail view */}
        {!loading && selected && (
          <motion.div
            layout
            onClick={() => setSelected(null)}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="grid grid-cols-1 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] gap-8 items-start"
          >
            {/* LEFT — card list (lg+ only) */}
            <motion.div
              layout
              onClick={(e) => e.stopPropagation()}
              style={detailHeight ? { maxHeight: `${detailHeight}px` } : undefined}
              className="hidden lg:block space-y-6 self-start lg:sticky lg:top-[calc(var(--navbar-height,80px)+16px)] lg:overflow-y-auto lg:pr-2"
            >
              <Card item={selected} onClick={() => setSelected(null)} />
              {remaining.map((item) => (
                <Card key={item.id} item={item} onClick={() => handleSelect(item)} />
              ))}
            </motion.div>

            {/* RIGHT — detail panel */}
            <motion.div
              layout
              ref={detailRef}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              style={{ scrollMarginTop: "calc(var(--navbar-height, 80px) + 12px)" }}
              className="scroll-mt-28 relative w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 order-first lg:order-last"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                aria-label="Back to all achievements"
                className="hidden lg:inline-flex absolute top-4 left-4 z-30 h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-700 border border-slate-200 shadow hover:bg-slate-50 transition"
              >
                &larr;
              </button>

              <div className="aspect-[4/3] bg-white flex items-center justify-center overflow-hidden">
                {selected.type === "image" && selected.media_urls?.length > 0 ? (
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    pagination={{ clickable: true }}
                    loop
                    className="w-full h-full"
                  >
                    {selected.media_urls.map((img, index) => (
                      <SwiperSlide key={index} className="!flex !items-center !justify-center">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={img}
                          alt={selected.title}
                          className="block max-w-full max-h-full object-contain mx-auto"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : selected.type === "video" && selected.media_urls?.length > 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <video
                      src={selected.media_urls[0]}
                      controls
                      autoPlay
                      className="block max-w-full max-h-full object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <span className="text-slate-400 text-sm">No media available yet</span>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 font-serif">
                  {selected.title}
                </h3>

                <div className="flex flex-wrap gap-3 mb-4 text-sm">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">
                    {selected.category}
                  </span>
                  {selected.date_raw && (
                    <span className="text-slate-500">{selected.date_raw}</span>
                  )}
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                  {selected.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {selected.linkedin_url && (
                    <a
                      href={selected.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#004182] transition"
                    >
                      View on LinkedIn
                    </a>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                    className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-semibold hover:bg-slate-200 transition lg:hidden"
                  >
                    &larr; Back to All
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center text-slate-500 mt-20">
            No achievements to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
