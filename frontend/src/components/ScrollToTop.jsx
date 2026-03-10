import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const displayProgressRef = useRef(0);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname]);

  useEffect(() => {
    const getScrollTarget = () => {
      return document.getElementById("main-content") || window;
    };

    const getScrollValues = (target) => {
      if (target === window) {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;

        return { scrollTop, docHeight };
      }

      return {
        scrollTop: target.scrollTop,
        docHeight: target.scrollHeight - target.clientHeight,
      };
    };

    const handleScroll = () => {
      const target = getScrollTarget();
      const { scrollTop, docHeight } = getScrollValues(target);

      const scrollPercent = docHeight ? scrollTop / docHeight : 0;

      setProgress(scrollPercent);
      setIsVisible(scrollTop > 120);
    };

    // Keep both listeners to support the in-app scroll container and fallback pages.
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Run once so the ring/button are correct after mount or page restore.
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, true);

      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    let frameId;
    const duration = 220;
    const from = displayProgressRef.current;
    const to = progress;

    if (Math.abs(to - from) < 0.001) {
      displayProgressRef.current = to;
      setDisplayProgress(to);
      return;
    }

    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const nextValue = from + (to - from) * eased;

      displayProgressRef.current = nextValue;
      setDisplayProgress(nextValue);

      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [progress]);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - displayProgress);

  const scrollToTop = () => {
    const mainContent = document.getElementById("main-content");

    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-28 md:bottom-8 right-4 md:right-8 z-50">
      <div className="relative w-16 h-16">

        {/* Outer Ring */}
        <svg className="w-16 h-16 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#E6EEF2"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#2CB1A1"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Button */}
        <button
          onClick={scrollToTop}
          className="
            absolute inset-0 m-auto
            w-11 h-11
            bg-teal-600
            rounded-full
            flex items-center justify-center
            shadow-md
            hover:bg-teal-700
            transition
          "
          aria-label="Scroll to top"
        >
          {/* Arrow */}
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

      </div>
    </div>
  );
}
