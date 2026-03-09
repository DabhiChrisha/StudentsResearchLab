import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { ExternalLink, X } from 'lucide-react';



const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null); // activity object or null

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase.from('activities').select('*');
            if (error) {
                setError('Failed to load activities.');
                setActivities([]);
            } else {
                setActivities(data || []);
            }
            setLoading(false);
        };
        fetchActivities();
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-10 pb-20 px-6 bg-gradient-to-b from-[#ecfeff] via-white to-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold uppercase tracking-tighter text-gray-900 mb-6 drop-shadow-lg inline-block px-8 py-2 rounded-xl transition-all duration-300 cursor-pointer">ACTIVITIES</h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-500 font-medium">
                        Discover the various initiatives and events organized by Students Research Lab to foster a culture of innovation and excellence.
                    </p>
                </div>

                {/* Loading */}
                {loading && <div className="text-center text-gray-400 py-20 text-lg">Loading activities...</div>}
                {/* Error */}
                {error && <div className="text-center text-red-500 py-20 text-lg">{error}</div>}
                {/* No Data */}
                {!loading && !error && activities.length === 0 && <div className="text-center text-gray-400 py-20 text-lg">No activities found.</div>}

                {/* Activities Grid */}
                {!loading && !error && activities.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8 items-stretch">
                        {activities.map((act, i) => (
                            <div
                                key={act.id || i}
                                className="bg-white rounded-2xl shadow-lg transition cursor-pointer flex flex-col overflow-hidden group min-h-[170px] md:min-h-[190px] neon-gradient-border"
                                onClick={() => setModal(act)}
                            >
                                {act.image && (
                                    <div className="aspect-[4/2] w-full bg-gray-100 overflow-hidden">
                                        <img src={act.image} alt={act.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                )}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="text-xs text-gray-400 font-semibold mb-2">
                                        {act.date}
                                    </div>
                                    <div className="font-bold text-lg md:text-xl text-gray-900 mb-2 line-clamp-2">{act.title}</div>
                                    <div className="text-gray-500 text-sm mb-3 line-clamp-2">
                                        {act.brief || act.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                <AnimatePresence>
                    {modal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 flex flex-col md:flex-row overflow-hidden relative"
                            >
                                {/* Image */}
                                {modal.image && (
                                    <div className="md:w-1/2 w-full bg-gray-100 flex items-center justify-center">
                                        <img src={modal.image} alt={modal.title} className="object-cover w-full h-full max-h-[340px]" />
                                    </div>
                                )}
                                {/* Details */}
                                <div className="flex-1 p-8 flex flex-col">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-gray-900 flex-1">{modal.title}</h2>
                                        {modal.year && (
                                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">{modal.year}</span>
                                        )}
                                    </div>
                                    {modal.link && (
                                        <a
                                            href={modal.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sky-700 font-semibold text-sm mb-3 hover:underline"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2.001 3.597 4.599v5.597z"/></svg>
                                            <span>(View Post)</span>
                                        </a>
                                    )}
                                    <div className="text-gray-700 text-base mb-4">
                                        <span className="font-bold">Brief: </span>
                                        {modal.brief || modal.description}
                                    </div>
                                    <div className="text-gray-400 text-xs mt-auto">
                                        {modal.date}
                                    </div>
                                </div>
                                {/* Close Button */}
                                <button
                                    onClick={() => setModal(null)}
                                    className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow text-gray-700"
                                    aria-label="Close"
                                >
                                    <X size={22} />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Activities;