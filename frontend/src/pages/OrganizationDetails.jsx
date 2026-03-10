import { useParams, Navigate, Link } from "react-router-dom";
import { organizationData } from "../data/organizationData";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowLeft, Globe, Mail, Phone, MapPin } from "lucide-react";

const OrganizationDetails = () => {
    const { orgId } = useParams();
    const data = organizationData[orgId];

    if (!data) {
        return <Navigate to="/" replace />;
    }

    return (
        <div key={orgId} className="pt-[96px] lg:pt-[112px] min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F5F1E8' }}>
            {/* Subtle Ambient Depth */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[150px] -mr-64 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-white rounded-full blur-[150px] -ml-64 -mb-32" />
            </div>


            {/* HERO SECTION */}
            <section className="relative py-16 px-6 sm:px-10 lg:px-14 overflow-hidden min-h-[40vh] flex items-center">
                {/* Hero Background Image */}
                {data.heroImage && (
                    <>
                        <img
                            src={data.heroImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-100"
                            style={{ imageRendering: '-webkit-optimize-contrast' }}
                        />
                        {/* Beige Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E8]/80 via-[#F5F1E8]/50 to-[#F5F1E8]/90 z-0 pointer-events-none" />
                    </>
                )}

                {/* Sparkle Pattern Overlay - Header Specific */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-[1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zm30 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative mb-4"
                    >
                        <motion.button
                            onClick={() => {
                                if (data.website) {
                                    window.open(data.website, '_blank');
                                }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative h-28 sm:h-36 cursor-pointer transition-all duration-500 group"
                        >
                            <img
                                src={data.image}
                                alt={data.title}
                                className="h-full w-auto object-contain drop-shadow-md"
                            />
                            {/* Floating redirect icon */}
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#00887b] text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ExternalLink className="w-5 h-5" />
                            </div>
                        </motion.button>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`font-black text-slate-900 mb-6 tracking-tight font-serif drop-shadow-xl ${orgId === 'mmpsrpc' ? 'text-3xl sm:text-4xl lg:text-5xl whitespace-nowrap' : 'text-4xl sm:text-5xl lg:text-7xl'
                            }`}
                        style={{ textShadow: "1px 1px 3px rgba(255,255,255,0.7)" }}
                    >
                        {data.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg sm:text-xl lg:text-2xl font-bold max-w-3xl font-serif italic drop-shadow-md text-slate-800"
                        style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.8)" }}
                    >
                        “{data.subtitle}”
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section className="pb-24 pt-4 px-6 sm:px-10 lg:px-14 relative">
                {/* Soft Gradient Background Transition */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F5F1E8] to-transparent pointer-events-none" />

                <div className="max-w-6xl mx-auto">
                    {/* Description Card - Glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-20"
                    >
                        <div
                            className="relative p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 bg-[#FAF8F3]/70 backdrop-blur-xl hover:-translate-y-2 transition-transform duration-500 group overflow-hidden"
                        >
                            {/* Academic Accent - Feather line */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-[#00887b]/30 to-transparent" />

                            <div className="relative z-10">
                                <div className="space-y-6">
                                    {data.description.map((paragraph, index) => (
                                        <p key={index} className="text-slate-800 leading-[1.7] text-[16px] font-normal font-sans text-justify">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Suble background glow */}
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#00887b]/5 rounded-full blur-3xl" />
                        </div>
                    </motion.div>

                    {/* STATS SECTION */}
                    {data.stats && (
                        <div className="relative mb-24 py-12 px-8 rounded-[3rem] bg-[#e9e4d9]/40 border border-white/20">
                            <div className={`grid grid-cols-1 sm:grid-cols-2 ${data.stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-12 w-full mx-auto max-w-6xl`}>
                                {data.stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                                        className="text-center group"
                                    >
                                        <div className="mb-4 flex justify-center text-[#00887b]/60 group-hover:text-secondary transition-colors duration-300">
                                            {/* Minimal line icon based on stat */}
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h4 className="text-4xl lg:text-5xl font-black text-secondary-dark mb-2 font-sans text-[#006d62]">
                                            {stat.value}
                                        </h4>
                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PERSONALITIES SECTION (Leadership or Founders) */}
                    {data.leadership ? (
                        <div className="mb-24 space-y-40">
                            {data.leadership.map((person, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                    className="mb-24 last:mb-0 relative group"
                                >
                                    <div className="flex flex-col items-center text-center mb-16 relative">
                                        {person.role && (
                                            <span className="text-[#00887b] font-bold text-xs uppercase tracking-[0.4em] mb-4 block">{person.role}</span>
                                        )}
                                        <h2 className="text-4xl lg:text-5xl font-black text-slate-800 font-sans leading-tight">{person.header}</h2>
                                        <div className="mt-4 h-[1px] w-24 bg-[#00887b]/30 mx-auto" />
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start w-full max-w-6xl mx-auto">
                                        {/* Left Side: Photo + Name/Designation */}
                                        <div className="w-full lg:w-[400px] flex flex-col items-center shrink-0">
                                            <div className="relative group mb-8 w-full">
                                                <div className="absolute -inset-4 border border-[#00887b]/20 rounded-[3rem] group-hover:scale-105 transition-transform duration-700" />
                                                <div className="relative p-4 bg-[#FAF8F3] rounded-[2.5rem] shadow-2xl border border-white overflow-hidden group-hover:shadow-[#d4af37]/10 transition-shadow">
                                                    <img
                                                        src={person.image}
                                                        alt={person.name}
                                                        className="w-full h-auto block rounded-[2rem] grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 scale-[1.01] group-hover:scale-[1.05]"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#00887b]/5 rounded-full blur-xl pointer-events-none" />
                                            </div>

                                            <div className="text-center w-full px-4 mt-2">
                                                <h4 className="text-2xl font-black text-slate-900 font-sans mb-1">{person.name}</h4>
                                                <p className="text-xs text-secondary-dark font-bold uppercase tracking-[0.3em] font-sans">{person.designation}</p>
                                            </div>
                                        </div>

                                        {/* Right Side: Message Content */}
                                        <div className="flex-grow flex flex-col justify-start self-start lg:pt-0 pt-0 z-10 px-4 sm:px-8">
                                            <div className="mb-4 relative">
                                                <div className="relative">
                                                    <span className="absolute -top-3 -left-6 text-3xl text-[#00887b]/30 font-serif italic select-none">“</span>
                                                    <div className="text-base lg:text-lg text-slate-900 font-bold leading-relaxed font-serif italic relative z-10 pr-6">
                                                        <span className="inline">{person.mainQuote.trim()}</span>
                                                        <span className="inline text-3xl text-[#00887b]/30 font-serif italic leading-none ml-1">”</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3 lg:ml-12 text-slate-700 leading-relaxed font-normal text-base font-sans text-justify">
                                                {person.message.map((p, pIndex) => (
                                                    <p key={pIndex}>{p}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (data.founders && (
                        <div className="mb-24 relative pt-12">
                            <div className="flex flex-col items-center mb-20">
                                <span className="text-[#00887b] font-bold text-xs uppercase tracking-[0.4em] mb-4">Dedicated to</span>
                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 text-center font-sans">Honoring Our Founders</h2>
                                <div className="mt-6 w-32 h-[1px] bg-[#00887b]/40" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 max-w-5xl mx-auto">
                                {data.founders.map((founder, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: index * 0.2 }}
                                        className="flex flex-col items-center group"
                                    >
                                        <div className="relative mb-10">
                                            {/* Heritage Frame Styling */}
                                            <div className="absolute -inset-4 bg-[#00887b]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            <div className="relative p-5 bg-[#FAF8F3] rounded-3xl shadow-xl border border-white hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2">
                                                <div className="rounded-2xl overflow-hidden border border-slate-100 relative">
                                                    <img
                                                        src={founder.image}
                                                        alt={founder.name}
                                                        className="w-64 md:w-72 h-auto block sepia-[0.3] group-hover:sepia-0 transition-all duration-1000 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-[#00887b]/5 group-hover:bg-transparent transition-colors duration-700" />
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-black text-slate-900 mb-6 font-sans">
                                            {founder.name}
                                        </h3>

                                        <div className="text-slate-500 font-sans text-lg leading-relaxed text-center px-4 py-6 border-t border-b border-[#00887b]/10 relative">
                                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F1E8] px-3 text-[#00887b]/40 font-serif text-3xl">“</span>
                                            {founder.quote}
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#F5F1E8] px-3 text-[#00887b]/40 font-serif text-3xl rotate-180">“</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* MISSION & VISION */}
                    {(data.mission || data.vision) && (
                        <div className="grid md:grid-cols-2 gap-12 mb-32">
                            {data.mission && (
                                <motion.div
                                    initial={{ opacity: 0, x: -60, scale: 0.95 }}
                                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    whileHover={{ y: -10 }}
                                    className="group relative bg-[#FAF8F3]/70 backdrop-blur-md p-8 rounded-[2rem] border-l-8 border-[#00887b] border-r border-t border-b border-white shadow-xl hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="mb-6 text-secondary-dark flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-inner">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 font-sans tracking-tight">Mission</h3>
                                    </div>
                                    <p className="text-slate-700 leading-[1.7] text-[16px] font-normal font-sans">{data.mission}</p>
                                </motion.div>
                            )}
                            {data.vision && (
                                <motion.div
                                    initial={{ opacity: 0, x: 60, scale: 0.95 }}
                                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="group relative bg-[#FAF8F3]/70 backdrop-blur-md p-8 rounded-[2rem] border-l-8 border-[#00887b] border-r border-t border-b border-white shadow-xl hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="mb-6 text-[#00887b] flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-[#00887b]/10 flex items-center justify-center group-hover:bg-[#00887b] group-hover:text-white transition-all duration-500 shadow-inner">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 font-sans tracking-tight">Vision</h3>
                                    </div>
                                    <p className="text-slate-700 leading-[1.7] text-[16px] font-normal font-sans">{data.vision}</p>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* STRATEGIC OBJECTIVES */}
                    {data.objectives && (
                        <div className="mb-32">
                            <div className="flex flex-col items-center mb-16 px-4">
                                <h3 className="text-4xl md:text-5xl font-black text-slate-900 text-center font-sans tracking-tight mb-4">
                                    {data.objectivesTitle || "Institutional Objectives"}
                                </h3>
                                {data.objectivesSubtitle && (
                                    <p className="text-slate-600 font-sans text-lg lg:text-xl text-center max-w-3xl leading-relaxed">
                                        {data.objectivesSubtitle}
                                    </p>
                                )}
                                <div className="mt-8 h-[2px] w-48 bg-gradient-to-r from-transparent via-[#00887b]/30 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {data.objectives.map((obj, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, amount: 0.1 }}
                                        transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                                        whileHover={{ y: -8, backgroundColor: "#FAF8F3" }}
                                        className="p-6 rounded-[1.5rem] bg-[#FAF8F3]/40 backdrop-blur-sm border border-white/50 shadow-md hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                                    >

                                        {/* Number Badge */}
                                        <div className="absolute top-0 right-0 p-4 font-black text-3xl font-serif text-[#00887b]/30 group-hover:scale-125 transition-transform duration-700">
                                            {index + 1}
                                        </div>


                                        <h4 className="text-lg font-bold text-slate-800 mb-2 font-sans leading-snug group-hover:text-secondary-dark transition-colors duration-300 pr-8 relative z-10">
                                            {obj.title}
                                        </h4>
                                        <p className="text-slate-600 font-normal leading-[1.6] text-[15px] group-hover:text-slate-800 font-sans">
                                            {obj.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CORE PRINCIPLES / FEATURES SECTION */}
                    {data.features && (
                        <div className="mb-32">
                            {orgId !== 'svkm' && orgId !== 'ksv' && (
                                <div className="flex items-center gap-6 mb-16">
                                    <h3 className="text-3xl font-black text-slate-900 font-sans whitespace-nowrap tracking-tight">Features</h3>
                                    <div className="h-[1px] flex-grow bg-[#00887b]/20" />
                                </div>
                            )}
                            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${(orgId === 'svkm' || orgId === 'ksv') ? 'mt-8' : ''}`}>
                                {data.features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, amount: 0.1 }}
                                        transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                                        whileHover={{ x: 10, backgroundColor: "#FAF8F3" }}
                                        className="bg-[#FAF8F3]/50 backdrop-blur-sm p-8 rounded-[2rem] border border-white shadow-sm hover:shadow-xl transition-all group flex items-center gap-6"
                                    >
                                        <div className="w-3 h-3 rounded-full bg-[#00887b] shadow-[0_0_10px_rgba(0,136,123,0.4)] group-hover:scale-150 transition-transform duration-500" />
                                        <span className="font-bold text-slate-700 uppercase tracking-[0.2em] text-[11px] font-sans leading-none">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CONTACT & LOCATION SECTION */}
                    {data.contact && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="mt-12"
                        >
                            <div className="text-center mb-16 px-4">
                                <span className="text-[#00887b] font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Connect With Us</span>
                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 font-sans tracking-tight">Contact & Location</h2>
                                <div className="mt-6 h-[1px] w-24 bg-[#00887b]/30 mx-auto" />
                            </div>

                            <div className="grid lg:grid-cols-5 gap-0 rounded-[3rem] overflow-hidden shadow-2xl border border-white border-opacity-30">
                                {/* Left Content Panel */}
                                <div className="lg:col-span-2 p-12 flex flex-col justify-between" style={{ backgroundColor: '#FAF8F3' }}>
                                    <div className="space-y-12">
                                        <div className="flex items-start gap-6 group">
                                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#F5F1E8] border border-[#00887b]/10 flex items-center justify-center group-hover:bg-[#00887b] group-hover:text-white transition-all duration-500">
                                                <svg className="w-5 h-5 text-[#00887b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00887b]/60 mb-2"> Location</p>
                                                <p className="text-slate-800 text-lg leading-relaxed font-sans italic">{data.contact.address}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#F5F1E8] border border-[#00887b]/10 flex items-center justify-center group-hover:bg-[#00887b] group-hover:text-white transition-all duration-500">
                                                <svg className="w-5 h-5 text-[#00887b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00887b]/60 mb-2"> Mail</p>
                                                <a href={`mailto:${data.contact.email}`} className="text-xl font-sans text-secondary-dark hover:text-secondary hover:underline transition-all">
                                                    {data.contact.email}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#F5F1E8] border border-[#00887b]/10 flex items-center justify-center group-hover:bg-[#00887b] group-hover:text-white transition-all duration-500">
                                                <svg className="w-5 h-5 text-[#00887b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00887b]/60 mb-2">Contact Us</p>
                                                <a href={`tel:${data.contact.phone.replace(/[^0-9+]/g, '')}`} className="text-xl font-sans text-secondary-dark hover:text-secondary hover:underline transition-all">
                                                    {data.contact.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-[#00887b]/10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00887b]/60 mb-6">Social Connect</p>
                                        <div className="flex gap-4">
                                            <a
                                                href="https://www.linkedin.com/company/mmpsrpc"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-[#134E4A]/5 flex items-center justify-center text-[#134E4A] hover:bg-[#134E4A] hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.604 2.002 3.604 4.604v5.592z" /></svg>
                                            </a>
                                            <a
                                                href="https://www.linkedin.com/school/kadi-sarva-vishwavidyalaya-gandihnagar/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-[#134E4A]/5 flex items-center justify-center text-[#134E4A] hover:bg-[#134E4A] hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.604 2.002 3.604 4.604v5.592z" /></svg>
                                            </a>
                                            <a
                                                href={data.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-[#134E4A]/5 flex items-center justify-center text-[#134E4A] hover:bg-[#134E4A] hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <Globe className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Map Full Span */}
                                <div className="lg:col-span-3 relative min-h-[450px] overflow-hidden grayscale-[0.5] hover:grayscale-0 transition-all duration-1000">
                                    <iframe
                                        title={`${data.title} Geography`}
                                        src={data.contact.mapEmbed}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full"
                                    />
                                    {/* Map frame overlay */}
                                    <div className="absolute inset-0 pointer-events-none border-[12px] border-white/20" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default OrganizationDetails;
