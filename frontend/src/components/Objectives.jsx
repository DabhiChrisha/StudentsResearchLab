import React from "react";
import { motion } from "framer-motion";

const objectives = [
    {
        id: "01",
        title: "360° Development",
        description: "Cultivating well-rounded, future-ready achievers prepared for global challenges.",
        group: "Growth",
        color: "bg-teal-50"
    },
    {
        id: "02",
        title: "Collaborative Learning",
        description: "Fostering teamwork through group projects and peer-to-peer knowledge sharing.",
        group: "Collaboration",
        color: "bg-teal-50"
    },
    {
        id: "03",
        title: "Hands-on Experience",
        description: "Practical experimentation and technical sessions for industry-relevant expertise.",
        group: "Technical",
        color: "bg-teal-50"
    },
    {
        id: "04",
        title: "Interdisciplinary Research",
        description: "Addressing societal challenges through cross-domain innovation and methodologies.",
        group: "Research",
        color: "bg-purple-50"
    },
    {
        id: "05",
        title: "Bridging Theory & Practice",
        description: "Connecting academic concepts with real-world engineering through mentorship.",
        group: "Applied",
        color: "bg-emerald-50"
    },
    {
        id: "06",
        title: "Guided Mentorship",
        description: "Professional growth under the expert guidance of dedicated faculty mentors.",
        group: "Growth",
        color: "bg-sky-50"
    },
    {
        id: "07",
        title: "Applied Innovation",
        description: "Solution-oriented research addressing practical industrial and societal needs.",
        group: "Innovation",
        color: "bg-rose-50"
    },
    {
        id: "08",
        title: "Professional Excellence",
        description: "Developing a mindset of quality, ethics, and competitive technical standards.",
        group: "Academic",
        color: "bg-indigo-50"
    },
    {
        id: "09",
        title: "Global Recognition",
        description: "Striving for excellence that places our research on the international stage.",
        group: "Impact",
        color: "bg-orange-50"
    },
    {
        id: "10",
        title: "Industry Readiness",
        description: "Equipping students with confidence for transition into high-impact roles.",
        group: "Career",
        color: "bg-slate-50"
    }
];

const CategoryBadge = ({ children, color }) => (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${color.replace('bg-', 'text-').replace('-50', '-700')} ${color} inline-block mb-2`}>
        {children}
    </span>
);

const Objectives = () => {
    return (
        <section id="objectives" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black tracking-[0.2em] uppercase mb-4"
                    >
                        Our Mission & Goals
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 font-serif tracking-tight"
                    >
                        Objectives of SRL
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed"
                    >
                        Pioneering excellence through a structured mission focused on innovation,
                        growth, and empowerment within the research ecosystem.
                    </motion.p>
                </div>

                {/* UNIFORM GRID OF 10 OBJECTIVES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {objectives.map((obj, index) => (
                        <motion.div
                            key={obj.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, shadow: "0 20px 40px rgba(0,0,0,0.05)" }}
                            className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col h-full group transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[12px] font-black text-slate-200 group-hover:text-secondary/20 transition-colors">
                                    {obj.id}
                                </span>
                                <CategoryBadge color={obj.color}>
                                    {obj.group}
                                </CategoryBadge>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif leading-tight group-hover:text-secondary transition-colors">
                                {obj.title}
                            </h3>

                            <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-grow">
                                {obj.description}
                            </p>

                            <div className="pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-12 h-1 bg-secondary/20 rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Objectives;
