import { useState } from "react";
import { Box, Collapse, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { COLORS } from "../theme";
import type { ConstellationSection, StarData, StarListItem } from "../data/types";

// ─── Star data card ───────────────────────────────────────────────────────────

function StarDataCard({ data }: { data: StarData }) {
  const { info, ...fields } = data;
  
  return (
    <Box sx={{ mt: 1 }}>
      {Object.entries(fields).map(([key, value]) => {
        // Skip undefined values
        if (value === undefined) return null;
        
        return (
          <Box key={key} sx={{ display: "flex", gap: 1.5, mb: 0.75, flexWrap: "wrap" }}>
            <Typography
              component="span"
              sx={{
                fontFamily:    '"Georgia", serif',
                fontSize:      "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         COLORS.textMuted,
                flexShrink:    0,
                minWidth:      "90px",
              }}
            >
              {key}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: '"Georgia", serif',
                fontSize:   "0.83rem",
                color:      COLORS.textPrimary,
                lineHeight: 1.6,
              }}
            >
              {value}
            </Typography>
          </Box>
        );
      })}
      {info && (
        <Typography
          sx={{
            mt:         2,
            fontFamily: '"Georgia", serif',
            fontSize:   "0.88rem",
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

// ─── List renderer ────────────────────────────────────────────────────────────

function StarList({ items }: { items: StarListItem[] }) {
  return (
    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mt: 2 }}>
      {items.map((item, idx) => (
        <Box key={idx} component="li" sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: '"Georgia", serif',
              fontSize:   "0.85rem",
              color:      COLORS.textPrimary,
              lineHeight: 1.7,
              mb:         item.subtext ? 0.5 : 0,
            }}
          >
            • {item.text}
          </Typography>
          {item.subtext && (
            <Typography
              sx={{
                fontFamily: '"Georgia", serif',
                fontSize:   "0.8rem",
                color:      COLORS.textMuted,
                lineHeight: 1.6,
                ml:         2.5,
              }}
            >
              {item.subtext}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface StarSectionRowProps {
  section:  ConstellationSection;
  isOpen:   boolean;
  onToggle: () => void;
}

export default function StarSectionRow({ section, isOpen, onToggle }: StarSectionRowProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display:        "flex",
          flexDirection:  "column",
          gap:            2,
          borderLeft:     `2px solid ${COLORS.border}`,
          pl:             2.5,
          py:             0.5,
          transition:     "border-color 0.2s",
          "&:hover":      { borderLeftColor: COLORS.gold },
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontFamily:    '"Georgia", serif',
            fontSize:      { xs: "0.9rem", md: "0.95rem" },
            letterSpacing: "0.06em",
            color:         COLORS.textPrimary,
            fontWeight:    500,
          }}
        >
          {section.title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize:   { xs: "0.8rem", md: "0.83rem" },
            color:      COLORS.textMuted,
            lineHeight: 1.7,
          }}
        >
          {section.description}
        </Typography>

        {/* Toggle button - full width */}
        <Box
          component="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? `Collapse ${section.title}` : `View ${section.title} details`}
          sx={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            width:          "100%",
            background:     "none",
            border:         `1px solid ${isOpen ? COLORS.gold : COLORS.border}`,
            borderRadius:   "2px",
            color:          isOpen ? COLORS.gold : COLORS.textMuted,
            cursor:         "pointer",
            px:             { xs: 1.5, md: 2 },
            py:             { xs: 0.8, md: 1 },
            fontSize:       "0.78rem",
            letterSpacing:  "0.1em",
            textTransform:  "uppercase",
            fontFamily:     '"Georgia", serif',
            fontWeight:     600,
            transition:     "border-color 0.2s, color 0.2s",
            minHeight:      "44px",
            "&:hover":      { color: COLORS.gold, borderColor: COLORS.gold },
          }}
        >
          <span>{section.title}</span>
          {isOpen ? (
            <KeyboardArrowUpIcon sx={{ fontSize: "1rem" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: "1rem" }} />
          )}
        </Box>
      </Box>

      {/* Expanded content */}
      <Collapse in={isOpen} timeout={300}>
        <Box
          sx={{
            mt:              1.5,
            ml:              { xs: 0, md: 2.5 },
            border:          `1px solid ${COLORS.border}`,
            borderRadius:    "2px",
            p:               { xs: 2, md: 2.5 },
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Star data fields */}
          {section.starData && <StarDataCard data={section.starData} />}
          
          {/* Optional list */}
          {section.list && section.list.length > 0 && <StarList items={section.list} />}
        </Box>
      </Collapse>
    </Box>
  );
}