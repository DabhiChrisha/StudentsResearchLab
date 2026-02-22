import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import HeadSRL from '../components/HeadSRL';
import Objectives from '../components/Objectives';
import { Target, Users, TrendingUp, History, UserCheck, Star } from 'lucide-react';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
        >
            {/* 1. Hero Section */}
            <Hero />

            {/* 2. Founders Section */}
            <section id="founders" className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black tracking-widest uppercase mb-6">
                            Visionary Leadership
                        </div>
                        <h2 className="text-4xl lg:text-7xl font-black font-serif text-slate-900 mb-6">Meet Our Founders</h2>
                        <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full mb-8" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="group bg-slate-50 rounded-[3rem] p-10 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all"
                            >
                                <div className="aspect-square bg-slate-200 rounded-[2.5rem] mb-8 overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-serif text-4xl">F{i}</div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">Founder Name</h3>
                                <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-6 underline decoration-primary-dark underline-offset-4">Executive Director</p>
                                <p className="text-slate-500 font-light leading-relaxed">
                                    Leading the institution with a vision for standardized global education and pioneering research methodologies.
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Head SRL Profile */}
            <HeadSRL />

            {/* 4. Objectives Section */}
            <Objectives />

            {/* 5. Timeline Section */}
            <section id="timeline" className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl lg:text-7xl font-black font-serif text-slate-900 mb-6">Our Journey</h2>
                        <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
                    </div>

                    <div className="space-y-16">
                        {[
                            { year: '2024', title: 'The Foundation', desc: 'SRL was established to centralize research activities across major institutes.' },
                            { year: '2025', title: 'Global Integration', desc: 'Started collaborations with international journals and merit frameworks.' },
                            { year: '2026', title: 'The Digital Wave', desc: 'Launch of the central appointment system and digital leaderboard.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-10 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-secondary font-black text-2xl group-hover:bg-secondary group-hover:text-white transition-all">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 w-px bg-slate-300 mt-6" />
                                </div>
                                <div className="pt-2 pb-12">
                                    <span className="text-secondary font-black mb-2 block">{item.year}</span>
                                    <h3 className="text-3xl font-bold text-slate-900 font-serif mb-4">{item.title}</h3>
                                    <p className="text-slate-500 text-lg leading-relaxed font-light max-w-2xl">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Impact Metrics */}
            <section id="impact" className="py-32 px-4 bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/graphy.png')` }} />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { label: 'Active Researchers', value: '500+' },
                            { label: 'Papers Published', value: '120+' },
                            { label: 'Patent Filings', value: '15' },
                            { label: 'Awards Won', value: '45' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-7xl font-black text-secondary mb-4 font-serif leading-none tracking-tighter">
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
