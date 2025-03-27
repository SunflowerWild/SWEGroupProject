import React from "react";
import{Grid,Paper} from '@mui/material'

const Login = () =>{
    const paperStyle= {padding :26,height: '70vh', width :480, margin:'20px auto'}
    return(
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}
            >
            <Paper elevation={10} style={paperStyle}>
                Sign in
            </Paper>
        </Grid>
    );
};
export default Login