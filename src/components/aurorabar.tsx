import React, { useEffect, useRef } from "react";

type AuroraPoint = {
  x: number;
  y: number;
};

type AuroraLayer = {
  color: string;
  baseLine: AuroraPoint[];
};

export default function AuroraBar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // ------------------------
    // Initialize dimensions
    // ------------------------
    let width = window.innerWidth;
    let height = 200;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    const layers: AuroraLayer[] = [];

    // ------------------------
    // Aurora Colors
    // ------------------------
    const baseColors = [
      "rgba(0,255,180,0.03)",     // original greenish
      "rgba(80,200,255,0.03)",    // original cyan
      "rgba(120, 255, 199, 0.03)",   // original light green
    ];

    const extraColors = [
      "rgba(100, 200, 255, 0.001)",   // soft blue
    ];

    const colors = [...baseColors, ...extraColors];

    // ------------------------
    // Generate Base Line
    // ------------------------
    function generateBaseLine(): AuroraPoint[] {
      const points: AuroraPoint[] = [];
      let x = 0;
      let y = height * (0.3 + Math.random() * 0.5);

      while (x <= width) {
        y += (Math.random() - 0.5) * 10;
        y = Math.max(0, Math.min(height, y));

        points.push({ x, y });

        x += 1;
        if (Math.random() < 0.02) {
          x -= Math.random() * 5;
        }
      }
      return points;
    }

    // ------------------------
    // Generate Aurora Layers
    // ------------------------
    function generateLayer(color: string): AuroraLayer {
      return {
        color,
        baseLine: generateBaseLine(),
      };
    }

    function generateAll() {
      layers.length = 0;
      colors.forEach((c) => layers.push(generateLayer(c)));
    }

    // ------------------------
    // Draw Light Line with side fade
    // ------------------------
    function drawLightLine(baseLine: AuroraPoint[], color: string) {
      const fadeWidth = 1000; 

      for (const p of baseLine) {
        const bloomWidth = 3 + Math.random() * 3;

        // compute horizontal fade factor
        let fadeFactor = 1;
        if (p.x < fadeWidth) fadeFactor = p.x / fadeWidth;
        if (p.x > width - fadeWidth) fadeFactor = (width - p.x) / fadeWidth;

        const alpha = (0.05 + Math.random() * 0.15) * fadeFactor;

        // Randomized height
        const maxHeight = p.y * (0.4 + Math.random() * 0.8);
        const topY = Math.max(p.y - maxHeight, -100);

        const gradient = ctx.createLinearGradient(p.x, p.y, p.x, topY);
        gradient.addColorStop(0, color.replace(/[\d\.]+\)$/g, `${alpha})`));
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(p.x - bloomWidth / 2, topY, bloomWidth, p.y - topY);
      }
    }

    // ------------------------
    // Draw All Layers
    // ------------------------
    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (const layer of layers) {
        drawLightLine(layer.baseLine, layer.color);
      }
    }

    generateAll();
    draw();

    // ------------------------
    // Resize Handling
    // ------------------------
    const handleResize = () => {
      width = window.innerWidth;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);

      generateAll();
      draw();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "160px",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}