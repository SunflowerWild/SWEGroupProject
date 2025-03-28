import React from "react";
import { Stack, TextField, Paper, Avatar, Checkbox, Grid, FormControlLabel, Button, Link, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo, } from '@mui/material/colors';
//import Paper from '@mui/material/Paper';
//import Avatar from '@mui/material/Avatar';
//import Grid from '@mui/material/Grid';

import ApiIcon from '@mui/icons-material/Api';

const theme = createTheme({
    palette: {
      primary: indigo,
      secondary: blueGrey,
    }
});
  
export const SignUp = () =>{
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
                <Avatar style={avatarStyle}><ApiIcon/></Avatar>
                <h2>Sign Up</h2>
                <Typography variant="caption">Create an account or </Typography>
                <Link href="#" color="primary" underline="hover" variant="caption">Sign in</Link>
                </Grid>
                <Stack spacing={4}>
                <TextField id="outlined-basic" label="Name" placeholder='Enter Name' variant="outlined" fullWidth required/>
                <TextField id="outlined-basic" label="Username" placeholder='Enter username' variant="outlined" fullWidth required/>
                <TextField id="outlined-basic" label="Password" placeholder='Enter password' variant="outlined" fullWidth required/>
                <TextField id="outlined-basic" label="Confirm Password" placeholder='Enter password' variant="outlined" fullWidth required/>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" type='submit' color='primary' style={btstyle} fullWidth>Sign Up</Button>
                </ThemeProvider>
                </Stack>
                <Typography variant="caption">By signing up to create an account, you are accepting our terms of service and privacy policy </Typography>           
            </Paper>
        </Grid>
    );
};
