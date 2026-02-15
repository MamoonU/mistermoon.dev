import React, { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { COLORS } from "../theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Star {
  id:           string;
  x:            number;
  y:            number;
  label:        string;
  size:         number;
  subsectionId?:string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Coordinates scaled ~1.8× from originals → 720×810 viewBox

const STARS: Star[] = [
  { id: "a", x: 180, y:  72, label: "A", size: 18 },
  { id: "b", x: 252, y:  54, label: "B", size: 18, subsectionId: "belt"   },
  { id: "c", x: 144, y: 198, label: "C", size: 18 },
  { id: "d", x: 171, y: 189, label: "D", size: 18 },
  { id: "f", x: 198, y: 306, label: "F", size: 18 },
  { id: "g", x: 252, y: 360, label: "G", size: 45, subsectionId: "nebula" },
  { id: "h", x: 360, y: 306, label: "H", size: 27 },
  { id: "i", x: 450, y: 378, label: "I", size: 36, subsectionId: "stars"  },
  { id: "j", x: 666, y: 369, label: "J", size: 27 },
  { id: "k", x: 324, y: 612, label: "K", size: 36 },
  { id: "l", x: 360, y: 594, label: "L", size: 36 },
  { id: "m", x: 396, y: 567, label: "M", size: 36 },
  { id: "n", x: 279, y: 756, label: "N", size: 27 },
  { id: "o", x: 486, y: 729, label: "O", size: 45, subsectionId: "origin" },
  { id: "p", x: 657, y: 315, label: "P", size: 18 },
  { id: "q", x: 630, y: 279, label: "Q", size: 18 },
  { id: "r", x: 657, y: 405, label: "R", size: 18 },
  { id: "s", x: 648, y: 468, label: "S", size: 18 },
  { id: "t", x: 621, y: 486, label: "T", size: 18 },
];

const LINES: [number, number, number, number][] = [
  [180,  72, 144, 198], [252,  54, 171, 189], [144, 198, 171, 189],
  [144, 198, 198, 306], [171, 189, 198, 306], [198, 306, 252, 360],
  [252, 360, 360, 306], [360, 306, 450, 378], [450, 378, 666, 369],
  [252, 360, 324, 612], [324, 612, 360, 594], [360, 594, 396, 567],
  [396, 567, 450, 378],
  [324, 612, 279, 756], [279, 756, 486, 729], [486, 729, 396, 567],
  [666, 369, 657, 405], [657, 405, 648, 468], [648, 468, 621, 486],
  [666, 369, 657, 315], [657, 315, 630, 279],
];

const ORION_SUBSECTIONS = [
  {
    id:    "belt",
    title: "The Belt",
    body: [
      "Alnitak, Alnilam, and Mintaka form the unmistakable three-star belt that has guided sailors and travellers for millennia. They sit roughly 800 to 1,300 light-years from Earth, yet appear almost identical in brightness from our vantage point.",
      "The alignment is a coincidence of perspective — in three-dimensional space the three stars are nowhere near each other. Alnilam, the middle star, is the most luminous of the trio, radiating roughly 375,000 times the energy of our Sun.",
    ],
  },
  {
    id:    "nebula",
    title: "The Great Nebula",
    body: [
      "Visible to the naked eye as a fuzzy patch below the belt, M42 is a stellar nursery roughly 1,344 light-years away and over 24 light-years across. It is one of the most scrutinised objects in the night sky.",
      "Within its glowing clouds, protostars are collapsing under gravity and igniting nuclear fusion for the very first time. The Trapezium cluster at its heart provides the ultraviolet radiation that excites the surrounding hydrogen gas into a luminous pink and violet haze.",
      "Long-exposure photography reveals dramatic pillars of dust and gas sculpted by stellar winds — cold dark cocoons inside which new solar systems are assembling themselves even now.",
    ],
  },
  {
    id:    "stars",
    title: "Betelgeuse & Rigel",
    body: [
      "Betelgeuse marks Orion's right shoulder and is one of the largest stars visible to the naked eye — a red supergiant so enormous that if placed at the centre of our Solar System, its surface would extend beyond the orbit of Jupiter.",
      "Rigel anchors the opposite corner as a blue-white supergiant shining approximately 120,000 times brighter than the Sun. The contrast between their colours — deep amber versus icy blue — is striking even without optical aids.",
      "Betelgeuse has been closely monitored for decades because it is expected to explode as a supernova within the next 100,000 years. In cosmic terms, that is imminent.",
    ],
  },
  {
    id:    "origin",
    title: "Origin of the Myth",
    body: [
      "The Orion myth predates the Greeks. Mesopotamian astronomers recognised the same asterism as the great hero Gilgamesh, hunter of the bull of heaven, thousands of years before Homer or Hesiod set anything to parchment.",
      "In Egyptian tradition the stars aligned with Osiris, god of the afterlife, and the three belt stars influenced the placement of the Giza pyramids — a claim that remains debated but captures the imagination regardless.",
      "Across cultures as distant as the Lakota Sioux, the Māori of New Zealand, and the ancient Chinese astronomers, this constellation consistently appears as a figure of power, hunting, or celestial navigation.",
    ],
  },
];

const PROJECT2_SUBSECTIONS = [
  {
    id:    "p2-overview",
    title: "Overview",
    body: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    ],
  },
  {
    id:    "p2-approach",
    title: "Approach",
    body: [
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
      "Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.",
      "Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis.",
    ],
  },
  {
    id:    "p2-results",
    title: "Results",
    body: [
      "Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget.",
      "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor.",
    ],
  },
  {
    id:    "p2-tech",
    title: "Technology",
    body: [
      "Quisque ullamcorper placerat ipsum. Cras nibh. Morbi vel justo vitae lacus tincidunt ultrices. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst.",
      "Integer tempus convallis augue. Etiam facilisis. Nunc elementum fermentum wisi. Aenean placerat. Ut imperdiet, enim sed gravida sollicitudin, felis odio placerat quam, ac pulvinar elit purus eget enim.",
      "Nunc vitae tortor. Proin tristique lacus vitae purus. Phasellus quis arcu. Fusce accumsan pharetra sem. Maecenas libero nunc, dignissim sed, ornare eu, interdum in, nibh.",
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Projects() {
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const [svgTop,      setSvgTop]      = useState(0);

  const location          = useLocation();
  const section1Ref       = useRef<HTMLDivElement>(null);
  const subsectionRefs    = useRef<Record<string, HTMLDivElement | null>>({});

  // ── Hash-based navigation from home page ────────────────────────────────────
  // e.g. /projects#nebula scrolls to the correct subsection on mount
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);

    // Let the page paint fully before trying to scroll
    const timer = setTimeout(() => {
      // Check subsection refs first (most common case)
      const subsection = subsectionRefs.current[id];
      if (subsection) {
        subsection.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      // Fall back to native anchor (for top-level section ids)
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);

    return () => clearTimeout(timer);
  }, [location.hash]);

  // ── Scroll-linked SVG position ───────────────────────────────────────────────
  //
  // The right column is position: relative.  The SVG panel inside it is
  // position: absolute with a JS-computed `top` so that:
  //
  //   • Before the user has scrolled to Section 1 → SVG sits at top of column
  //   • As the user scrolls: SVG tracks the viewport (stays centred)
  //   • When the SVG would overflow the bottom of Section 1 → it clamps there
  //
  // Formula (all in document-space pixels):
  //   idealTop = scrollY − section1OffsetTop + (vh − svgH) / 2
  //   top      = clamp(idealTop, 0, section1H − svgH)
  //
  // svgH ≈ viewportHeight (the panel is 100vh tall with slight padding via Box)
  //
  useEffect(() => {
    const handleScroll = () => {
      const section1 = section1Ref.current;
      if (!section1) return;

      const scrollY          = window.scrollY;
      const vh               = window.innerHeight;
      const section1OffsetTop= section1.offsetTop;
      const section1H        = section1.offsetHeight;
      const svgH             = vh; // SVG panel is 100vh tall

      const ideal   = scrollY - section1OffsetTop + (vh - svgH) / 2;
      const maxTop  = Math.max(0, section1H - svgH);
      const clamped = Math.max(0, Math.min(ideal, maxTop));

      setSvgTop(clamped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once immediately so position is correct on load
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Scroll to subsection ──────────────────────────────────────────────────
  const scrollToSubsection = (id: string) => {
    const el = subsectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const subsectionTitle = (subId: string) =>
    ORION_SUBSECTIONS.find((s) => s.id === subId)?.title;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ backgroundColor: "transparent", minHeight: "100vh", color: COLORS.textPrimary }}>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — ORION
          Left column  : scrollable text (sets the section height)
          Right column : position:relative container for the scroll-linked SVG
      ══════════════════════════════════════════════════════════════════ */}
      <Box
        id="orion"
        ref={section1Ref}
        sx={{ display: "flex" /* default alignItems:stretch */ }}
      >
        {/* ── Left: text ── */}
        <Box sx={{ width: "50%", px: 6, py: 10 }}>
          <Typography variant="h2" sx={{ mb: 1.5 }}>Orion</Typography>
          <Typography variant="caption" sx={{ display: "block", mb: 8 }}>
            Click a star to navigate · Scroll to explore
          </Typography>

          {ORION_SUBSECTIONS.map((sub) => (
            <Box
              key={sub.id}
              id={sub.id}
              ref={(el) => {
                subsectionRefs.current[sub.id] = el as HTMLDivElement | null;
              }}
              sx={{ mb: 12, scrollMarginTop: "48px" }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 2.5, borderBottom: `1px solid ${COLORS.border}`, pb: 1.5 }}
              >
                {sub.title}
              </Typography>
              {sub.body.map((para, i) => (
                <Typography key={i} variant="body1" sx={{ mb: 2.5 }}>
                  {para}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>

        {/* ── Right: scroll-linked SVG container ── */}
        <Box
          sx={{
            width:    "50%",
            position: "relative",
            // min-height so the column matches left even if SVG is small
          }}
        >
          {/*
            Absolutely positioned panel that `svgTop` moves up/down.
            Height = 100vh so the SVG fills the viewport.
            Padding = slight gap from edges.
          */}
          <Box
            sx={{
              position:       "absolute",
              top:            svgTop,
              left:           0,
              right:          0,
              height:         "100vh",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              p:              "2.5vh 3vw",
            }}
          >
            <svg
              viewBox="0 0 720 810"
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              {/* Constellation lines */}
              {LINES.map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={COLORS.borderLight}
                  strokeWidth={1.5}
                />
              ))}

              {/* Stars */}
              {STARS.map((star) => {
                const isLinked  = !!star.subsectionId;
                const isHovered = hoveredStar === star.id;
                const title     = star.subsectionId ? subsectionTitle(star.subsectionId) : undefined;

                return (
                  <g
                    key={star.id}
                    onMouseEnter={() => setHoveredStar(star.id)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={() => star.subsectionId && scrollToSubsection(star.subsectionId)}
                    style={{ cursor: isLinked ? "pointer" : "default" }}
                    transform={
                      isHovered
                        ? `translate(${star.x},${star.y}) scale(1.7) translate(${-star.x},${-star.y})`
                        : undefined
                    }
                  >
                    {/* Pulsing ring for linked stars */}
                    {isLinked && (
                      <circle
                        cx={star.x}
                        cy={star.y}
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

                    {/* Hover tooltip */}
                    {isHovered && (
                      <text
                        x={star.x}
                        y={star.y - star.size * 0.95 - 8}
                        textAnchor="middle"
                        fill={isLinked ? COLORS.gold : COLORS.textMuted}
                        fontSize={isLinked ? "11" : "10"}
                        fontFamily="Georgia, serif"
                        letterSpacing="0.1em"
                        style={{ pointerEvents: "none", userSelect: "none" }}
                      >
                        {title ?? star.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — PROJECT 2
          Full-width.  SVG naturally scrolls away above as Section 1 ends.
      ══════════════════════════════════════════════════════════════════ */}
      <Box
        id="project2"
        sx={{
          borderTop: `1px solid ${COLORS.border}`,
          px: 6,
          py: 10,
          maxWidth: "820px",
        }}
      >
        <Typography variant="h2" sx={{ mb: 8 }}>Project 2</Typography>

        {PROJECT2_SUBSECTIONS.map((sub) => (
          <Box
            key={sub.id}
            id={sub.id}
            ref={(el) => {
              subsectionRefs.current[sub.id] = el as HTMLDivElement | null;
            }}
            sx={{ mb: 12, scrollMarginTop: "48px" }}
          >
            <Typography
              variant="h5"
              sx={{
                color:        COLORS.blue,   // blue accent for project 2
                mb:           2.5,
                borderBottom: `1px solid ${COLORS.border}`,
                pb:           1.5,
              }}
            >
              {sub.title}
            </Typography>
            {sub.body.map((para, i) => (
              <Typography key={i} variant="body1" sx={{ mb: 2.5 }}>
                {para}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}