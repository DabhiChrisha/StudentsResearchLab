"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Premium Realistic Earth Palette
const EARTH_GREEN = [0.52, 0.92, 0.86];      // Natural Forest Green (Land)
const ATMOSPHERE_BLUE = [0.2, 0.7, 0.8];  // Atmospheric Sky Blue (Glow)
const HIGHLIGHT_WHITE = [1.0, 1.0, 1.0];  // Cloud Highlights (Markers)

const Earth = ({
  className,
  theta = 0.55,
  dark = 2,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 18000,
  mapBrightness = 9,
  baseColor = EARTH_GREEN,
  glowColor = ATMOSPHERE_BLUE,
  markerColor = HIGHLIGHT_WHITE,
}) => {
  const canvasRef = useRef(null);
  const rotationSpeed = useRef(0.003);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta,
      dark,
      scale,
      diffuse,
      mapSamples,
      mapBrightness,
      baseColor,
      glowColor,
      markerColor,
      opacity: 1,
      offset: [0, 0],
      markers: [],
      onRender: (state) => {
        state.phi = phi;
        phi += rotationSpeed.current;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [theta, dark, scale, diffuse, mapSamples, mapBrightness, baseColor, glowColor, markerColor]);

  useEffect(() => {
    rotationSpeed.current = isHovered ? 0.012 : 0.003;
  }, [isHovered]);

  return (
    <motion.div
      className={cn(
        "z-[10] mx-auto flex w-full max-w-[350px] items-center justify-center cursor-pointer",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          aspectRatio: "1",
          filter: isHovered ? "drop-shadow(0 0 20px rgba(147, 180, 234, 0.4))" : "none",
          transition: "filter 0.3s ease",
        }}
      />
    </motion.div>
  );
};

export default Earth;

