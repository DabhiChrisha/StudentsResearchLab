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
            const { data, error } = await supabase.from('activity').select('*').order('date', { ascending: false });
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
            className="min-h-screen pt-32 pb-20 px-4 bg-[#FDFDFD]"
        >
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-black text-[#0D9488] mb-8">Activities</h1>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl">
                    Discover the various initiatives and events organized by Students Research Lab to foster a culture of innovation and excellence.
                </p>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading activities...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-12">{error}</div>
                ) : activities.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">No activities found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {activities.map((act, i) => (
                            <div key={act.id || i} className="p-8 rounded-3xl bg-white shadow-xl border border-gray-100 hover:border-[#0D9488] transition-all group">
                                <span className="text-[#0D9488] font-bold text-sm uppercase tracking-widest">{act.date}</span>
                                <h3 className="text-2xl font-bold mt-2 mb-4 group-hover:text-[#0D9488] transition-colors">{act.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{act.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Activities;
