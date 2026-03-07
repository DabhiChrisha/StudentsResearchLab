import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Appointment = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen"
        >
            <div className="max-w-screen-2xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-black font-serif text-slate-900 mb-8 leading-tight">
                            SRL <span className="text-secondary underline decoration-primary-dark underline-offset-8">Appointment</span> System
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Need mentorship for your research project? Schedule a one-on-one session with our senior researchers or lab leads to discuss your methodology, findings, or publication strategy.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: Calendar, label: 'Flexible Scheduling', text: 'Select a date that fits your academic calendar.' },
                                { icon: Clock, label: '30-60 Minute Slots', text: 'Focused sessions for deep technical discussions.' },
                                { icon: MapPin, label: 'Hybrid Presence', text: 'Available for both in-person and virtual consultation.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.label}</h4>
                                        <p className="text-slate-500 text-sm">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/10 p-1 rounded-2xl sm:rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -z-10" />
                        <div className="bg-white rounded-xl sm:rounded-[2.8rem] p-6 sm:p-10 border border-white">
                            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-8">Book Your Slot</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Researcher to Meet</label>
                                    <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all">
                                        <option>Dr. Sarah Jenkins (Senior Lead)</option>
                                        <option>Prof. Mike Ross (Methodology Expert)</option>
                                        <option>Siddharth Sharma (Patent Lead)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Preferred Date</label>
                                        <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Time Slot</label>
                                        <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none">
                                            <option>10:00 AM</option>
                                            <option>02:00 PM</option>
                                            <option>04:00 PM</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button className="w-full py-5 bg-secondary text-white rounded-2xl font-bold shadow-xl hover:bg-secondary-dark transition-all transform hover:-translate-y-1">
                                        Confirm Appointment Request
                                    </button>
                                    <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
                                        Request will be approved within 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Appointment;
