import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import PaperRow from "../components/papers";       // runtime component
import type { Paper } from "../components/papers"; // type-only import
import { COLORS } from "../theme";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Project {
  id:          string;
  title:       string;
  description: string;
  anchor:      string;
}

const PROJECTS: Project[] = [
  {
    id:          "orion",
    title:       "Orion",
    description: "A minimal distributed operating system based on Plan 9 Philosiphies",
    anchor:      "orion",
  },
  {
    id:          "project2",
    title:       "Project 2",
    description: "Placeholder description — replace with a concise one-line summary of the second project.",
    anchor:      "project2",
  },
];

const PAPERS: Paper[] = [
  {
    id: "orion-paper",
    title: "Orion",
    description: "Replace with the actual abstract or a brief summary of this paper's findings and contribution.",
    pdfPath: "/Orion.pdf",
  },
  // Add more Paper objects here if needed
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 7 }}>
      <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
      <Box
        sx={{
          width:           5,
          height:          5,
          borderRadius:    "50%",
          backgroundColor: COLORS.gold,
          opacity:         0.35,
        }}
      />
      <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <Box
      sx={{
        // Wider section — aligns with A4 PDF width at standard screen DPI
        maxWidth: "960px",
        mx:       "auto",
        px:       { xs: 3, sm: 4, md: 6 },
        py:       { xs: 6, md: 10 },
        color:    COLORS.textPrimary,
      }}
    >
      {/* ── Projects ──────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 1 }}>
        <MuiLink
          component={RouterLink}
          to="/projects"
          underline="none"
          sx={{
            fontFamily:    '"Georgia", serif',
            fontSize:      { xs: "1.4rem", sm: "1.7rem", md: "clamp(1.6rem, 3vw, 2.2rem)" },
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         COLORS.white,
            display:       "inline-block",
            position:      "relative",
            "&::after": {
              content:         '""',
              position:        "absolute",
              bottom:          -3,
              left:            0,
              width:           0,
              height:          "1px",
              backgroundColor: COLORS.gold,
              transition:      "width 0.3s ease",
            },
            "&:hover::after": { width: "100%" },
            "&:hover":         { color: COLORS.white },
          }}
        >
          Projects
        </MuiLink>
      </Box>

      <Typography variant="caption" sx={{ display: "block", mb: { xs: 3, md: 5 } }}>
        Click a title to explore that project
      </Typography>

      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {PROJECTS.map((project) => (
          <Box
            key={project.id}
            component="li"
            sx={{
              display:    "flex",
              // Stack on xs, row on sm+
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "baseline" },
              gap:        { xs: 0.5, sm: 2.5 },
              mb:         { xs: 2.5, md: 3 },
              borderLeft: `2px solid ${COLORS.border}`,
              pl:         2.5,
              transition: "border-color 0.2s",
              "&:hover":  { borderLeftColor: COLORS.gold },
            }}
          >
            <MuiLink
              component={RouterLink}
              to={`/projects#${project.anchor}`}
              underline="none"
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      { xs: "0.92rem", md: "0.9rem" },
                letterSpacing: "0.07em",
                color:         COLORS.gold,
                flexShrink:    0,
                // Touch-friendly min height
                minHeight:     "28px",
                display:       "flex",
                alignItems:    "center",
                "&:hover":     { opacity: 0.7 },
                transition:    "opacity 0.2s",
              }}
            >
              {project.title}
            </MuiLink>

            {/* Dot separator — hidden on xs where layout is column */}
            <Box
              aria-hidden
              sx={{
                flexShrink:      0,
                width:           3,
                height:          3,
                borderRadius:    "50%",
                backgroundColor: COLORS.border,
                alignSelf:       "center",
                display:         { xs: "none", sm: "block" },
              }}
            />

            <Typography sx={{ fontSize: { xs: "0.82rem", md: "0.85rem" }, color: COLORS.textMuted, lineHeight: 1.7 }}>
              {project.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <SectionDivider />

      {/* ── Papers ────────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 1 }}>
        <Typography
          component="h2"
          sx={{
            fontFamily:    '"Georgia", serif',
            fontSize:      { xs: "1.4rem", sm: "1.7rem", md: "clamp(1.6rem, 3vw, 2.2rem)" },
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         COLORS.white,
          }}
        >
          Papers
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ display: "block", mb: { xs: 3, md: 5 } }}>
        Click View to read inline
      </Typography>

      {PAPERS.map((paper) => (
        <PaperRow key={paper.id} paper={paper} />
      ))}
    </Box>
  );
}