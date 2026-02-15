import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuroraPoint = {
  x: number;
  y: number;
};

type Gap = {
  start:   number; // index into points array where gap begins
  end:     number; // index into points array where gap ends (exclusive)
  fadeLen: number; // number of points on each edge that fade in/out
};

type AuroraLayer = {
  color:    string;
  baseLine: AuroraPoint[];
  gaps:     Gap[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_HEIGHT   = 200;

// Vertical padding: baseline y is clamped to this band.
// Keeps aurora off the very top and bottom edges of the bar.
const Y_PAD_TOP    = CANVAS_HEIGHT * 0.10; 
const Y_PAD_BOTTOM = CANVAS_HEIGHT * 0.80;   

// Bottom fade: alpha is multiplied by 0 as p.y approaches BOTTOM_FADE_START
const BOTTOM_FADE_START = CANVAS_HEIGHT * 0.55; // fade begins here
const BOTTOM_FADE_END   = CANVAS_HEIGHT * 0.82; // fully transparent here

// Gap config
const GAP_FADE_LEN  = 50;  // points on each gap edge that transition
const GAP_MIN_LEN   = 100; // shortest permissible gap
const GAP_MAX_COVER = 0.5; // max fraction of a layer's points that can be gaps

const AURORA_COLORS = [
  "rgba(0,255,180,0.03)",
  "rgba(80,200,255,0.03)",
  "rgba(120,255,199,0.03)",
  "rgba(100,200,255,0.001)",
];

// ─── Gap helpers ──────────────────────────────────────────────────────────────

/**
 * Generate between 1 and 5 non-overlapping gaps for a layer,
 * capped so their total length never exceeds GAP_MAX_COVER * totalPoints.
 */
function generateGaps(totalPoints: number): Gap[] {
  const gaps: Gap[]    = [];
  const maxGapCount    = 1 + Math.floor(Math.random() * 5); // 1–5
  const maxCovered     = Math.floor(totalPoints * GAP_MAX_COVER);
  let   totalCovered   = 0;

  for (let attempt = 0; attempt < maxGapCount; attempt++) {
    const remaining = maxCovered - totalCovered;
    if (remaining < GAP_MIN_LEN) break;

    // Cap individual gap length to avoid consuming the entire budget at once
    const maxLen = Math.min(remaining, Math.floor(totalPoints * 0.28));
    const len    = GAP_MIN_LEN + Math.floor(Math.random() * Math.max(1, maxLen - GAP_MIN_LEN));

    // Try up to 12 random placements that don't overlap existing gaps
    let placed = false;
    for (let t = 0; t < 12; t++) {
      const start = Math.floor(Math.random() * (totalPoints - len));
      const end   = start + len;

      // Buffer zone around each existing gap to avoid fade-zone collisions
      const buffer  = GAP_FADE_LEN * 2;
      const overlaps = gaps.some(
        (g) => start < g.end + buffer && end > g.start - buffer,
      );

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

/**
 * Returns a 0–1 multiplier for a point at index `i` based on its
 * relationship to all gaps in the layer:
 *   - Core of gap         → 0
 *   - Fade-in edge        → linear 1→0
 *   - Fade-out edge       → linear 0→1
 *   - Outside all gaps    → 1
 */
function gapAlpha(i: number, gaps: Gap[]): number {
  for (const gap of gaps) {
    if (i < gap.start || i >= gap.end) continue;

    const fromStart = i - gap.start;
    const fromEnd   = gap.end - 1 - i;

    // Fade-in zone (entering the gap from the left)
    if (fromStart < gap.fadeLen) {
      return 1 - fromStart / gap.fadeLen;
    }
    // Fade-out zone (leaving the gap to the right)
    if (fromEnd < gap.fadeLen) {
      return 1 - fromEnd / gap.fadeLen;
    }
    // Core of gap
    return 0;
  }
  return 1;
}

// ─── Baseline & layer generation ─────────────────────────────────────────────

function generateBaseLine(width: number): AuroraPoint[] {
  const points: AuroraPoint[] = [];
  let x = 0;
  let y = Y_PAD_TOP + Math.random() * (Y_PAD_BOTTOM - Y_PAD_TOP);

  while (x <= width) {
    y += (Math.random() - 0.5) * 10;
    // Clamp y to the padded band
    y  = Math.max(Y_PAD_TOP, Math.min(Y_PAD_BOTTOM, y));

    points.push({ x, y });

    x += 1;
    // Occasional slight backward jitter produces the organic feel of the original
    if (Math.random() < 0.02) x -= Math.random() * 5;
  }

  return points;
}

function generateLayer(color: string, width: number): AuroraLayer {
  const baseLine = generateBaseLine(width);
  return {
    color,
    baseLine,
    gaps: generateGaps(baseLine.length),
  };
}

// ─── Draw ─────────────────────────────────────────────────────────────────────

function drawLightLine(
  ctx:     CanvasRenderingContext2D,
  layer:   AuroraLayer,
  width:   number,
): void {
  const { color, baseLine, gaps } = layer;
  const fadeWidth = 1000;

  baseLine.forEach((p, i) => {
    // 1. Horizontal edge fade (original behaviour)
    let edgeFade = 1;
    if (p.x < fadeWidth)             edgeFade = p.x / fadeWidth;
    if (p.x > width - fadeWidth)     edgeFade = (width - p.x) / fadeWidth;
    edgeFade = Math.max(0, Math.min(1, edgeFade));

    // 2. Bottom fade: points whose baseline sits low in the bar fade to transparent
    let bottomFade = 1;
    if (p.y >= BOTTOM_FADE_START) {
      bottomFade = Math.max(
        0,
        1 - (p.y - BOTTOM_FADE_START) / (BOTTOM_FADE_END - BOTTOM_FADE_START),
      );
    }

    // 3. Gap multiplier
    const gapFade = gapAlpha(i, gaps);

    // Combined alpha for this point's light column
    const combinedFade = edgeFade * bottomFade * gapFade;
    if (combinedFade <= 0) return; // skip invisible points entirely

    const bloomWidth = 3 + Math.random() * 3;
    const alpha      = (0.05 + Math.random() * 0.15) * combinedFade;

    const maxHeight = p.y * (0.4 + Math.random() * 0.8);
    const topY      = Math.max(p.y - maxHeight, -100);

    const gradient  = ctx.createLinearGradient(p.x, p.y, p.x, topY);
    gradient.addColorStop(0, color.replace(/[\d.]+\)$/g, `${alpha})`));
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(p.x - bloomWidth / 2, topY, bloomWidth, p.y - topY);
  });
}

function drawAll(
  ctx:    CanvasRenderingContext2D,
  layers: AuroraLayer[],
  width:  number,
): void {
  ctx.clearRect(0, 0, width, CANVAS_HEIGHT);
  for (const layer of layers) drawLightLine(ctx, layer, width);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuroraBar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    let width    = window.innerWidth;
    const dpr    = window.devicePixelRatio || 1;

    const applySize = () => {
      canvas.width        = width * dpr;
      canvas.height       = CANVAS_HEIGHT * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${CANVAS_HEIGHT}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    applySize();

    // Generate all layers once
    const layers: AuroraLayer[] = AURORA_COLORS.map((c) => generateLayer(c, width));

    // Draw once — static, no animation loop
    drawAll(ctx, layers, width);

    const handleResize = () => {
      width = window.innerWidth;
      applySize();

      // Regenerate geometry for new width, then redraw
      layers.length = 0;
      AURORA_COLORS.forEach((c) => layers.push(generateLayer(c, width)));
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