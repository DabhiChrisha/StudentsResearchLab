import React from 'react';
import { motion } from "framer-motion";
import TreeBackground from './tree';

// Inline SVG Icons
const RocketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const BanknoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const TrophyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const HandshakeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 2 0l.47-.28c2.63-1.57 2.3-4.34 2-5a2.11 2.11 0 0 0-2.93-.25l-2.7 2.7" />
    <path d="M12 15l-4 4a3 3 0 0 1-3-3l1-1" />
  </svg>
);

const MedalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 5.12 2.2" />
    <path d="m13 12 5.88-9.8" />
    <path d="M8 7h8" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 18v-2h-.5" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const timelineSteps = [
  {
    step: "Nov 2025",
    title: "Marked The Beginning",
    description: "The origin of SRL, where innovation and research journey began.",
    icon: <RocketIcon />,
  },
  {
    step: "Dec 2025",
    title: "Alumni Connect SRL Sessions",
    description: "An interactive gathering where alumni reconnect, share experiences, and inspire SRL members with their journeys and insights.",
    icon: <MedalIcon />,
  },
  {
    step: "Jan 2026",
    title: "Organized ImpactThon| InnovAItion Finalists",
    description: (
      <>
        SRL students became finalists in an InnovAItion hackathon and successfully organized ImpactThon promoting
        <br />
        Research | Prototype | Impact.
      </>
    ),
    icon: <GlobeIcon />,
  },
  {
    step: "Feb 2026",
    title: "Bridging Theory & Practice- A Research Talk",
    description: "An upcoming research talk focused on connecting academic concepts with real-world applications through insights, discussions, and practical perspectives.",
    icon: <TrophyIcon />,
  },
];

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const popIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.2 }
  },
};

const TimelineItem = ({ item, index }) => {
  // Step 1 (Index 0): Content Left, Icon Center, Number Right.
  // Step 2 (Index 1): Number Left, Icon Center, Content Right.
  const isEvenStep = (index + 1) % 2 === 0; // False for Index 0 (Step 1)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
      className="relative flex items-center justify-between w-full mb-12 sm:mb-24 flex-col-reverse sm:flex-row z-10"
    >
      {/* LEFT SIDE (Desktop) */}
      <div className={`w-full sm:w-[45%] flex ${isEvenStep ? 'justify-end' : 'justify-end'}`}>
        {isEvenStep ? (
          // EVEN STEP (e.g., 2026): Show NUMBER on Left -> Slide in from Left
          <motion.div variants={slideInLeft} className="text-center sm:text-right pr-0 sm:pr-8 hidden sm:block">
            <span className="text-6xl sm:text-8xl font-bold tracking-tighter" style={{ color: '#16B29D' }}>
              {item.step}
            </span>
          </motion.div>
        ) : (
          // ODD STEP (e.g., 2025): Show CONTENT on Left -> Slide in from Left
          <motion.div
            variants={slideInLeft}
            whileHover={{ scale: 1.05, x: -10 }}
            className="text-center sm:text-right pr-0 sm:pr-8 cursor-pointer"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-teal-800 mb-2">
              {item.title}
            </h3>
            <div className="text-neutral-500 text-sm sm:text-base leading-relaxed">
              {item.description}
            </div>
          </motion.div>
        )}
      </div>

      {/* CENTER ICON */}
      <div className="relative z-10 flex items-center justify-center w-full sm:w-[10%] my-4 sm:my-0">
        <motion.div
          variants={popIn}
          whileHover={{ scale: 1.2, rotate: 15 }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-500 shadow-xl flex items-center justify-center text-white ring-8 ring-white cursor-pointer"
        >
          <div className="scale-125 sm:scale-150">
            {item.icon}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE (Desktop) */}
      <div className={`w-full sm:w-[45%] flex ${isEvenStep ? 'justify-start' : 'justify-start'}`}>
        {isEvenStep ? (
          // EVEN STEP (e.g., 2026): Show CONTENT on Right -> Slide in from Right
          <motion.div
            variants={slideInRight}
            whileHover={{ scale: 1.05, x: 10 }}
            className="text-center sm:text-left pl-0 sm:pl-8 cursor-pointer"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-teal-800 mb-2">
              {item.title}
            </h3>
            <div className="text-neutral-500 text-sm sm:text-base leading-relaxed max-w-md">
              {item.description}
            </div>
          </motion.div>
        ) : (
          // ODD STEP (e.g., 2025): Show NUMBER on Right -> Slide in from Right
          <motion.div variants={slideInRight} className="text-center sm:text-left pl-0 sm:pl-8 hidden sm:block">
            <span className="text-6xl sm:text-8xl font-bold tracking-tighter" style={{ color: '#16B29D' }}>
              {item.step}
            </span>
          </motion.div>
        )}
      </div>

      {/* Mobile Number Display (Only visible on small screens) */}
      <motion.div variants={slideInLeft} className="sm:hidden text-6xl font-bold mb-2" style={{ color: '#16B29D' }}>
        {item.step}
      </motion.div>
    </motion.div>
  );
};

const Timeline = () => {
  return (
    <section id="timeline" className="relative py-16 sm:py-20 overflow-hidden overflow-x-hidden bg-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <TreeBackground />
      </div>
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="rounded-2xl bg-white/70 backdrop-blur-md px-6 sm:px-10 lg:px-14 py-8 sm:py-12 mx-4 sm:mx-6 lg:mx-8 shadow-lg border border-gray-100">
          {/* HEADER */}
          <div className="text-center mb-16 sm:mb-24 max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-teal-900 mb-6 font-display"
            >
              Our Journey
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-neutral-500 text-lg"
            >
              From humble beginnings to a hub of innovation, exploring the milestones that define our path forward.
            </motion.p>
          </div>

          {/* TIMELINE CONTAINER */}
          <div className="relative">
            <div className="flex flex-col">
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
