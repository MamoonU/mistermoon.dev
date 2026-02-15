import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Divider, Collapse, Typography, Link as MuiLink } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon   from "@mui/icons-material/KeyboardArrowUp";
import ArticleOutlinedIcon   from "@mui/icons-material/ArticleOutlined";
import { COLORS } from "../theme";

// ─── Data ─────────────────────────────────────────────────────────────────────
// Replace these with real content when ready.

interface Project {
  id:          string;
  title:       string;
  description: string;
  anchor:      string; // hash on /projects page  e.g. "orion" or "project2"
}

interface Paper {
  id:          string;
  title:       string;
  description: string;
  pdfPath:     string; // path relative to /public, e.g. "/papers/my-paper.pdf"
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
    id:          "paper1",
    title:       "Paper Title One",
    description: "Replace with the actual abstract or a brief summary of the paper's findings and contribution.",
    pdfPath:     "/papers/paper1.pdf",
  },
  {
    id:          "paper2",
    title:       "Paper Title Two",
    description: "Replace with the actual abstract or a brief summary of the paper's findings and contribution.",
    pdfPath:     "/papers/paper2.pdf",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 6 }}>
      <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
      <Box
        sx={{
          width:           6,
          height:          6,
          borderRadius:    "50%",
          backgroundColor: COLORS.gold,
          opacity:         0.4,
        }}
      />
      <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
    </Box>
  );
}

interface PaperRowProps {
  paper: Paper;
}

function PaperRow({ paper }: PaperRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header row */}
      <Box
        sx={{
          display:       "flex",
          alignItems:    "flex-start",
          justifyContent:"space-between",
          gap:           3,
          borderLeft:    `2px solid ${COLORS.border}`,
          pl:            2.5,
          py:            0.5,
          transition:    "border-color 0.2s",
          "&:hover":     { borderLeftColor: COLORS.gold },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
            <ArticleOutlinedIcon
              sx={{ fontSize: "0.85rem", color: COLORS.textMuted }}
            />
            <Typography
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      "0.88rem",
                letterSpacing: "0.06em",
                color:         COLORS.textPrimary,
              }}
            >
              {paper.title}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize:   "0.83rem",
              color:      COLORS.textMuted,
              lineHeight: 1.7,
            }}
          >
            {paper.description}
          </Typography>
        </Box>

        {/* Expand / collapse button */}
        <Box
          component="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Collapse PDF" : "View PDF"}
          sx={{
            display:         "flex",
            alignItems:      "center",
            gap:             0.5,
            mt:              0.25,
            flexShrink:      0,
            background:      "none",
            border:          `1px solid ${open ? COLORS.gold : COLORS.border}`,
            borderRadius:    "2px",
            color:           open ? COLORS.gold : COLORS.textMuted,
            cursor:          "pointer",
            px:              1.5,
            py:              0.6,
            fontSize:        "0.72rem",
            letterSpacing:   "0.1em",
            textTransform:   "uppercase",
            fontFamily:      '"Georgia", serif',
            transition:      "border-color 0.2s, color 0.2s",
            "&:hover":       { color: COLORS.gold, borderColor: COLORS.gold },
          }}
        >
          {open ? (
            <>
              Close <KeyboardArrowUpIcon sx={{ fontSize: "0.85rem" }} />
            </>
          ) : (
            <>
              View <KeyboardArrowDownIcon sx={{ fontSize: "0.85rem" }} />
            </>
          )}
        </Box>
      </Box>

      {/* Collapsible PDF panel */}
      <Collapse in={open} timeout={300}>
        <Box
          sx={{
            mt:           1.5,
            ml:           2.5,
            border:       `1px solid ${COLORS.border}`,
            borderRadius: "2px",
            overflow:     "hidden",
            height:       "68vh",
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
        maxWidth: "780px",
        mx:       "auto",
        px:       { xs: 3, md: 6 },
        py:       { xs: 6, md: 10 },
        color:    COLORS.textPrimary,
      }}
    >
      {/* ── Projects ────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 1 }}>
        <MuiLink
          component={RouterLink}
          to="/projects"
          underline="none"
          sx={{
            fontFamily:    '"Georgia", serif',
            fontSize:      "clamp(1.6rem, 3vw, 2.2rem)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         COLORS.white,
            display:       "inline-block",
            position:      "relative",
            // underline bar that grows on hover
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

      <Typography variant="caption" sx={{ display: "block", mb: 5 }}>
        Click a title to explore that project
      </Typography>

      {/* Project list */}
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {PROJECTS.map((project) => (
          <Box
            key={project.id}
            component="li"
            sx={{
              display:    "flex",
              alignItems: "baseline",
              gap:        { xs: 1.5, md: 2.5 },
              mb:         3,
              // Left accent line
              borderLeft: `2px solid ${COLORS.border}`,
              pl:         2.5,
              transition: "border-color 0.2s",
              "&:hover":  { borderLeftColor: COLORS.gold },
            }}
          >
            {/* Title as anchor-linked navigation */}
            <MuiLink
              component={RouterLink}
              to={`/projects#${project.anchor}`}
              underline="none"
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      "0.88rem",
                letterSpacing: "0.07em",
                color:         COLORS.gold,
                flexShrink:    0,
                "&:hover":     { opacity: 0.7 },
                transition:    "opacity 0.2s",
              }}
            >
              {project.title}
            </MuiLink>

            {/* Dot separator */}
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

            {/* Description */}
            <Typography
              sx={{
                fontSize:   "0.85rem",
                color:      COLORS.textMuted,
                lineHeight: 1.7,
              }}
            >
              {project.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <SectionDivider />

      {/* ── Papers ──────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 1 }}>
        <Typography
          component="h2"
          sx={{
            fontFamily:    '"Georgia", serif',
            fontSize:      "clamp(1.6rem, 3vw, 2.2rem)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         COLORS.white,
          }}
        >
          Papers
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ display: "block", mb: 5 }}>
        Click View to read inline
      </Typography>

      {PAPERS.map((paper) => (
        <PaperRow key={paper.id} paper={paper} />
      ))}
    </Box>
  );
}