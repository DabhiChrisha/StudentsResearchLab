import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * ScrollToTop
 *
 * Always mounted so circleRef is never null.
 * Show/hide is driven by CSS opacity + translateY — no mount/unmount flash.
 * strokeDashoffset is updated directly on the DOM element via ref — zero React re-renders per scroll.
 * CSS `transition: stroke-dashoffset 100ms linear` provides smooth visual interpolation.
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const circleRef = useRef(null);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      // Direct DOM write — bypasses React entirely, no re-render chain
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
      }

      // State only drives visibility — updates are infrequent (threshold cross)
      setIsVisible(scrollTop > 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialise immediately after mount so the circle is correct from the start
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed bottom-28 md:bottom-8 right-4 md:right-8 z-50
        transition-[opacity,transform] duration-300 ease-out
        ${isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
        }`}
    >
      <div className="relative w-16 h-16">
        {/* SVG ring */}
        <svg
          width="64" height="64"
          viewBox="0 0 64 64"
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Track ring */}
          <circle
            cx="32" cy="32" r={RADIUS}
            stroke="#D1E8E6"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Progress arc — strokeDashoffset updated directly via ref */}
          <circle
            ref={circleRef}
            cx="32" cy="32" r={RADIUS}
            stroke="#2CB1A1"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            style={{ transition: "stroke-dashoffset 100ms linear" }}
          />
        </svg>

        {/* Button sits centered inside the ring */}
        <button
          onClick={scrollToTop}
          tabIndex={isVisible ? 0 : -1}
          className="
            absolute inset-0 m-auto
            w-10 h-10
            bg-teal-600 hover:bg-teal-700
            rounded-full shadow-md
            flex items-center justify-center
            active:scale-90
            transition-[background-color,transform] duration-150
          "
          aria-label="Scroll to top"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none" stroke="currentColor"
            strokeWidth="2.5" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
