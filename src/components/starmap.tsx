import { useState, useMemo } from "react";
import type { Star, StarLine } from "../data/types";
import { COLORS } from "../theme";

interface StarMapProps {
  stars:         Star[];
  lines:         StarLine[];
  /** Maps star id → section title shown as hover tooltip */
  sectionTitles: Record<string, string>;
  onStarClick:   (starId: string) => void;
  view:          "project" | "constellation";
}

// Generate random planet positions for each star (memoized per star)
function generatePlanets(starId: string, starSize: number): Array<{ angle: number; distance: number; size: number }> {
  const seed = starId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (index: number) => {
    const x = Math.sin(seed + index * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  
  const planetCount = Math.floor(random(0) * 4) + 2; // 2-5 planets
  const orbitRadius = starSize * 1.35;
  const planets = [];
  
  for (let i = 0; i < planetCount; i++) {
    planets.push({
      angle: random(i * 3) * 360,
      distance: orbitRadius, // Use exact orbit radius so planets are centered on orbit
      size: 2 + random(i * 3 + 2) * 2,
    });
  }
  
  return planets;
}

// Estimate text width for dynamic box sizing
function estimateTextWidth(text: string): number {
  // Rough estimation: ~7 pixels per character at font size 12-13
  // Add some padding for letter spacing and margins
  return Math.max(100, text.length * 8 + 30);
}

export default function StarMap({
  stars,
  lines,
  sectionTitles,
  onStarClick,
  view,
}: StarMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Memoize planet positions for each star
  const starPlanets = useMemo(() => {
    const planetMap: Record<string, Array<{ angle: number; distance: number; size: number }>> = {};
    stars.forEach(star => {
      // Generate planets for all stars, not just clickable ones
      planetMap[star.id] = generatePlanets(star.id, star.size);
    });
    return planetMap;
  }, [stars]);

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
        
        // For projects: show section title if linked, else star label
        // For constellations: always show star label
        const label = view === "project" && hasLink 
          ? sectionTitles[star.id] 
          : star.label;
        
        const planets  = starPlanets[star.id] || [];
        
        // Calculate dynamic box width based on label length
        const boxWidth = estimateTextWidth(label);
        const boxHeight = 24;

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
          >
            {/* Orbiting ring and planets - only on hover */}
            {isHovered && (
              <g>
                {/* Orbit ring */}
                <circle
                  cx={star.x} 
                  cy={star.y}
                  r={star.size * 1.35}
                  fill="none"
                  stroke={hasLink ? COLORS.gold : COLORS.textMuted}
                  strokeWidth={0.8}
                  opacity={0.6}
                >
                  {/* Continuous rotation */}
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${star.x} ${star.y}`}
                    to={`360 ${star.x} ${star.y}`}
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </circle>
                
                {/* Orbiting planets - centered on orbit */}
                {planets.map((planet, idx) => {
                  // Calculate initial position on orbit
                  const planetX = star.x + Math.cos((planet.angle * Math.PI) / 180) * planet.distance;
                  const planetY = star.y + Math.sin((planet.angle * Math.PI) / 180) * planet.distance;
                  
                  return (
                    <g key={idx}>
                      <circle
                        cx={planetX}
                        cy={planetY}
                        r={planet.size}
                        fill={hasLink ? COLORS.gold : COLORS.textMuted}
                        opacity={0.7}
                      >
                        {/* Orbit around star center */}
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from={`0 ${star.x} ${star.y}`}
                          to={`360 ${star.x} ${star.y}`}
                          dur="8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Star image with scale on hover */}
            <g transform={isHovered ? `translate(${star.x},${star.y}) scale(1.7) translate(${-star.x},${-star.y})` : undefined}>
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
            </g>

            {/* Hover label with dynamic sizing */}
            {isHovered && (
              <g>
                {/* Calculate label position to avoid clipping */}
                {(() => {
                  const labelY = star.y - star.size * 1.5 - 16;
                  const labelAbove = labelY > 30; // Only show above if there's room
                  const finalLabelY = labelAbove ? labelY : star.y + star.size * 1.5 + 20;
                  
                  return (
                    <>
                      {/* Background rectangle for label - dynamically sized */}
                      <rect
                        x={star.x - boxWidth / 2}
                        y={finalLabelY - 16}
                        width={boxWidth}
                        height={boxHeight}
                        fill="rgba(8, 8, 14, 0.95)"
                        stroke={hasLink ? COLORS.gold : COLORS.textMuted}
                        strokeWidth={0.8}
                        rx={3}
                        style={{ pointerEvents: "none" }}
                      />
                      
                      {/* Label text - larger font */}
                      <text
                        x={star.x}
                        y={finalLabelY}
                        textAnchor="middle"
                        fill={hasLink ? COLORS.gold : COLORS.textMuted}
                        fontSize="13"
                        fontFamily="Georgia, serif"
                        letterSpacing="0.08em"
                        style={{ pointerEvents: "none", userSelect: "none" }}
                      >
                        {label}
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}