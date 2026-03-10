import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import HeadSRL from '../components/HeadSRL';
import Objectives from '../components/Objectives';
import Timeline from '../components/Timeline';
import SplashCursor from '../components/react-bits/SplashCursor';
import GradientText from '../components/react-bits/GradientText';
import Earth from '../components/react-bits/Earth';
import { SparklesCore } from '../components/react-bits/SparklesCore';
import { Suspense } from 'react';

const Home = () => {
    return (
        <div className="flex flex-col">

            {/* 1. Hero Section */}
            <Hero />

            {/* 2. Head SRL Profile */}
            <HeadSRL />

            {/* 3. Objectives Section */}
            <Objectives />

            {/* 4. Timeline Section */}
            <Timeline />

            {/* 5. Impact Metrics */}
            <section id="impact" className="py-12 px-4 bg-white relative overflow-hidden">
                {/* <SplashCursor /> */}

                <div className="max-w-7xl mx-auto">
                    {/* Main Container matching the reference image style */}
                    <div className="bg-[#f2f9f7] rounded-[2rem] lg:rounded-[3rem] 2xl:rounded-[3.5rem] p-6 md:p-10 lg:p-12 2xl:p-16 relative overflow-hidden border border-slate-100 shadow-sm">

                        {/* LEFT: Sparkles Background for the stats side */}
                        <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-none">
                            <SparklesCore
                                id="tsparticlesimpact"
                                background="transparent"
                                minSize={0.6}
                                maxSize={1.4}
                                particleDensity={60}
                                className="w-full h-full"
                                particleColor="#05877a"
                            />
                        </div>

                        {/* Subtle background pattern/texture */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#05877a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                        <div className="relative z-10 flex flex-col lg:flex-row items-stretch gap-12">

                            {/* LEFT: Impact Metrics Stats */}
                            <div className="w-full lg:w-5/12 flex flex-col justify-center">
                                <div className="mb-10">
                                    <h2 className="text-4xl md:text-5xl lg:text-5xl 2xl:text-7xl font-bold font-display bg-gradient-to-r from-slate-900 via-slate-600 to-black bg-clip-text text-transparent animate-gradient-slow mb-6">Impact Metrics</h2>
                                    <p className="text-slate-500 text-lg">Measurable outcomes of our commitment to excellence.</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { icon: "👨‍🔬", label: "Active Researchers", value: "35+" },
                                        { icon: "📄", label: "Papers Published", value: "10+" },
                                        { icon: "⚙️", label: "Patent Filings", value: "2" },
                                        { icon: "🏆", label: "Awards Won", value: "5+" }
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                            className="bg-white/70 backdrop-blur-sm border border-slate-200/50 p-6 rounded-3xl flex flex-col items-start group hover:bg-white transition-colors"
                                        >
                                            <div className="text-5xl font-bold font-display text-teal-800 mb-2">
                                                {stat.value}
                                            </div>
                                            <div className="text-slate-500 text-sm font-medium">
                                                {stat.label}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: Deep Teal Globe Card */}
                            <div className="w-full lg:w-7/12">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="relative h-[380px] md:h-[450px] 2xl:h-[550px] overflow-hidden rounded-[2rem] 2xl:rounded-[3rem] bg-gradient-to-br from-[#cef0ea] via-[#f2e4b3] to-white p-6 md:p-10 2xl:p-14 text-slate-800 shadow-xl border border-white/50 flex flex-col justify-start"
                                >
                                    <h3 className="relative z-20 text-3xl md:text-4xl lg:text-4xl 2xl:text-6xl font-bold tracking-tight leading-[1.1] text-slate-800">
                                        Advancing <br />
                                        knowledge <br />
                                        through <br />
                                        innovative <br />
                                        research.
                                    </h3>

                                    <div className="absolute -right-20 -bottom-20 z-10 w-[400px] md:w-[500px] 2xl:w-[650px] aspect-square flex items-center justify-center pointer-events-auto">
                                        <Suspense fallback={<div className="animate-pulse bg-white/10 rounded-full w-64 h-64" />}>
                                            <Earth
                                                className="w-full h-full"
                                                scale={1.2}
                                                dark={0.8}
                                            />
                                        </Suspense>
                                    </div>

                                    {/* Subtle Overlay Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
