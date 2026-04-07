import { motion } from "framer-motion";
import { Mail, Clock, MapPin, Send } from "lucide-react";

const Appointment = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 lg:pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-black font-serif text-slate-900 mb-8 leading-tight">
              Get in{" "}
              <span className="text-secondary underline decoration-primary-dark underline-offset-8">
                Touch.
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Have questions or feedback? We'd love to hear from you. Reach out
              and let's start a conversation about your research journey.
            </p>

            <div className="space-y-6 text-left">
              {[
                {
                  icon: Mail,
                  label: "Email Us",
                  text: "mmpsrc.ksv@gmail.com",
                  link: "mailto:mmpsrc.ksv@gmail.com",
                },
                {
                  icon: MapPin,
                  label: "Visit Us",
                  text: "Student Research Lab (MMPSRPC), LDRP-ITR, Sector-15, Gandhinagar, Gujarat",
                  link: "https://maps.app.goo.gl/6Dh75Kw8tDKk7WTU7",
                },
                {
                  icon: Clock,
                  label: "Quick Response",
                  text: "Our team typically responds to all inquiries within 24 hours during business days.",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.label}</h4>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.icon === MapPin ? "_blank" : undefined}
                        rel="noreferrer"
                        className="text-slate-500 text-sm hover:text-secondary hover:underline transition-colors mt-1 inline-block"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p className="text-slate-500 text-sm mt-1">{item.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 p-1 rounded-2xl sm:rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -z-10" />
            <div className="bg-white rounded-xl sm:rounded-[2.8rem] p-6 sm:p-10 border border-white">
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-8 text-left">
                Send a Message
              </h2>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2 text-left"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2 text-left"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2 text-left"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2 text-left"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Include all the details you think we need..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all min-h-[140px] resize-none font-medium"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-5 bg-secondary text-white rounded-2xl font-bold shadow-xl hover:bg-secondary-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    Send Message <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Appointment;
