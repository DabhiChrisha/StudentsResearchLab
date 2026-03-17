import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { organizationData } from '../data/organizationData';
import { Link } from 'react-router-dom';

const About = () => {
    const [openAccordion, setOpenAccordion] = useState(null);
    const founders = organizationData?.svkm?.founders || [];

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <section id="about" className="py-28 bg-[#FAF9F6] relative overflow-hidden">
            {/* Decorative Background Curves */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none">
                    <path d="M-100 600 Q 360 200 720 600 T 1540 600" stroke="#00887b" strokeWidth="1" fill="none" className="opacity-10" />
                    <path d="M-100 200 Q 360 600 720 200 T 1540 200" stroke="#00887b" strokeWidth="1" fill="none" className="opacity-10" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-teal-900 mb-6 font-serif">
                        About Us
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Building a legacy of excellence through dedicated research and academic mentorship under the guidance of our parent institutions.
                    </p>
                </motion.div>

                {/* ACCORDIONS FOR SVKM & KSV */}
                <div className="max-w-4xl mx-auto mb-28 space-y-6">
                    {/* SVKM Accordion */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-[2rem] shadow-xl border border-teal-50 overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                    >
                        {/* Background Image Layer */}
                        {organizationData.svkm.heroImage && (
                            <img
                                src={organizationData.svkm.heroImage}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover filter brightness-[1.1] contrast-[1.05] saturate-[1.1]"
                                style={{ imageRendering: '-webkit-optimize-contrast' }}
                            />
                        )}
                        <button
                            onClick={() => toggleAccordion('svkm')}
                            className="w-full px-8 py-8 flex items-center justify-between text-left group relative z-10"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <img src={organizationData.svkm.image} alt="SVKM" className="h-full object-contain" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-teal-900 font-sans drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">Sarva Vidyalaya Kelavani Mandal (SVKM)</h4>
                                    <p className="text-xs text-teal-800 font-black uppercase tracking-[0.2em] mt-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">Our Founding Trust</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-6 h-6 text-teal-900 transition-transform duration-500 drop-shadow-md ${openAccordion === 'svkm' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openAccordion === 'svkm' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <div className="px-8 pb-8 pt-2">
                                        <div className="h-[1px] w-full bg-teal-50 mb-8" />
                                        <div className="w-full">
                                            <p className="text-gray-800 leading-[1.7] text-[15px] font-normal text-justify">
                                                {organizationData.svkm.description[0]}
                                            </p>
                                        </div>
                                        <div className="mt-8 flex flex-wrap gap-3">
                                            {organizationData.svkm.features.map((f, i) => (
                                                <span key={i} className="px-4 py-1.5 bg-teal-50 text-[10px] font-black text-teal-700 rounded-full uppercase tracking-wider">{f}</span>
                                            ))}
                                        </div>
                                        <div className="mt-8">
                                            <Link to="/organization/svkm" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-900 text-white rounded-full font-bold text-sm hover:bg-teal-800 transition-all shadow-lg hover:shadow-teal-900/20">
                                                Learn More About SVKM <ExternalLink size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* KSV Accordion */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative rounded-[2rem] shadow-xl border border-teal-50 overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                    >
                        {/* Background Image Layer */}
                        {organizationData.ksv.heroImage && (
                            <img
                                src={organizationData.ksv.heroImage}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover filter brightness-[1.1] contrast-[1.05] saturate-[1.1]"
                                style={{ imageRendering: '-webkit-optimize-contrast' }}
                            />
                        )}
                        <button
                            onClick={() => toggleAccordion('ksv')}
                            className="w-full px-8 py-8 flex items-center justify-between text-left group relative z-10"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <img src={organizationData.ksv.image} alt="KSV" className="h-full object-contain" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-teal-900 font-sans drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">Kadi Sarva Vishwavidyalaya (KSV)</h4>
                                    <p className="text-xs text-teal-800 font-black uppercase tracking-[0.2em] mt-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">Our University</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-6 h-6 text-teal-900 transition-transform duration-500 drop-shadow-md ${openAccordion === 'ksv' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openAccordion === 'ksv' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <div className="px-8 pb-8 pt-2">
                                        <div className="h-[1px] w-full bg-teal-50 mb-8" />
                                        <div className="w-full">
                                            <p className="text-gray-800 leading-[1.7] text-[15px] font-normal text-justify">
                                                {organizationData.ksv.description[0]}
                                            </p>
                                        </div>
                                        <div className="mt-8 flex flex-wrap gap-3">
                                            {organizationData.ksv.features.map((f, i) => (
                                                <span key={i} className="px-4 py-1.5 bg-teal-50 text-[10px] font-black text-teal-700 rounded-full uppercase tracking-wider">{f}</span>
                                            ))}
                                        </div>
                                        <div className="mt-8">
                                            <Link to="/organization/ksv" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-900 text-white rounded-full font-bold text-sm hover:bg-teal-800 transition-all shadow-lg hover:shadow-teal-900/20">
                                                Explore KSV University <ExternalLink size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* MMPSRPC Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative rounded-[2rem] shadow-xl border border-teal-50 overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                    >
                        {/* Background Image Layer */}
                        {organizationData.mmpsrpc.heroImage && (
                            <img
                                src={organizationData.mmpsrpc.heroImage}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover filter brightness-[1.1] contrast-[1.05] saturate-[1.1]"
                                style={{ imageRendering: '-webkit-optimize-contrast' }}
                            />
                        )}
                        <button
                            onClick={() => toggleAccordion('mmpsrpc')}
                            className="w-full px-8 py-8 flex items-center justify-between text-left group relative z-10"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <img src={organizationData.mmpsrpc.image} alt="MMPSRPC" className="h-full object-contain" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-teal-900 font-sans drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">M. M. Patel Students Research Project Cell</h4>
                                    <p className="text-xs text-teal-800 font-black uppercase tracking-[0.2em] mt-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">Our Research Hub</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-6 h-6 text-teal-900 transition-transform duration-500 drop-shadow-md ${openAccordion === 'mmpsrpc' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openAccordion === 'mmpsrpc' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <div className="px-8 pb-8 pt-2">
                                        <div className="h-[1px] w-full bg-teal-50 mb-8" />
                                        <div className="w-full">
                                            <p className="text-gray-800 leading-[1.7] text-[15px] font-normal text-justify">
                                                {organizationData.mmpsrpc.description[0]}
                                            </p>
                                        </div>
                                        <div className="mt-8 flex flex-wrap gap-3">
                                            {["Innovation", "Research", "Excellence"].map((f, i) => (
                                                <span key={i} className="px-4 py-1.5 bg-teal-50 text-[10px] font-black text-teal-700 rounded-full uppercase tracking-wider">{f}</span>
                                            ))}
                                        </div>
                                        <div className="mt-8">
                                            <Link to="/organization/mmpsrpc" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-900 text-white rounded-full font-bold text-sm hover:bg-teal-800 transition-all shadow-lg hover:shadow-teal-900/20">
                                                Explore MMPSRPC Cell <ExternalLink size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* IEEE KSV Section */}
                <div className="max-w-4xl mx-auto mb-28">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative rounded-[2rem] shadow-xl border border-teal-50 overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                    >
                        {/* Background Image Layer */}
                        {organizationData.ieee?.heroImage && (
                            <img
                                src={organizationData.ieee.heroImage}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover filter brightness-[1.1] contrast-[1.05] saturate-[1.1]"
                                style={{ imageRendering: '-webkit-optimize-contrast' }}
                            />
                        )}
                        <button
                            onClick={() => toggleAccordion('ieee')}
                            className="w-full px-8 py-8 flex items-center justify-between text-left group relative z-10"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <img src={organizationData.ieee?.image} alt="IEEE KSV" className="h-full object-contain" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-teal-900 font-sans drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">{organizationData.ieee?.title}</h4>
                                    <p className="text-xs text-teal-800 font-black uppercase tracking-[0.2em] mt-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">Our Student Branch</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-6 h-6 text-teal-900 transition-transform duration-500 drop-shadow-md ${openAccordion === 'ieee' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openAccordion === 'ieee' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <div className="px-8 pb-8 pt-2">
                                        <div className="h-[1px] w-full bg-teal-50 mb-8" />
                                        <div className="w-full space-y-4">
                                            {organizationData.ieee?.description?.map((para, i) => (
                                                <p key={i} className="text-gray-800 leading-[1.7] text-[15px] font-normal text-justify">
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                        <div className="mt-8 flex flex-wrap gap-3">
                                            {organizationData.ieee?.features?.map((f, i) => (
                                                <span key={i} className="px-4 py-1.5 bg-teal-50 text-[10px] font-black text-teal-700 rounded-full uppercase tracking-wider">{f}</span>
                                            ))}
                                        </div>
                                        <div className="mt-8">
                                            <a href={organizationData.ieee?.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-900 text-white rounded-full font-bold text-sm hover:bg-teal-800 transition-all shadow-lg hover:shadow-teal-900/20">
                                                Explore IEEE KSV SB <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* FOUNDERS SECTION */}
                <div className="pt-20 border-t border-teal-50">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black text-teal-900 mb-20 text-center font-serif"
                    >
                        Honoring Our Founders
                    </motion.h3>

                    <div className="grid md:grid-cols-2 gap-16 lg:gap-24 max-w-5xl mx-auto">
                        {founders.map((founder, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: index * 0.2 }}
                                className="flex flex-col items-center group"
                            >
                                {/* Portrait Frame */}
                                <div className="mb-12 relative">
                                    <div className="absolute inset-0 bg-teal-200/40 blur-2xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                                    <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-teal-50 overflow-hidden transform group-hover:-translate-y-3 transition-transform duration-700">
                                        <img
                                            src={founder.image}
                                            alt={founder.name}
                                            className="w-56 md:w-64 h-auto block rounded-2xl sepia-[0.2] group-hover:sepia-0 transition-all duration-1000 scale-105 group-hover:scale-110"
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <h4 className="text-2xl font-black text-teal-900 mb-4 tracking-tight font-serif text-center">
                                    {founder.name}
                                </h4>

                                <div className="text-teal-600 italic font-medium leading-relaxed font-serif text-center px-10 py-6 border-t border-b border-teal-50 relative">
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F6] px-4 font-serif text-4xl text-teal-100">“</span>
                                    {founder.quote}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#FAF9F6] px-4 font-serif text-4xl text-teal-100 rotate-180">“</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
