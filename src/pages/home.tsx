import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Typography, Box, Divider } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box mb={2}>
        <Typography variant="h6">Project 1</Typography>
        <Typography>Paragraph describing project 1.</Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">Project 2</Typography>
        <Typography>Paragraph describing project 2.</Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">Project 3</Typography>
        <Typography>Paragraph describing project 3.</Typography>
      </Box>
    </Box>
  );
}