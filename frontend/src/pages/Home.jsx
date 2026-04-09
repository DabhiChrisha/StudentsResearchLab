import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import HeadSRL from "../components/HeadSRL";
import LazySection from "../components/LazySection";

// Lazy-loaded below-the-fold sections (deferred JS bundles + API calls)
const Objectives = lazy(() => import("../components/Objectives"));
const Timeline = lazy(() => import("../components/Timeline"));
const Earth = lazy(() => import("../components/react-bits/Earth"));
const SparklesCore = lazy(() =>
  import("../components/react-bits/SparklesCore").then((m) => ({
    default: m.SparklesCore,
  })),
);

// Skeleton placeholders for each section while loading
const SectionSkeleton = ({ height = 400, label }) => (
  <div
    className="w-full flex items-center justify-center animate-pulse"
    style={{ minHeight: height }}
  >
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-[#05877a]/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-[#05877a]/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-[#05877a]/30 rounded-full animate-bounce"></div>
      </div>
      {label && (
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      )}
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section — eagerly loaded (above the fold) */}
      <Hero />

      {/* 2. Head SRL Profile — eagerly loaded (lightweight, no API call) */}
      <HeadSRL />

      {/* 3. Objectives Section — lazy loaded when user scrolls near */}
      <LazySection
        fallback={<SectionSkeleton height={650} label="Loading objectives…" />}
        rootMargin="300px"
        minHeight={650}
      >
        <Suspense
          fallback={
            <SectionSkeleton height={650} label="Loading objectives…" />
          }
        >
          <Objectives />
        </Suspense>
      </LazySection>

      {/* 4. Timeline Section — lazy loaded, API call fires only on visibility */}
      <LazySection
        fallback={<SectionSkeleton height={700} label="Loading timeline…" />}
        rootMargin="300px"
        minHeight={700}
      >
        <Suspense
          fallback={<SectionSkeleton height={700} label="Loading timeline…" />}
        >
          <Timeline />
        </Suspense>
      </LazySection>

      {/* 5. Impact Metrics — lazy loaded (contains heavy Earth 3D globe) */}
      <LazySection
        fallback={
          <SectionSkeleton height={500} label="Loading impact metrics…" />
        }
        rootMargin="300px"
        minHeight={500}
      >
        <section
          id="impact"
          className="py-12 px-4 bg-white relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#f2f9f7] rounded-[2rem] lg:rounded-[3rem] 2xl:rounded-[3.5rem] p-6 md:p-10 lg:p-12 2xl:p-16 relative overflow-hidden border border-slate-100 shadow-sm">
              {/* LEFT: Sparkles Background */}
              <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-none">
                <Suspense fallback={null}>
                  <SparklesCore
                    id="tsparticlesimpact"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={60}
                    className="w-full h-full"
                    particleColor="#05877a"
                  />
                </Suspense>
              </div>

              {/* Subtle background pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#05877a 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative z-10 flex flex-col lg:flex-row items-stretch gap-12">
                {/* LEFT: Impact Metrics Stats */}
                <div className="w-full lg:w-3/5 flex flex-col justify-center">
                  <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl lg:text-5xl 2xl:text-7xl font-bold font-display bg-gradient-to-r from-slate-900 via-slate-600 to-black bg-clip-text text-transparent animate-gradient-slow mb-4">
                      Impact Metrics
                    </h2>
                    <p className="text-slate-500 text-lg">
                      Measurable outcomes of our commitment to excellence.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                    {[
                      {
                        label: "Research Papers/ Case Studies/ Book Chapters",
                        value: "9",
                        category: "Total Publications",
                      },
                      {
                        label: "Research Poster Presentations",
                        value: "4",
                        category: "Conferences",
                      },
                      {
                        label: "Awards and Recognitions",
                        value: "2",
                        category: "Excellence",
                      },
                      {
                        label: "Hackathon",
                        isHackathon: true,
                        winners: "12",
                        finalists: "38",
                      },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        className="bg-white/70 backdrop-blur-sm border border-slate-200/50 p-4 sm:p-6 rounded-[1.5rem] 2xl:rounded-[2rem] flex flex-col items-start group hover:bg-white transition-all hover:shadow-md hover:-translate-y-1 h-full"
                      >
                        {stat.isHackathon ? (
                          <div className="w-full flex flex-col h-full justify-between">
                            <div className="flex items-center w-full">
                              <div className="flex-1 text-center">
                                <div className="text-4xl sm:text-5xl font-bold font-display text-teal-800 leading-none">
                                  {stat.winners}
                                </div>
                                <div className="text-slate-400 text-[11px] sm:text-[13px] font-bold uppercase tracking-wide mt-1">
                                  Winners
                                </div>
                              </div>
                              <div className="w-px h-12 bg-slate-200 mx-2" />
                              <div className="flex-1 text-center">
                                <div className="text-4xl sm:text-5xl font-bold font-display text-teal-800 leading-none">
                                  {stat.finalists}
                                </div>
                                <div className="text-slate-400 text-[11px] sm:text-[13px] font-bold uppercase tracking-wide mt-1">
                                  Finalists
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center">
                              <span className="text-slate-800 text-[14px] sm:text-[16px] font-black uppercase tracking-[0.2em]">
                                Hackathons
                              </span>
                            </div>
                          </div>
                        ) : stat.value ? (
                          <>
                            <div className="text-4xl sm:text-5xl font-bold font-display text-teal-800 mb-1">
                              {stat.value}
                            </div>
                            <div className="text-slate-800 text-[14px] sm:text-[16px] font-bold leading-tight mb-1">
                              {stat.label}
                            </div>
                            <div className="text-slate-400 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">
                              {stat.category}
                            </div>
                          </>
                        ) : null}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Deep Teal Globe Card */}
                <div className="w-full lg:w-2/5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative h-[380px] md:h-[450px] 2xl:h-[550px] overflow-hidden rounded-[2rem] 2xl:rounded-[3rem] bg-gradient-to-br from-[#cef0ea] via-[#f2e4b3] to-white p-6 md:p-10 2xl:p-14 text-slate-800 shadow-xl border border-white/50 flex flex-col justify-start"
                  >
                    <h3 className="relative z-20 text-3xl md:text-4xl lg:text-4xl 2xl:text-6xl font-bold tracking-tight leading-[1.1] text-slate-800">
                      Advancing <br />
                      knowledge <br />
                      through <br />
                      innovative <br />
                      research.
                    </h3>

                    <div className="absolute -right-20 -bottom-20 z-10 w-[400px] md:w-[500px] 2xl:w-[650px] aspect-square flex items-center justify-center pointer-events-auto">
                      <Suspense
                        fallback={
                          <div className="animate-pulse bg-white/10 rounded-full w-64 h-64" />
                        }
                      >
                        <Earth
                          className="w-full h-full"
                          scale={1.2}
                          dark={0.8}
                        />
                      </Suspense>
                    </div>

                    {/* Subtle Overlay Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazySection>
    </div>
  );
};

export default Home;
