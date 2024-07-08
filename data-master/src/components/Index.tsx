import { AppBar, Toolbar, Button, Typography, Container, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import bg from './assets/bg.jpg'
import icon from './assets/icon.png';
import mongo from './assets/mongo.png'
import postgres from './assets/postgres.png'
import mysql from './assets/mysql.png'
import sqlite from './assets/sqlite.png'
import Footer from './Footer';
import { Navigate, useLocation } from 'react-router-dom'

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

interface CardData {
    dbName: string,
    dbDescription: string,
    dbImage: any,
    available: boolean
};

//TODO: fetch this from backend
const cards: CardData[] = [
    {dbName: "PostgreSQL", dbDescription: "Advanced open-source relational database management system known for its robustness, scalability, and extensibility.", dbImage: postgres, available: true},
    {dbName: "MySQL", dbDescription: "Widely used open-source relational database management system known for its speed, reliability, and ease of use.", dbImage: mysql, available: true},
    {dbName: "MongoDB", dbDescription: "Leading NoSQL database known for its flexibility and scalability in handling unstructured and semi-structured data.", dbImage: mongo, available: true},
    {dbName: "SQLite", dbDescription: "Lightweight, serverless relational database designed for embedded and small-scale applications. Coming soon!", dbImage: sqlite, available: false},
];

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

function Index() {

    const token = useCheckAccessToken();
    
    if(token !== null) {
        return (<Navigate to="/dashboard"/>);
    }

    return (<ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar style={{height: 75}}>
            <a href="/" style={{ 
                textDecoration: 'none',
                textTransform: 'none',
                color: 'inherit',
            }}>
            <img src={icon} style={{ width: 50, height: 50, borderRadius: '12px' }} ></img>
            </a>
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
      
      <Container 
      style={{
                width: '100%',
                maxWidth: '100%',
                height: '850px',
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
        <Box sx={{ textAlign:'center', width: '50%' }}>
          <Typography color='#35485F' sx={{ fontWeight: 'bold', fontSize: {'xs': '35px', 'sm': '50px', 'md': '65px', 'lg': '75px'}}} gutterBottom>
            Manage everything in one place
          </Typography>
          <a href="/signup">
          <Button variant="contained" color="info" sx={{ textTransform: 'none', borderRadius: '100px', width: 200, height: 60, mt: 2, boxShadow: 'none', fontWeight: 'bold', fontSize: '25px' }}>
            Let's go!
          </Button>
          </a>
        </Box>
      </Container>
     
     <Container sx={{ marginTop: 2}} maxWidth="lg">
        
     <Typography color='#35485F' sx={{ fontWeight: 'bold', fontSize: '35px', textAlign: 'center'}} gutterBottom>
         Databases Support
     </Typography>
        
        <Grid container spacing={6}>
        {cards.map((card) => (
          <Grid  item xs={12} sm={6} md={3}>
            <Card style={{ height: '27vh', backgroundColor: '#8F8FC1', color: 'white', borderRadius: '25px'}}>
              <CardContent>
                <img src={card.dbImage} style={{ height: 40 }}/>
                <Typography variant="h5" component="h3" fontWeight='bold'>
                  {card.dbName}
                </Typography>
                <Typography variant="body2">
                    {card.dbDescription}
                </Typography>
              </CardContent>
              <CardActions>
                <a href="/signup">
                <Button size="small" variant='contained' color="info" style={{ textTransform: 'none',  marginLeft: 10, color: 'white', borderRadius: '25px', height: '40px', width: '120px', fontSize: '16px'}}>
                    {card.available ? "Try it out!" : "Notify me!"}
                </Button>
                </a>
              </CardActions>
            </Card>
          </Grid>
        ))}
        </Grid>
      </Container>
      <Container 
        sx={{
            width: {'xs': '95%', 'lg': '60.5%'},
            borderRadius: '25px',
            backgroundColor: '#8F8FC1',
            marginTop: 4,
        }}
      >
      <Box sx={{ display: 'flex' }}>
          <Box padding={5} width={{'xs': '80%', 'md': '60%', 'lg': '40%'}}>
            <Box>
                <Typography variant='h4' color='white' fontWeight='bold'>
                    Meet Data Master
                </Typography>
                    <Typography color='white' fontWeight='bold' marginTop={1}>
                    Unlock the full potential of your data with Data Master, the comprehensive Integrated Database Environment designed for database professionals like you.
                </Typography>
            </Box>
            <Box marginTop={5}>
                <Typography variant='h4' color='white' fontWeight='bold'>
                    Why Data Master?
                </Typography>
                    <Typography color='white' fontWeight='bold' marginTop={1}>
                    <ul>
                        <li>Effortless SQL Editing: Write and debug SQL queries with ease using our intuitive editor.</li>
                        <li>Advanced Database Management: Seamlessly manage multiple databases and schemas from a single interface.</li>
                        <li>Visualize Your Data: Gain insights with powerful data visualization tools and interactive dashboards.</li>
                        <li>Boost Productivity: Stop switching between database platforms and enjoy seamless workflow</li>
                    </ul>
                </Typography>
            </Box>
          </Box>
      </Box>
      </Container>
      <Box textAlign='center' paddingBottom={2}>
          <a href="/signup">
          <Button variant="contained" color="info" sx={{ textTransform: 'none', borderRadius: '100px', width: 200, height: 60, mt: 2, boxShadow: 'none', fontWeight: 'bold', fontSize: '22px' }}>
          Try for free!
          </Button>
          </a>
      </Box>
      <Footer/>
    </ThemeProvider>
    );
};

export default Index;
