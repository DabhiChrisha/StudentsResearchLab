import React from 'react';
import SpotlightCard from '../SpotlightCard';

const ChromaGrid = ({ items, onImageClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#fbe8c1] via-[#fbe8c1] to-[#5ba4a4] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                    onClick={() => onImageClick(item)}
                >
                    {/* Top: Image Section with Padding */}
                    <div className="p-4">
                        <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-sm border border-black/5">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Bottom: Info Section (Teal Background Area) */}
                    <div className="px-5 pb-6 pt-2">
                        <h4 className="text-lg font-black text-white mb-0.5 tracking-tight line-clamp-1">
                            {item.title}
                        </h4>
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-4">
                            {item.subtitle}
                        </p>

                        <div className="flex gap-4">
                            {item.email && (
                                <div className="text-white/70 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {item.linkedin && (
                                <div className="text-white/70 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.604 2.002 3.604 4.604v5.592z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChromaGrid;
