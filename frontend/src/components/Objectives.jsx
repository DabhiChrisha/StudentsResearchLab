import React from "react";
import { motion } from "framer-motion";

const objectives = [
    {
        id: "1",
        title: "360° Development",
        description: "Cultivating well-rounded, future-ready achievers.",
        color: "border-teal-400",
        shadow: "shadow-teal-100",
        bg: "bg-teal-50/30"
    },
    {
        id: "2",
        title: "Collaborative Learning",
        description: "Fostering teamwork through group projects.",
        color: "border-sky-400",
        shadow: "shadow-sky-100",
        bg: "bg-sky-50/30"
    },
    {
        id: "3",
        title: "Hands-on Experience",
        description: "Practical experimentation and tech sessions.",
        color: "border-emerald-400",
        shadow: "shadow-emerald-100",
        bg: "bg-emerald-50/30"
    },
    {
        id: "4",
        title: "Interdisciplinary Research",
        description: "Addressing societal challenges through innovation.",
        color: "border-indigo-400",
        shadow: "shadow-indigo-100",
        bg: "bg-indigo-50/30"
    },
    {
        id: "5",
        title: "Bridging Theory & Practice",
        description: "Connecting academic concepts with engineering.",
        color: "border-teal-500",
        shadow: "shadow-teal-200",
        bg: "bg-teal-50/40"
    },
    {
        id: "6",
        title: "Guided Mentorship",
        description: "Professional growth under expert guidance.",
        color: "border-cyan-400",
        shadow: "shadow-cyan-100",
        bg: "bg-cyan-50/30"
    },
    {
        id: "7",
        title: "Applied Innovation",
        description: "Solution-oriented research for industry.",
        color: "border-teal-300",
        shadow: "shadow-teal-50",
        bg: "bg-teal-50/20"
    },
    {
        id: "8",
        title: "Professional Excellence",
        description: "Mindset of quality and ethical standards.",
        color: "border-slate-400",
        shadow: "shadow-slate-100",
        bg: "bg-slate-50/30"
    },
    {
        id: "9",
        title: "Global Recognition",
        description: "Excellence on the international stage.",
        color: "border-teal-600",
        shadow: "shadow-teal-300",
        bg: "bg-teal-50/50"
    },
    {
        id: "10",
        title: "Industry Readiness",
        description: "Confidence for transition into roles.",
        color: "border-emerald-500",
        shadow: "shadow-emerald-200",
        bg: "bg-emerald-50/40"
    }
];

const Objectives = () => {
    // Positioning logic for desktop (semi-circle)
    // We'll distribute them from ~200 degrees to ~(-20) degrees for 10 items
    const getCoordinates = (index, total) => {
        const radius = 380; // Distance from center
        const startAngle = 200; // Left side
        const endAngle = -20; // Right side
        const angle = startAngle - (index * (startAngle - endAngle)) / (total - 1);
        const radian = (angle * Math.PI) / 180;

        // Offset center to bottom
        const x = Math.cos(radian) * radius;
        const y = -Math.sin(radian) * radius;

        return { x, y, angle };
    };

    return (
        <section id="objectives" className="py-32 bg-[#FAF9F6] relative overflow-hidden min-h-[900px] flex items-center justify-center">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
                {/* Section Header */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-[10px] font-black tracking-[0.2em] uppercase mb-4"
                    >
                        Our Mission & Goals
                    </motion.div>
                </div>

                {/* DESKTOP RADIAL LAYOUT */}
                <div className="hidden lg:block relative h-[700px] w-full mt-20">
                    {/* The Central Hub */}
                    <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 z-20">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            {/* Outer Colored Ring */}
                            <div className="w-[450px] h-[450px] rounded-full border-[20px] border-white shadow-2xl bg-gradient-to-t from-teal-500/10 to-transparent flex items-center justify-center relative overflow-hidden">
                                {/* Segmented Arc effect */}
                                <div className="absolute inset-0 border-[15px] border-teal-500/20 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />

                                {/* Inner Content Hub */}
                                <div className="w-[320px] h-[320px] bg-white rounded-full shadow-inner flex flex-col items-center justify-center p-10 text-center border border-teal-50">
                                    <h2 className="text-3xl font-black text-slate-800 font-serif leading-tight uppercase tracking-tight">
                                        Objectives of <br /> <span className="text-teal-600">SRL</span>
                                    </h2>
                                    <div className="w-16 h-1 bg-teal-500/20 my-4 rounded-full" />
                                    <p className="text-sm text-slate-500 font-medium">Empowering students through structured research & innovation.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Orbiting Orbs */}
                    {objectives.map((obj, i) => {
                        const { x, y, angle } = getCoordinates(i, objectives.length);
                        return (
                            <motion.div
                                key={obj.id}
                                initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                                whileInView={{
                                    opacity: 1,
                                    x: x,
                                    y: y,
                                    scale: 1
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15,
                                    delay: i * 0.1
                                }}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    bottom: '125px', // Aligned near the hub top
                                    transform: `translate(-50%, 50%)`
                                }}
                                className="z-30 group"
                            >
                                {/* Connector Arrow (minimal line) */}
                                <div
                                    className="absolute left-1/2 bottom-[-40px] w-px bg-teal-200/50 origin-bottom"
                                    style={{
                                        height: '60px',
                                        transform: `translateX(-50%) rotate(${180 - angle}deg)`
                                    }}
                                />

                                {/* Orb Card */}
                                <motion.div
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    className={`w-36 h-36 rounded-full border-[6px] ${obj.color} ${obj.bg} backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center ${obj.shadow} shadow-lg transition-all duration-300 relative bg-white overflow-hidden`}
                                >
                                    {/* Number Badge */}
                                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 ${obj.color} bg-white flex items-center justify-center text-xs font-black text-slate-700 shadow-md`}>
                                        {obj.id}
                                    </div>

                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-tight mb-2 leading-tight">
                                        {obj.title}
                                    </h3>
                                    <p className="text-[8px] text-slate-500 font-medium leading-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
                                        {obj.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* MOBILE / TABLET LAYOUT (GRID) */}
                <div className="lg:hidden text-left">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-3xl font-black text-slate-900 mb-4 font-serif"
                        >
                            Objectives of <span className="text-teal-600">SRL</span>
                        </motion.h2>
                        <p className="text-slate-500">Pioneering excellence through a structured mission.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {objectives.map((obj, i) => (
                            <motion.div
                                key={obj.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`p-8 rounded-[2.5rem] border-2 ${obj.color} bg-white shadow-sm flex items-start gap-6 group hover:shadow-xl transition-all`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${obj.bg.replace('/30', '/60')} text-slate-800 font-black text-lg border ${obj.color}`}>
                                    {obj.id}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2 font-serif">{obj.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{obj.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Objectives;
