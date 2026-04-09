import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, ScrollText, Target, Zap, Activity } from 'lucide-react';

const Metric = ({ icon: Icon, value, label }) => (
    <div className="flex flex-col items-center gap-0.5 group/m cursor-help">
        <div className="flex items-center gap-1 transition-transform group-hover/m:-translate-y-0.5">
            <Icon size={11} className="text-secondary opacity-60 group-hover/m:opacity-100 transition-opacity" />
            <span className="text-[10px] font-black text-slate-700 tabular-nums">{value}</span>
        </div>
        <span className="text-[7px] font-black uppercase text-slate-400 tracking-wider transition-colors group-hover/m:text-secondary">{label}</span>
    </div>
);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 animate-shimmer"
                    >
                        {/* Top: Image Box Skeleton */}
                        <div className="p-4">
                            <div className="relative aspect-[4/5] w-full rounded-[2rem] bg-slate-200 animate-pulse"></div>
                        </div>

                        {/* Bottom: Info Section Skeleton */}
                        <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
                            <div className="h-6 bg-slate-200 rounded-lg w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-slate-100 rounded-md w-1/2 animate-pulse"></div>

                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex gap-4">
                                    <div className="w-8 h-4 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="w-8 h-4 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="w-8 h-4 bg-slate-100 rounded animate-pulse"></div>
                                </div>
                                <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    style={{ background: item.gradient }}
                    className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-700 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-10px_rgba(11,61,58,0.1)] cursor-pointer"
                    onClick={() => onImageClick(item)}
                >
                    {/* Top: Image Section */}
                    <div className="p-2">
                        <div className="relative aspect-[1/1] w-full rounded-[1rem] overflow-hidden shadow-inner bg-slate-100/50">
                            {!failedImages[index] && item.image ? (
                                <>
                                    <img loading="lazy" decoding="async"
                                        src={item.image}
                                        alt={item.title}
                                        onLoad={() => handleImageLoad(index)}
                                        onError={() => handleImageError(index, item)}
                                        className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-4 backdrop-blur-[1px]">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                                            <span className="inline-block text-[9px] font-black text-white uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 shadow-xl">
                                                View Profile
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center p-4">
                                    {!item.image ? 'Profile Missing' : 'Network Error'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Info Section */}
                    <div className="px-3 pb-3 pt-0.5 flex-1 flex flex-col">
                        <div className="mb-2">
                            <h4 className="text-sm font-black text-slate-900 mb-0.5 tracking-tight leading-tight group-hover:text-secondary transition-colors duration-500 line-clamp-1">
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-1">
                                <span className="text-[7px] font-black text-secondary uppercase tracking-[0.1em] px-1 py-0.5 rounded bg-secondary/5">
                                    Sem {item.semester}
                                </span>
                                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[80px]">
                                    {item.department}
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats Badges */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {(item.research_areas || []).slice(0, 1).map((area, aIdx) => (
                                <span key={aIdx} className="text-[7px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                                    {area}
                                </span>
                            ))}
                        </div>

                        {/* Bottom Row: Metrics & Actions */}
                        <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex gap-4 lg:gap-3 flex-wrap">
                                <Metric icon={Activity} value={item.ongoingProjectsCount} label="Ongoing" />
                                <Metric icon={Target} value={item.researchWorksCount} label="Research" />
                                <Metric icon={Zap} value={item.hackathonsCount} label="Hack" />
                                <Metric icon={ScrollText} value={item.papersPublishedCount} label="Papers" />
                            </div>
                            <div className="shrink-0 w-7 h-7 rounded-lg bg-white/50 flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                                <ArrowUpRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChromaGrid;
