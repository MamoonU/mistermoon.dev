import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Collapse, Typography, Link as MuiLink } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon   from "@mui/icons-material/KeyboardArrowUp";
import ArticleOutlinedIcon   from "@mui/icons-material/ArticleOutlined";
import { COLORS } from "../theme";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Project {
  id:          string;
  title:       string;
  description: string;
  anchor:      string;
}

interface Paper {
  id:          string;
  title:       string;
  description: string;
  pdfPath:     string;
}

const PROJECTS: Project[] = [
  {
    id:          "orion",
    title:       "Orion",
    description: "An interactive star-map explorer mapping constellation data to scrollable narrative sections.",
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
    id:          "orion-paper",
    title:       "Orion",
    description: "Replace with the actual abstract or a brief summary of this paper's findings and contribution.",
    pdfPath:     "/Orion.pdf",
  },
  {
    id:          "paper2",
    title:       "Paper Title Two",
    description: "Replace with the actual abstract or a brief summary of this paper's findings and contribution.",
    pdfPath:     "/papers/paper2.pdf",
  },
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

function PaperRow({ paper }: { paper: Paper }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header row */}
      <Box
        sx={{
          display:        "flex",
          alignItems:     "flex-start",
          justifyContent: "space-between",
          gap:            { xs: 1.5, md: 3 },
          borderLeft:     `2px solid ${COLORS.border}`,
          pl:             2.5,
          py:             0.5,
          transition:     "border-color 0.2s",
          "&:hover":      { borderLeftColor: COLORS.gold },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
            <ArticleOutlinedIcon sx={{ fontSize: "0.9rem", color: COLORS.textMuted, flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      { xs: "0.85rem", md: "0.9rem" },
                letterSpacing: "0.06em",
                color:         COLORS.textPrimary,
              }}
            >
              {paper.title}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize:   { xs: "0.8rem", md: "0.83rem" },
              color:      COLORS.textMuted,
              lineHeight: 1.7,
            }}
          >
            {paper.description}
          </Typography>
        </Box>

        {/* View / close button */}
        <Box
          component="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Collapse PDF" : "View PDF"}
          sx={{
            display:       "flex",
            alignItems:    "center",
            gap:           0.5,
            mt:            0.25,
            flexShrink:    0,
            background:    "none",
            border:        `1px solid ${open ? COLORS.gold : COLORS.border}`,
            borderRadius:  "2px",
            color:         open ? COLORS.gold : COLORS.textMuted,
            cursor:        "pointer",
            px:            { xs: 1, md: 1.5 },
            py:            { xs: 0.5, md: 0.7 },
            fontSize:      "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily:    '"Georgia", serif',
            transition:    "border-color 0.2s, color 0.2s",
            // Ensure finger-friendly on touch
            minHeight:     "36px",
            "&:hover":     { color: COLORS.gold, borderColor: COLORS.gold },
          }}
        >
          {open
            ? <><span>Close</span><KeyboardArrowUpIcon sx={{ fontSize: "0.9rem" }} /></>
            : <><span>View</span><KeyboardArrowDownIcon sx={{ fontSize: "0.9rem" }} /></>
          }
        </Box>
      </Box>

      {/* Collapsible A4 PDF panel */}
      <Collapse in={open} timeout={300}>
        <Box
          sx={{
            mt:           1.5,
            // On mobile remove the left offset so PDF fills full section width
            ml:           { xs: 0, md: 2.5 },
            border:       `1px solid ${COLORS.border}`,
            borderRadius: "2px",
            overflow:     "hidden",
            // A4 portrait ratio (210mm × 297mm = 0.7071 width:height)
            // width is 100% of the containing column, height computed by ratio
            width:        "100%",
            aspectRatio:  "210 / 297",
          }}
        >
          <iframe
            src={paper.pdfPath}
            title={paper.title}
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
          />
        </Box>
      </Collapse>
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