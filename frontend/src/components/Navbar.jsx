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

    // Exact Sequence: 1. Home | 2. SRL Sessions | 3. Achievements | 4. Activities | 5. Publications | 6. Researchers | 7. Leaderboard | 8. About Us
    const menuItems = [
        { label: "Home", path: "/" },
        { label: "SRL Sessions", path: "/sessions" },
        { label: "Achievements", path: "/achievements" },
        { label: "Activities", path: "/activities" },
        { label: "Publications", path: "/publications" },
        { label: "Researchers", path: "/researchers" },
        { label: "Leaderboard", path: "/leaderboard" },
    ];

    const institutionalLinks = [
        { label: "SVKM", path: "/organization/svkm", isExternal: false },
        { label: "KSV", path: "/organization/ksv", isExternal: false },
        { label: "MMPSRPC", path: "/organization/mmpsrpc", isExternal: false },
        { label: "IEEE", path: "/organization/ieee", isExternal: false },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-md py-2' : 'bg-[#FAF9F6] py-3.5'}`}>
                {/* MAIN CONTAINER */}
                <div className="max-w-[1700px] mx-auto w-full flex items-center justify-between px-3 md:px-6 lg:px-8">

                    {/* WRAPPER 1: LEFT (Logo & Site Title) */}
                    <Link to="/" className="flex items-center gap-1.5 md:gap-3 group shrink-0 min-w-0">
                        <div className="w-[48px] h-[48px] md:w-[52px] md:h-[52px] lg:w-[60px] lg:h-[60px] xl:w-[70px] xl:h-[70px] -my-[6px] md:-my-[8px] xl:-my-[11px] bg-white rounded-full p-0.5 lg:p-1 flex items-center justify-center shadow-[0_0_15px_rgba(255,230,100,0.4)] lg:shadow-[0_0_20px_rgba(255,230,100,0.3)] shrink-0 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,210,100,0.5)]">
                            <img src={srlLogo} alt="SRL" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <h1 className="text-teal-900 font-serif font-bold text-[10px] md:text-[14px] lg:text-[13px] xl:text-[16px] tracking-tight leading-tight whitespace-nowrap m-0">
                                Students Research Lab <span className="text-teal-600">(SRL)</span>
                            </h1>
                            <p className="text-teal-800/80 font-sans font-semibold text-[7px] md:text-[9px] lg:text-[8px] xl:text-[10px] uppercase tracking-[0.14em] whitespace-nowrap leading-tight m-0">
                                MMPSRPC, KSV
                            </p>
                        </div>
                    </Link>

                    {/* WRAPPER 2: CENTER-RIGHT (Navigation Links) */}
                    <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-2 xl:px-4">
                        <div className="flex items-center justify-center w-full max-w-[850px] gap-x-1 sm:gap-x-2 xl:gap-x-4 2xl:gap-x-6">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className={({ isActive }) => `
                                    nav-link text-[10px] xl:text-[11px] 2xl:text-[13px] font-semibold whitespace-nowrap tracking-[0.01em] xl:tracking-[0.03em]
                                    ${isActive ? "text-teal-700 active" : "text-teal-900/70 hover:text-teal-900"}
                                `}
                                >
                                    {item.label}
                                </NavLink>
                            ))}

                            {/* About Us Dropdown */}
                            <div
                                className="relative group"
                                ref={dropdownRef}
                                onMouseEnter={() => setIsAboutHovered(true)}
                                onMouseLeave={() => setIsAboutHovered(false)}
                            >
                                <button
                                    onClick={() => setIsAboutClicked(!isAboutClicked)}
                                    className={`flex items-center gap-0.5 py-1 text-[10px] xl:text-[11px] 2xl:text-[13px] font-sans font-semibold transition-all whitespace-nowrap tracking-[0.01em] xl:tracking-[0.03em] relative group/aboutlink ${isAboutActive || isAboutClicked ? 'text-teal-700' : 'text-teal-900/70 hover:text-teal-900'}`}
                                >
                                    About Us <ChevronDown size={14} className={`transition-transform duration-300 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                                    <span className={`absolute bottom-[-2px] left-0 h-[3px] bg-teal-600 transition-all duration-300 ${isAboutActive || isAboutClicked ? 'w-full' : 'w-0 group-hover/aboutlink:w-full'}`}></span>
                                </button>
                                <AnimatePresence>
                                    {aboutDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-2xl rounded-xl overflow-hidden py-2 mt-2 border border-teal-50"
                                        >
                                            {institutionalLinks.map((link) => (
                                                link.isExternal ? (
                                                    <a key={link.label} href={link.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsAboutClicked(false)} className="block px-6 py-3 text-sm font-bold text-gray-700 hover:bg-teal-50 hover:text-[#0D9488] transition-all">
                                                        {link.label}
                                                    </a>
                                                ) : (
                                                    <Link key={link.label} to={link.path} onClick={() => setIsAboutClicked(false)} className="block px-6 py-3 text-sm font-bold text-gray-700 hover:bg-teal-50 hover:text-[#0D9488] transition-all">
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
                    <div className="flex items-center justify-end gap-x-2 xl:gap-x-3 shrink-0">
                        <div className="hidden lg:flex items-center gap-x-2 xl:gap-x-3">
                            <Link to="/join" className="relative bg-[#F5F2E1] text-[#134E4A] hover:bg-[#E8E4D0] transition-colors rounded-full shadow-md py-1.5 lg:py-2 px-3 xl:px-5 text-[10px] xl:text-[12px] uppercase tracking-wider font-bold overflow-hidden group">
                                <span className="relative z-10">Join Us</span>
                                {/* Shine Animation */}
                                <span className="absolute left-[-75%] top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80 animate-shine-join" />
                                <style>{`
                                    @keyframes shine {
                                        0% { left: -75%; }
                                        60% { left: 120%; }
                                        100% { left: 120%; }
                                    }
                                    .animate-shine-join {
                                        animation: shine 2.1s linear infinite;
                                        animation-delay: 0.1s;
                                    }
                                    .animate-shine-appoint {
                                        animation: shine 1.8s linear infinite;
                                        animation-delay: 0.3s;
                                    }
                                `}</style>
                            </Link>
                            <a href="https://appointment.mmpsrpc.in/" target="_blank" rel="noopener noreferrer" className="relative bg-[#E0F2F1] text-[#0D9488] border border-teal-100 hover:bg-[#B2DFDB] transition-colors shadow-sm rounded-full py-1.5 lg:py-2 px-3 xl:px-5 text-[10px] xl:text-[12px] uppercase tracking-wider font-bold overflow-hidden group">
                                <span className="relative z-10">Appointment</span>
                                <span className="absolute left-[-75%] top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80 animate-shine-appoint" />
                            </a>
                        </div>

                        {/* Partner logos visible from xl+ */}
                        <div className="hidden xl:flex items-center gap-x-2.5 2xl:gap-x-6 border-l border-teal-900/10 pl-2.5 2xl:pl-6 shrink-0">
                            <a href="https://www.svkm.org.in/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                                <img src={svkmLogo} alt="SVKM" className="h-8 xl:h-10 2xl:h-14 w-auto object-contain" />
                            </a>
                            <a href="https://www.ksv.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                                <img src={ksvLogo} alt="KSV" className="h-8 xl:h-10 2xl:h-14 w-auto object-contain" />
                            </a>
                            <a href="https://www.mmpsrpc.in/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                                <img src={mmpsrpcLogo} alt="MMPSRPC" className="h-8 xl:h-10 2xl:h-14 w-auto object-contain" />
                            </a>
                        </div>

                        {/* Mobile Toggle */}
                        <button onClick={() => setOpen(true)} className="lg:hidden text-teal-900 p-2 hover:bg-teal-50 rounded-lg transition-colors touch-target" aria-label="Open menu">
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE DRAWER */}
            {/* MOBILE DRAWER (Always mounted for 60fps hardware accelerated sliding) */}
            <div
                className={`fixed inset-0 z-[200] xl:hidden transition-opacity duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                aria-hidden={!open}
            >
                {/* Backdrop overlay */}
                <div
                    onClick={closeSidebar}
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ease-out ${open ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Drawer panel */}
                <div
                    className={`absolute top-0 right-0 w-[85vw] max-w-sm h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-500 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation menu"
                >
                    <div className="p-4 flex justify-between items-center bg-teal-50 border-b border-teal-100 shrink-0">
                        <div className="flex items-center gap-2">
                            <img src={srlLogo} alt="SRL" className="w-10 h-10 object-contain" />
                            <span className="font-bold text-teal-800 text-sm uppercase tracking-tight">Students Lab</span>
                        </div>
                        <button onClick={closeSidebar} className="p-2 text-teal-800 hover:bg-teal-100 rounded-full transition-colors" aria-label="Close menu">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink key={item.label} to={item.path} onClick={closeSidebar} className={({ isActive }) => `block px-4 py-3 rounded-xl font-semibold text-[15px] transition-colors ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                                {item.label}
                            </NavLink>
                        ))}
                        <div className="pt-3 mt-3 border-t border-gray-100">
                            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">About Us</p>
                            {institutionalLinks.map((link) => (
                                <Link key={link.label} to={link.path} onClick={closeSidebar} className="block px-4 py-2.5 rounded-xl font-semibold text-[14px] text-gray-700 hover:bg-gray-50 transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 border-t border-gray-100 space-y-3 bg-gray-50 shrink-0">
                        <Link to="/join" onClick={closeSidebar} className="flex justify-center w-full py-3 bg-[#E6B800] text-white font-bold rounded-xl shadow-sm uppercase text-[13px] tracking-wide active:bg-[#CC0000] focus:outline-none">
                            Join Us
                        </Link>
                        <a href="https://appointment.mmpsrpc.in/" target="_blank" rel="noopener noreferrer" className="flex justify-center w-full py-3 bg-white text-teal-700 border border-teal-200 font-bold rounded-xl shadow-sm uppercase text-[13px] tracking-wide active:bg-gray-50 focus:outline-none">
                            Appointment
                        </a>
                        <div className="flex justify-center items-center gap-4 pt-3 pb-1">
                            <img src={svkmLogo} className="h-8 w-auto object-contain opacity-80" alt="SVKM" />
                            <img src={ksvLogo} className="h-8 w-auto object-contain opacity-80" alt="KSV" />
                            <img src={mmpsrpcLogo} className="h-8 w-auto object-contain opacity-80" alt="MMPSRPC" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
