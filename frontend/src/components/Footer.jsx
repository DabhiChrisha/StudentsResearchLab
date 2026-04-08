import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isKsvPage = location.pathname.includes("/organization/ksv");
  const isMmpsrpcPage = location.pathname.includes("/organization/mmpsrpc");

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="relative">
      {/* SOFT CURVE */}
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="absolute -top-[39px] left-0 w-full h-[40px]"
      >
        <path
          d="
            M0,34
            Q720,0 1440,34
            L1440,40
            L0,40
            Z
          "
          fill="#cfded8"
        />
      </svg>

      {/* FOOTER BODY */}
      <div className="bg-[#cfded8] text-[#134E4A] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            {/* SRL BRAND */}
            <div className="flex flex-col items-center text-center">
              <img
                loading="lazy"
                decoding="async"
                src="/SRL.svg"
                alt="Student Research Lab"
                className="h-24 w-auto mb-4"
              />

              <p className="text-[#134E4A]/80 leading-relaxed text-xs max-w-[240px]">
                Student Research Lab (SRL) encourages innovation, collaboration,
                and applied research through guided academic mentorship.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="font-semibold mb-3 uppercase tracking-wide text-xs">
                Quick Links
              </h4>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-[#134E4A]/80">
                <Link to="/" onClick={scrollToTop} className="hover:underline">
                  Home
                </Link>

                <Link
                  to="/sessions"
                  onClick={scrollToTop}
                  className="hover:underline"
                >
                  SRL Sessions
                </Link>

                <Link
                  to="/achievements"
                  onClick={scrollToTop}
                  className="hover:underline"
                >
                  Achievements
                </Link>

                <Link
                  to="/activities"
                  onClick={scrollToTop}
                  className="hover:underline"
                >
                  Activities
                </Link>

                <Link
                  to="/publications"
                  onClick={scrollToTop}
                  className="hover:underline"
                >
                  Publications
                </Link>

                <Link
                  to="/researchers"
                  onClick={scrollToTop}
                  className="hover:underline"
                >
                  Researchers
                </Link>

                <Link
                  to="/leaderboard"
                  onClick={scrollToTop}
                  className="hover:underline"
                >
                  Leaderboard
                </Link>

                <Link
                  to="/about"
                  onClick={scrollToTop}
                  className="hover:underline"
                >
                  About Us
                </Link>

                <Link
                  to="/appointment"
                  onClick={scrollToTop}
                  className="hover:underline"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h4 className="font-semibold mb-3 uppercase tracking-wide text-xs">
                Contact
              </h4>

              <p className="text-xs text-[#134E4A]/80 leading-relaxed mb-2">
                Student Research Lab (MMPSRPC)
                <br />
                LDRP-ITR, Sector-15, Gandhinagar
              </p>

              <div className="flex flex-col gap-1 text-xs text-[#134E4A]/80 mb-2">
                <a
                  href="mailto:mmpsrpc.ksv@gmail.com"
                  className="hover:underline"
                >
                  mmpsrpc.ksv@gmail.com
                </a>
              </div>
            </div>

            {/* FOLLOW */}
            <div>
              <h4 className="font-semibold mb-3 uppercase tracking-wide text-xs">
                Follow Us on
              </h4>

              <div className="flex flex-col gap-1">
                {!isKsvPage && (
                  <a
                    href="https://www.linkedin.com/company/mmpsrpc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-[#134E4A]/80 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-1"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.604 2.002 3.604 4.604v5.592z" />
                    </svg>
                    @mmpsrpc
                  </a>
                )}
                {!isMmpsrpcPage && (
                  <a
                    href="https://www.linkedin.com/school/kadi-sarva-vishwavidyalaya-gandihnagar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-[#134E4A]/80 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-1"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.604 2.002 3.604 4.604v5.592z" />
                    </svg>
                    @ksv
                  </a>
                )}
                <a
                  href="https://www.linkedin.com/company/ieee-student-branch-ksv/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-[#134E4A]/80 hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.604 2.002 3.604 4.604v5.592z" />
                  </svg>
                  @ieee_ksv_sb
                </a>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-[#134E4A]/20 my-5"></div>

          {/* COPYRIGHT */}
          <div className="text-center text-[11px] text-[#134E4A]/70">
            © {new Date().getFullYear()} Student Research Lab · MMPSRPC, KSV
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
