import { createTheme, alpha } from "@mui/material/styles";

// ─── Palette tokens ────────────────────────────────────────────────────────────
export const COLORS = {
  bg:           "#08080e",       // page background
  surface:      "#0d0d1a",       // card / drawer surface
  border:       "#1c1c28",       // subtle borders
  borderLight:  "#2a2a3a",       // slightly lighter border
  gold:         "#c8b98a",       // primary accent (Orion headings, links)
  blue:         "#8ab4c8",       // secondary accent (project 2)
  white:        "#f0f0f0",       // headings
  textPrimary:  "#c8c8c8",       // readable body text
  textSecondary:"#888",          // muted body text
  textMuted:    "#555",          // captions, hints
} as const;

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: COLORS.bg,
      paper:   COLORS.surface,
    },
    primary: {
      main:        COLORS.gold,
      contrastText: COLORS.bg,
    },
    secondary: {
      main:        COLORS.blue,
      contrastText: COLORS.bg,
    },
    text: {
      primary:   COLORS.textPrimary,
      secondary: COLORS.textSecondary,
      disabled:  COLORS.textMuted,
    },
    divider: COLORS.border,
  },

  // ─── Typography ─────────────────────────────────────────────────────────────
  // Serif display for headings, clean system sans for body
  typography: {
    fontFamily: '"Georgia", "Times New Roman", serif',

    // Section titles  e.g. "Orion", "Project 2"
    h1: {
      fontFamily:    '"Georgia", serif',
      fontSize:      "clamp(2rem, 4vw, 3.5rem)",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color:         COLORS.white,
      fontWeight:    400,
    },
    h2: {
      fontFamily:    '"Georgia", serif',
      fontSize:      "clamp(1.75rem, 3.5vw, 3rem)",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color:         COLORS.white,
      fontWeight:    400,
    },

    // Page-level headings (e.g. "Projects", "Papers" on home page)
    h3: {
      fontFamily:    '"Georgia", serif',
      fontSize:      "clamp(1.4rem, 2.5vw, 2rem)",
      letterSpacing: "0.1em",
      color:         COLORS.white,
      fontWeight:    400,
    },

    // Sub-page section titles
    h4: {
      fontFamily:    '"Georgia", serif',
      fontSize:      "clamp(1.1rem, 2vw, 1.4rem)",
      letterSpacing: "0.08em",
      color:         COLORS.white,
      fontWeight:    400,
    },

    // Subsection titles within a project (gold accent)
    h5: {
      fontFamily:    '"Georgia", serif',
      fontSize:      "0.9rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color:         COLORS.gold,
      fontWeight:    400,
    },

    // Small labels, nav items
    h6: {
      fontFamily:    '"Georgia", serif',
      fontSize:      "0.82rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color:         COLORS.textSecondary,
      fontWeight:    400,
    },

    // Standard body copy
    body1: {
      fontFamily: '"Georgia", serif',
      fontSize:   "0.93rem",
      lineHeight: 1.9,
      color:      COLORS.textSecondary,
    },

    // Smaller body / descriptions
    body2: {
      fontFamily: '"Georgia", serif',
      fontSize:   "0.85rem",
      lineHeight: 1.75,
      color:      COLORS.textMuted,
    },

    // Captions, hints, "click a star to navigate"
    caption: {
      fontFamily:    '"Georgia", serif',
      fontSize:      "0.75rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color:         COLORS.textMuted,
    },

    // Overline used for paper labels, etc.
    overline: {
      fontFamily:    '"Georgia", serif',
      fontSize:      "0.7rem",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color:         COLORS.textMuted,
    },
  },

  // ─── Shape ──────────────────────────────────────────────────────────────────
  shape: { borderRadius: 2 },

  // ─── Component overrides ────────────────────────────────────────────────────
  components: {

    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": {
          backgroundColor: COLORS.bg,
          scrollBehavior: "smooth",
        },
        // thin scrollbar
        "::-webkit-scrollbar": { width: "5px" },
        "::-webkit-scrollbar-track": { background: COLORS.bg },
        "::-webkit-scrollbar-thumb": {
          background:   COLORS.border,
          borderRadius: "2px",
        },
        "::-webkit-scrollbar-thumb:hover": { background: COLORS.borderLight },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          boxShadow:        "none",
          borderBottom:     `1px solid ${COLORS.border}`,
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: { minHeight: "56px !important" },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: COLORS.surface,
          borderRight:     `1px solid ${COLORS.border}`,
          width:           260,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius:  2,
          margin:        "2px 8px",
          paddingLeft:   "16px",
          "&:hover": {
            backgroundColor: alpha(COLORS.gold, 0.06),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(COLORS.gold, 0.1),
            "&:hover": { backgroundColor: alpha(COLORS.gold, 0.14) },
          },
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontFamily:    '"Georgia", serif',
          fontSize:      "0.82rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         COLORS.textSecondary,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color:        COLORS.textSecondary,
          "&:hover": { color: COLORS.white, backgroundColor: "transparent" },
          transition:   "color 0.2s ease",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: COLORS.border },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color:          COLORS.gold,
          textDecoration: "none",
          transition:     "opacity 0.2s ease",
          "&:hover":      { opacity: 0.7 },
        },
      },
    },
  },
});

export default theme;