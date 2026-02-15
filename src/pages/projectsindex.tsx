import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import { getProjectConstellations } from "../data";
import { COLORS } from "../theme";

export default function ProjectsIndex() {
  const projects = getProjectConstellations();

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
      <Typography
        variant="h2"
        sx={{ mb: 1.5, fontSize: { xs: "2rem", md: "clamp(1.75rem, 3.5vw, 3rem)" } }}
      >
        Projects
      </Typography>
      <Typography variant="caption" sx={{ display: "block", mb: { xs: 6, md: 10 } }}>
        Each project is named after the constellation that inspired it
      </Typography>

      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {projects.map((project) => (
          <Box
            key={project.id}
            component="li"
            sx={{
              display:       "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems:    { xs: "flex-start", sm: "baseline" },
              gap:           { xs: 0.5, sm: 2.5 },
              mb:            { xs: 3, md: 4 },
              borderLeft:    `2px solid ${COLORS.border}`,
              pl:            2.5,
              transition:    "border-color 0.2s",
              "&:hover":     { borderLeftColor: COLORS.gold },
            }}
          >
            <MuiLink
              component={RouterLink}
              to={`/projects/${project.id}`}
              underline="none"
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      { xs: "0.95rem", md: "0.92rem" },
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
              {project.name}
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

            <Typography
              sx={{
                fontSize:   { xs: "0.82rem", md: "0.85rem" },
                color:      COLORS.textMuted,
                lineHeight: 1.7,
              }}
            >
              {project.description}
            </Typography>
          </Box>
        ))}
      </Box>

      {projects.length === 0 && (
        <Typography sx={{ color: COLORS.textMuted, fontFamily: '"Georgia", serif', fontSize: "0.9rem" }}>
          No projects yet — check back soon.
        </Typography>
      )}
    </Box>
  );
}