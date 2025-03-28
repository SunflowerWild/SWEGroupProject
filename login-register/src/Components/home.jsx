import React from "react";
import { Stack, TextField, Paper, Avatar, Checkbox, Grid, FormControlLabel, Button, Link, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo, } from '@mui/material/colors';

const theme = createTheme({
    palette: {
      primary: indigo,
      secondary: blueGrey,
    }
});
export const Home = () =>{
    const paperStyle = {padding :26,height: '20vh', width :480, margin:'20px auto'}
    const avatarStyle = {backgroundColor: '#7a15bb9e'}
    const btstyle={margin: '8px 0'}
    return(
        <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}>
            <Paper elevation={10} style={paperStyle}>
                <Grid align = 'center'>
                <h1>Welcome home</h1>
                
                <ThemeProvider theme={theme}>
                    <Button variant="contained" type='submit' color='primary' style={btstyle} fullWidth>Log Out</Button>
                </ThemeProvider>
                </Grid>
            </Paper>
        </Grid>
    );
};
    