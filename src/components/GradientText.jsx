import React from 'react';

export default function GradientText({
    children,
    className = "",
    colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
    animationSpeed = 8,
    showBorder = false,
    animateOnHover = false,
}) {
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        animationDuration: `${animationSpeed}s`,
    };

    return (
        <div className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium transition-shadow duration-500 ${className} ${animateOnHover ? 'hover:animate-gradient-slow' : ''}`}>
            {showBorder && (
                <div
                    className="absolute inset-0 bg-cover animate-gradient-slow rounded-[1.25rem]"
                    style={gradientStyle}
                >
                    <div className="absolute inset-[1px] bg-white rounded-[1.25rem]" />
                </div>
            )}
            <div
                className="relative z-10 inline-block bg-cover bg-clip-text text-transparent animate-gradient-slow"
                style={gradientStyle}
            >
                {children}
            </div>
        </div>
    );
}
