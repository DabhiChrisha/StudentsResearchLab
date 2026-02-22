import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Custom SVG Icons for Objectives
const Icon360 = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const IconTeam = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconHandsOn = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-8.1 8.1a2 2 0 0 1-2.83 0l-1.6-1.6a2 2 0 0 1 0-2.83l8.1-8.1a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77" />
        <path d="m14.7 6.3-3.6 3.6" />
        <circle cx="5" cy="19" r="2" />
        <path d="M3.5 17.5 2 16" />
        <path d="M6.5 20.5 8 22" />
    </svg>
);

const IconResearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="M11 7v8" />
        <path d="M7 11h8" />
    </svg>
);

const IconTheory = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const IconMentors = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconInnovation = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <path d="M12 2v4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="M2 12h4" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="M12 22v-4" />
        <path d="m19.07 19.07-2.83-2.83" />
        <path d="M22 12h-4" />
        <path d="m19.07 4.93-2.83 2.83" />
    </svg>
);

const IconSkills = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <path d="m12 14 4-4" />
        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
);

const IconGlobal = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <circle cx="12" cy="12" r="10" />
        <path d="M22 12A10 10 0 1 1 2 12" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const IconReady = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
);

const objectives = [
    {
        id: 1,
        icon: <Icon360 />,
        title: "360° Development of Students",
        description: "To cultivate well-rounded, future-ready achievers equipped to excel beyond boundaries.",
    },
    {
        id: 2,
        icon: <IconTeam />,
        title: "Team-Based Learning & Collaborative Activities",
        description: "To promote teamwork through group research projects, innovation activities, and collaborative problem-solving, building coordination and leadership skills.",
    },
    {
        id: 3,
        icon: <IconHandsOn />,
        title: "Hands-on Experience & Skill-Based Learning",
        description: "To encourage practical experimentation and hands-on technical sessions, ensuring students develop industry-relevant expertise.",
    },
    {
        id: 4,
        icon: <IconResearch />,
        title: "Interdisciplinary Research",
        description: "Addressing emerging technologies and societal challenges through cross-domain collaboration and innovative methodologies.",
    },
    {
        id: 5,
        icon: <IconTheory />,
        title: "Bridging Theory & Practice",
        description: "Connecting academic learning with real-world engineering through continuous technical engagement and mentorship.",
    },
    {
        id: 6,
        icon: <IconMentors />,
        title: "Guided Mentorship",
        description: "Fostering professional growth and character building under the expert guidance of dedicated faculty mentors.",
    },
    {
        id: 7,
        icon: <IconInnovation />,
        title: "Applied Innovation",
        description: "Focusing on solution-oriented research and technological advancements that address practical industrial needs.",
    },
    {
        id: 8,
        icon: <IconSkills />,
        title: "Professional Excellence",
        description: "Developing a mindset of quality, ethics, and competitive technical standards among all lab members.",
    },
    {
        id: 9,
        icon: <IconGlobal />,
        title: "Global Recognition",
        description: "Striving for excellence that places our research and students on the international stage.",
    },
    {
        id: 10,
        icon: <IconReady />,
        title: "Industry Readiness",
        description: "Equipping students with the skills and confidence required to transition seamlessly into high-impact professional roles.",
    }
];

const ObjectiveItem = ({ objective, index }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="flex items-center w-full max-w-3xl mx-auto mb-4 sm:mb-6 group"
        >
            <div className={`relative flex items-center w-full ${isMobile ? 'gap-4' : ''}`}>
                {/* SVG Icon Circle */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="z-20 flex items-center justify-center 
                        w-20 h-20 sm:w-24 sm:h-24 
                        rounded-full bg-secondary
                        border-4 border-white shadow-lg sm:shadow-xl
                        text-white
                        shrink-0"
                >
                    <div className="flex items-center justify-center p-2">
                        {objective.icon}
                    </div>
                </motion.div>

                {/* Content Box */}
                <div className={`relative flex-1 ${isMobile ? '' : '-ml-12'}`}>
                    <motion.div
                        whileHover={{ x: isMobile ? 0 : 10 }}
                        className={`
                            relative z-10 w-full
                            border border-neutral-200
                            flex flex-col justify-center
                            group-hover:shadow-md group-hover:border-secondary/30
                            transition-all duration-300
                            bg-white
                            ${isMobile ? 'px-4 py-3 rounded-xl' : 'pl-16 pr-14 py-4 min-h-[7rem] rounded-r-xl'}
                        `}
                        style={{
                            ...(isMobile ? {} : {
                                clipPath: 'polygon(0% 0%, calc(100% - 25px) 0%, 100% 50%, calc(100% - 25px) 100%, 0% 100%)',
                            })
                        }}
                    >
                        <h3 className="text-base sm:text-xl font-bold text-neutral-800 mb-1 sm:mb-2 font-serif">
                            {objective.title}
                        </h3>
                        <p className="text-neutral-500 text-xs sm:text-sm leading-snug sm:leading-relaxed max-w-3xl">
                            {objective.description}
                        </p>
                    </motion.div>

                    {/* Visual Number Indicator in Background */}
                    <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-5 ${isMobile ? 'right-2' : 'right-20'}`}>
                        <span className="text-5xl sm:text-7xl font-black text-neutral-800">
                            {objective.id}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Objectives = () => {
    return (
        <section id="objectives" className="py-10 sm:py-16 overflow-hidden overflow-x-hidden bg-primary/20">
            <div className="max-w-7xl mx-auto">
                <div className="rounded-2xl px-6 sm:px-10 lg:px-14 py-8 sm:py-12 mx-4 sm:mx-6 lg:mx-8">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl sm:text-5xl font-black text-secondary-dark mb-6 font-serif tracking-tight"
                        >
                            Objectives of SRL
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-neutral-500 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light"
                        >
                            Pioneering excellence through a structured mission
                            focused on innovation, growth, and student empowerment.
                        </motion.p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        {objectives.map((obj, index) => (
                            <ObjectiveItem key={obj.id} objective={obj} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Objectives;
