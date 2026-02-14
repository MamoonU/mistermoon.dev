import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Link as MuiLink,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import NightSky from "./nightsky";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const pages = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Example1", path: "/example1" },
    { name: "Example2", path: "/example2" },
  ];

  return (
    <>
      {/* Animated Background */}
      <NightSky />

      {/* TopBar */}
      <AppBar position="static" color="primary" sx={{ zIndex: 1200 }}>
        <Toolbar>
          {/* Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title + Links */}
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" component="div">
              MisterMoon
            </Typography>

            <Box>
              {pages.map((page) => (
                <MuiLink
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  color="inherit"
                  underline="hover"
                  sx={{ mr: 2 }}
                >
                  {page.name}
                </MuiLink>
              ))}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerToggle}
        >
          <List>
            {pages.map((page) => (
              <ListItem
                button
                key={page.name}
                component={RouterLink}
                to={page.path}
              >
                <ListItemText primary={page.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ mt: 2, px: 2 }}>{children}</Box>
    </>
  );
}