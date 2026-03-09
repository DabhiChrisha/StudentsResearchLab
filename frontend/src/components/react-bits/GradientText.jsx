import React from 'react';

export default function GradientText({
  children,
  className = "",
  colors = ["#16B29D", "#4079ff", "#16B29D", "#4079ff", "#16B29D"], // Using SRL primary color
  animationSpeed = 8,
  showBorder = false,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] transition-shadow duration-500 ${className}`}>
      {showBorder && (
        <div
          className="absolute inset-0 block h-full w-full animate-gradient bg-[length:300%_100%] [mask-image:linear-gradient(#fff,#fff),linear-gradient(#fff,#fff)] [mask-clip:padding-box,border-box] [mask-composite:intersect] [border:2px_solid_transparent] rounded-[1.25rem]"
          style={gradientStyle}
        ></div>
      )}
      <h1
        className="relative z-10 animate-gradient bg-[length:300%_100%] bg-clip-text text-transparent leading-normal py-2"
        style={gradientStyle}
      >
        {children}
      </h1>
      
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 300% 100%;
          animation: gradient var(--duration, 8s) linear infinite;
        }
      `}</style>
    </div>
  );
}
