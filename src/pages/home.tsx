import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import PaperRow from "../components/papers";
import type { Paper } from "../components/papers";
import { getAllConstellations } from "../data";
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
    description: "A minimal distributed operating system inspired by Plan 9 philosophies.",
    anchor:      "orion",
  },
];

const PAPERS: Paper[] = [
  {
    id:          "orion-paper",
    title:       "Orion",
    description: "Replace with the actual abstract or a brief summary of this paper's findings and contribution.",
    pdfPath:     "/Orion.pdf",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 7 }}>
      <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
      <Box sx={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: COLORS.gold, opacity: 0.35 }} />
      <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const constellations = getAllConstellations();

  return (
    <Box
      sx={{
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
              display:       "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems:    { xs: "flex-start", sm: "baseline" },
              gap:           { xs: 0.5, sm: 2.5 },
              mb:            { xs: 2.5, md: 3 },
              borderLeft:    `2px solid ${COLORS.border}`,
              pl:            2.5,
              transition:    "border-color 0.2s",
              "&:hover":     { borderLeftColor: COLORS.gold },
            }}
          >
            <MuiLink
              component={RouterLink}
              to={`/projects/${project.anchor}`}
              underline="none"
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      { xs: "0.92rem", md: "0.9rem" },
                letterSpacing: "0.07em",
                color:         COLORS.gold,
                flexShrink:    0,
                minHeight:     "28px",
                display:       "flex",
                alignItems:    "center",
                "&:hover":     { opacity: 0.7 },
                transition:    "opacity 0.2s",
              }}
            >
              {project.title}
            </MuiLink>

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

      <SectionDivider />

      {/* ── Constellations ────────────────────────────────────────────────── */}
      <Box sx={{ mb: 1 }}>
        <MuiLink
          component={RouterLink}
          to="/constellations"
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
          Constellations
        </MuiLink>
      </Box>

      <Typography variant="caption" sx={{ display: "block", mb: { xs: 3, md: 5 } }}>
        Star maps, mythology, and the science behind each constellation
      </Typography>

      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {constellations.map((c) => (
          <Box
            key={c.id}
            component="li"
            sx={{
              display:       "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems:    { xs: "flex-start", sm: "baseline" },
              gap:           { xs: 0.5, sm: 2.5 },
              mb:            { xs: 2.5, md: 3 },
              borderLeft:    `2px solid ${COLORS.border}`,
              pl:            2.5,
              transition:    "border-color 0.2s",
              "&:hover":     { borderLeftColor: COLORS.gold },
            }}
          >
            <MuiLink
              component={RouterLink}
              to={`/constellations/${c.id}`}
              underline="none"
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      { xs: "0.92rem", md: "0.9rem" },
                letterSpacing: "0.07em",
                color:         COLORS.gold,
                flexShrink:    0,
                minHeight:     "28px",
                display:       "flex",
                alignItems:    "center",
                "&:hover":     { opacity: 0.7 },
                transition:    "opacity 0.2s",
              }}
            >
              {c.name}
            </MuiLink>

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
              {c.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}