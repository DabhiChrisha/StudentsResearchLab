import { useEffect, useRef } from "react";

const tree = ({ noise = 0 }) => {
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
        const growthSpeed = 0.008; // speed of growth

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
            const hue = 160 - ((maxD - depth) * 8); // 160 -> 80
            const light = 20 + ((maxD - depth) * 3); // 20 -> 50

            ctx.strokeStyle = `hsl(${hue}, 70%, ${light}%)`;
            ctx.fillStyle = `hsl(${hue}, 70%, ${light}%)`;
            ctx.lineWidth = width * localGrowth; // Thickness also grows

            ctx.translate(x, y);
            ctx.rotate(angle);

            // Draw Limb
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -currentLen);
            ctx.stroke();

            if (depth <= 1 || currentLen < 5) {
                // Draw leaf or end bud if fully grown
                if (localGrowth > 0.8) {
                    ctx.beginPath();
                    ctx.arc(0, -currentLen, 4 * localGrowth, 0, Math.PI / 2);
                    ctx.fillStyle = `rgba(250, 204, 21, ${localGrowth})`; // Gold tint bud
                    ctx.fill();
                }
                ctx.restore();
                return;
            }

            ctx.translate(0, -currentLen);

            // Sway calculation
            const sway = Math.sin(time + depth * 0.5) * 0.015;

            // Recursive branches
            // Note: Passing x=0, y=0 because we translated the context
            drawBranch(0, 0, len * 0.78, Math.PI / 5 + sway, width * 0.7, depth - 1, currentProgress);
            drawBranch(0, 0, len * 0.78, -Math.PI / 5 + sway, width * 0.7, depth - 1, currentProgress);

            ctx.restore();
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Gradient Background (Subtle)
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "#f0fdfa");
            gradient.addColorStop(1, "#ffffff");
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

export default tree;