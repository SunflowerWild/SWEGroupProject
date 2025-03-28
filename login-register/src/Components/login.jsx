import React from "react";
import { Stack, TextField, Paper, Avatar, Checkbox, Grid, FormControlLabel, Button, Link, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo, } from '@mui/material/colors';
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
  
const Login = () =>{
    const paperStyle = {padding :26,height: '70vh', width :480, margin:'20px auto'}
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
                <Avatar style={avatarStyle}><LockOutlineIcon/></Avatar>
                <h2>Sign in</h2>
                </Grid>
                <Stack spacing={6}>
                <TextField id="outlined-basic" label="Username" placeholder='Enter username' variant="outlined" fullWidth required/>
                <TextField id="outlined-basic" label="Password" placeholder='Enter password' variant="outlined" fullWidth required/>
                </Stack>

                <Stack direction='row' justifyContent="space-between" alignItems="center" marginTop="auto">
                <FormControlLabel
                control={<Checkbox name= 'checkedB' color = 'primary'/>}
                label = 'Remember me'
                />
                <ThemeProvider theme={theme}>
                <Typography> 
                    <Link href="#" color="secondary" variant="caption" underline="hover">Forgot Password</Link>
                </Typography>
                </ThemeProvider>
                </Stack>
                
                <ThemeProvider theme={theme}>
                    <Button variant="contained" type='submit' color='primary' style={btstyle} fullWidth>Sign in</Button>
                </ThemeProvider>
                <Stack direction='row' alignItems="center" gap={2} marginTop="auto">
                    <ThemeProvider theme={theme}>
                    <Typography> New User? </Typography>
                    <Link href="#" color="primary" underline="hover">SignUp</Link>
                    </ThemeProvider>
                </Stack>
                
            </Paper>
        </Grid>
    );
};
export default Login