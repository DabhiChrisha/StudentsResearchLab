import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const JoinUsForm = ({ isModal = false, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        enrollment: '',
        semester: '',
        division: '',
        branch: '',
        batch: '',
        college: '',
        contact: '',
        email: '',
        source: '',
        reference_name: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('join_us')
                .insert([formData]);

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                if (isModal) {
                    onClose();
                } else {
                    navigate('/');
                }
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            alert('Error submitting form. Please check your console for details or ensure Supabase is configured.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 font-serif">Registry Updated!</h2>
                <p className="text-slate-500 mt-2">Welcome to the inner circle of SRL.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="Ex: Aarav Patel" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Enrollment No.</label>
                    <input required name="enrollment" value={formData.enrollment} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="ID Number" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Semester</label>
                    <select required name="semester" value={formData.semester} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 appearance-none transition-all font-medium text-slate-600">
                        <option value="">Choose Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Division</label>
                    <input required name="division" value={formData.division} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="Ex: Alpha" />
                </div>

                <div className="grid col-span-1 md:col-span-2 grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Branch</label>
                        <input required name="branch" value={formData.branch} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="CSE / IT" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Batch</label>
                        <input required name="batch" value={formData.batch} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="2022-26" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">College</label>
                        <input required name="college" value={formData.college} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="SVKM" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact No.</label>
                    <input required name="contact" value={formData.contact} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="+91" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personal Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="email@domain.com" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Discovery Source</label>
                    <select required name="source" value={formData.source} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 appearance-none transition-all font-medium text-slate-600">
                        <option value="">How'd you find us?</option>
                        <option value="Friend">Referral</option>
                        <option value="Social">Social Channels</option>
                        <option value="Campus">Campus Poster</option>
                        <option value="Direct">Faculty Direct</option>
                    </select>
                </div>

                {formData.source === 'Friend' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reference Name</label>
                        <input name="reference_name" value={formData.reference_name} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium" placeholder="Who referred you?" />
                    </motion.div>
                )}
            </div>

            <button
                disabled={loading}
                type="submit"
                className="group relative w-full bg-secondary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-secondary-dark transition-all shadow-xl hover:shadow-secondary/20 active:scale-[0.98] disabled:opacity-50 mt-10"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Initiate Membership"}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </form>
    );
};

const JoinUs = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-primary pt-32 pb-24 px-4 sm:px-6"
        >
            <div className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-0 rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-white/40">
                    {/* Left Info Sidebar */}
                    <div className="lg:col-span-2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-3xl -mr-32 -mt-32 rounded-full" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[10px] font-black tracking-widest uppercase mb-8">
                                <Star size={12} fill="currentColor" /> Recruitment Open
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black font-serif mb-6 leading-tight">Be part of the <span className="text-secondary">next wave</span> of research.</h1>
                            <p className="text-slate-400 leading-relaxed font-light mb-8">Join a community of 200+ elite researchers pushing the boundaries of technology and academic excellence.</p>

                            <ul className="space-y-4">
                                {['Direct Mentorship', 'Publication Support', 'Lab Resource Access', 'Merit Certification'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center text-secondary">
                                            <CheckCircle2 size={12} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative z-10 pt-12 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-800 mt-12">
                            SVKM | KSV | MMPSRPC
                        </div>
                    </div>

                    {/* Right Form Area */}
                    <div className="lg:col-span-3 p-10 sm:p-14">
                        <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">Membership Application</h2>
                        <p className="text-slate-400 text-sm mb-12">Please provide accurate academic credentials.</p>
                        <JoinUsForm />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export { JoinUsForm, JoinUs };
