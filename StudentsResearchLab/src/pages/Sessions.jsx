import { motion } from 'framer-motion';

const Sessions = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-40 px-4 sm:px-6 lg:px-8 bg-primary/20 min-h-screen relative overflow-hidden"
        >
            {/* Background patterns to reduce white space */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -mr-64 -mt-64" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#00887b 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-16">
                    <h1 className="text-5xl lg:text-7xl font-black font-serif text-slate-900 mb-6 drop-shadow-sm">SRL Sessions</h1>
                    <div className="w-24 h-2 bg-secondary rounded-full mb-8 shadow-sm" />
                    <p className="text-xl text-slate-700 max-w-2xl leading-relaxed font-light">
                        Discover our curated series of workshops, colloquiums, and technical discussions designed to sharpen your research skills and academic integrity.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-white hover:border-secondary/20 transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -mr-16 -mt-16 rounded-full group-hover:bg-secondary/10 transition-colors duration-500" />
                            <div className="text-secondary font-black text-xs uppercase tracking-[0.2em] mb-6">Upcoming • Session {i}</div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif leading-tight">Advanced Research Methodology & Publication Ethics</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-normal">
                                Deep dive into the fundamental principles of conducting high-impact academic research, focusing on systematic reviews and ethical standards.
                            </p>
                            <button className="flex items-center gap-3 text-secondary font-black text-xs uppercase tracking-widest group">
                                <span className="relative">
                                    Register Now
                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
                                </span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Sessions;
