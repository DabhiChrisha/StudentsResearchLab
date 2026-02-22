import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import JoinUsButton from './JoinUsButton';

// Assets from public directory
import srlLogo from "/SRL Logo.svg";
const mmpsrpcLogo = "/mmpsrpc.png";
const svkmLogo = "/svkm.png";
const ksvLogo = "/ksv.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Requested Sequence: SRL Sessions | Achievements | researchers | Leaderboard | Join Us | Appointment
    const menuItems = [
        { label: "SRL Sessions", path: "/sessions" },
        { label: "Achievements", path: "/achievements" },
        { label: "Researchers", path: "/researchers" },
        { label: "Leaderboard", path: "/leaderboard" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg py-2' : 'bg-[#05877a] py-4'
                    }`}
            >
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">

                        {/* LEFT — SRL Identity */}
                        <Link to="/" className="flex items-center gap-3 shrink-0 group">
                            <img
                                src={srlLogo}
                                alt="SRL"
                                className="h-10 sm:h-12 object-contain group-hover:rotate-6 transition-transform"
                            />
                            <div className="flex flex-col">
                                <span className="hidden sm:block text-base sm:text-xl font-black text-white leading-none tracking-tight">
                                    SRL
                                </span>
                                <span className="hidden sm:block text-[8px] uppercase tracking-[0.3em] text-white/70 font-bold">Lab</span>
                            </div>
                        </Link>

                        {/* CENTER — DESKTOP MENU (SINGLE LINE) */}
                        <div className="hidden xl:flex absolute left-[55%] -translate-x-1/2 items-center gap-5">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `relative font-bold text-[11px] uppercase tracking-widest transition-all hover:text-white whitespace-nowrap
                                        ${isActive ? "text-white" : "text-white/80"}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {item.label}
                                            <div className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`} />
                                        </>
                                    )}
                                </NavLink>
                            ))}

                        {/* Right: Actions & Partner Logos */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <JoinUsButton onClick={() => navigate('/join')} />
                                <NavLink
                                    to="/appointment"
                                    className={({ isActive }) =>
                                        `text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-all border-2
                                        ${isActive ? 'bg-white text-[#05877a] border-white font-bold' : 'bg-transparent text-white border-white/30 hover:bg-white hover:text-[#05877a] hover:border-white hover:shadow-lg'}`
                                    }
                                >
                                    SRL Appointment System
                                </NavLink>
                            </div>
                        </div>

                        {/* RIGHT — LOGOS */}
                        <div className="ml-auto hidden xl:flex items-center gap-5 pl-4 border-l border-white/20 shrink-0">
                            <img src={svkmLogo} alt="SVKM" className="h-10 w-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
                            <img src={ksvLogo} alt="KSV" className="h-10 w-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
                            <img src={mmpsrpcLogo} alt="MMPSRPC" className="h-10 w-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
                        </div>

                        {/* MOBILE MENU TOGGLE */}
                        <button
                            className="xl:hidden ml-auto text-white p-2"
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="xl:hidden bg-[#05877a] shadow-2xl overflow-hidden border-t border-white/10"
                        >
                            <div className="flex flex-col px-6 py-8 gap-5">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setOpen(false)}
                                        className={({ isActive }) =>
                                            `text-base font-black uppercase tracking-widest transition-colors ${isActive ? "text-white" : "text-white/80 hover:text-white"}`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}

                                <div className="pt-6 space-y-4">
                                    <JoinUsButton onClick={() => { navigate('/join'); setOpen(false); }} className="w-full justify-center py-5" />
                                    <NavLink
                                        to="/appointment"
                                        onClick={() => setOpen(false)}
                                        className="block w-full bg-white text-[#05877a] text-center py-4 rounded-full font-black uppercase tracking-widest hover:bg-opacity-90 transition-all font-sans"
                                    >
                                        SRL Appointment System
                                    </NavLink>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

        </>
    );
};

export default Navbar;
