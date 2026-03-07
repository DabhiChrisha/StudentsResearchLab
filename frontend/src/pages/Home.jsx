import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import HeadSRL from '../components/HeadSRL';
import Objectives from '../components/Objectives';
import Timeline from '../components/Timeline';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SplashCursor from '../components/react-bits/SplashCursor';
import GradientText from '../components/react-bits/GradientText';

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

            {/* 2. Head SRL Profile */}
            <HeadSRL />

            {/* 3. Objectives Section */}
            <Objectives />

            {/* 4. Timeline Section */}
            <Timeline />

            {/* 5. Impact Metrics */}
            <section id="impact" className="pt-12 pb-32 px-4 bg-[#0b1f35] relative overflow-hidden">
                <SplashCursor />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="mb-16">
                        <GradientText
                            colors={["#16B29D", "#FFFFFF", "#16B29D", "#FFFFFF", "#16B29D"]}
                            animationSpeed={6}
                            showBorder={false}
                            className="text-4xl sm:text-6xl font-bold"
                        >
                            Impact Metrics
                        </GradientText>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">

                        {[
                            { icon: "👨‍🔬", label: "Active Researchers", value: "35+" },
                            { icon: "📄", label: "Papers Published", value: "10+" },
                            { icon: "⚙️", label: "Patent Filings", value: "2" },
                            { icon: "🏆", label: "Awards Won", value: "5+" }
                        ].map((stat, i) => (

                            <div
                                key={i}
                                className="bg-white w-[230px] p-8 rounded-xl shadow-lg hover:-translate-y-2 transition duration-300"
                            >

                                <div className="w-[60px] h-[60px] mx-auto rounded-xl bg-[#e8f6f5] flex items-center justify-center text-2xl">
                                    {stat.icon}
                                </div>

                                <div className="text-4xl font-bold text-[#1fa79b] mt-4">
                                    {stat.value}
                                </div>

                                <div className="text-gray-600 mt-2 text-sm">
                                    {stat.label}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* Scroll to Top Button */}
            <ScrollToTopButton />
        </motion.div>
    );
};

export default Home;
