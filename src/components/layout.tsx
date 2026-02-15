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

const NAV_PAGES = [
  { name: "Home",     path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Example1", path: "/example1" },
  { name: "Example2", path: "/example2" },
] as const;

const SOCIAL_LINKS = [
  { icon: <GitHubIcon fontSize="small" />,    href: "https://github.com/MamoonU",                           label: "GitHub"    },
  { icon: <LinkedInIcon fontSize="small" />,  href: "https://www.linkedin.com/in/mamoon-umar-92ba95297/",   label: "LinkedIn"  },
  { icon: <InstagramIcon fontSize="small" />, href: "https://www.instagram.com/mamoon.umar",                label: "Instagram" },
] as const;

export default function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* ── Background canvas ─────────────────────────────────────────────── */}
      <NightSky />

      {/* ── App bar ───────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          height:         "72px",
          justifyContent: "center",
          backgroundColor:"transparent",
          backdropFilter: "blur(6px)",
          borderBottom:   `1px solid ${COLORS.border}`,
          // Override the theme's appbar background which is transparent anyway
        }}
      >
        {/* Aurora decorative layer sits behind toolbar content */}
        <AuroraBar />

        <Toolbar
          sx={{
            position:       "relative",
            zIndex:         1,
            height:         "72px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            px:             { xs: 2, md: 4 },
          }}
        >
          {/* Left: hamburger + wordmark */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label="open navigation"
              size="small"
              sx={{
                color:  COLORS.textSecondary,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "3px",
                p: "5px",
                "&:hover": { color: COLORS.white, borderColor: COLORS.borderLight },
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>

            <MuiLink
              component={RouterLink}
              to="/"
              underline="none"
              sx={{
                color:         COLORS.white,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily:    '"Georgia", serif',
                fontSize:      "0.9rem",
                opacity:       0.9,
                "&:hover":     { opacity: 1 },
                transition:    "opacity 0.2s ease",
              }}
            >
              MisterMoon
            </MuiLink>
          </Box>

          {/* Right: social icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                size="small"
                sx={{
                  color:     COLORS.textMuted,
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
      >
        <Box
          sx={{
            width:          260,
            height:         "100%",
            display:        "flex",
            flexDirection:  "column",
            backgroundColor:COLORS.surface,
          }}
          role="navigation"
          aria-label="Site navigation"
        >
          {/* Drawer header */}
          <Box
            sx={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 2,
              borderBottom:   `1px solid ${COLORS.border}`,
            }}
          >
            <Typography
              sx={{
                fontFamily:    '"Georgia", serif',
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontSize:      "0.78rem",
                color:         COLORS.gold,
              }}
            >
              MisterMoon
            </Typography>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              size="small"
              aria-label="close navigation"
              sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.white } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Nav links */}
          <List sx={{ flex: 1, pt: 2, px: 1 }}>
            {NAV_PAGES.map((page) => {
              const isActive = location.pathname === page.path;
              return (
                <ListItemButton
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  selected={isActive}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    py: 1.2,
                    borderLeft: isActive
                      ? `2px solid ${COLORS.gold}`
                      : "2px solid transparent",
                    borderRadius: "0 2px 2px 0",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                >
                  <ListItemText
                    primary={page.name}
                    primaryTypographyProps={{
                      sx: {
                        color:         isActive ? COLORS.gold : COLORS.textSecondary,
                        fontFamily:    '"Georgia", serif',
                        fontSize:      "0.8rem",
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

          {/* Social links at bottom of drawer */}
          <Divider sx={{ borderColor: COLORS.border }} />
          <Box
            sx={{
              display:        "flex",
              justifyContent: "center",
              gap:            1,
              py:             2,
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
                size="small"
                sx={{
                  color:     COLORS.textMuted,
                  "&:hover": { color: COLORS.white },
                }}
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
        sx={{
          position:  "relative",
          zIndex:    1,
          width:     "100vw",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </>
  );
}