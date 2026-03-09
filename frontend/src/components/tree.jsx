import { useEffect, useRef } from "react";

const Tree = ({ rootXPos = 0.5, rootYPos = 1, scale = 1 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Configuration
        let startLength;

        // Resize & Setup
        const setup = () => {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            // Scaleable organic size
            startLength = Math.min(canvas.width, canvas.height) * 0.35 * scale;
        };
        window.addEventListener("resize", setup);
        setup();

        let growthProgress = 0; 
        const growthSpeed = 0.008; 
        let time = 0;

        function drawBranch(x, y, len, angle, width, depth, currentProgress) {
            const maxD = 10;
            const normalizedDepth = (maxD - depth) / maxD; 

            const startGrow = normalizedDepth * 0.6; 
            const endGrow = startGrow + 0.4; 

            let localGrowth = (currentProgress - startGrow) / (endGrow - startGrow);
            localGrowth = Math.max(0, Math.min(1, localGrowth));

            // Ease out
            localGrowth = 1 - Math.pow(1 - localGrowth, 3);

            if (localGrowth <= 0.01) return; 

            const currentLen = len * localGrowth;

            ctx.beginPath();
            ctx.save();

            // Colors
            const hue = 160 - ((maxD - depth) * 8); 
            const light = 20 + ((maxD - depth) * 5); 

            ctx.strokeStyle = `hsl(${hue}, 70%, ${light}%)`;
            ctx.fillStyle = `hsl(${hue}, 70%, ${light}%)`;
            ctx.lineWidth = width * localGrowth; 

            ctx.translate(x, y);
            ctx.rotate(angle);

            ctx.moveTo(0, 0);
            ctx.lineTo(0, -currentLen);
            ctx.stroke();

            if (depth <= 1 || currentLen < 5) {
                if (localGrowth > 0.8) {
                    ctx.beginPath();
                    ctx.arc(0, -currentLen, 4 * localGrowth, 0, Math.PI / 2);
                    ctx.fillStyle = `rgba(250, 204, 21, ${localGrowth})`; 
                    ctx.fill();
                }
                ctx.restore();
                return;
            }

            ctx.translate(0, -currentLen);

            const sway = Math.sin(time + depth * 0.5) * 0.015;

            drawBranch(0, 0, len * 0.78, Math.PI / 5 + sway, width * 0.7, depth - 1, currentProgress);
            drawBranch(0, 0, len * 0.78, -Math.PI / 5 + sway, width * 0.7, depth - 1, currentProgress);

            ctx.restore();
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Subtle gradient background
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(1, "rgba(255,255,255,0.5)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            time += 0.015;
            if (growthProgress < 1) {
                growthProgress += growthSpeed;
            }

            const rootX = canvas.width * rootXPos;
            const rootY = canvas.height * rootYPos;

            // Straight up (angle 0)
            drawBranch(rootX, rootY, startLength, 0, 16, 10, growthProgress);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", setup);
            cancelAnimationFrame(animationFrameId);
        };
    }, [rootXPos, rootYPos]);

    return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default Tree;