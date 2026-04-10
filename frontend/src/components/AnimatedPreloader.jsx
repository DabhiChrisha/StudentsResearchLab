import { useEffect } from "react";
import "./AnimatedPreloader.css";
import { motion } from "framer-motion";
import { getImageUrl } from "../lib/imageUrl";

export default function AnimatedPreloader({ finishLoading }) {
    useEffect(() => {
        // Auto-hide after 2.5 seconds
        const timer = setTimeout(() => {
            if (finishLoading) finishLoading();
        }, 1800);
        return () => clearTimeout(timer);
    }, [finishLoading]);

    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="preloader-container"
        >
            {/* Main animated logo background */}
            <div className="preloader-wrapper">
                {/* Outer rotating ring */}
                <div className="rotating-ring ring-outer-1"></div>
                <div className="rotating-ring ring-outer-2"></div>
                <div className="rotating-ring ring-outer-3"></div>

                {/* Center logo */}
                <div className="logo-wrapper">
                    <img loading="lazy" decoding="async" src={getImageUrl("/SRL.svg")} alt="SRL Logo" className="animated-logo" />
                    {/* Pulse effect */}
                    <div className="pulse-ring"></div>
                </div>

                {/* Loading text dots */}
                <div className="loading-text">
                    <span className="dot dot-1">•</span>
                    <span className="dot dot-2">•</span>
                    <span className="dot dot-3">•</span>
                </div>
            </div>

            {/* Background blur */}
            <div className="preloader-blur"></div>
        </motion.div>
    );
}
