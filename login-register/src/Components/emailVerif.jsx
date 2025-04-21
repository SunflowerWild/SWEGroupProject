import React, { useState } from "react";
import { Stack, TextField, Paper, Avatar, Checkbox, Grid, FormControlLabel, Button, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo, } from '@mui/material/colors';
import { DashboardHeader } from "./DashboardHeader"; // adjust path as needed
import api from '../utils/apiRoutes'; 


const EmailAuth = () =>{
    const paperStyle = {padding :26,height: '20vh', width :480, margin:'20px auto'}
    const avatarStyle = {backgroundColor: '#7a15bb9e'}
    const btstyle = { margin: '8px 0' }
    const navigate = useNavigate(); // Add useNavigate hook
    const [code, setCode] = useState('');
    const [error, setError] = useState('');


     const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/verify-email', { code });

            if (response.data.success) {
                navigate('/home'); // Redirect on successful verification
            } else {
                setError('Invalid verification code');
            }
        } catch (err) {
            console.error("Verification error:", err);
            setError('Failed to verify code. Try again.');
        }
    };

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
                <Button type='submit' color='primary' variant="contained" style={btstyle} fullWidth onClick={handleSubmit}>Verify</Button>
                </Grid>
            </Paper>
        </Grid>
    );
}

export default EmailAuth;
