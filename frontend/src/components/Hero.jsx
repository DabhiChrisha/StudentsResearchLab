import { useState, useEffect } from "react";

// 👉 Using local assets provided in src/assets
import slide1 from "../assets/HERO.jpg";
import slide2 from "../assets/hero2.jpg";
import slide3 from "../assets/hero3.jpg";
import srlLogo from "/SRL.svg";

export default function Hero() {
    const [current, setCurrent] = useState(0);

    const slides = [
        {
            image: slide1,
            // Mobile: Center | Desktop: Top Right
            align: "justify-center items-center text-center md:justify-start md:items-end md:text-right md:pt-24 lg:pt-32",
        },
        {
            image: slide2,
            align: "items-center justify-center text-center",
        },
        {
            image: slide3,
            align: "items-center justify-center text-center",
        },
    ];

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section id="top" className="relative h-[80vh] lg:h-[85vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">

            {/* ===== BACKGROUND SLIDES ===== */}
            {slides.map((slide, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-in-out ${index === current ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"}`}
                >
                    <img
                        src={slide.image}
                        alt="hero"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>
            ))}

            {/* ===== TEXT CONTAINER ===== */}
            <div
                className={`absolute inset-0 z-20 flex flex-col px-4 sm:px-6 md:px-16 ${slides[current].align} transition-all duration-700 pointer-events-none`}
            >
                <div className="max-w-3xl w-full">

                    {/* LOGO on subsequent slides (index > 0) */}
                    {current > 0 && (
                        <img
                            src={srlLogo}
                            alt="SRL Logo"
                            className="w-16 md:w-24 mx-auto mb-4 drop-shadow-lg animate-fade-up"
                        />
                    )}

                    {/* 👉 YOUR EXACT TEXT STYLE */}
                    <h1 className="text-white font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-lg leading-tight">
                        Students Research Lab
                    </h1>

                    <p className="text-white/90 font-serif text-base md:text-xl drop-shadow mt-4 md:mt-6 leading-relaxed">
                        Fostering a disciplined research culture, consistency in academic
                        practice, and excellence through collaborative scholarly engagement.
                    </p>

                </div>
            </div>

            {/* ===== DOT INDICATORS ===== */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition ${current === index ? "bg-white" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>

        </section>
    );
}
