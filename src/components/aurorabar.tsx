import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuroraPoint = { x: number; y: number };

type Gap = {
  start:   number;
  end:     number;
  fadeLen: number;
};

type AuroraLayer = {
  color:    string;
  baseLine: AuroraPoint[];
  gaps:     Gap[];
};

// x-range claimed by a loop — shared across all layers
type LoopZone = { xStart: number; xEnd: number };

type BaselinePhase = "forward" | "back" | "return";

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_HEIGHT  = 200;
const Y_PAD_TOP      = CANVAS_HEIGHT * 0.10;
const Y_PAD_BOTTOM   = CANVAS_HEIGHT * 0.80;
const BOTTOM_FADE_START = CANVAS_HEIGHT * 0.55;
const BOTTOM_FADE_END   = CANVAS_HEIGHT * 0.82;
const GAP_FADE_LEN   = 50;
const GAP_MIN_LEN    = 100;
const GAP_MAX_COVER  = 0.5;

// Minimum horizontal gap between any two loops across all layers
const LOOP_EXCLUSION_BUFFER = 180;

const AURORA_COLORS = [
  "rgba(0,255,180,0.03)",
  "rgba(80,200,255,0.03)",
  "rgba(120,255,199,0.03)",
  "rgba(100,200,255,0.001)",
];

// ─── Gap helpers ──────────────────────────────────────────────────────────────

function generateGaps(totalPoints: number): Gap[] {
  const gaps: Gap[]  = [];
  const maxGapCount  = 1 + Math.floor(Math.random() * 5);
  const maxCovered   = Math.floor(totalPoints * GAP_MAX_COVER);
  let   totalCovered = 0;

  for (let attempt = 0; attempt < maxGapCount; attempt++) {
    const remaining = maxCovered - totalCovered;
    if (remaining < GAP_MIN_LEN) break;

    const maxLen = Math.min(remaining, Math.floor(totalPoints * 0.28));
    const len    = GAP_MIN_LEN + Math.floor(Math.random() * Math.max(1, maxLen - GAP_MIN_LEN));

    let placed = false;
    for (let t = 0; t < 12; t++) {
      const start  = Math.floor(Math.random() * (totalPoints - len));
      const end    = start + len;
      const buffer = GAP_FADE_LEN * 2;
      const overlaps = gaps.some(g => start < g.end + buffer && end > g.start - buffer);

      if (!overlaps) {
        gaps.push({ start, end, fadeLen: GAP_FADE_LEN });
        totalCovered += len;
        placed = true;
        break;
      }
    }
    if (!placed) break;
  }
  return gaps;
}

function gapAlpha(i: number, gaps: Gap[]): number {
  for (const gap of gaps) {
    if (i < gap.start || i >= gap.end) continue;
    const fromStart = i - gap.start;
    const fromEnd   = gap.end - 1 - i;
    if (fromStart < gap.fadeLen) return 1 - fromStart / gap.fadeLen;
    if (fromEnd   < gap.fadeLen) return 1 - fromEnd   / gap.fadeLen;
    return 0;
  }
  return 1;
}

// ─── Baseline generation with shared loop-zone exclusion ─────────────────────

function generateBaseLine(
  width:          number,
  forbiddenZones: LoopZone[],
  outZones:       LoopZone[],
): AuroraPoint[] {
  const points: AuroraPoint[] = [];

  let x     = 0;
  let y     = Y_PAD_TOP + Math.random() * (Y_PAD_BOTTOM - Y_PAD_TOP);
  let phase: BaselinePhase = "forward";
  let loopStartX  = 0;
  let loopDepth   = 0;
  let loopTargetY = y;

  const maxPoints = width * 4;

  while (x <= width && points.length < maxPoints) {
    y = Math.max(Y_PAD_TOP, Math.min(Y_PAD_BOTTOM, y));
    points.push({ x, y });

    switch (phase) {
      case "forward": {
        y += (Math.random() - 0.5) * 10;
        const jitter = Math.random() < 0.02 ? -(Math.random() * 5) : 0;
        x += 1 + jitter;

        if (Math.random() < 0.0025 && x > 80 && x < width * 0.85) {
          const tentativeDepth = 60 + Math.random() * Math.min(260, x - 60);
          const tentativeStart = x - tentativeDepth;
          const allZones = [...forbiddenZones, ...outZones];
          const isTaken  = allZones.some(
            z => tentativeStart - LOOP_EXCLUSION_BUFFER < z.xEnd &&
                 x              + LOOP_EXCLUSION_BUFFER > z.xStart,
          );

          if (!isTaken) {
            phase      = "back";
            loopStartX = x;
            loopDepth  = tentativeDepth;
            outZones.push({ xStart: tentativeStart, xEnd: x });

            const shift = (15 + Math.random() * 55) * (Math.random() < 0.5 ? 1 : -1);
            loopTargetY = Math.max(Y_PAD_TOP, Math.min(Y_PAD_BOTTOM, y + shift));
          }
        }
        break;
      }

      case "back": {
        y += (loopTargetY - y) * 0.035 + (Math.random() - 0.5) * 7;
        x -= 1 + Math.random() * 0.8;

        if (x <= loopStartX - loopDepth) {
          phase = "return";
          if (Math.random() < 0.25) {
            const innerDepth  = 30 + Math.random() * 60;
            const allZones    = [...forbiddenZones, ...outZones];
            const innerTaken  = allZones.some(
              z => (x - innerDepth) - LOOP_EXCLUSION_BUFFER < z.xEnd &&
                   x               + LOOP_EXCLUSION_BUFFER > z.xStart,
            );
            if (!innerTaken) {
              outZones.push({ xStart: x - innerDepth, xEnd: x });
              loopDepth  = innerDepth;
              loopStartX = x;
              const shift = (10 + Math.random() * 30) * (Math.random() < 0.5 ? 1 : -1);
              loopTargetY = Math.max(Y_PAD_TOP, Math.min(Y_PAD_BOTTOM, y + shift));
              phase = "back";
            }
          }
        }
        break;
      }

      case "return": {
        y += (Math.random() - 0.5) * 10;
        x += 1 + Math.random() * 0.5;
        if (x >= loopStartX) phase = "forward";
        break;
      }
    }
  }

  return points;
}

// ─── Layer collection ─────────────────────────────────────────────────────────

function generateAllLayers(width: number): AuroraLayer[] {
  const allLoopZones: LoopZone[] = [];

  return AURORA_COLORS.map((color) => {
    const newZones: LoopZone[] = [];
    const baseLine = generateBaseLine(width, allLoopZones, newZones);
    allLoopZones.push(...newZones);
    return { color, baseLine, gaps: generateGaps(baseLine.length) };
  });
}

// ─── Draw ─────────────────────────────────────────────────────────────────────

function drawLightLine(ctx: CanvasRenderingContext2D, layer: AuroraLayer, width: number): void {
  const { color, baseLine, gaps } = layer;
  const fadeWidth = 1000;

  baseLine.forEach((p, i) => {
    let edgeFade = 1;
    if (p.x < fadeWidth)         edgeFade = p.x / fadeWidth;
    if (p.x > width - fadeWidth) edgeFade = (width - p.x) / fadeWidth;
    edgeFade = Math.max(0, Math.min(1, edgeFade));

    let bottomFade = 1;
    if (p.y >= BOTTOM_FADE_START) {
      bottomFade = Math.max(0, 1 - (p.y - BOTTOM_FADE_START) / (BOTTOM_FADE_END - BOTTOM_FADE_START));
    }

    const combinedFade = edgeFade * bottomFade * gapAlpha(i, gaps);
    if (combinedFade <= 0) return;

    const bloomWidth = 3 + Math.random() * 3;
    const alpha      = (0.05 + Math.random() * 0.15) * combinedFade;
    const maxHeight  = p.y * (0.4 + Math.random() * 0.8);
    const topY       = Math.max(p.y - maxHeight, -100);

    const gradient   = ctx.createLinearGradient(p.x, p.y, p.x, topY);
    gradient.addColorStop(0, color.replace(/[\d.]+\)$/g, `${alpha})`));
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(p.x - bloomWidth / 2, topY, bloomWidth, p.y - topY);
  });
}

function drawAll(ctx: CanvasRenderingContext2D, layers: AuroraLayer[], width: number): void {
  ctx.clearRect(0, 0, width, CANVAS_HEIGHT);
  for (const layer of layers) drawLightLine(ctx, layer, width);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuroraBar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const dpr    = window.devicePixelRatio || 1;
    let width    = window.innerWidth;

    const applySize = () => {
      canvas.width        = width * dpr;
      canvas.height       = CANVAS_HEIGHT * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${CANVAS_HEIGHT}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    applySize();
    let layers: AuroraLayer[] = generateAllLayers(width);
    drawAll(ctx, layers, width);

    const handleResize = () => {
      width = window.innerWidth;
      applySize();
      layers = generateAllLayers(width);
      drawAll(ctx, layers, width);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        `${CANVAS_HEIGHT}px`,
        zIndex:        0,
        pointerEvents: "none",
      }}
    />
  );
}