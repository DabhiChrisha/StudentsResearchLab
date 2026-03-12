import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import mamPhoto from "../assets/Ma'am Photo.png";

export default function HeadSRL() {
    return (
        <section className="relative pt-12 pb-52 overflow-hidden bg-[#f0f9f6]">
            
            {/* Background Aesthetic Shapes */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Large Beige Petal/Shape on the right */}
                <div 
                    className="absolute top-[-5%] right-[-10%] w-[70%] h-[120%] bg-[#f8e6c1]/60 rounded-full blur-[80px] animate-float-slow" 
                    style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 70%' }}
                />
                
                {/* Additional Decorative Animated Circles */}
                <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-[#05877a]/5 rounded-full blur-[60px] animate-float-slower" />
                <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-[#05877a]/10 rounded-full blur-[100px] animate-float-slow" />
                <div className="absolute top-[40%] left-[-5%] w-48 h-48 bg-[#f8e6c1]/40 rounded-full blur-[50px] animate-float-slower" />
                
                {/* Bottom Curved Transition to White */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[120%] h-48 md:h-64 lg:h-80 -ml-[10%]">
                        <path 
                            d="M0,0 C300,40 600,100 1200,20 L1200,120 L0,120 Z" 
                            fill="white"
                        />
                    </svg>
                </div>
            </div>



            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-20 pb-16">
                {/* Heading positioned with enough top space to avoid overlap */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-10 mt-0"
                >
                    <div className="mb-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-[#05877a]/20 text-xs font-bold uppercase tracking-[0.2em] animate-gradient-text shadow-sm">
                            SRL Mentor
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.2] font-serif max-w-5xl">
                        M. M. Patel Students Research Project Cell, <br className="hidden lg:block"/>
                        Kadi Sarva Vishwavidyalaya
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* LEFT CONTENT */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7"
                    >
                        <div className="flex items-start gap-4 mb-8">
                            {/* Quotation Mark Icon - Teal Circle with White Quote */}
                            <div className="mt-1 shrink-0">
                                <span className="animate-gradient-text font-serif text-2xl md:text-3xl italic leading-none block">
                                    “
                                </span>
                            </div>
                            
                            <blockquote className="text-lg md:text-xl text-slate-800 font-serif leading-relaxed italic relative">
                                Aspirations, curiosity, excellence, and dedication form the
                                foundation of SRL — a space created to nurture disciplined,
                                research-driven minds.
                                <span className="inline-block animate-gradient-text text-2xl md:text-3xl ml-2 align-bottom leading-none select-none">”</span>
                            </blockquote>
                        </div>

                        <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 font-sans max-w-2xl">
                            SRL is designed to foster academic rigor, consistency, and
                            intellectual growth. Through structured mentorship and
                            purpose-driven initiatives, students are guided toward meaningful
                            research and long-term impact.
                        </p>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 font-serif">
                                Dr. Himani Trivedi
                            </h3>
                            <p className="text-xs font-bold text-[#05877a] uppercase tracking-widest mt-1">
                                HEAD, M. M. PATEL STUDENTS RESEARCH PROJECT CELL
                            </p>
                        </div>

                        {/* Contact info strictly as per image */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-700 hover:text-[#05877a] transition-colors group">
                                <Mail className="w-5 h-5 text-[#05877a]" />
                                <a href="mailto:mmpsrc.ksv@gmail.com" className="font-medium underline decoration-[#05877a]/30 hover:decoration-[#05877a]">mmpsrc.ksv@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <MapPin className="w-5 h-5 text-[#05877a]" />
                                <span className="font-medium">AF-7 Lab, First Floor, Wing B, LDRP-ITR</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT PORTRAIT - CENTERED AND HIGHLIGHTED */}
                    <div className="lg:col-span-5 relative flex justify-center items-center py-8 lg:py-0">


                        {/* Profile Image with centered placement */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="relative z-20 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
                        >
                            <div className="w-full h-full rounded-full border-[10px] border-white shadow-2xl overflow-hidden bg-white ring-1 ring-[#05877a]/10">
                                <img
                                    src={mamPhoto}
                                    alt="Dr. Himani Trivedi"
                                    className="w-full h-full object-cover transition-all duration-700"
                                />
                            </div>

                            {/* Pill Badge Highlighted Overlay */}
                            <motion.div 
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute bottom-10 right-[-10px] md:right-[-30px] bg-[#00887b] text-white px-5 py-2.5 rounded-full shadow-lg font-bold text-sm tracking-wide border-2 border-white whitespace-nowrap z-30"
                            >
                                Discipline builds excellence.
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
