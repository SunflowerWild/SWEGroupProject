import React from "react";
import { useNavigate } from 'react-router-dom';
import { Toolbar, Button, Box, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey, indigo } from "@mui/material/colors";
import { Link as RouterLink } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: { main: "#0d1117" },
    secondary: blueGrey,
  },
});
export const DashboardHeader = () => {
  const navigate = useNavigate(); // Add useNavigate hook
  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "999px",
          px: 3,
          py: 1,
          mx: "auto",
          width: "90%", // 📏 Slightly longer than before
          maxWidth: 1200,
          mt: 2,
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(13, 17, 23, 0.6)",
          color: "#ffffff",
        }}
      >
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          
          {/* Left: Logo */}
          <Box display="flex" alignItems="center">
            <IconButton edge="start" href="/" sx={{ p: 0 }}>
              <img
                src="/logo192.png"
                alt="Logo"
                style={{ height: 36, borderRadius: "50%" }}
              />
            </IconButton>
          </Box>

          {/* Right: Navigation & CTA */}
          <Box display="flex" alignItems="center" gap={2} sx={{ ml: "auto" }}>
            <Button href="/dash" size="small" sx={{ color: "#ffffff" }}>Dashboard</Button>
            <Button href="/inv" size="small" sx={{ color: "#ffffff" }}>Inventory</Button>
            <Button href="/history" size="small" sx={{ color: "#ffffff" }}>History</Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#58a6ff",
                color: "black",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 500,
                px: 2,
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "#4090e6",
                },
              }}
              onClick={handleLogout}
              //href="/logout"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </ThemeProvider>
  );
};
