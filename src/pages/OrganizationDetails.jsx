import { useParams, Navigate } from "react-router-dom";
import { organizationData } from "../data/organizationData";
import { motion } from "framer-motion";

const OrganizationDetails = () => {
    const { orgId } = useParams();
    const data = organizationData[orgId];

    if (!data) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="pt-[88px] min-h-screen bg-slate-50">
            {/* HERO SECTION */}
            <section className="relative py-20 px-6 sm:px-10 lg:px-14 overflow-hidden bg-primary/20">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <motion.button
                        onClick={() => {
                            if (data.website) {
                                window.open(data.website, '_blank');
                            }
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="h-24 sm:h-32 object-contain mb-8 drop-shadow-lg rounded-2xl cursor-pointer hover:drop-shadow-xl transition-all"
                    >
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-full object-contain"
                        />
                    </motion.button>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl sm:text-4xl lg:text-7xl font-black text-slate-900 mb-4 font-serif"
                    >
                        {data.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl uppercase tracking-widest"
                    >
                        {data.subtitle}
                    </motion.p>


                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-secondary rounded-full blur-[100px]" />
                    <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-primary-dark rounded-full blur-[100px]" />
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section className="py-24 px-6 sm:px-10 lg:px-14">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-slate-800 mb-16"
                    >
                        {data.description.map((paragraph, index) => (
                            <p key={index} className="mb-6 leading-relaxed text-lg font-light">
                                {paragraph}
                            </p>
                        ))}
                    </motion.div>

                    {/* STATS */}
                    {data.stats && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
                        >
                            {data.stats.map((stat, index) => (
                                <div key={index} className="bg-white p-8 rounded-[2rem] text-center border border-slate-100 shadow-sm">
                                    <h4 className="text-3xl lg:text-4xl font-black text-secondary mb-2 font-serif">{stat.value}</h4>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {data.founders && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mb-24"
                        >
                            <h2 className="text-4xl font-black text-slate-900 mb-16 text-center font-serif">
                                Honoring Our Founders
                            </h2>
                            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                                {data.founders.map((founder, index) => (
                                    <div key={index} className="flex flex-col items-center text-center group">
                                        <div className="relative mb-8">
                                            <div className="absolute inset-0 bg-secondary/10 rotate-6 rounded-[2rem] group-hover:rotate-12 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-primary/20 -rotate-3 rounded-[2rem] group-hover:-rotate-6 transition-transform duration-500" />
                                            <div className="relative rounded-[2rem] shadow-2xl border-8 border-white bg-white overflow-auto">
                                                <img
                                                    src={founder.image}
                                                    alt={founder.name}
                                                    className="w-full h-auto block filter sepia-[.1] group-hover:sepia-0 transition-all duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-900 mb-4 font-serif">
                                            {founder.name}
                                        </h3>

                                        <div className="flex gap-3 text-secondary/40 items-start justify-center">
                                            <svg className="w-8 h-8 shrink-0 rotate-180 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9 14.9381 9.68715 14.1802 10.4566 13.7915C10.8732 13.5811 11.017 13.0423 10.7496 12.656C10.4651 12.2452 9.8736 12.1895 9.53982 12.5645C8.01633 14.276 7 16.6433 7 19.5C7 20.3284 7.67157 21 8.5 21H14.017ZM21 21L21 18C21 16.8954 20.1046 16 19 16H15.983C15.983 14.9381 16.6702 14.1802 17.4396 13.7915C17.8562 13.5811 18 13.0423 17.7326 12.656C17.4481 12.2452 16.8566 12.1895 16.5228 12.5645C14.9993 14.276 13.983 16.6433 13.983 19.5C13.983 20.3284 14.6546 21 15.483 21H21Z" />
                                            </svg>
                                            <p className="text-slate-500 italic font-medium max-w-xs text-base">
                                                {founder.quote}
                                            </p>
                                            <svg className="w-8 h-8 shrink-0 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9 14.9381 9.68715 14.1802 10.4566 13.7915C10.8732 13.5811 11.017 13.0423 10.7496 12.656C10.4651 12.2452 9.8736 12.1895 9.53982 12.5645C8.01633 14.276 7 16.6433 7 19.5C7 20.3284 7.67157 21 8.5 21H14.017ZM21 21L21 18C21 16.8954 20.1046 16 19 16H15.983C15.983 14.9381 16.6702 14.1802 17.4396 13.7915C17.8562 13.5811 18 13.0423 17.7326 12.656C17.4481 12.2452 16.8566 12.1895 16.5228 12.5645C14.9993 14.276 13.983 16.6433 13.983 19.5C13.983 20.3284 14.6546 21 15.483 21H21Z" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* MISSION & VISION */}
                    {(data.mission || data.vision) && (
                        <div className="grid md:grid-cols-2 gap-8 mb-24">
                            {data.mission && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl"
                                >
                                    <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3 font-serif">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        Mission
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed font-light">{data.mission}</p>
                                </motion.div>
                            )}
                            {data.vision && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl"
                                >
                                    <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3 font-serif">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        Vision
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed font-light">{data.vision}</p>
                                </motion.div>
                            )}
                        </div>
                    )}



                    {/* OBJECTIVES */}
                    {data.objectives && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mb-24"
                        >
                            <h3 className="text-3xl font-bold text-slate-900 mb-10 text-center font-serif">Objectives</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                {data.objectives.map((obj, index) => (
                                    <div key={index} className="group flex flex-col items-center text-center bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6">
                                        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition-all">
                                            <svg className="w-6 h-6 text-secondary group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="9" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                                            </svg>
                                        </div>
                                        <h4 className="text-sm font-bold text-secondary mb-2 font-serif leading-snug">{obj.title}</h4>
                                        <p className="text-slate-500 text-xs leading-relaxed font-light">{obj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {data.features && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24"
                        >
                            {data.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-secondary group-hover:scale-150 transition-transform" />
                                        <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">{feature}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* CONTACT & LOCATION SECTION */}
                    {data.contact && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-20"
                        >
                            {/* Section Header */}
                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-black text-slate-900 font-serif">Contact Us</h2>
                                <p className="text-slate-400 mt-2 text-sm font-light">Get in touch or find us on the map</p>
                            </div>

                            {/* Big card grid */}
                            <div className="grid lg:grid-cols-5 gap-0 rounded-[2.5rem] overflow-hidden shadow-2xl">

                                {/* Left: Contact info panel */}
                                <div className="lg:col-span-2 p-10 flex flex-col justify-between gap-8" style={{ backgroundColor: '#e3eef0' }}>
                                    <div>
                                        <p className="text-secondary text-xs font-black uppercase tracking-[0.2em] mb-6">Reach Us</p>

                                        {/* Address */}
                                        <div className="flex items-start gap-4 mb-8">
                                            <div className="shrink-0 w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center mt-0.5">
                                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Address</p>
                                                <p className="text-slate-700 text-sm leading-relaxed font-light">{data.contact.address}</p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-start gap-4 mb-8">
                                            <div className="shrink-0 w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                                                <a href={`mailto:${data.contact.email}`} className="text-secondary font-semibold hover:text-secondary-dark text-sm break-all underline underline-offset-2">
                                                    {data.contact.email}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-start gap-4">
                                            <div className="shrink-0 w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                                                <a href={`tel:${data.contact.phone.replace(/[^0-9+]/g, '')}`} className="text-secondary font-semibold hover:text-secondary-dark text-sm underline underline-offset-2">
                                                    {data.contact.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className="border-t border-secondary/20 pt-6">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">We'd love to hear from you</p>
                                    </div>
                                </div>

                                {/* Right: Map — full height */}
                                <div className="lg:col-span-3 relative min-h-[350px] bg-slate-200">
                                    <iframe
                                        title={`${data.title} Location`}
                                        src={data.contact.mapEmbed}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full"
                                    />
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
