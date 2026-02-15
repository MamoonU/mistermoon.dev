import { useState } from "react";
import type { Star, StarLine } from "../data/types";
import { COLORS } from "../theme";

interface StarMapProps {
  stars:         Star[];
  lines:         StarLine[];
  /** Maps star id → section title shown as hover tooltip */
  sectionTitles: Record<string, string>;
  onStarClick:   (starId: string) => void;
}

export default function StarMap({
  stars,
  lines,
  sectionTitles,
  onStarClick,
}: StarMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 720 810"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      {/* Constellation lines */}
      {lines.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={COLORS.borderLight}
          strokeWidth={1.5}
        />
      ))}

      {/* Stars */}
      {stars.map((star) => {
        const hasLink  = star.id in sectionTitles;
        const isHovered = hoveredId === star.id;
        const label    = sectionTitles[star.id] ?? star.label;

        return (
          <g
            key={star.id}
            onMouseEnter={() => setHoveredId(star.id)}
            onMouseLeave={() => setHoveredId(null)}
            onTouchStart={() => setHoveredId(star.id)}
            onTouchEnd={() => {
              if (hasLink) onStarClick(star.id);
              setTimeout(() => setHoveredId(null), 600);
            }}
            onClick={() => hasLink && onStarClick(star.id)}
            style={{ cursor: hasLink ? "pointer" : "default" }}
            transform={
              isHovered
                ? `translate(${star.x},${star.y}) scale(1.7) translate(${-star.x},${-star.y})`
                : undefined
            }
          >
            {/* Pulsing ring on linked stars */}
            {hasLink && (
              <circle
                cx={star.x} cy={star.y}
                r={star.size * 1.15}
                fill="none"
                stroke={COLORS.gold}
                strokeWidth={0.8}
                opacity={isHovered ? 0.9 : 0.22}
              >
                {!isHovered && (
                  <animate
                    attributeName="opacity"
                    values="0.08;0.38;0.08"
                    dur="3.2s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            )}

            {/* Star image */}
            <image
              href="/star.png"
              x={star.x - star.size / 2}
              y={star.y - star.size / 2}
              width={star.size}
              height={star.size}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${star.x} ${star.y}`}
                to={`360 ${star.x} ${star.y}`}
                dur="15s"
                repeatCount="indefinite"
              />
            </image>

            {/* Hover label */}
            {isHovered && (
              <text
                x={star.x}
                y={star.y - star.size * 0.95 - 8}
                textAnchor="middle"
                fill={hasLink ? COLORS.gold : COLORS.textMuted}
                fontSize={hasLink ? "11" : "10"}
                fontFamily="Georgia, serif"
                letterSpacing="0.1em"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}