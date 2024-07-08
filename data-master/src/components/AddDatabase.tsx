import { AppBar, Toolbar, Button, Typography, Container, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import icon from './assets/icon.png';
import bg from './assets/bg.jpg';
import mongo from './assets/mongo.png'
import postgres from './assets/postgres.png'
import mysql from './assets/mysql.png'
import sqlite from './assets/sqlite.png'
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authenticatedFetch from '../utils/apiUtil';
import Header from './Header';

const theme = createTheme({
    typography: {
        fontFamily: "Noto Sans, sans-serif",
    },
    palette: {
        primary: {
            main: '#35485F',
        },
        secondary: {
            main: '#8F8FC1',
        },
        info: {
            main: '#5C4E8D',
        },
    },
});

function AddDatabase() {
   
    return (<ThemeProvider theme={theme}>
      <Container 
      style={{
                width: '100%',
                maxWidth: '100%',
                height: '92.2vh',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundImage: `url(${bg})`,
                backgroundPosition: 'bottom',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
     }} maxWidth="xl">

      </Container>
    </ThemeProvider>
    );
};

export default AddDatabase;

