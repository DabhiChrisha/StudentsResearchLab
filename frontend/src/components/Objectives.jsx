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
    }
];

const positions = [
    { top: 55, left: 220 },
    { top: 30, left: 1000 },

    { top: 200, left: 440 },
    { top: 90, left: 720 },

    { top: 390, left: 320 },
    { top: 280, left: 860 },

    { top: 400, left: 640 },
    { top: 400, left: 1100 },

    { top: 570, left: 520 },
    { top: 540, left: 920 }
];

const colors = [
    "#7dd3fc", "#8660bf", "#a5b4fc", "#7ab0c2",
    "#f9a8d4", "#ca2881", "#e8f136", "#1ce867",
    "#fcd34d", "#5f8ea2"
];

const Objectives = () => {

    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [lines, setLines] = useState([]);

    const cardRefs = useRef([]);
    const circleRef = useRef(null);
    const containerRef = useRef(null);
    const sectionRef = useRef(null);

    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {

        const container = containerRef.current.getBoundingClientRect();
        const circle = circleRef.current.getBoundingClientRect();

        const circleCenterX = circle.left - container.left + circle.width / 2;
        const circleCenterY = circle.top - container.top + circle.height / 2;
        const radius = circle.width / 2;

        const newLines = cardRefs.current.map(card => {

            if (!card) return null;

            const rect = card.getBoundingClientRect();

            const cardCenterX = rect.left - container.left + rect.width / 2;
            const cardCenterY = rect.top - container.top + rect.height / 2;

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

        });

        setLines(newLines);

    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursor({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (

        <section
            ref={sectionRef}
            id="objectives"
            className="py-24 bg-slate-50 relative overflow-hidden"
        >

            <SplashCursorCard />

            <div className="max-w-7xl mx-auto px-6 relative">

                {/* Mission Badge */}

                <div className="flex justify-center mb-6">

                    <div className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg text-sm tracking-wide">

                        Our Mission & Goals

                    </div>

                </div>

                {/* Title */}

                <div className="text-center mb-6">

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl font-black font-serif inline-block"
                        style={{
                            background: "linear-gradient(90deg,#0f766e,#10b981,#2dd4bf,#FFD700)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                    >
                        Objectives of SRL
                    </motion.h2>

                </div>

                <p className="text-center text-slate-600 text-lg max-w-3xl mx-auto mb-1 leading-relaxed">

                    Pioneering excellence through a structured mission focused on innovation, growth, and empowerment within the research ecosystem.

                </p>

                <div ref={containerRef} className="relative h-[700px]">

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
                                                    `M ${line.x1} ${line.y1} C ${midX + 60} ${line.y1 + 40}, ${midX - 60} ${line.y2 - 40}, ${line.x2} ${line.y2}`,
                                                    `M ${line.x1} ${line.y1} C ${midX - 60} ${line.y1 - 40}, ${midX + 60} ${line.y2 + 40}, ${line.x2} ${line.y2}`,
                                                    `M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`
                                                ]
                                            }
                                            : { pathLength: 0 }
                                    }
                                    transition={{
                                        pathLength: { duration: 0.7, delay: i * 0.7, ease: "easeInOut" },
                                        d: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                />

                            )

                        })}

                    </svg>

                    {/* Center Circle */}

                    <motion.div
                        ref={circleRef}
                        className="absolute left-[-130px] top-[290px] w-[200px] h-[200px] rounded-full border-[7px] border-[#0f766e] bg-white flex items-center justify-center shadow-xl z-10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        style={{
                            boxShadow: `
0 0 8px #10b981,
0 0 18px #10b981,
0 0 40px #10b98155,
inset 0 0 10px #10b98144
`
                        }}
                    >

                        <img
                            src="/innovation1.jpg"
                            alt="innovation"
                            className="w-[145px] h-[145px] object-contain"
                        />

                    </motion.div>

                    {/* Ovals */}

                    {objectives.map((obj, index) => {

                        const pos = positions[index];

                        return (

                            <motion.div
                                key={index}
                                ref={(el) => cardRefs.current[index] = el}
                                onMouseMove={handleMouseMove}

                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}

                                transition={{
                                    duration: 0.35,
                                    delay: (index * 0.7) + 0.75,
                                    ease: "easeOut"
                                }}

                                className="absolute w-[260px] h-[140px] rounded-[80px] flex flex-col items-center justify-center text-center px-6 bg-[#0f766e] overflow-hidden group"

                                style={{
                                    top: pos.top,
                                    left: pos.left,
                                    boxShadow: `
0 0 8px #44af8bff,
0 0 18px #61c8a5ff,
0 0 30px #f1f7f555
`
                                }}
                            >

                                <div
                                    className="absolute inset-0 opacity-40 pointer-events-none"
                                    style={{
                                        background: "linear-gradient(120deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0) 60%)"
                                    }}
                                />

                                <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
                                    style={{
                                        background: `radial-gradient(600px circle at ${cursor.x}px ${cursor.y}px, rgba(16,185,129,0.35), transparent 40%)`
                                    }}
                                />

                                <h3 className="text-lg font-bold text-white font-serif leading-snug">
                                    {obj.title}
                                </h3>

                                <p className="text-sm text-white/85 leading-relaxed mt-1">
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