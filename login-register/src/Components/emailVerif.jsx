import React from "react";
import { Stack, TextField, Paper, Avatar, Checkbox, Grid, FormControlLabel, Button, Link, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo, } from '@mui/material/colors';
import { DashboardHeader } from "./DashboardHeader"; // adjust path as needed

export const EmailAuth = () =>{
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
                <h1>Email Verification</h1>
                <TextField id="outlined-basic" label="Verification Code" placeholder='Enter Code' variant="outlined" fullWidth required/>
                </Grid>
            </Paper>
        </Grid>
    );
}
