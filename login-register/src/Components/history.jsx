// History.jsx
import React from "react";
import { Paper, Avatar, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo } from '@mui/material/colors';
import HistoryIcon from '@mui/icons-material/History';
import { DashboardHeader } from "./DashboardHeader"; // adjust path as needed

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: blueGrey,
  }
});

export const History = () => {
  const paperStyle = { padding: 26, width: '80%', margin: '20px auto' };
  const avatarStyle = { backgroundColor: '#7a15bb9e' };

  return (
    <ThemeProvider theme={theme}>
      <DashboardHeader />
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}><HistoryIcon /></Avatar>
            <h2>Transaction History</h2>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Part</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>2025-04-12</TableCell>
                <TableCell>PC #10</TableCell>
                <TableCell>Test Student</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
};
