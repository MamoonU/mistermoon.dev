import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout    from "./components/layout";
import Home      from "./pages/home";
import Projects  from "./pages/projects";
import theme     from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/*
        CssBaseline injects the theme's MuiCssBaseline styleOverrides as global
        CSS — this is what applies mobile normalisation rules (box-sizing,
        -webkit-text-size-adjust, tap highlight removal, etc.).
        It must be a direct child of ThemeProvider.
      */}
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"        element={<Home />}     />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);