import React, { useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import MenuIcon      from "@mui/icons-material/Menu";
import CloseIcon     from "@mui/icons-material/Close";
import GitHubIcon    from "@mui/icons-material/GitHub";
import LinkedInIcon  from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link as RouterLink, useLocation } from "react-router-dom";
import NightSky  from "./nightsky";
import AuroraBar from "./aurorabar";
import { COLORS } from "../theme";

interface LayoutProps {
  children: React.ReactNode;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
//
// "active" is determined by the start of the pathname so that
// /projects/orion highlights the Projects entry, and
// /constellations/orion highlights the Constellations entry.
//
const NAV_PAGES = [
  { name: "Home",           path: "/",              match: (p: string) => p === "/"                  },
  { name: "Projects",       path: "/projects",      match: (p: string) => p.startsWith("/projects")  },
  { name: "Constellations", path: "/constellations", match: (p: string) => p.startsWith("/constellations") },
] as const;

const SOCIAL_LINKS = [
  {
    icon:  <GitHubIcon sx={{ fontSize: { xs: "1.4rem", md: "2.35rem" } }} />,
    href:  "https://github.com/MamoonU",
    label: "GitHub",
  },
  {
    icon:  <LinkedInIcon sx={{ fontSize: { xs: "1.4rem", md: "2.35rem" } }} />,
    href:  "https://www.linkedin.com/in/mamoon-umar-92ba95297/",
    label: "LinkedIn",
  },
  {
    icon:  <InstagramIcon sx={{ fontSize: { xs: "1.4rem", md: "2.35rem" } }} />,
    href:  "https://www.instagram.com/mamoon.umar",
    label: "Instagram",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* ── Background ────────────────────────────────────────────────────── */}
      <NightSky />

      {/* ── App bar ───────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          height:          { xs: "64px", md: "100px" },
          justifyContent:  "center",
          backgroundColor: "transparent",
          backdropFilter:  "blur(6px)",
          borderBottom:    `1px solid ${COLORS.border}`,
        }}
      >
        <AuroraBar />

        <Toolbar
          sx={{
            position:       "relative",
            zIndex:         1,
            height:         { xs: "64px", md: "100px" },
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            px:             { xs: 2, sm: 3, md: 5 },
          }}
        >
          {/* Left: hamburger + wordmark */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 5 } }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label="open navigation"
              size="small"
              sx={{
                color:        COLORS.textSecondary,
                border:       `1px solid ${COLORS.border}`,
                borderRadius: "3px",
                p:            { xs: "7px", md: "6px" },
                "&:hover":    { color: COLORS.white, borderColor: COLORS.borderLight },
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} />
            </IconButton>

            <MuiLink
              component={RouterLink}
              to="/"
              underline="none"
              sx={{
                color:         COLORS.white,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily:    '"Georgia", serif',
                fontSize:      { xs: "1.05rem", sm: "1.35rem", md: "2.05rem" },
                opacity:       0.9,
                "&:hover":     { opacity: 1 },
                transition:    "opacity 0.2s ease",
                whiteSpace:    "nowrap",
              }}
            >
              MisterMoon
            </MuiLink>
          </Box>

          {/* Right: social icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.25, md: 0.75 } }}>
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{
                  color:     COLORS.textMuted,
                  p:         { xs: "6px", md: "8px" },
                  "&:hover": { color: COLORS.white },
                }}
              >
                {icon}
              </IconButton>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar drawer ────────────────────────────────────────────────── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width:           { xs: "80vw", sm: "260px" },
            maxWidth:        "320px",
            backgroundColor: COLORS.surface,
          },
        }}
      >
        <Box
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          role="navigation"
          aria-label="Site navigation"
        >
          {/* Drawer header */}
          <Box
            sx={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              px:             2.5,
              py:             2.5,
              borderBottom:   `1px solid ${COLORS.border}`,
            }}
          >
            <Typography
              sx={{
                fontFamily:    '"Georgia", serif',
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontSize:      "0.82rem",
                color:         COLORS.gold,
              }}
            >
              MisterMoon
            </Typography>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              aria-label="close navigation"
              sx={{ color: COLORS.textMuted, p: "8px", "&:hover": { color: COLORS.white } }}
            >
              <CloseIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>

          {/* Nav links */}
          <List sx={{ flex: 1, pt: 2, px: 1 }}>
            {NAV_PAGES.map((page) => {
              const isActive = page.match(location.pathname);
              return (
                <ListItemButton
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  selected={isActive}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    py:           { xs: 1.6, md: 1.3 },
                    borderLeft:   isActive ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                    borderRadius: "0 2px 2px 0",
                    transition:   "border-color 0.2s, background-color 0.2s",
                  }}
                >
                  <ListItemText
                    primary={page.name}
                    primaryTypographyProps={{
                      sx: {
                        color:         isActive ? COLORS.gold : COLORS.textSecondary,
                        fontFamily:    '"Georgia", serif',
                        fontSize:      { xs: "0.85rem", md: "0.8rem" },
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        transition:    "color 0.2s",
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          {/* Social icons at drawer bottom */}
          <Divider sx={{ borderColor: COLORS.border }} />
          <Box
            sx={{
              display:        "flex",
              justifyContent: "center",
              gap:            { xs: 1.5, md: 1 },
              py:             { xs: 3, md: 2.5 },
            }}
          >
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{ color: COLORS.textMuted, p: "8px", "&:hover": { color: COLORS.white } }}
              >
                {icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Drawer>

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{ position: "relative", zIndex: 1, width: "100vw", overflowX: "hidden" }}
      >
        {children}
      </Box>
    </>
  );
}