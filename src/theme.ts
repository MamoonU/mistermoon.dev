import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d47a1", // Dark blue
    },
    secondary: {
      main: "#1976d2", // Light blue
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h6: {
      fontWeight: 700,
    },
  },
});

export default theme;