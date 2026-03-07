import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const objectives = [
    {
        id: "01",
        title: "360° Development",
        description: "Cultivating well-rounded, future-ready achievers prepared for global challenges.",
        group: "Growth",
        color: "#0D9488", // Teal
        icon: "🎯"
    },
    {
        id: "02",
        title: "Collaborative Learning",
        description: "Fostering teamwork through group projects and peer-to-peer knowledge sharing.",
        group: "Collaboration",
        color: "#2563EB", // Blue
        icon: "🤝"
    },
    {
        id: "03",
        title: "Hands-on Experience",
        description: "Practical experimentation and technical sessions for industry-relevant expertise.",
        group: "Technical",
        color: "#4F46E5", // Indigo
        icon: "⚙️"
    },
    {
        id: "04",
        title: "Interdisciplinary Research",
        description: "Addressing societal challenges through cross-domain innovation and methodologies.",
        group: "Research",
        color: "#7C3AED", // Purple
        icon: "🔍"
    },
    {
        id: "05",
        title: "Bridging Theory & Practice",
        description: "Connecting academic concepts with real-world engineering through mentorship.",
        group: "Applied",
        color: "#10B981", // Emerald
        icon: "🌉"
    },
    {
        id: "06",
        title: "Guided Mentorship",
        description: "Professional growth under the expert guidance of dedicated faculty mentors.",
        group: "Mentorship",
        color: "#0EA5E9", // Sky
        icon: "👨‍🏫"
    },
    {
        id: "07",
        title: "Applied Innovation",
        description: "Solution-oriented research addressing practical industrial and societal needs.",
        group: "Innovation",
        color: "#E11D48", // Rose
        icon: "💡"
    },
    {
        id: "08",
        title: "Professional Excellence",
        description: "Developing a mindset of quality, ethics, and competitive technical standards.",
        group: "Academic",
        color: "#8B5CF6", // Violet
        icon: "🏆"
    },
    {
        id: "09",
        title: "Global Recognition",
        description: "Striving for excellence that places our research on the international stage.",
        group: "Impact",
        color: "#F59E0B", // Amber
        icon: "🌍"
    },
    {
        id: "10",
        title: "Industry Readiness",
        description: "Equipping students with confidence for transition into high-impact roles.",
        group: "Career",
        color: "#64748B", // Slate
        icon: "🚀"
    }
];

const NeuralTree = () => (
    <svg viewBox="0 0 200 100" className="w-full h-full">
        <motion.path
            d="M100 100 V70 M100 70 L80 50 M100 70 L120 50 M80 50 L70 30 M80 50 L90 30 M120 50 L110 30 M120 50 L130 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        {[
            { x: 70, y: 30 }, { x: 90, y: 30 }, { x: 110, y: 30 }, { x: 130, y: 30 },
            { x: 80, y: 50 }, { x: 120, y: 50 }, { x: 100, y: 70 }
        ].map((point, i) => (
            <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="2"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
            />
        ))}
    </svg>
);

const Objectives = () => {
    const [hovered, setHovered] = useState(null);

    return (
        <section id="objectives" className="py-24 bg-white relative overflow-hidden min-h-[900px] flex flex-col items-center">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-teal-50/30 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-[10px] font-black tracking-[0.2em] uppercase mb-4 border border-teal-100">
                        Our Mission & Goals
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 font-serif tracking-tight">
                        Objectives of SRL
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Pioneering excellence through a structured mission focused on innovation,
                        growth, and empowerment within the research ecosystem.
                    </p>
                </motion.div>

                {/* DESKTOP LAYOUT (Semi-circle) */}
                <div className="hidden lg:block relative h-[600px] mt-20">
                    {/* Central Hub */}
                    <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-white rounded-t-full border-t-8 border-x-8 border-teal-500/10 shadow-[0_-20px_50px_rgba(13,148,136,0.1)] flex flex-col justify-end items-center pb-8 group"
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full border border-gray-100 shadow-xl flex flex-col items-center justify-center p-6 text-center">
                            <div className="text-teal-500 w-24 h-24 mb-2">
                                <NeuralTree />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">SRL Core</span>
                            <div className="text-[8px] text-slate-400 font-bold leading-tight">Innovation Hub</div>
                        </div>
                    </motion.div>

                    {/* Orbiting Cards */}
                    {objectives.map((obj, index) => {
                        const total = objectives.length;
                        const angleRange = 160;
                        const startAngle = 10;
                        const angle = startAngle + (index * (angleRange / (total - 1)));
                        const rad = (angle * Math.PI) / 180;
                        const radius = 420; // Increased radius for more space
                        const x = Math.cos(rad) * radius;
                        const y = -Math.sin(rad) * radius * 0.8; // Flattened ellipse

                        return (
                            <motion.div
                                key={obj.id}
                                className="absolute left-1/2 bottom-0"
                                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                whileInView={{
                                    opacity: 1,
                                    scale: 1,
                                    x: -x,
                                    y: y
                                }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
                                style={{ transformOrigin: "bottom center" }}
                            >
                                <motion.div
                                    className={`relative -translate-x-1/2 -translate-y-1/2 w-48 p-5 bg-white rounded-[2rem] shadow-lg border border-gray-100 cursor-pointer transition-all duration-300
                                        ${hovered === obj.id ? 'z-50 scale-110 shadow-2xl ring-2 ring-teal-500/20' : 'z-10 grayscale-[0.3] opacity-80 hover:opacity-100 hover:grayscale-0'}
                                    `}
                                    onMouseEnter={() => setHovered(obj.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    whileHover={{ y: -10 }}
                                >
                                    {/* Connection Line */}
                                    <div
                                        className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-t from-teal-500/30 to-transparent"
                                        style={{ height: `${radius - Math.abs(y)}px`, transform: `rotate(${-angle + 90}deg)`, transformOrigin: "top center" }}
                                    />

                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 shadow-sm"
                                            style={{ backgroundColor: `${obj.color}15`, color: obj.color }}
                                        >
                                            {obj.icon}
                                        </div>
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 leading-tight">
                                            {obj.title}
                                        </h4>
                                        <AnimatePresence>
                                            {hovered === obj.id && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-[10px] text-slate-500 leading-relaxed font-medium"
                                                >
                                                    {obj.description}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                        <div className="text-[10px] font-bold text-slate-300 mt-2">{obj.id}</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* MOBILE / TABLET LAYOUT (Modern Grid) */}
                <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 pb-20">
                    {objectives.map((obj, index) => (
                        <motion.div
                            key={obj.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
                        >
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                                style={{ backgroundColor: `${obj.color}15`, color: obj.color }}
                            >
                                {obj.icon}
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-2">
                                {obj.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                {obj.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
        </section>
    );
};

export default Objectives;
