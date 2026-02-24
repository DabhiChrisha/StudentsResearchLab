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
            align: "justify-center items-center text-center md:justify-start md:items-end md:text-right md:pt-32",
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
        <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">

            {/* ===== BACKGROUND SLIDES ===== */}
            {slides.map((slide, index) => (
                <img
                    key={index}
                    src={slide.image}
                    alt="hero"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* ===== TEXT CONTAINER ===== */}
            <div
                className={`absolute inset-0 flex flex-col px-4 sm:px-6 md:px-16 ${slides[current].align} transition-all duration-700`}
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
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
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
