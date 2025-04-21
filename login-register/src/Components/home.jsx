// Dashboard.jsx
import React from "react";
import { Paper, Avatar, Grid, Typography, Link, Button, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo } from '@mui/material/colors';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { DashboardHeader } from "./DashboardHeader"; // adjust path as needed


// Create the theme
const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: blueGrey,
  }
});

export const Dashboard = () => {
  const paperStyle = { padding: 26, width: 600, margin: '20px auto' };
  const avatarStyle = { backgroundColor: '#7a15bb9e' };

  return (
    <ThemeProvider theme={theme}>
      <DashboardHeader />
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}><DashboardIcon /></Avatar>
            <h2>Dashboard</h2>
          </Grid>
          <Stack spacing={4} mt={4}>
            <Paper elevation={2} style={{ padding: 20 }}>
              <Typography variant="h6">Total Parts</Typography>
              <Typography variant="h4">124</Typography>
            </Paper>
            <Paper elevation={2} style={{ padding: 20 }}>
              <Typography variant="h6">Low Stock</Typography>
              <Typography variant="h4">6</Typography>
            </Paper>
            <Paper elevation={2} style={{ padding: 20 }}>
              <Typography variant="h6">Recent Check-Outs</Typography>
              <Typography variant="h4">9</Typography>
            </Paper>
          </Stack>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
};

