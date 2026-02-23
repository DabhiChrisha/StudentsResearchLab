import { motion } from 'framer-motion';

const JoinUsButton = ({ onClick, className = "" }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative overflow-hidden bg-accent-gold text-white font-bold py-2.5 px-6 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-300 group ${className}`}
        >
            {/* Shine Sweep Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shine transition-none" />

            <span className="relative z-10 flex items-center gap-2 uppercase tracking-wider text-sm">
                Join Us
            </span>

            {/* Subtle Halo/Glow */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-accent-gold/50 -z-10" />
        </motion.button>
    );
};

export default JoinUsButton;
