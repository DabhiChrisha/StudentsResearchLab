import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import SplashCursorCard from "../components/SplashCursorCard";

const objectives = [
    {
        title: "360° Development",
        description: "Cultivating well-rounded, future-ready achievers prepared for global challenges."
    },
    {
        title: "Collaborative Learning",
        description: "Fostering teamwork through group projects and peer-to-peer knowledge sharing."
    },
    {
        title: "Hands-on Experience",
        description: "Practical experimentation and technical sessions for industry-relevant expertise."
    },
    {
        title: "Interdisciplinary Research",
        description: "Addressing societal challenges through cross-domain innovation."
    },
    {
        title: "Bridging Theory & Practice",
        description: "Connecting academic concepts with real-world engineering through mentorship."
    },
    {
        title: "Guided Mentorship",
        description: "Professional growth under expert faculty mentors."
    },
    {
        title: "Applied Innovation",
        description: "Solution-oriented research addressing industrial and societal needs."
    },
    {
        title: "Professional Excellence",
        description: "Developing a mindset of quality, ethics and competitive standards."
    },
    {
        title: "Global Recognition",
        description: "Striving for excellence placing our research internationally."
    },
    {
        title: "Industry Readiness",
        description: "Equipping students for transition into high-impact roles."
    },
    {
        title: "Research Ecosystem",
        description: "Building a dynamic environment where ideas and opportunities empower student growth."
    }
];

const positions = [
    { top: 25, left: "15%" },    // 360° Development
    { top: 10, left: "45%" },    // Collaborative Learning
    { top: 35, left: "75%" },    // Hands-on Experience

    { top: 155, left: "30%" },   // Interdisciplinary Research
    { top: 140, left: "60%" },   // Bridging Theory & Practice
    { top: 170, left: "90%" }, // Guided Mentorship

    { top: 290, left: "18%" },   // Applied Innovation
    { top: 270, left: "48%" },   // Professional Excellence
    { top: 300, left: "76%" },   // Global Recognition

    { top: 430, left: "35%" },    // Industry Readiness
    { top: 430, left: "62%" }     // Thriving Research Ecosystem (NEW)
];

const colors = [
    "#7dd3fc", "#8660bf", "#a5b4fc", "#7ab0c2",
    "#f9a8d4", "#ca2881", "#e8f136", "#1ce867",
    "#fcd34d", "#5f8ea2", "#94a3b8"
];

const Objectives = () => {

    const [lines, setLines] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    const cardRefs = useRef([]);
    const overlayRefs = useRef([]); // direct DOM refs for hover overlays — no re-render on mousemove
    const circleRef = useRef(null);
    const containerRef = useRef(null);
    const sectionRef = useRef(null);

    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    /* Detect screen size */
    useEffect(() => {
        const resize = () => setIsMobile(window.innerWidth < 768);
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    /* Mobile positions - zigzag layout */
    const mobilePositions = objectives.map((_, i) => {
        const gap = 84;
        const top = 145 + i * gap;
        const left = i % 2 === 0 ? 10 : window.innerWidth / 1.45 - 90;
        return { top, left };
    });

    const finalPositions = isMobile ? mobilePositions : positions;

    useEffect(() => {

        const container = containerRef.current.getBoundingClientRect();
        const circle = circleRef.current.getBoundingClientRect();

        const circleCenterX = circle.left - container.left + circle.width / 2;
        const circleCenterY = circle.top - container.top + circle.height / 2;
        const radius = circle.width / 2;

        const newLines = cardRefs.current.map((card, index) => {

            if (!card) return null;

            const rect = card.getBoundingClientRect();

            const cardCenterX = rect.left - container.left + rect.width / 2;
            const cardCenterY = rect.top - container.top + rect.height / 2;

            /* MOBILE: first two cards connect to circle, rest connect to previous card */
            if (isMobile) {
                if (index === 0 || index === 1) {
                    /* Connect to circle */
                    const angle = Math.atan2(
                        cardCenterY - circleCenterY,
                        cardCenterX - circleCenterX
                    );
                    const startX = circleCenterX + radius * Math.cos(angle);
                    const startY = circleCenterY + radius * Math.sin(angle);
                    return {
                        x1: startX,
                        y1: startY,
                        x2: cardCenterX,
                        y2: cardCenterY
                    };
                } else {
                    /* Connect to previous card */
                    const prevCard = cardRefs.current[index - 1];
                    if (!prevCard) return null;
                    const prevRect = prevCard.getBoundingClientRect();
                    const prevCardCenterX = prevRect.left - container.left + prevRect.width / 2;
                    const prevCardCenterY = prevRect.top - container.top + prevRect.height / 2;
                    return {
                        x1: prevCardCenterX,
                        y1: prevCardCenterY,
                        x2: cardCenterX,
                        y2: cardCenterY
                    };
                }
            } else {
                /* DESKTOP: all cards connect to circle */
                const angle = Math.atan2(
                    cardCenterY - circleCenterY,
                    cardCenterX - circleCenterX
                );
                const offset = 3.3;
                const startX = circleCenterX + (radius - offset) * Math.cos(angle);
                const startY = circleCenterY + (radius - offset) * Math.sin(angle);
                return {
                    x1: startX,
                    y1: startY,
                    x2: cardCenterX,
                    y2: cardCenterY
                };
            }

        });

        setLines(newLines);

    }, [isMobile]);

    // Direct DOM update — no setState, no re-render on every mousemove
    const handleCardMouseMove = (e, index) => {
        const overlay = overlayRefs.current[index];
        if (!overlay) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        overlay.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(16,185,129,0.35), transparent 40%)`;
    };

    return (

        <section
            ref={sectionRef}
            id="objectives"
            className="pt-0 pb-24 bg-white relative overflow-hidden"
        >

            <SplashCursorCard />

            <div className="max-w-7xl mx-auto px-6 relative">

                {/* Title */}

                <div className="text-center mb-6">

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-4xl font-black font-serif inline-block pb-2"
                        style={{
                            background: "linear-gradient(90deg,#0f766e,#10b981,#2dd4bf,#FFD700)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"

                        }}
                    >
                        Objectives of SRL
                    </motion.h2>

                </div>



                <div ref={containerRef} className={`relative ${isMobile ? "h-[1050px]" : "h-[600px]"}`}>

                    {/* Animated Lines */}

                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">

                        {lines.map((line, i) => {

                            if (!line) return null;

                            const midX = (line.x1 + line.x2) / 2;

                            return (

                                <motion.path
                                    key={i}
                                    stroke={colors[i]}
                                    strokeWidth="4"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={
                                        isInView
                                            ? {
                                                pathLength: 1,
                                                d: [
                                                    `M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`,
                                                    `M ${line.x1} ${line.y1} C ${midX + 20} ${line.y1 + 15}, ${midX - 20} ${line.y2 - 15}, ${line.x2} ${line.y2}`,
                                                    `M ${line.x1} ${line.y1} C ${midX - 20} ${line.y1 - 15}, ${midX + 20} ${line.y2 + 15}, ${line.x2} ${line.y2}`,
                                                    `M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`
                                                ]
                                            }
                                            : { pathLength: 0 }
                                    }
                                    transition={{
                                        pathLength: { duration: 0.7, delay: i * 0.7, ease: "easeInOut" },
                                        d: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                />

                            )

                        })}

                    </svg>

                    {/* Center Circle Wrapper for Stable Ref */}
                    <div
                        ref={circleRef}
                        className={isMobile ? "absolute left-[29%] top-[20px] -translate-x-1/2 w-[110px] h-[110px] z-10" : "absolute left-[-110px] top-[240px] w-[170px] h-[170px] z-10"}
                    >
                        <motion.div
                            className="w-full h-full rounded-full border-[7px] border-[#0f766e] bg-white flex items-center justify-center shadow-xl"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            style={isMobile ? { display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 8px #44af8bff, 0 0 18px #61c8a5ff, 0 0 30px #f1f7f555" } : {
                                boxShadow: `
0 0 8px #10b981,
0 0 18px #10b981,
0 0 40px #10b98155,
inset 0 0 10px #10b98144
` }}
                        >
                            <img loading="lazy" decoding="async"
                                src="/innovation1.jpg"
                                alt="innovation"
                                className={isMobile ? "w-[75px] object-contain" : "w-[125px] h-[125px] object-contain"}
                            />
                        </motion.div>
                    </div>

                    {/* Ovals */}

                    {objectives.map((obj, index) => {

                        const pos = finalPositions[index];

                        return (

                            <motion.div
                                key={index}
                                ref={(el) => cardRefs.current[index] = el}
                                onMouseMove={(e) => handleCardMouseMove(e, index)}

                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}

                                transition={{
                                    duration: 0.35,
                                    delay: isMobile ? (index * 0.7 + 0.7) : ((index * 0.7) + 0.75),
                                    ease: "easeOut"
                                }}

                                className={`absolute ${isMobile ? "w-[145px] h-[78px]" : "w-[172px] h-[96px] xl:w-[185px] xl:h-[105px] 2xl:w-[210px] 2xl:h-[118px]"} rounded-[80px] flex flex-col items-center justify-center text-center px-4 bg-[#0f766e] overflow-hidden group`}

                                style={{
                                    top: pos.top,
                                    left: pos.left,
                                    boxShadow: `
0 0 8px #44af8bff,
0 0 18px #61c8a5ff,
0 0 30px #f1f7f555
`,
                                    padding: isMobile ? "8px" : undefined
                                }}
                            >

                                <div
                                    className="absolute inset-0 opacity-40 pointer-events-none"
                                    style={{
                                        background: "linear-gradient(120deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0) 60%)"
                                    }}
                                />

                                <div
                                    ref={(el) => overlayRefs.current[index] = el}
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                />

                                <h3 className={`${isMobile ? "text-[9.5px]" : "text-[12px] 2xl:text-[15px]"} font-bold text-white font-serif leading-tight break-words max-w-full`}>
                                    {obj.title}
                                </h3>

                                <p className={`${isMobile ? "text-[8.5px]" : "text-[10px] 2xl:text-[11px]"} text-white/85 leading-snug mt-1`}>
                                    {obj.description}
                                </p>

                            </motion.div>

                        )

                    })}

                </div>

            </div>

        </section>

    );

};

export default Objectives;