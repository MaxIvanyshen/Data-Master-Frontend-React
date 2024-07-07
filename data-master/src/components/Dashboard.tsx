import { AppBar, Toolbar, Button, Typography, Container, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import bg from './assets/bg.jpg';
import icon from './assets/icon.png';
import mongo from './assets/mongo.png'
import postgres from './assets/postgres.png'
import mysql from './assets/mysql.png'
import sqlite from './assets/sqlite.png'
import Footer from './Footer';
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function useCheckAccessToken() {
    const query = useQuery();
    let token = query.get("token");

    if(token === null) {
        token = localStorage.getItem('accessToken')
    } else {
        localStorage.setItem('accessToken', token);
    }

    return token
}

async function fetchDatabases(token: string) {
    try {
        const response = await fetch('http://localhost:42069/user', {
            method: 'GET', // or 'POST', 'PUT', etc.
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

interface UserInfo {
    firstname: string;
    lastname: string;
    email: string;
    databases: Map<String, object>
}

function Dashboard() {
    const [data, setData] = useState(null);
    const token = useCheckAccessToken();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:42069/user', {
                    method: 'GET', // or 'POST', 'PUT', etc.
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                setData(await response.json());
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    if(token === null) {
       return ( <Navigate to="/"/> ); 
    }

    if(data !== null) {
        const userHasDatabases = (data as UserInfo).databases.size !== undefined;
        if(!userHasDatabases) {
            return ( <Navigate to="/dashboard/add-database"/> );
        }
    }
    
    return (<ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar style={{height: 75}}>
        <img src={icon} style={{ width: 50, height: 50, borderRadius: '12px' }} ></img>
          <Typography variant="h6" fontWeight="bold" sx={{ ml: 2, flexGrow: 1 }}>
            Data Master
          </Typography>
          <a href="/signup">
          <Button 
              variant="contained"
              sx={
              { 
                  ml: 2,
                  borderRadius: '100px',
                  boxShadow: 'none',
                  fontWeight: 'bold',
                  fontSize: '17px',
                  width: '120px',
                  textTransform: 'none',
              }} 
              color="info">
              Sign Up
          </Button>
          </a>

          <a href="/login">
          <Button 
              variant="contained"
              sx={
              { 
                  ml: 2,
                  borderRadius: '100px',
                  boxShadow: 'none',
                  fontWeight: 'bold',
                  fontSize: '17px',
                  width: '120px',
                  textTransform: 'none',
              }} 
              color="info">
              Log In
          </Button>
          </a>
        </Toolbar>
      </AppBar>

      <Container>
      </Container>
      
    </ThemeProvider>
    );
};

export default Dashboard;
