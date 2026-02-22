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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
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

    const menuItems = [
        { label: "Home", path: "/" },
        {
            label: "About Us",
            path: "#",
            submenu: [
                { label: "MMPSRPC", path: "/organization/mmpsrpc" },
                { label: "KSV", path: "/organization/ksv" },
                { label: "SVKM", path: "/organization/svkm" },
                { label: "Contact Us", path: "/contact" },
            ],
        },
        { label: "Research", path: "/researchers" },
        { label: "Activities", path: "/achievements" },
        { label: "Sessions", path: "/sessions" },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg h-[75px]' : 'bg-primary h-[88px]'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full font-sans">
                    <div className="flex items-center h-full relative">

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

                        {/* CENTER — DESKTOP MENU */}
                        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
                            {menuItems.map((item) =>
                                item.submenu ? (
                                    <div
                                        key={item.label}
                                        className="relative group"
                                        onMouseEnter={() => setDropdownOpen(true)}
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <button
                                            className={`
                                                relative font-bold text-[11px] uppercase tracking-widest transition-colors hover:text-white flex items-center gap-1 whitespace-nowrap
                                                ${dropdownOpen || location.pathname.includes("/about") || location.pathname.includes("/organization")
                                                    ? "text-white"
                                                    : "text-white/80"
                                                }
                                            `}
                                        >
                                            {item.label}
                                            <svg
                                                className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>

                                            {/* Underline Effect */}
                                            <div className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-300 ${(dropdownOpen || location.pathname.includes("/about") || location.pathname.includes("/organization")) ? 'w-full' : 'w-0'}`} />
                                        </button>

                                        {/* DESKTOP DROPDOWN */}
                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 overflow-hidden border border-slate-100"
                                                >
                                                    {item.submenu.map((subItem) => (
                                                        <Link
                                                            key={subItem.label}
                                                            to={subItem.path}
                                                            className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:bg-primary/10 hover:text-primary transition-all"
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
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
                                )
                            )}
                        </div>

                        {/* RIGHT — ACTIONS & LOGOS */}
                        <div className="ml-auto hidden lg:flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <JoinUsButton onClick={() => setIsModalOpen(true)} />
                                <NavLink
                                    to="/appointment"
                                    className={({ isActive }) =>
                                        `text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-all border-2
                                        ${isActive ? 'bg-white text-primary border-white' : 'bg-transparent text-white border-white/30 hover:bg-white hover:text-primary hover:border-white hover:shadow-lg'}`
                                    }
                                >
                                    Appointment System
                                </NavLink>
                            </div>

                            <div className="flex items-center gap-3 pl-4 border-l border-white/20 shrink-0">
                                <img src={svkmLogo} alt="SVKM" className="h-8 w-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                                <img src={ksvLogo} alt="KSV" className="h-8 w-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                                <img src={mmpsrpcLogo} alt="MMPSRPC" className="h-8 w-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* MOBILE MENU TOGGLE */}
                        <button
                            className="lg:hidden ml-auto text-white p-2"
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
                            className="lg:hidden bg-primary shadow-2xl overflow-hidden border-t border-white/10"
                        >
                            <div className="flex flex-col px-6 py-8 gap-5">
                                {menuItems.map((item) =>
                                    item.submenu ? (
                                        <div key={item.label} className="space-y-3">
                                            <button
                                                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                                                className="w-full flex items-center justify-between text-base font-black uppercase tracking-widest text-white/80"
                                            >
                                                {item.label}
                                                <svg
                                                    className={`w-5 h-5 transition-transform duration-200 ${mobileDropdownOpen ? "rotate-180" : ""}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <AnimatePresence>
                                                {mobileDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="flex flex-col gap-3 pl-4 border-l-2 border-white/20"
                                                    >
                                                        {item.submenu.map((subItem) => (
                                                            <Link
                                                                key={subItem.label}
                                                                to={subItem.path}
                                                                onClick={() => setOpen(false)}
                                                                className="text-white/60 hover:text-white text-sm font-bold uppercase tracking-wider py-1 transition-colors"
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
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
                                    )
                                )}

                                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                    <JoinUsButton onClick={() => { setIsModalOpen(true); setOpen(false); }} className="w-full justify-center py-4" />
                                    <NavLink
                                        to="/appointment"
                                        onClick={() => setOpen(false)}
                                        className="block w-full bg-white text-primary text-center py-4 rounded-full font-black uppercase tracking-widest hover:bg-opacity-90 transition-all font-sans"
                                    >
                                        Appointment System
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
