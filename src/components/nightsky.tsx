import React, { useEffect, useRef } from "react";

interface Pixel {
  x: number;
  y: number;
  size: number;
  alpha: number;
  delta: number; // fade speed
}

interface MovingPixel {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
  fadeInSpeed: number;
  speed: number;
  trail: { x: number; y: number; alpha: number }[];
  life: number;
}

export default function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // ----- Static twinkling stars -----
    const starCount = 150;
    const stars: Pixel[] = [];

    const randomPixel = (): Pixel => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      alpha: 0,
      delta: Math.random() * 0.02 + 0.005,
    });

    for (let i = 0; i < starCount; i++) {
      stars.push(randomPixel());
    }

    // ----- Moving stars -----
    const movingStars: MovingPixel[] = [];
    const spawnRate = 0.01; // probability per frame

    const animate = () => {
      // Dark background with slight transparency for fading trails
      ctx.fillStyle = "rgba(11,15,26,0.2)";
      ctx.fillRect(0, 0, width, height);

      // ----- Draw static stars -----
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);

        star.alpha += star.delta;
        if (star.alpha >= 1) star.delta *= -1;
        if (star.alpha <= 0) Object.assign(star, randomPixel());
      });

      // ----- Spawn new moving stars -----
      if (Math.random() < spawnRate) {
        movingStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          targetX: Math.random() * width,
          targetY: Math.random() * height,
          size: Math.random() * 2 + 1.5,
          alpha: 0,
          fadeInSpeed: 0.05, // fast fade-in
          speed: 1 + Math.random() * 1.5,
          trail: [],
          life: 200 + Math.random() * 100,
        });
      }

      // ----- Draw and update moving stars -----
      for (let i = movingStars.length - 1; i >= 0; i--) {
        const p = movingStars[i];

        // Add current position to trail
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
        if (p.trail.length > 15) p.trail.shift();

        // Draw trail
        p.trail.forEach((t, index) => {
          ctx.fillStyle = `rgba(255,255,255,${t.alpha * (index / p.trail.length)})`;
          ctx.fillRect(t.x, t.y, p.size, p.size);
        });

        // Fade in quickly
        if (p.alpha < 1) p.alpha += p.fadeInSpeed;

        // Move toward target
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * 0.01 * p.speed;
        p.y += dy * 0.01 * p.speed;

        // Decrease life
        p.life--;
        if (p.life <= 0) movingStars.splice(i, 1);
      }

      requestAnimationFrame(animate);
    };

    animate();

    // ----- Resize handler -----
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
    />
  );
}