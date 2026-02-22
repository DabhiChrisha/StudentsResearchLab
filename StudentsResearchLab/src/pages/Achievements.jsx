import { motion } from 'framer-motion';

const Achievements = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-5xl lg:text-7xl font-black font-serif text-slate-900 mb-6 uppercase tracking-tight">Achievements</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Celebrating the milestones and scholarly breakthroughs of our dedicated researchers.</p>
                </div>

                <div className="space-y-8">
                    {[
                        { year: '2025', title: 'Top Institutional Research Award', desc: 'SVKM was recognized for having the highest number of student publications in International Journals.' },
                        { year: '2024', title: 'National Level Hackathon Winners', desc: 'Our SRL team won the Smart India Hackathon in the Educational Tech category.' },
                        { year: '2023', title: 'Patent Filed for AI Ethics Framework', desc: 'Five students from the lab successfully filed a patent for a novel AI Bias detection model.' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-8 bg-primary/10 p-10 rounded-[3rem] items-center border border-primary/20">
                            <div className="text-7xl font-black text-secondary/20 font-serif">{item.year}</div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-slate-800 mb-3 font-serif">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                            <div className="flex -space-x-4">
                                {[1, 2, 3].map(a => <div key={a} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200" />)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Achievements;
