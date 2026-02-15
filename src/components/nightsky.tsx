import React, { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StarState = "fadingIn" | "holding" | "fadingOut";

interface StaticStar {
  x: number;
  y: number;
  size: number;
  alpha: number;
  delta: number;
  holdTime: number;
  state: StarState;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

interface ShootingStar {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
  fadeInSpeed: number;
  speed: number;
  trail: TrailPoint[];
  life: number;
  age: number;
}

// ─── Static star helpers ──────────────────────────────────────────────────────

function makeStaticStar(width: number, height: number): StaticStar {
  return {
    x:        Math.random() * width,
    y:        Math.random() * height,
    size:     Math.random() * 1 + 0.5,
    alpha:    0,
    delta:    0.003 + Math.random() * 0.002,
    holdTime: 20 + Math.floor(Math.random() * 40),
    state:    "fadingIn",
  };
}

function resetStaticStar(star: StaticStar, width: number, height: number): void {
  star.x        = Math.random() * width;
  star.y        = Math.random() * height;
  star.size     = Math.random() * 1 + 0.5;
  star.alpha    = 0;
  star.delta    = 0.003 + Math.random() * 0.002;
  star.holdTime = 20 + Math.floor(Math.random() * 40);
  star.state    = "fadingIn";
}

function tickStaticStar(
  star: StaticStar,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  // Draw
  ctx.shadowBlur  = 4;
  ctx.shadowColor = "rgba(200, 220, 255, 0.8)";
  ctx.fillStyle   = `rgba(255,255,255,${star.alpha})`;
  ctx.fillRect(star.x, star.y, star.size, star.size);

  // Advance state
  switch (star.state) {
    case "fadingIn":
      star.alpha += star.delta;
      if (star.alpha >= 1) { star.alpha = 1; star.state = "holding"; }
      break;
    case "holding":
      if (--star.holdTime <= 0) star.state = "fadingOut";
      break;
    case "fadingOut":
      star.alpha -= star.delta;
      if (star.alpha <= 0) resetStaticStar(star, width, height);
      break;
  }
}

// ─── Shooting star helpers ────────────────────────────────────────────────────

function makeShootingStar(width: number, height: number): ShootingStar {
  const x    = Math.random() * width;
  const y    = Math.random() * height;
  const dist = 120 + Math.random() * 280;
  const angle = (Math.random() * 60 + 20) * (Math.PI / 180); // 20°–80° diagonal
  return {
    x, y,
    targetX:    x + Math.cos(angle) * dist,
    targetY:    y + Math.sin(angle) * dist,
    size:       Math.random() * 1.5 + 1,
    alpha:      0,
    fadeInSpeed:0.12 + Math.random() * 0.06,
    speed:      3 + Math.random() * 3,
    trail:      [],
    life:       40 + Math.random() * 40,
    age:        0,
  };
}

function tickShootingStar(
  star: ShootingStar,
  ctx: CanvasRenderingContext2D,
): boolean {
  // Add trail point
  star.trail.push({ x: star.x, y: star.y, alpha: star.alpha });
  if (star.trail.length > 12) star.trail.shift();

  // Draw trail
  for (let i = 1; i < star.trail.length; i++) {
    const prev = star.trail[i - 1];
    const curr = star.trail[i];
    const t    = i / star.trail.length;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.strokeStyle = `rgba(220,235,255,${curr.alpha * 0.35 * t})`;
    ctx.lineWidth   = star.size * t;
    ctx.shadowBlur  = 2;
    ctx.shadowColor = "white";
    ctx.stroke();
    ctx.closePath();
  }

  // Update alpha
  const fadeFrames = Math.floor(star.life * 0.2);
  if (star.age < fadeFrames) {
    star.alpha = Math.min(star.alpha + star.fadeInSpeed, 1);
  } else {
    star.alpha = Math.max((star.life - star.age) / (star.life - fadeFrames), 0);
  }

  // Move toward target
  const dx   = star.targetX - star.x;
  const dy   = star.targetY - star.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 0) {
    star.x += (dx / dist) * star.speed;
    star.y += (dy / dist) * star.speed;
  }

  // Draw head
  ctx.shadowBlur  = 5;
  ctx.shadowColor = "rgba(200,220,255,0.9)";
  ctx.fillStyle   = `rgba(255,255,255,${star.alpha})`;
  ctx.fillRect(star.x, star.y, star.size, star.size);

  star.age++;
  return star.alpha > 0 && star.age < star.life;
}

// ─── Component ────────────────────────────────────────────────────────────────

const STATIC_COUNT  = 400;
const SPAWN_CHANCE  = 0.004; // probability per frame of a new shooting star
const BG_COLOR      = "rgb(8, 8, 14)";

export default function NightSky(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width  = window.innerWidth;
    let height = window.innerHeight;

    // Size canvas for DPR
    const resize = () => {
      width  = window.innerWidth;
      height = window.innerHeight;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Create static star pool — these persist across resizes (positions clamp naturally)
    const staticStars: StaticStar[] = Array.from(
      { length: STATIC_COUNT },
      () => makeStaticStar(width, height),
    );

    // Stagger initial states so they don't all fade in at once
    staticStars.forEach((s) => {
      const roll = Math.random();
      if (roll < 0.33) {
        s.state = "holding";
        s.alpha = 1;
      } else if (roll < 0.66) {
        s.state = "fadingIn";
        s.alpha = Math.random();
      }
    });

    let shootingStars: ShootingStar[] = [];
    let rafId: number;

    const animate = () => {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      // Static stars
      ctx.shadowBlur = 0;
      for (const star of staticStars) {
        tickStaticStar(star, ctx, width, height);
      }

      // Shooting stars
      if (Math.random() < SPAWN_CHANCE) {
        shootingStars.push(makeShootingStar(width, height));
      }
      shootingStars = shootingStars.filter((s) => tickShootingStar(s, ctx));

      ctx.shadowBlur  = 0;
      ctx.shadowColor = "transparent";

      rafId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      // Cancel current frame, resize, restart
      cancelAnimationFrame(rafId);
      ctx.resetTransform();
      resize();
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top:      0,
        left:     0,
        zIndex:   0,
        width:    "100%",
        height:   "100%",
        pointerEvents: "none",
      }}
    />
  );
}