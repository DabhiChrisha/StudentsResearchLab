import { useEffect, useRef, useState } from "react";

const FloatingLines = ({
    enabledWaves = ["top", "middle", "bottom"],
    lineCount = [2, 2, 2],
    lineDistance = [8, 16, 14],
    amplitude = 80.00,       // wave height
    frequency = 0.05,      // wave density
    speed = 0.0005,        // animation speed
}) => {
    const [time, setTime] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        const animate = () => {
            setTime((t) => t + 1);
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const waves = ["top", "middle", "bottom"];

    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            {waves.map((wave, waveIndex) => {
                if (!enabledWaves.includes(wave)) return null;

                const count = Array.isArray(lineCount)
                    ? lineCount[waveIndex]
                    : lineCount;

                const distance = Array.isArray(lineDistance)
                    ? lineDistance[waveIndex]
                    : lineDistance;

                return Array.from({ length: count }).map((_, i) => {
                    const baseY =
                        wave === "top"
                            ? 12 + i * distance
                            : wave === "middle"
                                ? 45 + i * distance
                                : 78 + i * distance;

                    // 🌊 true wave motion
                    const phase = time * speed + i * 0.6 + waveIndex * 1.5;

                    const y1 = baseY + Math.sin(phase) * amplitude;
                    const y2 = baseY + Math.sin(phase + frequency * 10) * amplitude;
                    const y3 = baseY + Math.sin(phase + frequency * 20) * amplitude;

                    return (
                        <path
                            key={`${wave}-${i}`}
                            d={`
                M 0 ${y1}
                C 25 ${y2},
                  50 ${y3},
                  75 ${y2}
                S 100 ${y1},
                  120 ${y3}
              `}
                            fill="none"
                            stroke="rgba(19, 78, 74, 0.16)"
                            strokeWidth="0.45"
                        />
                    );
                });
            })}
        </svg>
    );
};

export default FloatingLines;
