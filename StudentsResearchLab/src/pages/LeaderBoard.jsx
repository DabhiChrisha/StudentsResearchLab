import { motion } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';

const LeaderBoard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-primary/20 min-h-screen"
        >
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-black uppercase tracking-[0.2em] mb-4">
                        <Star size={14} /> Merit Rankings <Star size={14} />
                    </div>
                    <h1 className="text-5xl font-black font-serif text-slate-900 mb-4">Research LeaderBoard</h1>
                    <p className="text-slate-500">Recognizing excellence in scholarly contribution and consistent academic engagement.</p>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rank => (
                        <div
                            key={rank}
                            className={`flex items-center gap-6 p-6 rounded-3xl transition-all border 
                ${rank <= 3 ? 'bg-white border-accent-gold/30 shadow-xl scale-[1.02]' : 'bg-white/50 border-slate-200'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl
                ${rank === 1 ? 'bg-accent-gold text-white rotate-6' :
                                    rank === 2 ? 'bg-slate-300 text-white -rotate-6' :
                                        rank === 3 ? 'bg-orange-400 text-white rotate-2' : 'bg-slate-100 text-slate-400'}`}>
                                {rank === 1 ? <Trophy size={20} /> : rank === 2 ? <Medal size={20} /> : rank === 3 ? <Medal size={20} /> : rank}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 font-serif">Aarav Patel</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enrollment: 12345678 • SVKM</p>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-black text-secondary">{(1200 - rank * 50).toLocaleString()}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Research Points</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default LeaderBoard;
