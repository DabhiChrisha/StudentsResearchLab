import FloatingLines from "./FloatingLines";

const ParticleBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <FloatingLines
                linesGradient={["#E945F5", "#2F4BC0", "#E945F5"]}
                animationSpeed={1}
                interactive
                bendRadius={5}
                bendStrength={-0.5}
                mouseDamping={0.05}
                parallax
                parallaxStrength={0.2}
            />
        </div>
    );
};

export default ParticleBackground;
