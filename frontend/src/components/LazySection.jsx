import { useRef, useState, useEffect } from 'react';

/**
 * LazySection — renders its children only when the section scrolls into (or near) the viewport.
 *
 * Uses IntersectionObserver to defer rendering of heavy / data-fetching components
 * until the user actually scrolls to them, preventing simultaneous API calls
 * and large JS bundle evaluations on initial page load.
 *
 * @param {React.ReactNode}  children    – content to render once visible
 * @param {React.ReactNode}  fallback    – placeholder shown before the section enters the viewport
 * @param {string}           rootMargin  – how far *before* the viewport to trigger (default "200px")
 * @param {string}           className   – optional className for the wrapper div
 * @param {number}           minHeight   – optional min-height to prevent layout shift (px)
 */
export default function LazySection({
  children,
  fallback = null,
  rootMargin = '200px',
  className = '',
  minHeight,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Once visible, never re-hide
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={!isVisible && minHeight ? { minHeight } : undefined}
    >
      {isVisible ? children : fallback}
    </div>
  );
}
