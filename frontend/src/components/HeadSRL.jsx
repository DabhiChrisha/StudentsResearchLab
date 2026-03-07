import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import mamPhoto from "../assets/Ma'am Photo.png";

export default function HeadSRL() {
    return (
        <section className="relative py-28 overflow-hidden bg-white">
            {/* Ambient MVPBlocks accents */}
            <div className="absolute inset-0 pointer-events-none text-[#05877a]/5">
                <div className="absolute -top-40 -left-40 w-lg h-128 bg-teal-50/50 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 right-0 w-[24rem] h-96 bg-teal-100/40 rounded-full blur-3xl opacity-40" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center
                     bg-white rounded-3xl md:rounded-[2.75rem]
                     shadow-[0_50px_100px_rgba(5,135,122,0.1)]
                     p-6 md:p-10 lg:p-16"
                >
                    {/* LEFT – MESSAGE */}
                    <div className="order-2 lg:order-1">
                        <div className="text-xs md:text-sm uppercase tracking-widest text-[#05877a] font-semibold mb-4">
                            SRL Mentor
                        </div>

                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight font-serif">
                            M. M. Patel Students Research Project Cell, Kadi Sarva Vishwavidyalaya
                        </h2>

                        <blockquote className="relative pl-10 italic text-base md:text-lg text-gray-700 mb-8 font-serif sm:pr-12 leading-relaxed">
                            <span className="absolute -top-3 left-0 text-3xl text-[#05877a]/20 select-none italic">“</span>
                            <div className="inline">
                                Aspirations, curiosity, excellence, and dedication form the
                                foundation of SRL — a space created to nurture disciplined,
                                research-driven minds.
                                <span className="inline text-3xl text-[#05877a]/20 ml-1 italic leading-none">”</span>
                            </div>
                        </blockquote>

                        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6 font-sans">
                            SRL is designed to foster academic rigor, consistency, and
                            intellectual growth. Through structured mentorship and
                            purpose-driven initiatives, students are guided toward meaningful
                            research and long-term impact.
                        </p>

                        <div className="mt-8">
                            <div className="text-lg font-semibold text-gray-900 font-serif">
                                Dr. Himani Trivedi
                            </div>
                            <div className="text-sm text-[#05877a] font-medium uppercase tracking-wider">
                                Head, M. M. Patel Students Research Project Cell
                            </div>
                        </div>

                        {/* Contact (de-emphasized) */}
                        <div className="mt-8 flex flex-col gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#05877a]" />
                                <a
                                    href="mailto:himani_ce@ldrp.ac.in"
                                    className="underline hover:text-[#05877a] break-all"
                                >
                                    mmpsrc.ksv@gmail.com
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-[#05877a] shrink-0" />
                                <span>AF-7 Lab, First Floor, Wing B, LDRP-ITR</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT – PORTRAIT */}
                    <div className="relative flex justify-center order-1 lg:order-2">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-teal-50 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[10px] md:border-[14px] border-white shadow-xl" />
                            <img
                                src={mamPhoto}
                                alt="Dr. Himani Trivedi"
                                className="w-56 h-56 md:w-72 md:h-72 rounded-full object-cover"
                            />
                        </div>

                        <div className="absolute -bottom-4 md:bottom-4 right-0 md:-right-4 bg-[#05877a] text-white text-xs md:text-sm px-4 md:px-5 py-2 rounded-full shadow-lg z-10 max-w-[150px] md:max-w-none text-center font-bold tracking-wide">
                            Discipline builds excellence.
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
