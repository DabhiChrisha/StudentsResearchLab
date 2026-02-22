import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import JoinUsButton from './JoinUsButton';
import JoinUsModal from './JoinUsModal';

// Using local SVG logo from public/src
import srlLogo from "/SRL Logo.svg";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'SRL Sessions', path: '/sessions' },
        { name: 'Achievements', path: '/achievements' },
        { name: 'Researchers', path: '/researchers' },
        { name: 'LeaderBoard', path: '/leaderboard' },
    ];

    const handleLogoClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
            // Navigate takes a moment, scroll to top on the next loop
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 100);
        }
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg py-2' : 'bg-primary py-4'
                    }`}
            >
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">

                        {/* Left: Logo - Clicking navigates to / or scrolls to top */}
                        <a
                            href="/"
                            className="flex-shrink-0 flex items-center gap-3 group cursor-pointer"
                            onClick={handleLogoClick}
                        >
                            <img src={srlLogo} alt="SRL Logo" className="w-10 h-10 object-contain group-hover:rotate-6 transition-transform drop-shadow-sm" />
                            <div className="flex flex-col">
                                <span className="text-xl font-black font-serif text-slate-800 leading-tight">
                                    SRL
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-secondary font-bold">Lab</span>
                            </div>
                        </a>

                        {/* Center: Navigation - Desktop (Routes, not scroll sections) */}
                        <div className="hidden xl:flex items-center gap-8">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `text-[11px] font-black uppercase tracking-[0.15em] transition-all relative py-2 
                    ${isActive ? 'text-secondary' : 'text-slate-500 hover:text-secondary'}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {item.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navUnderline"
                                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary rounded-full"
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>

                        {/* Right: Actions & Partner Logos */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <JoinUsButton onClick={() => setIsModalOpen(true)} />
                                <NavLink
                                    to="/appointment"
                                    className={({ isActive }) =>
                                        `text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-full transition-all 
                    ${isActive ? 'bg-secondary-dark text-white' : 'bg-secondary text-white hover:bg-secondary-dark hover:shadow-lg'}`
                                    }
                                >
                                    SRL Appointment System
                                </NavLink>
                            </div>

                            <div className="hidden xl:flex items-center gap-4 pl-4 border-l border-slate-300">
                                <Link to="/organization/svkm">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 p-1 hover:shadow-md transition-shadow">
                                        <img src="/svkm.png" alt="SVKM" className="w-full h-full object-contain" />
                                    </div>
                                </Link>
                                <Link to="/organization/ksv">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 p-1 hover:shadow-md transition-shadow">
                                        <img src="/ksv.png" alt="KSV" className="w-full h-full object-contain" />
                                    </div>
                                </Link>
                                <Link to="/organization/mmpsrpc">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 p-1 hover:shadow-md transition-shadow">
                                        <img src="/mmpsrpc.png" alt="MMPSRPC" className="w-full h-full object-contain" />
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="xl:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-xl text-slate-600 hover:text-secondary hover:bg-secondary/10 transition-colors"
                            >
                                {isOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="xl:hidden bg-white border-t border-slate-100 shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 pt-4 pb-10 space-y-4">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) =>
                                            `block w-full text-left py-3 text-lg font-bold uppercase tracking-widest transition-all
                      ${isActive ? 'text-secondary pl-2 border-l-4 border-secondary' : 'text-slate-700'}`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}

                                <div className="pt-6 space-y-4">
                                    <JoinUsButton onClick={() => { setIsModalOpen(true); setIsOpen(false); }} className="w-full justify-center py-5" />
                                    <NavLink
                                        to="/appointment"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full bg-secondary text-white py-5 rounded-full font-black uppercase tracking-widest text-center"
                                    >
                                        SRL Appointment System
                                    </NavLink>
                                </div>

                                <div className="pt-10 flex justify-center gap-6 border-t border-slate-50">
                                    <Link to="/organization/svkm" onClick={() => setIsOpen(false)}>
                                        <img src="/svkm.png" alt="SVKM" className="w-12 h-12 object-contain" />
                                    </Link>
                                    <Link to="/organization/ksv" onClick={() => setIsOpen(false)}>
                                        <img src="/ksv.png" alt="KSV" className="w-12 h-12 object-contain" />
                                    </Link>
                                    <Link to="/organization/mmpsrpc" onClick={() => setIsOpen(false)}>
                                        <img src="/mmpsrpc.png" alt="MMPSRPC" className="w-12 h-12 object-contain" />
                                    </Link>
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
