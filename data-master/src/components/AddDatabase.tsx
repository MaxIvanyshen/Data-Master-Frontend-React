import { TextField, Typography, Container, Box, Grid, Card, CardContent, CardActions, Fab } from '@mui/material';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import bg from './assets/bg.jpg';
import { useState, useEffect } from 'react';
import PostgresForm from './dbDataForms/postgresForm';
import MySQLForm from './dbDataForms/mysqlForm';
import MongoForm from './dbDataForms/mongoForm';
import { ArrowBack } from '@mui/icons-material';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface AddDatabaseProps {
   setAddDb: (setDb: boolean) => void;
}

const AddDatabase: React.FC<AddDatabaseProps> = ({ setAddDb }) => {
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
   
    return (<ThemeProvider theme={theme}>
      <Container 
      sx={{
                height: {'xs': '100vh', 'md': '91.9vh'},
      }}
      style={{
                width: '100%',
                maxWidth: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundImage: `url(${bg})`,
                backgroundPosition: 'bottom',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                textAlign: 'center',
     }} maxWidth="xl">

          <Container sx={{
              paddingTop: '50px',
          }}>
              <Typography color='#35485F' sx={{ fontWeight: 'bold', fontSize: {'xs': '35px', 'sm': '50px', 'md': '65px'}}} gutterBottom>
                Let's add a database!
              </Typography>
              <Container
                sx={{
                    backgroundColor: '#FEF7FF',
                    width: '100%',
                    borderRadius: '25px'
                }}
              >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab sx={{
                        color: '#5C4E8D',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }} label="PostgreSQL" />
                    <Tab sx={{
                        color: '#5C4E8D',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }} label="MySQL" />
                    <Tab sx={{
                        color: '#5C4E8D',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }} label="MongoDB" />
              </Tabs>
            </Box>
            <Box>
                <Fab color="secondary"
                style={{
                    position: 'fixed',
                    top: '95px',
                    left: 25,
                    transition: 'left 0.2s',
                    width: 50,
                    height: 50,
                    borderRadius: '12px',
                }}
                onClick={() => {setAddDb(false)}}>
                    <ArrowBack/>
                </Fab>
            </Box>
                <CustomTabPanel value={value} index={0}>
                    <PostgresForm/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <MySQLForm/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <MongoForm/>
                </CustomTabPanel>
              </Container>
          </Container>
      </Container>
    </ThemeProvider>
    );
};

export default AddDatabase;

