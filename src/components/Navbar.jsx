import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import JoinUsButton from "./JoinUsButton";
import JoinUsModal from "./JoinUsModal";

// Assets from public directory
import srlLogo from "/SRL Logo.svg";
const mmpsrpcLogo = "/mmpsrpc.png";
const svkmLogo = "/svkm.png";
const ksvLogo = "/ksv.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Requested Sequence: SRL Sessions | Achievements | Researchers | Leaderboard | Join Us | Appointment
    const menuItems = [
        { label: "SRL Sessions", path: "/sessions" },
        { label: "Achievements", path: "/achievements" },
        { label: "Researchers", path: "/researchers" },
        { label: "Leaderboard", path: "/leaderboard" },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#134E4A]/95 backdrop-blur-md shadow-lg h-[75px]' : 'bg-[#134E4A] h-[88px]'}`}>
                <div className="max-w-[1536px] mx-auto px-4 sm:px-8 h-full font-sans">
                    <div className="flex items-center h-full">

                        {/* LEFT — SRL Identity (No 'Lab' written underneath) */}
                        <Link to="/" className="flex items-center gap-3 shrink-0 group">
                            <img
                                src={srlLogo}
                                alt="SRL"
                                className="h-10 sm:h-12 object-contain group-hover:rotate-6 transition-transform"
                            />
                            <span className="hidden sm:block text-2xl font-black text-white tracking-tighter">
                                SRL
                            </span>
                        </Link>

                        {/* RIGHT SECTION — TABS + BUTTONS + PARTNERS */}
                        <div className="hidden xl:flex items-center ml-auto gap-8">
                            {/* NAVIGATION TABS (Moved to right side) */}
                            <div className="flex items-center gap-6">
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
                            </div>

                            {/* ACTION BUTTONS (Single line each) */}
                            <div className="flex items-center gap-4">
                                <JoinUsButton
                                    onClick={() => setIsModalOpen(true)}
                                    className="whitespace-nowrap px-8"
                                />
                                <NavLink
                                    to="/appointment"
                                    className={({ isActive }) =>
                                        `text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full transition-all border-2 whitespace-nowrap
                                        ${isActive ? 'bg-white text-[#134E4A] border-white font-bold' : 'bg-transparent text-white border-white/30 hover:bg-white hover:text-[#134E4A] hover:border-white hover:shadow-lg'}`
                                    }
                                >
                                    SRL Appointment System
                                </NavLink>
                            </div>

                            {/* PARTNER LOGOS */}
                            <div className="flex items-center gap-5 pl-8 border-l border-white/20 shrink-0">
                                <img src={svkmLogo} alt="SVKM" className="h-10 w-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
                                <img src={ksvLogo} alt="KSV" className="h-10 w-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
                                <img src={mmpsrpcLogo} alt="MMPSRPC" className="h-10 w-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
                            </div>
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
                            className="xl:hidden bg-[#134E4A] shadow-2xl overflow-hidden border-t border-white/10"
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

                                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                    <JoinUsButton onClick={() => { setIsModalOpen(true); setOpen(false); }} className="w-full justify-center py-4" />
                                    <NavLink
                                        to="/appointment"
                                        onClick={() => setOpen(false)}
                                        className="block w-full bg-white text-[#134E4A] text-center py-4 rounded-full font-black uppercase tracking-widest hover:bg-opacity-90 transition-all font-sans"
                                    >
                                        SRL Appointment System
                                    </NavLink>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <JoinUsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Navbar;
