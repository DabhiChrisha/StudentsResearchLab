import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import HeadSRL from '../components/HeadSRL';
import Objectives from '../components/Objectives';
import Timeline from '../components/Timeline';
import About from '../components/About';

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
            <About />

            {/* 3. Head SRL Profile */}
            <HeadSRL />

            {/* 4. Objectives Section */}
            <Objectives />

            {/* 5. Timeline Section */}
            <Timeline />

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
