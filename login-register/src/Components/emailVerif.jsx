import React, { useState } from "react";
import { Grid, TextField, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import your API utility

const EmailAuth = () => {
    const paperStyle = { padding: 26, height: '20vh', width: 480, margin: '20px auto' };
    const btstyle = { margin: '8px 0' };
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = localStorage.getItem('email'); // Retrieve email from localStorage

        if (!email || !code) {
            setError('Email and verification code are required');
            return;
        }

        try {
            const response = await api.post('/api/auth/verify-email', { email, code }); // Ensure the route matches the backend

            console.log(response.data);
            if (response.data === 'Email verified successfully.') {
                navigate('/home'); // Redirect on successful verification
            } else {
                setError('Invalid verification code');
            }
        } catch (err) {
            console.error("Verification error:", err);
            setError('Failed to verify code. Try again.');
        }
    };

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}
        >
            <Paper elevation={10} style={paperStyle}>
                <Grid align="center">
                    <h1>Email Verification</h1>
                    <TextField
                        id="outlined-basic"
                        label="Verification Code"
                        placeholder="Enter Code"
                        variant="outlined"
                        fullWidth
                        required
                        value={code} // Bind to the code state
                        onChange={(e) => setCode(e.target.value)} // Update the code state on input change
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        style={btstyle}
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Verify
                    </Button>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default EmailAuth;