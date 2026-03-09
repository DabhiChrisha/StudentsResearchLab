import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const scrollElement = document.getElementById("main-content");

        const toggleVisibility = () => {
            const currentScrollTop = scrollElement ? scrollElement.scrollTop : window.scrollY;

            if (currentScrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Set initial visibility in case the user reloads at a scrolled position.
        toggleVisibility();

        if (scrollElement) {
            scrollElement.addEventListener("scroll", toggleVisibility, { passive: true });
            return () => scrollElement.removeEventListener("scroll", toggleVisibility);
        }

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        const scrollElement = document.getElementById("main-content");

        if (scrollElement) {
            scrollElement.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className="group fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                    aria-label="Scroll to top"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.16)]"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute inset-[5px] sm:inset-[6px] rounded-full bg-[conic-gradient(from_-35deg,_#16B29D_0deg,_#16B29D_58deg,_#d7dfe5_58deg,_#d7dfe5_360deg)]"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute inset-[9px] sm:inset-[11px] rounded-full bg-[#f3f7f8]"
                    />

                    <span className="relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-secondary text-white shadow-[0_10px_20px_rgba(0,136,123,0.35)] transition-colors duration-300 group-hover:bg-secondary-dark">
                        <ArrowUp size={20} strokeWidth={3} />
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
