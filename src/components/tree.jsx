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

        function drawBranch(x, y, len, angle, width, depth, currentProgress, pathIndex) {
            const maxD = 10;
            const normalizedDepth = (maxD - depth) / maxD;
            const startGrow = normalizedDepth * 0.6;
            const endGrow = startGrow + 0.4;

            let localGrowth = (currentProgress - startGrow) / (endGrow - startGrow);
            localGrowth = Math.max(0, Math.min(1, localGrowth));
            localGrowth = 1 - Math.pow(1 - localGrowth, 3);

            if (localGrowth <= 0.01) return;

            const currentLen = len * localGrowth;

            ctx.beginPath();
            ctx.save();

            // Realistic bark color: Dark brown that gets slightly lighter at the tips
            const barkHue = 25;
            const barkSat = 35;
            const barkLight = 15 + ((maxD - depth) * 1.5);
            ctx.strokeStyle = `hsl(${barkHue}, ${barkSat}%, ${barkLight}%)`;
            ctx.fillStyle = ctx.strokeStyle;
            ctx.lineWidth = width * localGrowth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.translate(x, y);
            ctx.rotate(angle);

            ctx.moveTo(0, 0);
            ctx.lineTo(0, -currentLen);
            ctx.stroke();

            // Draw Leaves
            if (depth <= 2 || currentLen < 15) {
                if (localGrowth > 0.5) {
                    const leafGrowth = (localGrowth - 0.5) * 2; // 0 to 1

                    // Pseudo-random factors based on pathIndex to make leaves look organic but stable
                    const rand1 = Math.abs(Math.sin(pathIndex * 11.23));
                    const rand2 = Math.abs(Math.cos(pathIndex * 17.54));

                    const leafHue = 100 + (rand1 * 40); // Greens and slight yellow-greens
                    const leafLight = 30 + (rand2 * 20); // Varying lightness

                    ctx.beginPath();
                    // Organic leaf cluster shape
                    ctx.ellipse(0, -currentLen, 12 * leafGrowth * (0.8 + rand1 * 0.5), 20 * leafGrowth * (0.8 + rand2 * 0.5), rand1 * Math.PI, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${leafHue}, 70%, ${leafLight}%, ${0.85 * leafGrowth})`;
                    ctx.fill();

                    // Add a tiny secondary leaf for density
                    ctx.beginPath();
                    ctx.ellipse((rand1 - 0.5) * 10, -currentLen + (rand2 - 0.5) * 10, 8 * leafGrowth, 12 * leafGrowth, rand2 * Math.PI, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${leafHue - 15}, 80%, ${leafLight - 10}%, ${0.9 * leafGrowth})`;
                    ctx.fill();
                }
                ctx.restore();
                return;
            }

            ctx.translate(0, -currentLen);

            // Sway calculation
            const sway = Math.sin(time + depth * 0.3) * 0.01;

            // Pseudo-random asymmetrical branching parameters to look realistic without flickering
            const angleNoise1 = Math.sin(pathIndex * 13.9) * 0.15;
            const angleNoise2 = Math.cos(pathIndex * 21.5) * 0.15;
            const lenNoise1 = Math.abs(Math.sin(pathIndex * 7.1)) * 0.15;
            const lenNoise2 = Math.abs(Math.cos(pathIndex * 9.3)) * 0.15;

            // Draw organic branches (2-way split usually looks most like a classic oak/maple)
            drawBranch(0, 0, len * (0.75 + lenNoise1), Math.PI / 6 + angleNoise1 + sway, width * 0.7, depth - 1, currentProgress, pathIndex * 2 + 1);

            // Occasionally sprout a small center branch for fullness
            if (Math.abs(Math.sin(pathIndex)) > 0.5) {
                drawBranch(0, 0, len * 0.5, (angleNoise1 - angleNoise2) * 0.5 + sway, width * 0.5, depth - 2, currentProgress, pathIndex * 2 + 2);
            }

            drawBranch(0, 0, len * (0.78 + lenNoise2), -Math.PI / 5 + angleNoise2 + sway, width * 0.7, depth - 1, currentProgress, pathIndex * 2 + 3);

            ctx.restore();
        }

        const render = () => {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            time += 0.015;
            if (growthProgress < 1) {
                growthProgress += growthSpeed;
            }

            // Tree Root Position
            const rootX = canvas.width * 0.15;
            const rootY = canvas.height;

            // Initial Call (x, y, len, angle, width, depth, progress, pathIndex)
            drawBranch(rootX, rootY, startLength, 0.05, 25, 10, growthProgress, 1);

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