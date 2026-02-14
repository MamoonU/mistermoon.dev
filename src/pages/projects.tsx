import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

interface Star {
  id: string;
  x: number;
  y: number;
  label: string;
  size: number;
}

export default function Projects() {
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  const stars: Star[] = [
    { id: "a", x: 100, y: 40, label: "A", size: 10 },
    { id: "b", x: 140, y: 30, label: "B", size: 10 },
    { id: "c", x: 80, y: 110, label: "C", size: 10 },
    { id: "d", x: 95, y: 105, label: "D", size: 10 },
    { id: "f", x: 110, y: 170, label: "F", size: 10 },
    { id: "g", x: 140, y: 200, label: "G", size: 10 },
    { id: "h", x: 200, y: 170, label: "H", size: 10 },
    { id: "i", x: 250, y: 210, label: "I", size: 10 },
    { id: "j", x: 370, y: 205, label: "J", size: 10 },
    { id: "k", x: 180, y: 340, label: "K", size: 10 },
    { id: "l", x: 200, y: 330, label: "L", size: 10 },
    { id: "m", x: 220, y: 315, label: "M", size: 10 },
    { id: "n", x: 155, y: 420, label: "N", size: 10 },
    { id: "o", x: 270, y: 405, label: "O", size: 10 },
    { id: "p", x: 365, y: 175, label: "P", size: 10 },
    { id: "q", x: 350, y: 155, label: "Q", size: 10 },
    { id: "r", x: 365, y: 225, label: "R", size: 10 },
    { id: "s", x: 360, y: 260, label: "S", size: 10 },
    { id: "t", x: 345, y: 270, label: "T", size: 10 },
  ];

  const lines: number[][] = [
    [100, 40, 80, 110], [140, 30, 95, 105], [80, 110, 95, 105],
    [80, 110, 110, 170], [95, 105, 110, 170], [110, 170, 140, 200],
    [140, 200, 200, 170], [200, 170, 250, 210], [250, 210, 370, 205],
    [140, 200, 180, 340], [180, 340, 200, 330], [200, 330, 220, 315],
    [220, 315, 250, 210],
    [180, 340, 155, 420], [155, 420, 270, 405], [270, 405, 220, 315],
    [370, 205, 365, 225], [365, 225, 360, 260], [360, 260, 345, 270],
    [370, 205, 365, 175], [365, 175, 350, 155]
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#0b0f1a",
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <svg viewBox="0 0 400 450" width="90%" maxWidth="900px">
        {/* Lines */}
        {lines.map((line, index) => (
          <line
            key={index}
            x1={line[0]}
            y1={line[1]}
            x2={line[2]}
            y2={line[3]}
            stroke="#444"
            strokeWidth={2}
          />
        ))}

        {/* Stars */}
        {stars.map((star) => (
          <g
            key={star.id}
            onMouseEnter={() => setHoveredStar(star.id)}
            onMouseLeave={() => setHoveredStar(null)}
          >
            <image
              href="/Untitled.png"
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
                dur="6s"
                repeatCount="indefinite"
              />
            </image>

            {/* Tooltip */}
            {hoveredStar === star.id && (
              <g>
                <rect
                  x={star.x + 15}
                  y={star.y - 25}
                  width="160"
                  height="40"
                  rx="6"
                  fill="#fff"
                  opacity={0.95}
                />
                <text
                  x={star.x + 25}
                  y={star.y}
                  fill="#000"
                  fontSize={14}
                  dominantBaseline="middle"
                >
                  {star.label}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </Box>
  );
}