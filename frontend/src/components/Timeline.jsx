import React, { useRef } from 'react';
import { motion } from "framer-motion";
import Tree from './tree';
import GradientText from './react-bits/GradientText';

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

const TimelineItem = ({ item, index, scrollRoot }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ root: scrollRoot, margin: "-10% 0% -10% 0%" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
      }}
      className="relative flex items-center justify-center w-full mb-32 group px-4"
    >
      {/* Center Track */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-0 bottom-[-150%]">
        <div className="w-10 h-10 rounded-full bg-[#16B29D] flex items-center justify-center text-white shadow-lg z-10 border-4 border-white">
          {item.icon}
        </div>
        {index < timelineSteps.length - 1 && (
          <div className="w-[2px] h-full bg-slate-200/50 flex-1" />
        )}
      </div>

      <div className="flex w-full items-center">
        {/* LEFT COMPONENT: Slides further left */}
        <motion.div 
          className="w-1/2 pr-10 text-right"
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
          }}
        >
          {isEven ? (
            <div>
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 max-w-[240px] ml-auto leading-relaxed">{item.description}</p>
            </div>
          ) : (
            <span className="text-4xl sm:text-5xl font-bold text-[#16B29D] tracking-tighter block leading-none">
              {item.step}
            </span>
          )}
        </motion.div>

        {/* RIGHT COMPONENT: Slides further right */}
        <motion.div 
          className="w-1/2 pl-10 text-left"
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
          }}
        >
          {!isEven ? (
            <div>
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 max-w-[240px] leading-relaxed">{item.description}</p>
            </div>
          ) : (
            <span className="text-4xl sm:text-5xl font-bold text-[#16B29D] tracking-tighter block leading-none">
              {item.step}
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  const scrollContainerRef = useRef(null);

  return (
    <section id="timeline" className="py-12 px-4 md:px-8 bg-white relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <div className="max-w-[1400px] mx-auto">
        {/* Main Section Container with Border and Height Constraint */}
        <div className="relative flex flex-col lg:flex-row bg-[#fdfdfd] border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden h-[700px]">
          
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#16B29D]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* LEFT: STATIC HUB (Tree & Circle) */}
          <div className="w-full lg:w-[45%] h-[300px] lg:h-full relative flex items-center justify-center p-8 bg-white/50 border-b lg:border-b-0 lg:border-r border-slate-100">
            
            {/* Animated Title above the tree */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-8 left-0 right-0 z-20"
            >
              <GradientText
                colors={["#82C8C1", "#F5E6CC", "#82C8C1", "#F5E6CC"]}
                animationSpeed={5}
                className="text-4xl md:text-5xl font-black tracking-tighter"
              >
                Our Journey
              </GradientText>
            </motion.div>

            {/* Tree Layer */}
            <div className="absolute inset-0 z-0 opacity-40">
              <Tree rootXPos={0.5} rootYPos={1.1} scale={0.7} />
            </div>

            {/* Hub Circle */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              viewport={{ once: true }}
              className="relative w-56 h-56 sm:w-72 sm:h-72 z-10"
            >
              <div className="absolute inset-0 rounded-full border-[10px] border-l-[#16B29D] border-t-[#16B29D] border-r-transparent border-b-transparent rotate-[-45deg] z-0 opacity-80" />
              <div className="absolute inset-0 rounded-full border-[10px] border-l-transparent border-t-transparent border-r-emerald-50 border-b-emerald-50 rotate-[-45deg] z-0" />

              <div className="absolute inset-3 rounded-full bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-6 text-center ring-1 ring-slate-100/50 backdrop-blur-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-full flex items-center justify-center">
                  <img src="/SRL.svg" alt="SRL Logo" className="w-full h-full object-contain" />
                </div>

                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-[#16B29D] font-bold text-[10px] sm:text-[11px] tracking-[0.25em] uppercase mb-3"
                >
                  Students Research Lab
                </motion.span>

                <div className="h-[1px] w-12 bg-slate-200 mb-3" />

                <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed max-w-[200px] font-medium italic">
                  "Exploring milestones from humble beginnings to a hub of innovation."
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: SCROLLABLE TIMELINE */}
          <div 
            ref={scrollContainerRef}
            className="w-full lg:w-[55%] h-full overflow-y-auto overflow-x-hidden relative scroll-smooth bg-white/30 backdrop-blur-[2px]"
            style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: '#16B29D22 transparent' 
            }}
          >
            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
              #timeline div::-webkit-scrollbar { width: 4px; }
              #timeline div::-webkit-scrollbar-track { background: transparent; }
              #timeline div::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
              #timeline div::-webkit-scrollbar-thumb:hover { background: #16B29D; }
            `}} />

            <div className="py-24 lg:py-32 px-4">
              {timelineSteps.map((item, index) => (
                <TimelineItem 
                  key={index} 
                  item={item} 
                  index={index} 
                  scrollRoot={scrollContainerRef}
                />
              ))}
              
              <div className="h-48" />
            </div>

            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Timeline;
