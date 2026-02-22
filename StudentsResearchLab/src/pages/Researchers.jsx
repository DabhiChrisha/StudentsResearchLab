import { motion } from 'framer-motion';

const Researchers = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-40 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen relative overflow-hidden"
        >
            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -ml-48" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary-dark/20 blur-[120px] rounded-full -mr-48" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black tracking-widest uppercase mb-6">
                            Academic Roster
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black font-serif text-slate-900 mb-6 tracking-tight leading-none">The Minds Behind <br /><span className="text-secondary">Innovation</span></h1>
                        <p className="text-slate-500 text-lg leading-relaxed font-light">Our lab is powered by curious minds dedicated to solving real-world challenges through systematic research, mentorship, and cross-functional collaboration.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {['All Researchers', 'CSE', 'IT', 'Mechanical', 'Electrical'].map((tab, idx) => (
                            <button
                                key={tab}
                                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all 
                                    ${idx === 0 ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'bg-white text-slate-400 border border-slate-200 hover:border-secondary/50 hover:text-secondary'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="group"
                        >
                            <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden mb-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-white group-hover:shadow-2xl group-hover:shadow-secondary/5 transition-all duration-500 relative">
                                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                    <div className="text-slate-200 font-serif text-8xl font-black select-none opacity-20 group-hover:scale-110 transition-transform duration-700">SRL</div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="px-4">
                                <h3 className="text-2xl font-bold text-slate-800 font-serif mb-1 group-hover:text-secondary transition-colors">Dr. Aditi Sharma</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Senior Research Fellow • CSE</p>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-white transition-colors cursor-pointer text-xs">LN</div>
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-white transition-colors cursor-pointer text-xs">GH</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Researchers;
