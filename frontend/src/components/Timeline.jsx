import React, { useRef } from 'react';
import { motion } from "framer-motion";
import Tree from './tree';
import GradientText from './react-bits/GradientText';
import { useSupabaseQuery, fetchWithTimeout } from '../hooks/useSupabaseQuery';
import { API_BASE_URL } from '../config/apiConfig';

// Timeline icons mapping
const timelineIcons = {
  beginning: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
  ),
  alumni: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" /><path d="M11 12 5.12 2.2" /><path d="m13 12 5.88-9.8" /><path d="M8 7h8" /><circle cx="12" cy="17" r="5" /><path d="M12 18v-2h-.5" /></svg>
  ),
  impactthon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
  ),
  theory: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
  ),
};

const TimelineItem = ({ item, index, scrollRoot, isLast }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ root: scrollRoot, once: true, margin: "-10% 0% -10% 0%" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
      }}
      className={`relative flex items-center justify-center w-full group px-2 sm:px-6 ${isLast ? 'mb-24' : 'mb-32'}`}
    >
      {/* Center Track */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-0 bottom-[-150%]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#16B29D] flex items-center justify-center text-white shadow-lg z-10 border-4 border-white">
          {timelineIcons[item.icon] || timelineIcons.beginning}
        </div>
        {/* Track line */}
        {isLast ? null : <div className="w-[2px] h-full bg-slate-200/50 flex-1" />}
      </div>

      <div className="flex w-full items-center">
        {/* LEFT COMPONENT: Slides further left */}
        <motion.div
          className="w-1/2 pr-4 sm:pr-8 md:pr-10 text-right"
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
          }}
        >
          {isEven ? (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight mb-1">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-[240px] ml-auto leading-relaxed">{item.description}</p>
            </div>
          ) : (
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#16B29D] tracking-tighter block leading-none">
              {item.step}
            </span>
          )}
        </motion.div>

        {/* RIGHT COMPONENT: Slides further right */}
        <motion.div
          className="w-1/2 pl-4 sm:pl-8 md:pl-10 text-left"
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
          }}
        >
          {!isEven ? (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight mb-1">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-[240px] leading-relaxed">{item.description}</p>
            </div>
          ) : (
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#16B29D] tracking-tighter block leading-none">
              {item.step}
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const TimelineSkeleton = () => {
  return (
    <div className="w-full flex flex-col relative animate-pulse">
      {[1, 2, 3].map((_, index) => {
        const isEven = index % 2 === 0;
        const isLast = index === 2;
        return (
          <div key={index} className={`relative flex items-center justify-center w-full group px-2 sm:px-6 ${isLast ? 'mb-24' : 'mb-32'}`}>
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-0 bottom-[-150%]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 z-10 border-4 border-white shadow-sm"></div>
              {!isLast && <div className="w-[2px] h-full bg-slate-200/50 flex-1" />}
            </div>
            <div className="flex w-full items-center">
              <div className="w-1/2 pr-4 sm:pr-8 md:pr-10 flex flex-col items-end">
                {isEven ? (
                  <>
                    <div className="h-6 sm:h-7 bg-slate-200 rounded-md w-3/4 mb-3"></div>
                    <div className="h-3 sm:h-4 bg-slate-200 rounded-md w-full max-w-[240px] mb-2"></div>
                    <div className="h-3 sm:h-4 bg-slate-200 rounded-md w-5/6 max-w-[200px]"></div>
                  </>
                ) : (
                  <div className="h-10 sm:h-12 bg-slate-200 rounded-md w-24 sm:w-32"></div>
                )}
              </div>
              <div className="w-1/2 pl-4 sm:pl-8 md:pl-10 flex flex-col items-start">
                {!isEven ? (
                  <>
                    <div className="h-6 sm:h-7 bg-slate-200 rounded-md w-3/4 mb-3"></div>
                    <div className="h-3 sm:h-4 bg-slate-200 rounded-md w-full max-w-[240px] mb-2"></div>
                    <div className="h-3 sm:h-4 bg-slate-200 rounded-md w-5/6 max-w-[200px]"></div>
                  </>
                ) : (
                  <div className="h-10 sm:h-12 bg-slate-200 rounded-md w-24 sm:w-32"></div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function Timeline() {
  const scrollContainerRef = useRef(null);

  const { data: timelineSteps = [], loading, error, retry } = useSupabaseQuery(async () => {
    const json = await fetchWithTimeout(`${API_BASE_URL}/api/timeline`);
    return json.data || [];
  });

  return (
    <section id="timeline" className="py-24 px-4 md:px-8 bg-gradient-to-b from-white via-[#e8f5f1] to-white relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[65%] bg-[#f8e6c1]/60 rounded-full blur-[90px] animate-float-slow opacity-80" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', willChange: 'transform' }} />
        <div className="absolute bottom-[-5%] right-[-5%] w-[55%] h-[75%] bg-[#05877a]/10 rounded-full blur-[110px] animate-float-slower opacity-70" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 70%', willChange: 'transform' }} />
        <div className="absolute top-[30%] right-[10%] w-64 h-64 bg-[#05877a]/5 rounded-full blur-[80px] animate-float-slow opacity-50" style={{ willChange: 'transform' }} />
      </div>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="relative bg-white/40 backdrop-blur-xl border border-[#05877a]/20 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(5,135,122,0.15)] overflow-hidden h-[900px] lg:h-[700px] z-10">
          {/* Tree Layer - Remains fixed in the background */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <Tree rootXPos={0.25} rootYPos={1.1} scale={0.8} />
          </div>
          <div ref={scrollContainerRef} className="absolute inset-0 flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden z-10 scroll-smooth timeline-container">
            {/* LEFT: STATIC HUB (Central Hub) - Sticky on Desktop */}
            <div className="w-full lg:w-[42%] lg:sticky lg:top-0 h-[400px] lg:h-full relative flex flex-col items-center justify-center p-6 lg:p-8 z-10 bg-transparent flex-shrink-0">
              <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative lg:absolute lg:top-8 left-0 right-0 z-20 mb-6 lg:mb-0">
                <GradientText colors={["#184d46ff", "#16966bff", "#184d46ff", "#16966bff"]} animationSpeed={4} className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter drop-shadow-sm">
                  Our Journey
                </GradientText>
              </motion.div>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} animate={{ y: [0, -12, 0] }} transition={{ scale: { duration: 0.5 }, opacity: { duration: 0.5 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }} viewport={{ once: true }} className="relative w-56 h-56 sm:w-72 sm:h-72 z-10">
                <div className="absolute inset-0 z-0 scale-[1.05] sm:scale-110">
                  <div className="absolute inset-0 rounded-full border-[1.5px] border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                  <div className="absolute inset-1 rounded-full border border-[#FF9800]/20 rotate-[15deg]" />
                  <div className="absolute inset-[-3px] rounded-full border-[0.8px] border-[#C5A021]/40 -rotate-[10deg]" />
                  <div className="absolute inset-[-6px] rounded-full border-[0.3px] border-[#B8860B]/10 rotate-45deg" />
                  <div className="absolute top-[15%] left-[82%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#FFD700] animate-pulse" />
                  <div className="absolute top-[82%] left-[18%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#FFD700] animate-pulse delay-700" />
                  <div className="absolute top-[45%] left-[2%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_#FFF] animate-pulse delay-300" />
                  <div className="absolute top-[55%] left-[98%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_#FFF] animate-pulse delay-500" />
                  <div className="absolute top-[10%] left-[30%] w-0.5 h-0.5 bg-white/60 rounded-full" />
                  <div className="absolute top-[90%] left-[65%] w-0.5 h-0.5 bg-white/60 rounded-full" />
                  <div className="absolute top-[18%] left-[80%] -translate-x-1/2 -translate-y-1/2 scale-50 sm:scale-75">
                    <div className="absolute h-12 w-[1.5px] bg-gradient-to-b from-transparent via-[#FFD700] to-transparent -translate-y-6" />
                    <div className="absolute w-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent -translate-x-6" />
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_6px_rgba(255,255,255,0.8)]" />
                  </div>
                  <div className="absolute top-[78%] left-[22%] -translate-x-1/2 -translate-y-1/2 scale-[0.4] sm:scale-50 rotate-45">
                    <div className="absolute h-10 w-[1.5px] bg-gradient-to-b from-transparent via-[#FFD700] to-transparent -translate-y-5" />
                    <div className="absolute w-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent -translate-x-5" />
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_12px_4px_white]" />
                  </div>
                  <div className="absolute top-[50%] left-[97%] -translate-x-1/2 -translate-y-1/2 scale-[0.3]">
                    <div className="absolute h-10 w-[2px] bg-[#FFD700] blur-[1px] -translate-y-5" />
                    <div className="absolute w-10 h-[2px] bg-[#FFD700] blur-[1px] -translate-x-5" />
                  </div>
                </div>
                <div className="absolute inset-3 rounded-full bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-6 text-center ring-1 ring-slate-100/50 backdrop-blur-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-full flex items-center justify-center">
                    <img loading="lazy" decoding="async" src="/SRL.svg" alt="SRL Logo" className="w-full h-full object-contain" />
                  </div>
                  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} className="text-[#926c15] font-extrabold text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-3 drop-shadow-sm">
                    Students Research Lab
                  </motion.span>
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mb-3" />
                  <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed max-w-[200px] font-medium italic">
                    "Exploring milestones from humble beginnings to a hub of innovation."
                  </p>
                </div>
              </motion.div>
            </div>
            {/* RIGHT: TIMELINE (Items container) */}
            <div className="w-full lg:w-[58%] h-auto relative bg-transparent z-10 flex flex-col justify-start">
              <div className="pt-8 lg:pt-32 pb-0 px-4">
                {loading && <TimelineSkeleton />}
                {error && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <p className="text-slate-500 text-sm">Unable to load timeline data.</p>
                    <button
                      onClick={retry}
                      className="px-5 py-2 rounded-full bg-[#16B29D] text-white text-sm font-medium shadow-md hover:bg-[#139485] transition-colors cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                )}
                {!loading && !error && timelineSteps.length === 0 && (<div className="text-center text-slate-500 py-8">No data available 📭</div>)}
                {!loading && !error && timelineSteps.map((item, index) => (
                  <TimelineItem key={item.id || index} item={item} index={index} scrollRoot={scrollContainerRef} isLast={index === timelineSteps.length - 1} />
                ))}
              </div>
            </div>
          </div>
          {/* Gradients to signify scroll depth */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
}

export default Timeline;
