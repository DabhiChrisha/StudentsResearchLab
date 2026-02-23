import { useEffect, useRef } from "react";

const TreeBackground = ({ noise = 0 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Configuration
        // Increased start length for "Bigger"
        const startLength = Math.min(window.innerWidth, window.innerHeight) * 0.25;
        // Growth Animation State
        let growthProgress = 0; // 0 to 1
        const growthSpeed = 0.025; // Flash growth for extreme intensity
        const maxD = 10;

        // Resize & Setup
        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", setup);
        setup();

        let time = 0;

        function drawBranch(x, y, len, angle, width, depth, currentProgress) {
            // Stop if not grown enough to reach this depth
            // We map depth 10 -> 0 to progress 0 -> 1 ?
            // Or simpler: entire tree scales up? Or branches extend out?
            // "Growing from roots": The length extends from 0 to full length at each level sequentially or simultaneously.
            // Let's do sequential ease-out per level or global scale.

            // Simpler "Growing" Model:
            // The tree has a max depth. The current visible depth depends on growthProgress.
            // If growthProgress is 0.5, we show 50% of the tree (e.g. depth 10 to 5)

            // Let's use a "global" growth factor that affects length.
            // But true organic growth means trunk grows first, then branches.

            // Implementation:
            // The effective length of this branch is determined by `growthProgress` relative to its depth.
            // Root (depth 10) grows first. Tips (depth 1) grow last.
            // Let's map growthProgress (0-1) to the tree levels.

            // Offset growth: Depth 10 starts at 0.0, finishes at 0.3
            // Depth 9 starts at 0.1, finishes at 0.4 ...

            // Normalized "start time" for this branch based on depth (inverted, 10 is root)
            const maxD = 10;
            const normalizedDepth = (maxD - depth) / maxD; // 0 for root, 0.9 for tips

            // When does this branch start growing?
            const startGrow = normalizedDepth * 0.6; // Staggered start
            const endGrow = startGrow + 0.4; // Valid window

            // Calculate local growth (0 to 1) for this specific branch
            let localGrowth = (currentProgress - startGrow) / (endGrow - startGrow);
            localGrowth = Math.max(0, Math.min(1, localGrowth));

            // Ease out
            localGrowth = 1 - Math.pow(1 - localGrowth, 3);

            if (localGrowth <= 0.01) return; // Don't draw if not started

            const currentLen = len * localGrowth;

            ctx.beginPath();
            ctx.save();

            // More attractive colors: Gradient for trunk?
            // Use HSL for richer green-goldshift
            // Depth 10 (root) -> Dark Emerald (160, 100%, 20%)
            // Depth 1 (tips) -> Vibrant Gold-Green (80, 80%, 40%)
            const hue = 160 - ((maxD - depth) * 6); // 160 (Emerald) -> 100 (Leaf Green)
            const light = 15 + ((maxD - depth) * 5); // 15% -> 65% (Deeper Contrast)

            ctx.strokeStyle = `hsl(${hue}, 100%, ${light}%)`;
            ctx.fillStyle = `hsl(${hue}, 100%, ${light}%)`;
            ctx.lineWidth = width * 10.0 * localGrowth; // Hyper Surge
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(0,0,0,0.5)"; // Maximum depth

            ctx.translate(x, y);
            ctx.rotate(angle);

            // Draw Limb
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -currentLen);
            ctx.stroke();

            if (depth <= 1 || currentLen < 5) {
                // Draw enhanced floral buds if fully grown
                if (localGrowth > 0.6) {
                    ctx.beginPath();
                    ctx.arc(0, -currentLen, 16 * localGrowth, 0, Math.PI * 2); // Massive buds
                    ctx.fillStyle = `rgba(16, 185, 129, ${localGrowth * 0.98})`; // Vivid Emerald
                    ctx.fill();

                    // Luminous core for "sparkle"
                    ctx.beginPath();
                    ctx.arc(0, -currentLen, 8 * localGrowth, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowBlur = 30;
                    ctx.shadowColor = "#10b981";
                    ctx.fill();
                    ctx.shadowBlur = 0; // Reset
                }
                ctx.restore();
                return;
            }

            ctx.translate(0, -currentLen);

            // Sway calculation
            const sway = Math.sin(time + depth * 0.5) * 0.015;

            // Recursive branches - Triple Branching for extreme density
            drawBranch(0, 0, len * 0.75, Math.PI / 4.5 + sway, width * 0.65, depth - 1, currentProgress);
            drawBranch(0, 0, len * 0.82, 0 + sway, width * 0.65, depth - 1, currentProgress);
            drawBranch(0, 0, len * 0.75, -Math.PI / 4.5 + sway, width * 0.65, depth - 1, currentProgress);

            ctx.restore();
        }

        const render = () => {
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
            );
            gradient.addColorStop(0, "#d1fae5"); // Brighter center
            gradient.addColorStop(1, "#6ee7b7"); // Deep Emerald wash for maximum punch
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            time += 0.015;
            if (growthProgress < 1) {
                growthProgress += growthSpeed;
            }

            // Tree Root Position - More Left
            const rootX = canvas.width * 0.15;
            const rootY = canvas.height;

            // Initial Call (x, y, len, angle, width, depth, progress)
            drawBranch(rootX, rootY, startLength, 0.2, 18, 10, growthProgress);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", setup);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />;
};

export default TreeBackground;