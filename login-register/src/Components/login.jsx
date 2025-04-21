import React from "react";
import { useNavigate } from 'react-router-dom';
import { Stack, TextField, Paper, Avatar, Checkbox, Grid, FormControlLabel, Button, Link, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo, } from '@mui/material/colors';
import { Link as RouterLink } from 'react-router-dom';
import api from '../utils/api'; 
//import Paper from '@mui/material/Paper';
//import Avatar from '@mui/material/Avatar';
//import Grid from '@mui/material/Grid';



import LockOutlineIcon from '@mui/icons-material/LockOutlined';

const theme = createTheme({
    palette: {
        primary: indigo,
        secondary: blueGrey,
    },
});

const Login = () => {
    const navigate = useNavigate(); // Add useNavigate hook
    const paperStyle = { padding: 26, height: '70vh', width: 480, margin: '20px auto' };
    const avatarStyle = { backgroundColor: '#7a15bb9e' };
    const btstyle = { margin: '8px 0' };

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSignUp = () => {
        navigate('/signup'); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        try {
            const response = await api.post('/users/login', {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/home'); 
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid email or password');
        }
    };

    return (
        <Grid container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlineIcon /></Avatar>
                    <h2>Sign in</h2>
                </Grid>
                <Stack spacing={6}>
                    <TextField
                        id="email"
                        label="Email"
                        placeholder='Enter UF Email'
                        variant="outlined"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        placeholder='Enter password'
                        variant="outlined"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Stack>

                {error && <Typography color="error">{error}</Typography>}

                <Stack direction='row' justifyContent="space-between" alignItems="center" marginTop="auto">
                    <FormControlLabel
                        control={<Checkbox name='checkedB' color='primary' />}
                        label='Remember me'
                    />
                    <ThemeProvider theme={theme}>
                        <Typography>
                            <Link href="#" color="secondary" variant="caption" underline="hover">Forgot Password</Link>
                        </Typography>
                    </ThemeProvider>
                </Stack>

                <ThemeProvider theme={theme}>
                    <Button
                        variant="contained"
                        type='submit'
                        color='primary'
                        style={btstyle}
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Sign in
                    </Button>
                </ThemeProvider>
                <Stack direction='row' alignItems="center" gap={2} marginTop="auto">
                    <ThemeProvider theme={theme}>
                    <Typography> New User? </Typography>
                    <Link component={RouterLink} to="/signup" color="primary" underline="hover">Sign Up</Link>
                    </ThemeProvider>
                </Stack>
            </Paper>
        </Grid>
    );
};

export default Login;