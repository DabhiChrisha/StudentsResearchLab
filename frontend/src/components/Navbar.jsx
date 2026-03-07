import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';

// Logo assets (Paths from public directory)
const srlLogo = "/SRL.svg";
const mmpsrpcLogo = "/mmpsrpc.png";
const svkmLogo = "/svkm.png";
const ksvLogo = "/ksv.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isAboutHovered, setIsAboutHovered] = useState(false);
    const [isAboutClicked, setIsAboutClicked] = useState(false);
    const aboutDropdownOpen = isAboutHovered || isAboutClicked;
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);

    // Active state detection for the "About Us" dropdown
    const isAboutActive =
        location.pathname.includes("/about") ||
        location.pathname.includes("/organization") ||
        location.pathname.includes("/team");

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAboutClicked(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const scrollContainer = document.getElementById('main-content');
        if (!scrollContainer) return;

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(scrollContainer.scrollTop > 10);
                    ticking = false;
                });
                ticking = true;
            }
        };
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    // Body scroll lock: prevent background scroll & compensate scrollbar width
    useEffect(() => {
        if (open) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [open]);

    // Close sidebar on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    const closeSidebar = useCallback(() => setOpen(false), []);

    // Exact Sequence: 1. Home | 2. SRL Sessions | 3. Achievements | 4. Activities | 5. Researchers | 6. Leaderboard | 7. About Us
    const menuItems = [
        { label: "Home", path: "/" },
        { label: "SRL Sessions", path: "/sessions" },
        { label: "Achievements", path: "/achievements" },
        { label: "Activities", path: "/activities" },
        { label: "Researchers", path: "/researchers" },
        { label: "Leaderboard", path: "/leaderboard" },
    ];

    const institutionalLinks = [
        { label: "SVKM", path: "/organization/svkm", isExternal: false },
        { label: "KSV", path: "/organization/ksv", isExternal: false },
        { label: "MMPSRPC", path: "/organization/mmpsrpc", isExternal: false },
    ];

    return (
        <>
            <nav className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-md py-2' : 'bg-[#FAF9F6] py-3.5'}`}>
                {/* MAIN CONTAINER */}
                <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between px-4 lg:px-8">

                    {/* WRAPPER 1: LEFT (Logo & Site Title) */}
                    <div className="flex items-center gap-2 lg:gap-3 shrink min-w-0">
                        <Link to="/" className="flex items-center gap-2 lg:gap-3 group min-w-0">
                            <div className="w-11 h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 bg-white rounded-full p-0.5 lg:p-1 2xl:p-1.5 flex items-center justify-center shadow-md shrink-0 transition-transform group-hover:scale-105">
                                <img src={srlLogo} alt="SRL" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h1 className="text-teal-900 font-black text-[9.5px] lg:text-[11px] xl:text-xs 2xl:text-base tracking-tight leading-none whitespace-nowrap">
                                    Students Research Lab <span className="text-teal-600">(SRL)</span>
                                </h1>
                                <p className="text-teal-800/80 font-bold text-[6px] lg:text-[7px] xl:text-[8px] 2xl:text-[9px] uppercase tracking-widest whitespace-nowrap">
                                    MMPSRPC, Kadi Sarva Vishwavidyalaya
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* WRAPPER 2: CENTER-RIGHT (Navigation Links) */}
                    <div className="hidden lg:flex items-center justify-end flex-1 px-2 xl:px-4 2xl:px-8">
                        <div className="flex items-center gap-x-1 lg:gap-x-2 xl:gap-x-3 2xl:gap-x-4">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className={({ isActive }) => `
                                    relative py-1 text-[9px] xl:text-[10px] 2xl:text-[12px] font-black transition-all duration-300 whitespace-nowrap uppercase tracking-wider
                                    ${isActive ? "text-teal-700" : "text-teal-900/70 hover:text-teal-900"}
                                    group/link
                                `}
                                >
                                    {item.label}
                                    <span className={`absolute bottom-0 left-0 h-[3px] bg-teal-600 transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                                </NavLink>
                            ))}

                            {/* About Us Dropdown */}
                            <div
                                className="relative group/about"
                                ref={dropdownRef}
                                onMouseEnter={() => setIsAboutHovered(true)}
                                onMouseLeave={() => setIsAboutHovered(false)}
                            >
                                <button
                                    onClick={() => setIsAboutClicked(!isAboutClicked)}
                                    className={`flex items-center gap-1 py-1 text-[9px] xl:text-[10px] 2xl:text-[12px] font-black transition-all whitespace-nowrap uppercase tracking-wider relative group/aboutlink ${isAboutActive ? 'text-teal-700' : 'text-teal-900/70 hover:text-teal-900'}`}
                                >
                                    About Us <ChevronDown size={14} className={`transition-transform duration-300 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                                    <span className={`absolute bottom-0 left-0 h-[3px] bg-teal-600 transition-all duration-300 ${isAboutActive ? 'w-full' : 'w-0 group-hover/aboutlink:w-full'}`}></span>
                                </button>
                                <AnimatePresence>
                                    {aboutDropdownOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-2xl rounded-xl overflow-hidden py-2 mt-3 border border-teal-50">
                                            {institutionalLinks.map((link) => (
                                                link.isExternal ? (
                                                    <a key={link.label} href={link.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsAboutClicked(false)} className="block px-6 py-3 text-xs font-black text-gray-700 hover:bg-teal-50 hover:text-[#0D9488] transition-all">
                                                        {link.label}
                                                    </a>
                                                ) : (
                                                    <Link key={link.label} to={link.path} onClick={() => setIsAboutClicked(false)} className="block px-6 py-3 text-xs font-black text-gray-700 hover:bg-teal-50 hover:text-[#0D9488] transition-all">
                                                        {link.label}
                                                    </Link>
                                                )
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* WRAPPER 3: RIGHT (Buttons & Partner Logos) */}
                    <div className="flex items-center justify-end gap-x-2 xl:gap-x-4 shrink-0">
                        <div className="hidden lg:flex items-center gap-x-1.5 xl:gap-x-2">
                            <Link to="/join" className="px-2.5 py-1.5 xl:px-3 xl:py-2 2xl:px-4 2xl:py-2.5 bg-gradient-to-br from-[#FCD34D] via-[#D97706] to-[#B45309] text-white font-black rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all text-[8px] xl:text-[9px] 2xl:text-[11px] whitespace-nowrap uppercase tracking-wider">
                                Join Us
                            </Link>
                            <a href="https://appointment.mmpsrpc.in/" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 xl:px-3 xl:py-2 2xl:px-4 2xl:py-2.5 bg-white text-[#0D9488] border border-teal-100 shadow-sm font-black rounded-full hover:scale-105 active:scale-95 transition-all text-[8px] xl:text-[9px] 2xl:text-[11px] whitespace-nowrap uppercase tracking-wider">
                                Appointment
                            </a>
                        </div>

                        {/* Partner logos only visible on xl+ */}
                        <div className="hidden xl:flex items-center gap-x-2 2xl:gap-x-4 border-l border-teal-900/10 pl-3 2xl:pl-6 shrink-0">
                            <a href="https://www.svkm.org.in/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                                <img src={svkmLogo} alt="SVKM" className="h-8 xl:h-9 2xl:h-12 w-auto object-contain" />
                            </a>
                            <a href="https://www.ksv.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                                <img src={ksvLogo} alt="KSV" className="h-8 xl:h-9 2xl:h-12 w-auto object-contain" />
                            </a>
                            <a href="https://www.mmpsrpc.in/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                                <img src={mmpsrpcLogo} alt="MMPSRPC" className="h-8 xl:h-9 2xl:h-12 w-auto object-contain" />
                            </a>
                        </div>

                        {/* Mobile Toggle — always shows Menu icon; X is inside drawer */}
                        <button onClick={() => setOpen(true)} className="lg:hidden text-teal-900 p-2.5 hover:bg-teal-50 rounded-lg transition-colors shrink-0 touch-target" aria-label="Open menu">
                            <Menu size={32} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE DRAWER — rendered outside <nav> to avoid stacking context conflicts */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={closeSidebar}
                            className="fixed inset-0 bg-black/40 z-[200] lg:hidden"
                            aria-hidden="true"
                        />
                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-[85vw] max-w-md h-[100dvh] bg-white shadow-2xl z-[210] lg:hidden flex flex-col"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Navigation menu"
                        >
                            <div className="p-5 flex justify-between items-center border-b border-gray-100 bg-teal-50/30 shrink-0">
                                <div className="flex items-center gap-3">
                                    <img src={srlLogo} alt="SRL" className="w-11 h-11 object-contain" />
                                    <span className="font-black text-[#0D9488] text-lg uppercase tracking-tighter">Students Lab</span>
                                </div>
                                <button onClick={closeSidebar} className="p-2.5 text-[#0D9488] hover:bg-teal-50 rounded-full transition-colors touch-target" aria-label="Close menu">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-6 px-5 space-y-2 overscroll-contain">
                                {menuItems.map((item) => (
                                    <NavLink key={item.label} to={item.path} onClick={closeSidebar} className={({ isActive }) => `block px-5 py-3.5 rounded-2xl font-bold text-lg transition-all ${isActive ? 'bg-teal-50 text-[#0D9488] border-l-4 border-[#0D9488]' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        {item.label}
                                    </NavLink>
                                ))}
                                <div className="pt-4 mt-2 border-t border-gray-100">
                                    <p className="px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">About Us</p>
                                    {institutionalLinks.map((link) => (
                                        <Link key={link.label} to={link.path} onClick={closeSidebar} className="block px-5 py-3 rounded-2xl font-bold text-base text-gray-600 hover:bg-gray-50 transition-all">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50/50 shrink-0">
                                <Link to="/join" onClick={closeSidebar} className="block w-full py-3.5 text-center bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold rounded-2xl shadow-lg uppercase tracking-wider text-base transition-transform active:scale-95">Join Us Now</Link>
                                <a href="https://appointment.mmpsrpc.in/" className="block w-full py-3.5 text-center bg-[#0D9488] text-white font-bold rounded-2xl shadow-lg uppercase tracking-wider text-base transition-transform active:scale-95">SRL Appointment</a>
                                <div className="flex justify-center items-center gap-6 pt-4 pb-2">
                                    <img src={svkmLogo} className="h-12 w-auto object-contain" alt="SVKM" />
                                    <img src={ksvLogo} className="h-12 w-auto object-contain" alt="KSV" />
                                    <img src={mmpsrpcLogo} className="h-12 w-auto object-contain" alt="MMPSRPC" />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
