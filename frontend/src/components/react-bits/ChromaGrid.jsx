import React, { useState, useEffect } from 'react';
import SpotlightCard from '../SpotlightCard';

const ChromaGrid = ({ items, onImageClick, isLoading = false }) => {
    const [loadedImages, setLoadedImages] = useState({});
    const [failedImages, setFailedImages] = useState({});

    useEffect(() => {
        // Log all image paths for debugging
        if (!isLoading) {
            items.forEach((item, index) => {
                console.log(`[${index}] ${item.title}: ${item.image}`);
            });
        }
    }, [items, isLoading]);

    const handleImageLoad = (index) => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
    };

    const handleImageError = (index, item) => {
        console.error(`Failed to load image for ${item.title}:`, item.image);
        setFailedImages(prev => ({ ...prev, [index]: true }));
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-gray-200/50 animate-pulse border border-gray-100"
                    >
                        {/* Top: Image Box Skeleton */}
                        <div className="p-3">
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-300"></div>
                        </div>

                        {/* Bottom: Info Section Skeleton */}
                        <div className="px-4 pb-5 pt-2 flex flex-col gap-2">
                            {/* Title Skeleton */}
                            <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
                            {/* Subtitle/Semester Skeleton */}
                            <div className="h-4 bg-gray-300 rounded-md w-1/2 mb-2"></div>

                            {/* Icons and Metrics Skeleton */}
                            <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-300/40 pt-4">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-gray-300 rounded-lg"></div>
                                    <div className="w-6 h-6 bg-gray-300 rounded-lg"></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 outline outline-2 outline-gray-200/50 outline-offset-[2px]"></div>
                                    <div className="w-8 h-8 rounded-full bg-gray-300 outline outline-2 outline-gray-200/50 outline-offset-[2px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#fbe8c1] via-[#fbe8c1] to-[#5ba4a4] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                    onClick={() => onImageClick(item)}
                >
                    {/* Top: Image Section with Padding */}
                    <div className="p-3">
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-sm border border-black/5 bg-gray-200">
                            {!failedImages[index] && item.image ? (
                                <>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        onLoad={() => handleImageLoad(index)}
                                        onError={() => handleImageError(index, item)}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-slate-900/25 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-sm font-bold text-white uppercase tracking-wider px-4 py-2 rounded-full bg-black/30">
                                            View profile
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs text-center p-2">
                                    {!item.image ? 'No photo' : 'Image not found'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Info Section (Teal Background Area) */}
                    <div className="px-4 pb-5 pt-2">
                        <h4 className="text-xl font-black text-white mb-0.5 tracking-tight line-clamp-1">
                            {item.title}
                        </h4>
                        <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                            {item.subtitle}
                        </p>

                        {/* Bottom Row: Icons + Metrics in one line */}
                        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/40 pt-4">
                            {/* Social Icons */}
                            <div className="flex gap-3 shrink-0">
                                {item.email && (
                                    <a
                                        href={`mailto:${item.email}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-white hover:text-black transition-all transform hover:scale-110 relative z-10"
                                        title={`Email: ${item.email}`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </a>
                                )}
                                {item.linkedin && (
                                    <a
                                        href={item.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-white hover:text-black transition-all transform hover:scale-110 relative z-10"
                                        title="LinkedIn Profile"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.604 2.002 3.604 4.604v5.592z" />
                                        </svg>
                                    </a>
                                )}
                            </div>

                            {/* Metrics Strip */}
                            <div className="flex flex-1 items-center justify-end gap-4 text-white">
                                <div className="flex items-center gap-1.5" title="Research Works">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <span className="text-base font-black">{(item.researchWorks || []).length}</span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Achievements">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                    <span className="text-base font-black">{(item.achievements || []).length}</span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Papers Published">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    <span className="text-base font-black">{(item.papersPublished || []).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChromaGrid;
