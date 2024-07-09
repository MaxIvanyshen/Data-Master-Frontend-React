import { AppBar, Toolbar, Button, Typography, Container, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import icon from './assets/icon.png';
import mongo from './assets/mongo.png'
import postgres from './assets/postgres.png'
import mysql from './assets/mysql.png'
import sqlite from './assets/sqlite.png'
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authenticatedFetch from '../utils/apiUtil';
import Header from './Header';
import AddDatabase from './AddDatabase';

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

interface UserInfo {
    firstname: string;
    lastname: string;
    email: string;
    databases: Map<String, object>
}

function Dashboard() {
    const [data, setData] = useState(null);
    const [redirect, setRedirect] = useState("");
    const [addDb, setAddDb] = useState(false);
    const token = useCheckAccessToken();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchUrl = `${process.env.REACT_APP_BACKEND_URL}/user`
                const response = await authenticatedFetch(fetchUrl)

                if (response.status == 401) {
                    setRedirect("/login")
                    return
                }
                else if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const resp = await response.json();
                setData(resp);
                let psqlCount = 0;
                let mysqlCount = 0;
                let mongoCount = 0;
                if(resp.databases["PostgreSQL"]) {
                    psqlCount = resp.databases["PostgreSQL"].length;
                }
                if(resp.databases["MySQL"]) {
                    mysqlCount = resp.databases["MySQL"].length;
                }
                if(resp.databases["MongoDB"]) {
                    mongoCount = resp.databases["MongoDB"].length;
                }

                let userHasDatabases = psqlCount + mysqlCount + mongoCount !== 0;
                //setAddDb(!userHasDatabases);
                setAddDb(true);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    if(redirect !== "") {
       return ( <Navigate to={redirect}/> ); 
    }

    if(token === null) {
       return ( <Navigate to="/"/> ); 
    }
    
    return (<ThemeProvider theme={theme}>
            <Header user={data}/>
            {addDb ?
                <AddDatabase/>
                    : 
                <Container>
                    hello world
                </Container>
            }
      
    </ThemeProvider>
    );
};

export default Dashboard;
