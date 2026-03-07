import React from 'react';
import { motion } from "framer-motion";
import Tree from './tree';

const timelineSteps = [
  {
    step: "Nov 2025",
    title: "Marked The Beginning",
    description: "The origin of SRL, where innovation and research journey began.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
    ),
  },
  {
    step: "Dec 2025",
    title: "Alumni Meet",
    description: "An interactive gathering where alumni reconnect, share experiences, and inspire members.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" /><path d="M11 12 5.12 2.2" /><path d="m13 12 5.88-9.8" /><path d="M8 7h8" /><circle cx="12" cy="17" r="5" /><path d="M12 18v-2h-.5" /></svg>
    ),
  },
  {
    step: "Jan 2026",
    title: "ImpactThon & InnovAItion",
    description: "SRL students became finalists in InnovAItion and organized ImpactThon successfully.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
    ),
  },
  {
    step: "Feb 2026",
    title: "Theory & Practice Talk",
    description: "A research talk focused on connecting academic concepts with real-world applications.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
    ),
  },
];

const TimelineItem = ({ item, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex items-center justify-center w-full mb-32 group"
    >
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-0 bottom-[-150%]">
        <div className="w-12 h-12 rounded-full bg-[#16B29D] flex items-center justify-center text-white shadow-lg z-10 border-4 border-white">
          {item.icon}
        </div>
        {index < timelineSteps.length - 1 && (
          <div className="w-[3px] h-full bg-slate-100 flex-1" />
        )}
      </div>

      <div className="flex w-full items-center">
        <div className="w-1/2 pr-12 text-right">
          {isEven ? (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 max-w-[280px] ml-auto leading-relaxed">{item.description}</p>
            </div>
          ) : (
            <span className="text-5xl sm:text-7xl font-bold text-[#16B29D] tracking-tighter block">
              {item.step}
            </span>
          )}
        </div>
        <div className="w-1/2 pl-12 text-left">
          {!isEven ? (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 max-w-[280px] leading-relaxed">{item.description}</p>
            </div>
          ) : (
            <span className="text-5xl sm:text-7xl font-bold text-[#16B29D] tracking-tighter block">
              {item.step}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  return (
    <section id="timeline" className="relative bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Static Background Layer - Spans the whole section but stays sticky */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Tree />
        </div>
      </div>

      <div className="relative max-w-[1500px] mx-auto px-8 z-10">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT: STATIC COLUMN (Circle) */}
          <div className="w-full lg:w-[45%] lg:h-screen lg:sticky lg:top-0 flex justify-center items-start pt-32 lg:pt-48 py-20 lg:py-0 pr-0 lg:pr-10 relative">

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              viewport={{ once: true }}
              className="relative w-64 h-64 sm:w-[340px] sm:h-[340px] z-10"
            >
              <div className="absolute inset-0 rounded-full border-[12px] border-l-[#16B29D] border-t-[#16B29D] border-r-transparent border-b-transparent rotate-[-45deg] z-0 shadow-[0_0_20px_rgba(22,178,157,0.1)]" />
              <div className="absolute inset-0 rounded-full border-[12px] border-l-transparent border-t-transparent border-r-[#F9EBD2] border-b-[#F9EBD2] rotate-[-45deg] z-0" />

              <div className="absolute inset-4 rounded-full bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center p-6 text-center ring-1 ring-slate-100">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-0 rounded-full flex items-center justify-center">
                  <img src="/SRL.svg" alt="SRL Logo" className="w-full h-full object-contain" />
                </div>

                <div className="overflow-hidden">
                  <motion.h2
                    initial={{ y: 40 }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="text-xl sm:text-2xl font-black text-slate-800 tracking-[0.05em] uppercase mb-1"
                  >
                    Our Journey
                  </motion.h2>
                </div>

                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-[#16B29D] font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2"
                >
                  Students Research Lab
                </motion.span>

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-[1px] bg-slate-200 mb-2"
                />

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-[240px] font-medium italic"
                >
                  "Exploring the milestones that define our path from humble beginnings to a hub of innovation."
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: SCROLLABLE COLUMN */}
          <div className="w-full lg:w-[55%] py-32 lg:py-[20vh] relative z-10">
            <div className="max-w-4xl mx-auto pl-0 lg:pl-10">
              {timelineSteps.map((item, index) => (
                <TimelineItem key={index} item={item} index={index} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Timeline;
