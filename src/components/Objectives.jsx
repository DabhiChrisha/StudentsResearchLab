import React from "react";
import { motion } from "framer-motion";
import srlLogo from "../assets/SRL Logo.png";

const objectives = [
    {
        id: "01",
        title: "360° Development",
        description: "Cultivating well-rounded, future-ready achievers prepared for global challenges.",
        group: "Growth",
        color: "bg-blue-50"
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
        color: "bg-amber-50"
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

const stats = [
    { label: "Active Members", value: "30+" },
    { label: "Research Domains", value: "8+" },
    { label: "Publications", value: "2+" }
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
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
                <div className="text-center mb-20">
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
                        className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 font-serif tracking-tight"
                    >
                        Objectives of SRL
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        Pioneering excellence through a structured mission focused on innovation,
                        growth, and empowerment within the research ecosystem.
                    </motion.p>
                </div>

                {/* BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
                    {/* Stat: Active Members */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100"
                    >
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{stats[0].label}</span>
                        <span className="text-5xl font-black text-slate-900 leading-none">{stats[0].value}</span>
                    </motion.div>

                    {/* Objective: Applied Innovation (L-Shape Span) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        className="lg:col-span-2 bg-white rounded-[2rem] p-8 flex flex-col justify-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative group overflow-hidden"
                    >
                        <CategoryBadge color={objectives[6].color}>{objectives[6].group}</CategoryBadge>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">{objectives[6].title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{objectives[6].description}</p>
                        <div className="absolute -bottom-4 -right-4 text-8xl font-black text-slate-50 group-hover:text-secondary/5 transition-colors">07</div>
                    </motion.div>

                    {/* Stat: Research Domains */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100"
                    >
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{stats[1].label}</span>
                        <span className="text-5xl font-black text-slate-900 leading-none">{stats[1].value}</span>
                    </motion.div>

                    {/* Objective: Guided Mentorship */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2rem] p-8 flex flex-col justify-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative group overflow-hidden"
                    >
                        <CategoryBadge color={objectives[5].color}>{objectives[5].group}</CategoryBadge>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">{objectives[5].title}</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">{objectives[5].description}</p>
                        <div className="absolute -bottom-2 -right-2 text-6xl font-black text-slate-50 group-hover:text-secondary/5 transition-colors">06</div>
                    </motion.div>

                    {/* Central Logo Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-white to-slate-50 rounded-[3rem] shadow-xl border border-white flex flex-col items-center justify-center p-12 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent opacity-60" />
                        <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full p-8 shadow-inner flex items-center justify-center border-8 border-slate-50">
                            <img
                                src={srlLogo}
                                alt="SRL Logo"
                                className="w-full h-auto object-contain drop-shadow-md"
                            />
                        </div>
                        <div className="mt-8 text-center">
                            <h4 className="text-xl font-black text-slate-900 font-serif mb-1 tracking-tighter">STUDENTS RESEARCH LAB</h4>
                            <p className="text-secondary font-bold text-[10px] uppercase tracking-[0.3em]">MMPSRPC, KSV, GANDHINAGAR</p>
                        </div>
                    </motion.div>

                    {/* Objective: Hands-on Experience */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2rem] p-8 flex flex-col justify-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative group overflow-hidden"
                    >
                        <CategoryBadge color={objectives[2].color}>{objectives[2].group}</CategoryBadge>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif uppercase tracking-tight leading-tight">{objectives[2].title}</h3>
                        <div className="absolute -bottom-2 -right-2 text-6xl font-black text-slate-50 group-hover:text-secondary/5 transition-colors">03</div>
                    </motion.div>

                    {/* Objective: Bridging Theory & Practice */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="lg:col-span-2 bg-white rounded-[2rem] p-8 flex flex-col justify-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative group overflow-hidden"
                    >
                        <CategoryBadge color={objectives[4].color}>{objectives[4].group}</CategoryBadge>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">{objectives[4].title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">{objectives[4].description}</p>
                        <div className="absolute -bottom-4 -right-4 text-8xl font-black text-slate-50 group-hover:text-secondary/5 transition-colors">05</div>
                    </motion.div>

                    {/* Stat: Publications */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100"
                    >
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{stats[2].label}</span>
                        <span className="text-5xl font-black text-slate-900 leading-none">{stats[2].value}</span>
                    </motion.div>

                    {/* Secondary Row: The rest of the objectives */}
                    <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                        {[0, 1, 3, 7, 8, 9].map((idx, i) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7 + (i * 0.1) }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-[1.5rem] p-6 shadow-[0_5px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:border-secondary/20 transition-all cursor-default group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black text-slate-300">{objectives[idx].id}</span>
                                    <CategoryBadge color={objectives[idx].color}>{objectives[idx].group}</CategoryBadge>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-2 font-serif leading-tight">{objectives[idx].title}</h4>
                                <p className="text-[11px] text-slate-500 leading-normal hidden sm:block">
                                    {objectives[idx].description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Objectives;
