"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

// Image-Specific Colors (Bright Cyan on Dark Globe)
const IMAGE_LAND_COLOR = [0.2, 0.9, 0.8]; // Bright Cyan-Teal
const IMAGE_GLOW_COLOR = [0.1, 0.5, 0.5]; // Deep Teal Glow
const IMAGE_MARKER_COLOR = [1.0, 1.0, 1.0]; // White markers if any

const Earth = ({
  className,
  theta = 0.25,
  dark = 1,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 40000,
  mapBrightness = 6,
  baseColor = IMAGE_LAND_COLOR,
  glowColor = IMAGE_GLOW_COLOR,
  markerColor = IMAGE_MARKER_COLOR,
}) => {
  const canvasRef = useRef(null);

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
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [theta, dark, scale, diffuse, mapSamples, mapBrightness, baseColor, glowColor, markerColor]);

  return (
    <div
      className={cn(
        "z-[10] mx-auto flex w-full max-w-[350px] items-center justify-center",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          aspectRatio: "1",
        }}
      />
    </div>
  );
};

export default Earth;
