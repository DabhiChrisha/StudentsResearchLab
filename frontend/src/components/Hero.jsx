import { useState, useEffect } from "react";
import { getImageUrl } from "../lib/imageUrl";

const srlLogo = getImageUrl("/SRL.svg");

export default function Hero() {
  const [current, setCurrent] = useState(0);
  // Only slide 0 loads on mount; slides 1 & 2 unlock after 3s
  const [unlockedSlides, setUnlockedSlides] = useState(new Set([0]));

  const slides = [
    {
      image: getImageUrl("frontend/src/assets/HERO.jpg"),
      align:
        "items-center text-center justify-end pb-24 md:items-end md:text-right md:justify-end md:pb-12",
    },
    {
      image: getImageUrl("frontend/src/assets/hero2.jpg"),
      align: "items-center text-center justify-start pt-10 md:pt-8",
    },
    {
      image: getImageUrl("frontend/src/assets/hero3.jpg"),
      align: "items-center text-center justify-start pt-10 md:pt-8",
    },
  ];

  // Defer loading slides 2 & 3 until after initial render settles
  useEffect(() => {
    const preload = setTimeout(
      () => setUnlockedSlides(new Set([0, 1, 2])),
      3000,
    );
    return () => clearTimeout(preload);
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden flex items-center justify-center bg-slate-900"
      style={{ height: "calc(100vh - var(--navbar-height, 70px))" }}
    >
      {/* ===== BACKGROUND SLIDES ===== */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* The Full Image - covers entire screen */}
          <img loading="lazy" decoding="async"
            src={unlockedSlides.has(index) ? slide.image : undefined}
            alt="hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}

      {/* ===== TEXT CONTAINER ===== */}
      <div
        className={`absolute inset-0 z-20 flex flex-col px-4 sm:px-6 md:px-16 pt-8
                ${slides[current].align}
                transition-all duration-700 pointer-events-none`}
      >
        <div className="w-full flex items-center justify-center">
          {current === 0 ? (
            /* SLIDE 1: Original Style */
            <div className="max-w-3xl ml-auto text-right self-end mt-auto mb-24 md:mb-0">
              <h1 className="text-white font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-lg leading-tight">
                Students Research Lab
              </h1>
              <p className="text-white/90 font-serif text-lg md:text-2xl drop-shadow mt-4 md:mt-6 leading-relaxed font-medium">
                Fostering a disciplined research culture, consistency in
                academic practice, and excellence through collaborative
                scholarly engagement.
              </p>
            </div>
          ) : (
            /* SLIDE 2 & 3: PERFECTLY CENTERED TOP LAYOUT */
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 animate-fade-up w-full max-w-7xl mx-auto px-4">
              {/* Logo */}
              <img loading="lazy" decoding="async"
                src={srlLogo}
                alt="SRL Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 drop-shadow-lg object-contain shrink-0 transition-all duration-700"
              />

              {/* Text Container - Same Size for Slide 2 & 3 */}
              <div className="flex flex-col justify-center text-center transition-all duration-700">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white font-serif font-bold tracking-tight drop-shadow-lg leading-none">
                  Students Research Lab (SRL)
                </h1>
                <p className="text-[10px] sm:text-sm md:text-base lg:text-xl text-white/90 font-serif drop-shadow-md mt-2 italic font-medium leading-tight max-w-4xl mx-auto">
                  "Fostering a disciplined research culture, consistency in
                  academic practice, and excellence through collaborative
                  scholarly engagement."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== DOT INDICATORS ===== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              current === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
