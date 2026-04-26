import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import JoinUs from '../pages/JoinUs';
import joinSrlImg from '../assets/Join SRL.png';

const JoinUsModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[92vh]"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex items-start sm:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">Join SRL</h2>
                                    <p className="text-sm text-slate-500 mt-1">Registration Form</p>
                                </div>
                                <img src={joinSrlImg} alt="Join SRL Process" className="h-10 sm:h-14 lg:h-16 w-auto object-contain mt-2 sm:mt-0" />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="p-5 sm:p-8">
                            <JoinUs isModal onClose={onClose} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default JoinUsModal;
