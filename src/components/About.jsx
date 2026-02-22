import React from 'react';
import { motion } from 'framer-motion';
import { organizationData } from '../data/organizationData';

const About = () => {
    const founders = organizationData?.svkm?.founders || [];

    if (founders.length === 0) return null;

    return (
        <section id="founders" className="py-24 bg-white relative overflow-hidden">
            {/* HONOURABLE FOUNDERS SECTION */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl lg:text-5xl font-black text-slate-900 mb-16 text-center font-serif"
                >
                    Honoring Our Founders
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
                    {founders.map((founder, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="mb-8 relative">
                                <div className="absolute inset-0 bg-secondary/5 rotate-6 rounded-lg blur-xl group-hover:bg-secondary/10 transition-colors" />
                                <div className="w-72 mx-auto bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-lg relative z-10 border border-slate-100">
                                    <div className="overflow-hidden rounded-md">
                                        <img
                                            src={founder.image}
                                            alt={founder.name}
                                            className="w-full h-auto block grayscale hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-serif">
                                {founder.name}
                            </h3>

                            <div className="flex gap-4 text-secondary/30 items-start max-w-sm">
                                <svg className="w-8 h-8 rotate-180 opacity-20 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9 14.9381 9.68715 14.1802 10.4566 13.7915C10.8732 13.5811 11.017 13.0423 10.7496 12.656C10.4651 12.2452 9.8736 12.1895 9.53982 12.5645C8.01633 14.276 7 16.6433 7 19.5C7 20.3284 7.67157 21 8.5 21H14.017ZM21 21L21 18C21 16.8954 20.1046 16 19 16H15.983C15.983 14.9381 16.6702 14.1802 17.4396 13.7915C17.8562 13.5811 18 13.0423 17.7326 12.656C17.4481 12.2452 16.8566 12.1895 16.5228 12.5645C14.9993 14.276 13.983 16.6433 13.983 19.5C13.983 20.3284 14.6546 21 15.483 21H21Z" />
                                </svg>
                                <p className="text-slate-500 italic font-medium leading-relaxed">
                                    {founder.quote}
                                </p>
                                <svg className="w-8 h-8 opacity-20 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9 14.9381 9.68715 14.1802 10.4566 13.7915C10.8732 13.5811 11.017 13.0423 10.7496 12.656C10.4651 12.2452 9.8736 12.1895 9.53982 12.5645C8.01633 14.276 7 16.6433 7 19.5C7 20.3284 7.67157 21 8.5 21H14.017ZM21 21L21 18C21 16.8954 20.1046 16 19 16H15.983C15.983 14.9381 16.6702 14.1802 17.4396 13.7915C17.8562 13.5811 18 13.0423 17.7326 12.656C17.4481 12.2452 16.8566 12.1895 16.5228 12.5645C14.9993 14.276 13.983 16.6433 13.983 19.5C13.983 20.3284 14.6546 21 15.483 21H21Z" />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
