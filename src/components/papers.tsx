import { useState } from "react";
import { Box, Collapse, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { COLORS } from "../theme";

export interface Paper {
  id: string;
  title: string;
  description: string;
  pdfPath: string;
}

export default function PaperRow({ paper }: { paper: Paper }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: { xs: 1.5, md: 3 },
          borderLeft: `2px solid ${COLORS.border}`,
          pl: 2.5,
          py: 0.5,
          transition: "border-color 0.2s",
          "&:hover": { borderLeftColor: COLORS.gold },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
            <ArticleOutlinedIcon
              sx={{ fontSize: "0.9rem", color: COLORS.textMuted, flexShrink: 0 }}
            />
            <Typography
              sx={{
                fontFamily: '"Georgia", serif',
                fontSize: { xs: "0.85rem", md: "0.9rem" },
                letterSpacing: "0.06em",
                color: COLORS.textPrimary,
              }}
            >
              {paper.title}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", md: "0.83rem" },
              color: COLORS.textMuted,
              lineHeight: 1.7,
            }}
          >
            {paper.description}
          </Typography>
        </Box>

        <Box
          component="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Collapse PDF" : "View PDF"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 0.25,
            flexShrink: 0,
            background: "none",
            border: `1px solid ${open ? COLORS.gold : COLORS.border}`,
            borderRadius: "2px",
            color: open ? COLORS.gold : COLORS.textMuted,
            cursor: "pointer",
            px: { xs: 1, md: 1.5 },
            py: { xs: 0.5, md: 0.7 },
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: '"Georgia", serif',
            transition: "border-color 0.2s, color 0.2s",
            minHeight: "36px",
            "&:hover": { color: COLORS.gold, borderColor: COLORS.gold },
          }}
        >
          {open ? (
            <>
              <span>Close</span>
              <KeyboardArrowUpIcon sx={{ fontSize: "0.9rem" }} />
            </>
          ) : (
            <>
              <span>View</span>
              <KeyboardArrowDownIcon sx={{ fontSize: "0.9rem" }} />
            </>
          )}
        </Box>
      </Box>

      <Collapse in={open} timeout={300}>
        <Box
          sx={{
            mt: 1.5,
            ml: { xs: 0, md: 2.5 },
            border: `1px solid ${COLORS.border}`,
            borderRadius: "2px",
            overflow: "hidden",
            width: "100%",
            aspectRatio: "210 / 297",
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