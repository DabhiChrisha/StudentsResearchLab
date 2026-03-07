import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('activities')
                .select('*');

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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-10 pb-20 px-6 bg-gradient-to-b from-[#ecfeff] via-white to-white"
        >
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">

                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#0F172A] font-serif tracking-wide mb-6">
                        ACTIVITIES
                    </h1>

                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        Discover the various initiatives and events organized by Students Research Lab
                        to foster a culture of innovation and excellence.
                    </p>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center text-gray-400 py-20 text-lg">
                        Loading activities...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center text-red-500 py-20 text-lg">
                        {error}
                    </div>
                )}

                {/* No Data */}
                {!loading && !error && activities.length === 0 && (
                    <div className="text-center text-gray-400 py-20 text-lg">
                        No activities found.
                    </div>
                )}

                {/* Activities Grid */}
                {!loading && !error && activities.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 items-stretch">

                        {activities.map((act, i) => (

                            <motion.div
                                key={act.id || i}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="relative group h-full"
                            >

                                {/* Neon Glow */}
                                <div className="
                                    absolute -inset-1
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-lime-300
                                    via-green-300
                                    to-emerald-300
                                    opacity-0
                                    blur-xl
                                    group-hover:opacity-70
                                    transition
                                    duration-500
                                "></div>

                                {/* Card */}
                                <div className="
                                    relative
                                    p-8
                                    rounded-2xl
                                    bg-white
                                    shadow-lg
                                    border border-gray-100
                                    hover:-translate-y-2
                                    hover:shadow-2xl
                                    transition-all
                                    duration-300
                                    overflow-hidden
                                    flex
                                    flex-col
                                    h-full
                                    min-h-[220px]
                                ">

                                    {/* Accent Bar */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-green-400 opacity-0 group-hover:opacity-100 transition"></div>

                                    <div className="flex flex-col flex-grow">

                                        {/* Year */}
                                        {act.year && (
                                            <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wider w-fit">
                                                {act.year}
                                            </span>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-xl font-bold mt-4 mb-3 text-gray-800 group-hover:text-green-600 transition-colors duration-200">
                                            {act.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                                            {act.description}
                                        </p>

                                    </div>

                                </div>

                            </motion.div>

                        ))}

                    </div>
                )}

            </div>
        </motion.div>
    );
};

export default Activities;