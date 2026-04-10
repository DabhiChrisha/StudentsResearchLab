import { useEffect, useRef } from "react";

const FloatingLines = ({
    enabledWaves = ["top", "middle", "bottom"],
    lineCount = [1, 1, 1],
    lineDistance = [12, 18, 16],
    amplitude = 60.00,       // wave height
    frequency = 0.05,      // wave density
    speed = 0.0005,        // animation speed
}) => {
    const rafRef = useRef(null);
    const pathRefs = useRef([]);

    useEffect(() => {
        let time = 0;
        
        const animate = () => {
            time += 1;
            
            // Update each path directly via DOM mutation to avoid React renders
            let pathIndex = 0;
            const waves = ["top", "middle", "bottom"];
            
            waves.forEach((wave, waveIndex) => {
                if (!enabledWaves.includes(wave)) return;

                const count = Array.isArray(lineCount)
                    ? lineCount[waveIndex]
                    : lineCount;

                const distance = Array.isArray(lineDistance)
                    ? lineDistance[waveIndex]
                    : lineDistance;

                for (let i = 0; i < count; i++) {
                    const baseY =
                        wave === "top"
                            ? 12 + i * distance
                            : wave === "middle"
                                ? 45 + i * distance
                                : 78 + i * distance;

                    const phase = time * speed + i * 0.6 + waveIndex * 1.5;

                    const y1 = baseY + Math.sin(phase) * amplitude;
                    const y2 = baseY + Math.sin(phase + frequency * 10) * amplitude;
                    const y3 = baseY + Math.sin(phase + frequency * 20) * amplitude;

                    const d = `
                        M 0 ${y1}
                        C 25 ${y2},
                          50 ${y3},
                          75 ${y2}
                        S 100 ${y1},
                          120 ${y3}
                    `;
                    
                    const pathEl = pathRefs.current[pathIndex];
                    if (pathEl) {
                        pathEl.setAttribute("d", d);
                    }
                    pathIndex++;
                }
            });

            rafRef.current = requestAnimationFrame(animate);
        };
        
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [enabledWaves, lineCount, lineDistance, amplitude, frequency, speed]);

    const waves = ["top", "middle", "bottom"];
    let renderIndex = 0;

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

                return Array.from({ length: count }).map((_, i) => {
                    const currentIndex = renderIndex++;
                    return (
                        <path
                            key={`${wave}-${i}`}
                            ref={el => pathRefs.current[currentIndex] = el}
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
