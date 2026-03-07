import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
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
                    whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(31, 167, 155, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-10 z-50 w-16 h-16 bg-[#1fa79b] hover:bg-[#17877a] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={28} strokeWidth={2.5} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
