import React from "react";
import { Stack, TextField, Paper, Avatar, Grid, Button, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo } from '@mui/material/colors';
import api from '../utils/api';
import apiRoutes from '../utils/apiRoutes'; // Import apiRoutes
import ApiIcon from '@mui/icons-material/Api';

const theme = createTheme({
    palette: {
        primary: indigo,
        secondary: blueGrey,
    }
});

const SignUp = () => {
    const paperStyle = { padding: 26, height: '70vh', width: 480, margin: '20px auto' }
    const avatarStyle = { backgroundColor: '#7a15bb9e' }
    const btstyle = { margin: '8px 0' }
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [name, setName] = React.useState('');

    const handleSignIn = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword || !name) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post(apiRoutes.register, { // Use the route from apiRoutes
                email,
                password,
                name
            });

            if (response.data?.message === 'User registered. Check your email for verification.') {
                navigate('/eauth');
            } else {
                setError('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed');
        }
    };

    return (
        <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><ApiIcon /></Avatar>
                    <h2>Sign Up</h2>
                    <Typography variant="caption">Create an account or </Typography>
                    <Link href="#" color="primary" underline="hover" variant="caption" onClick={handleSignIn}>Sign in</Link>
                </Grid>

                {error && <Typography color="error">{error}</Typography>}

                {/* Wrap fields and button inside a form */}
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <TextField
                            id="name"
                            label="Name"
                            placeholder='Enter Name'
                            variant="outlined"
                            fullWidth
                            required
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            id="email"
                            label="Email"
                            placeholder='Enter Email'
                            variant="outlined"
                            fullWidth
                            required
                            type="email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            placeholder='Enter password'
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            id="confirm-password"
                            label="Confirm Password"
                            placeholder='Confirm password'
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <ThemeProvider theme={theme}>
                            {/* Submit button inside the form */}
                            <Button variant="contained" color='primary' style={btstyle} fullWidth type="submit">
                                Sign Up
                            </Button>
                        </ThemeProvider>
                    </Stack>
                </form>

                <Typography variant="caption">By signing up, you accept our terms of service and privacy policy.</Typography>
            </Paper>
        </Grid>
    );
};

export default SignUp;