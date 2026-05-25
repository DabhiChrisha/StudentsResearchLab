import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Award, Github, Linkedin, Mail, ScrollText, Target, Zap, Activity } from 'lucide-react';
import { getImageUrl } from '../../lib/imageUrl';

const Metric = ({ icon: Icon, value, label }) => (
    <div className="flex flex-col items-center gap-0.5 group/m">
        <div className="flex items-center gap-1 transition-transform group-hover/m:-translate-y-0.5">
            <Icon size={11} className="text-secondary opacity-60 group-hover/m:opacity-100 transition-opacity" />
            <span className="text-[13px] sm:text-sm font-black text-slate-700 tabular-nums">{value}</span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider transition-colors group-hover/m:text-secondary">{label}</span>
    </div>
);

const ChromaGrid = ({ items, onImageClick, onCertClick, isLoading = false, skeletonCount = 16 }) => {
    const [loadedImages, setLoadedImages] = useState({});
    const [failedImages, setFailedImages] = useState({});

    useEffect(() => {
        // Log all image paths for debugging
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 sm:gap-3" aria-busy="true" aria-label="Loading researchers">
                {[...Array(skeletonCount)].map((_, index) => (
                    <div
                        key={index}
                        className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                    >
                        {/* Top: Image Skeleton */}
                        <div className="p-2">
                            <div className="relative aspect-square w-full rounded-[1rem] skeleton-bone"></div>
                        </div>

                        {/* Bottom: Info Section Skeleton */}
                        <div className="px-3 pb-3 pt-0.5 flex-1 flex flex-col">
                            {/* Name Skeleton */}
                            <div className="mb-2">
                                <div className="h-4 skeleton-bone rounded-md w-5/6 mb-1.5"></div>
                                <div className="flex items-center gap-1">
                                    <div className="w-12 h-4 skeleton-bone rounded-sm"></div>
                                    <div className="w-16 h-3 skeleton-bone rounded-sm"></div>
                                </div>
                            </div>

                            {/* Research Area Tag Skeleton */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                <div className="w-16 h-3.5 skeleton-bone rounded-md"></div>
                            </div>

                            {/* Bottom Row: Metrics + Action Button Skeleton */}
                            <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                                <div className="flex gap-3 lg:gap-2">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="flex flex-col items-center gap-0.5">
                                            <div className="w-6 h-3 skeleton-bone rounded"></div>
                                            <div className="w-8 h-2 skeleton-bone rounded"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="shrink-0 w-7 h-7 rounded-lg skeleton-bone"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 sm:gap-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    style={{ background: item.gradient }}
                    className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-700 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-10px_rgba(11,61,58,0.1)] cursor-pointer"
                    onClick={() => onImageClick(item)}
                >
                    {/* Top: Image Section */}
                    <div className="p-1">
                        <div className="relative aspect-[0.95/1] w-full rounded-[0.9rem] overflow-hidden shadow-inner bg-slate-100/50">
                            {!failedImages[index] && item.image ? (
                                <>
                                    <img loading="lazy" decoding="async"
                                        src={getImageUrl(item.image)}
                                        alt={item.title}
                                        onLoad={() => handleImageLoad(index)}
                                        onError={() => handleImageError(index, item)}
                                        className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-4 backdrop-blur-[1px]">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                                            <span className="inline-block text-[11px] font-black text-white uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 shadow-xl">
                                                View Profile
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-400 text-sm font-bold uppercase tracking-widest text-center p-4">
                                    {!item.image ? 'Profile Missing' : 'Network Error'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Info Section */}
                    <div className="px-2 pb-2 pt-0 flex-1 flex flex-col">
                        <div className="mb-0.5">
                            <h4 className="text-[1.3rem] sm:text-[1.3rem] lg:text-[1.0rem] font-black text-slate-900 mb-0.5 tracking-tight leading-tight group-hover:text-secondary transition-colors duration-500 line-clamp-2 min-h-[1.35em]">
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[12px] sm:text-[12px] font-black text-secondary uppercase tracking-[0.1em] px-1 py-0.5 rounded bg-secondary/5">
                                    BATCH {item.batch || ''}
                                </span>
                                <span className="text-[12px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[96px]">
                                    {item.department}
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats Badges */}
                        <div className="flex flex-wrap gap-1 mb-1">
                            {(item.research_areas || []).slice(0, 1).map((area, aIdx) => (
                                <span key={aIdx} className="text-[12px] sm:text-[12px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                                    {area}
                                </span>
                            ))}
                        </div>

                        {/* Bottom Row: Metrics & Actions */}
                        <div className="mt-auto pt-1 border-t border-slate-50 flex flex-col gap-1">
                            <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
                                <Metric icon={Activity} value={item.ongoingProjectsCount} label="Ongoing" />
                                <Metric icon={Zap} value={item.hackathonsCount} label="Hacks" />
                                <Metric icon={ScrollText} value={item.papersPublishedCount} label="Papers" />
                            </div>

                            <div className="flex items-center justify-between gap-1">
                                <button
                                    type="button"
                                    aria-label={`View certificates for ${item.title}`}
                                    title="Certificates"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCertClick?.(item);
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[13px] font-black uppercase tracking-wider shadow-sm hover:bg-teal-500 hover:text-white transition-all duration-500"
                                >
                                    <Award size={16} />
                                    <span>CERTIFICATES</span>
                                </button>

                                <button
                                    type="button"
                                    aria-label={`View profile for ${item.title}`}
                                    title="View profile"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onImageClick(item);
                                    }}
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/60 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-white transition-all duration-500 shadow-sm"
                                >
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChromaGrid;

// Add global styles for animations if not already present
if (typeof window !== 'undefined' && !document.getElementById('chroma-grid-styles')) {
    const style = document.createElement('style');
    style.id = 'chroma-grid-styles';
    style.textContent = `
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
            animation: shimmer 3s infinite;
            background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
            background-size: 1000px 100%;
            background-position: -1000px 0;
        }
    `;
    document.head.appendChild(style);
}
