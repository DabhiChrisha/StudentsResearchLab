import React from 'react';
import { organizationData } from '../data/organizationData';

const About = () => {
    const founders = organizationData?.svkm?.founders || [];

    if (founders.length === 0) return null;

    return (
        <section id="founders" className="py-28 bg-white relative overflow-hidden">
            {/* Decorative Background Curves */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none">
                    <path d="M-100 600 Q 360 200 720 600 T 1540 600" stroke="#00887b" strokeWidth="1" fill="none" className="opacity-10" />
                    <path d="M-100 200 Q 360 600 720 200 T 1540 200" stroke="#00887b" strokeWidth="1" fill="none" className="opacity-10" />
                    <path d="M-100 400 Q 720 800 1540 400" stroke="#00887b" strokeWidth="0.5" fill="none" className="opacity-5" />
                    <path d="M-100 400 Q 720 0 1540 400" stroke="#00887b" strokeWidth="0.5" fill="none" className="opacity-5" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-20 text-center font-serif">
                    Honoring Our Founders
                </h2>

                <div className="grid md:grid-cols-2 gap-16 lg:gap-24 max-w-5xl mx-auto">
                    {founders.map((founder, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {/* Portrait Frame */}
                            <div className="mb-12 relative group">
                                <div className="absolute inset-0 bg-slate-200 blur-2xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative bg-white p-3 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <img
                                        src={founder.image}
                                        alt={founder.name}
                                        className="w-56 md:w-64 h-auto block rounded-lg sepia-[0.2] group-hover:sepia-0 transition-all duration-700"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className="text-2xl font-black text-secondary mb-3 tracking-tight">
                                {founder.name}
                            </h3>

                            <div className="flex items-start gap-3 max-w-xs justify-center relative">
                                <svg
                                    className="w-4 h-4 text-secondary/40 mt-1 flex-shrink-0 rotate-180"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9 14.9381 9.68715 14.1802 10.4566 13.7915C10.8732 13.5811 11.017 13.0423 10.7496 12.656C10.4651 12.2452 9.8736 12.1895 9.53982 12.5645C8.01633 14.276 7 16.6433 7 19.5C7 20.3284 7.67157 21 8.5 21H14.017ZM21 21L21 18C21 16.8954 20.1046 16 19 16H15.983C15.983 14.9381 16.6702 14.1802 17.4396 13.7915C17.8562 13.5811 18 13.0423 17.7326 12.656C17.4481 12.2452 16.8566 12.1895 16.5228 12.5645C14.9993 14.276 13.983 16.6433 13.983 19.5C13.983 20.3284 14.6546 21 15.483 21H21Z" />
                                </svg>
                                <p className="text-slate-500 italic font-medium leading-relaxed font-serif text-center text-base">
                                    {founder.quote}
                                </p>
                                <svg
                                    className="w-4 h-4 text-secondary/40 mt-1 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9 14.9381 9.68715 14.1802 10.4566 13.7915C10.8732 13.5811 11.017 13.0423 10.7496 12.656C10.4651 12.2452 9.8736 12.1895 9.53982 12.5645C8.01633 14.276 7 16.6433 7 19.5C7 20.3284 7.67157 21 8.5 21H14.017ZM21 21L21 18C21 16.8954 20.1046 16 19 16H15.983C15.983 14.9381 16.6702 14.1802 17.4396 13.7915C17.8562 13.5811 18 13.0423 17.7326 12.656C17.4481 12.2452 16.8566 12.1895 16.5228 12.5645C14.9993 14.276 13.983 16.6433 13.983 19.5C13.983 20.3284 14.6546 21 15.483 21H21Z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
