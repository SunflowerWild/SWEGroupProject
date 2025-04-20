// Inventory.jsx
import React from "react";
import { Paper, Avatar, Grid, Typography, Link, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo } from '@mui/material/colors';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { DashboardHeader } from "./DashboardHeader"; // adjust path as needed

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: blueGrey,
  }
});

export const Inventory = () => {
    
  const paperStyle = { padding: 26, width: '80%', margin: '20px auto' };
  const avatarStyle = { backgroundColor: '#7a15bb9e' };

  return (
    <ThemeProvider theme={theme}>
      <DashboardHeader />
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}><Inventory2Icon /></Avatar>
            <h2>Inventory</h2>
          </Grid>
          <TextField label="Search parts..." variant="outlined" fullWidth style={{ marginBottom: 20 }} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Part</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>GeForce RTX 4070 GPU</TableCell>
                <TableCell>3</TableCell>
                <TableCell>Bin A1</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" style={{ marginRight: 10 }}>Check Out</Button>
                  <Button variant="outlined" color="secondary">Check In</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
};