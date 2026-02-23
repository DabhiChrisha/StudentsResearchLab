import { motion } from 'framer-motion';
import { CheckCircle2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JoinUsSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-primary/30 to-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle2 className="w-16 h-16 text-secondary" />
                </motion.div>

                {/* Success Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 font-serif mb-4">
                        Application Submitted!
                    </h1>
                    <p className="text-lg text-slate-600 mb-6">
                        Welcome to the SRL community! 🎉
                    </p>
                    <p className="text-slate-500 max-w-lg mx-auto mb-8">
                        Your membership application has been received successfully. Our team will review your application and get back to you soon. You'll receive an email confirmation shortly.
                    </p>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-50 rounded-2xl p-6 mb-8 text-left"
                >
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="text-secondary">→</span> What's Next?
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                            <span className="text-secondary mt-1">•</span>
                            <span>Check your email for confirmation and further instructions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-secondary mt-1">•</span>
                            <span>Our team will review your application within 2-3 business days</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-secondary mt-1">•</span>
                            <span>You'll receive login credentials once approved</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-white rounded-full font-bold hover:bg-secondary-dark transition-all shadow-lg hover:shadow-xl"
                    >
                        <Home className="h-5 w-5" />
                        Back to Home
                    </button>
                </motion.div>

                {/* Footer Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-xs text-slate-400 mt-8"
                >
                    Questions? Contact us at <span className="text-secondary font-semibold">srl@example.com</span>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default JoinUsSuccess;
