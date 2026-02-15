import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarMap from "../components/starmap";
import { useScrollLinked } from "../hooks/useScrollLinked";
import { getAllConstellations } from "../data";
import type { ConstellationData, ConstellationSection } from "../data/types";
import { COLORS } from "../theme";

// ─── Star data card ───────────────────────────────────────────────────────────

function StarDataCard({ data }: { data: Record<string, string | number> }) {

  const { info, ...fields } = data;
  return (
    <Box sx={{ mt: 1 }}>
      {Object.entries(fields).map(([key, value]) => (
        <Box key={key} sx={{ display: "flex", gap: 1.5, mb: 0.6, flexWrap: "wrap" }}>
          <Typography
            component="span"
            sx={{
              fontFamily:    '"Georgia", serif',
              fontSize:      "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         COLORS.textMuted,
              flexShrink:    0,
              minWidth:      "80px",
            }}
          >
            {key}
          </Typography>
          <Typography
            component="span"
            sx={{
              fontFamily: '"Georgia", serif',
              fontSize:   "0.8rem",
              color:      COLORS.textPrimary,
              lineHeight: 1.6,
            }}
          >
            {value}
          </Typography>
        </Box>
      ))}
      {info && (
        <Typography
          sx={{
            mt:         1.5,
            fontFamily: '"Georgia", serif',
            fontSize:   "0.83rem",
            color:      COLORS.textSecondary,
            lineHeight: 1.85,
          }}
        >
          {info}
        </Typography>
      )}
    </Box>
  );
}

// ─── Single constellation block ───────────────────────────────────────────────

function ConstellationBlock({ constellation }: { constellation: ConstellationData }) {
  const navigate    = useNavigate();
  const sectionRef  = useRef<HTMLDivElement>(null);
  const svgPanelRef = useRef<HTMLDivElement>(null);
  useScrollLinked(sectionRef, svgPanelRef);

  const sectionTitles: Record<string, string> = {};
  constellation.constellationSections.forEach((s) => {
    if (s.starId) sectionTitles[s.starId] = s.title;
  });

  const handleStarClick = (starId: string) => {
    const section = constellation.constellationSections.find((s) => s.starId === starId);
    if (!section) return;
    document
      .getElementById(`${constellation.id}-${section.id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Navigate to project view.
  //   cameFrom: "constellation" → ConstellationPage animates SVG from left (0%) to right (50%)
  //   returnTo: "/constellations" → when the user clicks the toggle on /projects/:slug,
  //             it goes back to this index page instead of /constellations/:slug
  const goToProject = () => {
    navigate(`/projects/${constellation.id}`, {
      state: {
        cameFrom: "constellation",
        returnTo: "/constellations",
      },
    });
  };

  return (
    <Box
      id={constellation.id}
      ref={sectionRef}
      sx={{
        borderTop:       `1px solid ${COLORS.border}`,
        display:         "flex",
        flexDirection:   { xs: "column", md: "row" },
        position:        "relative",
        scrollMarginTop: "60px",
      }}
    >
      {/* ── SVG column ─────────────────────────────────────────────────────
          The toggle button lives here so it travels with the SVG column.

          Desktop pill:
            position: absolute, left: 0 of the SVG column.
            The SVG column is the left 50% of the screen, so left:0 of this
            column = left edge of the viewport — matching the fixed-left-edge
            pill on the individual constellation page.
            Pill opens rightward: borderRadius "0 4px 4px 0", borderLeft: none.

          Mobile pill:
            Small label at the bottom-right of the sticky SVG strip.
      ─────────────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          width:           { xs: "100%", md: "50%" },
          order:           { xs: -1, md: 0 },
          position:        { xs: "sticky", md: "relative" },
          top:             { xs: 0, md: "auto" },
          zIndex:          { xs: 5, md: "auto" },
          alignSelf:       "flex-start",
          backgroundColor: { xs: "rgba(8,8,14,0.92)", md: "transparent" },
          borderBottom:    { xs: `1px solid ${COLORS.border}`, md: "none" },
        }}
      >
        {/* Scroll-linked inner panel */}
        <Box
          ref={svgPanelRef}
          sx={{
            height:         { xs: "min(55vh, 90vw)", md: "calc(100vh - 100px)" },
            position:       { xs: "relative", md: "absolute" },
            top:            { xs: "auto", md: 0 },
            left:           { xs: "auto", md: 0 },
            right:          { xs: "auto", md: 0 },
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            p:              { xs: "2vw 4vw", md: "2vh 2vw" },
            willChange:     "transform",
          }}
        >
          <StarMap
            stars={constellation.stars}
            lines={constellation.lines}
            sectionTitles={sectionTitles}
            onStarClick={handleStarClick}
          />
        </Box>

        {/* Toggle button — only shown when constellation has a project */}
        {constellation.hasProject && (
          <>
            {/* Desktop: pill at left edge of SVG column (= left edge of screen) */}
            <Box
              onClick={goToProject}
              role="button"
              aria-label={`View ${constellation.name} project`}
              sx={{
                display:         { xs: "none", md: "flex" },
                position:        "absolute",
                left:            0,          // left edge of SVG column = left edge of viewport
                top:             "50%",
                transform:       "translateY(-50%)",
                // Pill opens rightward — same style as the /constellations/:slug toggle
                borderRadius:    "0 4px 4px 0",
                borderLeft:      "none",
                zIndex:          10,
                flexDirection:   "column",
                alignItems:      "center",
                justifyContent:  "center",
                py:              2,
                px:              0.75,
                gap:             1,
                cursor:          "pointer",
                backgroundColor: "rgba(8,8,14,0.85)",
                border:          `1px solid ${COLORS.border}`,
                backdropFilter:  "blur(6px)",
                transition:      "background-color 0.2s, border-color 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(12,12,22,0.95)",
                  borderColor:     COLORS.borderLight,
                  "& .ci-icon":    { color: COLORS.gold },
                  "& .ci-label":   { color: COLORS.gold },
                },
              }}
            >
              <Typography
                className="ci-label"
                sx={{
                  fontFamily:      '"Georgia", serif',
                  fontSize:        "0.62rem",
                  letterSpacing:   "0.18em",
                  textTransform:   "uppercase",
                  color:           COLORS.textMuted,
                  writingMode:     "vertical-rl",
                  textOrientation: "mixed",
                  // No rotation — label reads top-to-bottom when pill opens rightward
                  transition:      "color 0.2s",
                }}
              >
                Project
              </Typography>
              <ChevronRightIcon
                className="ci-icon"
                sx={{ fontSize: "1rem", color: COLORS.textMuted, transition: "color 0.2s" }}
              />
            </Box>

            {/* Mobile: small pill bottom-right of sticky SVG strip */}
            <Box
              onClick={goToProject}
              role="button"
              aria-label={`View ${constellation.name} project`}
              sx={{
                display:         { xs: "flex", md: "none" },
                position:        "absolute",
                bottom:          8,
                right:           8,
                alignItems:      "center",
                gap:             0.5,
                cursor:          "pointer",
                backgroundColor: "rgba(8,8,14,0.85)",
                border:          `1px solid ${COLORS.border}`,
                borderRadius:    "3px",
                backdropFilter:  "blur(6px)",
                px:              1.25,
                py:              0.6,
                zIndex:          6,
                transition:      "border-color 0.2s",
                "&:hover": {
                  borderColor:    COLORS.gold,
                  "& .ci-m-label": { color: COLORS.gold },
                },
              }}
            >
              <Typography
                className="ci-m-label"
                sx={{
                  fontFamily:    '"Georgia", serif',
                  fontSize:      "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color:         COLORS.textMuted,
                  transition:    "color 0.2s",
                }}
              >
                Project
              </Typography>
              <ChevronRightIcon sx={{ fontSize: "0.85rem", color: COLORS.textMuted }} />
            </Box>
          </>
        )}
      </Box>

      {/* ── Text column ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          order: { xs: 1, md: 1 },
          px:    { xs: 3, sm: 4, md: 6 },
          py:    { xs: 5, md: 10 },
        }}
      >
        <Typography
          variant="h2"
          sx={{ mb: 1.5, fontSize: { xs: "2rem", md: "clamp(1.75rem, 3.5vw, 3rem)" } }}
        >
          {constellation.name}
        </Typography>

        <Typography variant="caption" sx={{ display: "block", mb: { xs: 5, md: 8 } }}>
          Click a star to navigate · Scroll to explore
        </Typography>

        {constellation.constellationSections.map((section: ConstellationSection) => (
          <Box
            key={section.id}
            id={`${constellation.id}-${section.id}`}
            sx={{ mb: { xs: 8, md: 12 }, scrollMarginTop: "60px" }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, borderBottom: `1px solid ${COLORS.border}`, pb: 1.5 }}
            >
              {section.title}
            </Typography>
            <StarDataCard data={section.starData} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConstellationsIndex() {
  const constellations = getAllConstellations();

  return (
    <Box sx={{ color: COLORS.textPrimary }}>

      {/* ── 1-column header ──────────────────────────────────────────────── */}
      <Box
        sx={{
          maxWidth: "720px",
          mx:       "auto",
          px:       { xs: 3, sm: 4, md: 6 },
          pt:       { xs: 6, md: 10 },
          pb:       { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant="h2"
          sx={{ mb: 6, fontSize: { xs: "2rem", md: "clamp(1.75rem, 3.5vw, 3rem)" } }}
        >
          Constellations
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Each constellation in this catalogue is mapped with its navigable star data — distances,
          spectral classes, temperatures, and the myths woven around them across cultures and
          millennia. Click any star in the map to jump directly to its entry.
        </Typography>

        <Typography variant="body1" sx={{ mb: 6 }}>
          Some constellations have an associated software project. These are listed separately
          under Projects, but the constellation view is always available here — the science and
          the engineering sit side by side, named after the same stars.
        </Typography>

        {/* Quick navigation list */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 6 }}>
          <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
          <Box sx={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: COLORS.gold, opacity: 0.35 }} />
          <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, md: 3 } }}>
          {constellations.map((c) => (
            <MuiLink
              key={c.id}
              href={`#${c.id}`}
              underline="none"
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:         COLORS.textSecondary,
                transition:    "color 0.2s",
                "&:hover":     { color: COLORS.gold },
              }}
            >
              {c.name}
              {c.hasProject && (
                <Box
                  component="span"
                  sx={{
                    display:         "inline-block",
                    width:           4,
                    height:          4,
                    borderRadius:    "50%",
                    backgroundColor: COLORS.gold,
                    opacity:         0.6,
                    ml:              0.75,
                    verticalAlign:   "middle",
                    mb:              "2px",
                  }}
                />
              )}
            </MuiLink>
          ))}
        </Box>

        <Typography variant="caption" sx={{ display: "block", mt: 2, color: COLORS.textMuted }}>
          · gold dot indicates an associated project
        </Typography>
      </Box>

      {/* ── Constellation blocks ──────────────────────────────────────────── */}
      {constellations.map((c) => (
        <ConstellationBlock key={c.id} constellation={c} />
      ))}
    </Box>
  );
}