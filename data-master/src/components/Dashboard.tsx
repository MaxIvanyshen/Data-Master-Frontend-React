import { Toolbar, Drawer, Fab, Tabs, Tab, Button, Typography, Container, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, MouseEventHandler } from 'react';
import authenticatedFetch from '../utils/apiUtil';
import DatabaseView from './dashboardViews/DatabaseView';
import Header from './Header';
import AddDatabase from './AddDatabase';
import { Menu } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Folder } from '@mui/icons-material';
import { Storage } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

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

interface ConnectionData {
  host: string;
  port: number;
  user: string;
  database: string;
  password: string;
}

export interface Data {
  connection_data: ConnectionData;
  connection_string: string;
}

export interface DatabaseEntry {
  id: number;
  userId: string;
  db: Db;
  data: Data;
  createdAt: string;
  updatedAt: string;
}

export enum Db {
    PostgreSQL = 1,
    MySQL,
    MongoDB,
}

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

function Dashboard() {
    const [data, setData] = useState(null);
    const [databases, setDbs] = useState(new Map<string, DatabaseEntry[]>);
    const [redirect, setRedirect] = useState("");
    const [addDb, setAddDb] = useState(false);
    const [treeViewOpen, setTreeViewOpen] = useState(true);

    const [db, setCurrDB] = useState<DatabaseEntry>();
    const token = useCheckAccessToken();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const changeCurrDb = (data: DatabaseEntry) => {
        setCurrDB(data);
        setValue(0);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchUrl = `${process.env.REACT_APP_BACKEND_URL}/user`
                const response = await authenticatedFetch(fetchUrl)

                if (response.status == 401) {
                    setRedirect("/login")
                    return
                }
                else if (response.status != 200) {
                    throw new Error('Network response was not ok');
                }

                const resp = await response.data;
                setData(resp);
                setDbs(resp.databases);
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
                setAddDb(!userHasDatabases);
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
    
    const drawerWidth = 240;

    return (<ThemeProvider theme={theme}>
            <Header user={data} 
                sx={{
                    zIndex: theme.zIndex.drawer + 2,
                }}
            />
            {addDb ?
                <AddDatabase/>
                    : 
                <Container
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                    }}
                    >
                        <Box display='flex'>
                        <Drawer 
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                            backgroundColor: '#35485F',
                            color: 'white',
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                zIndex: theme.zIndex.drawer + 1,
                                marginTop: '75px',
                            },
                        }}
                        anchor='left'
                        variant='persistent' open={treeViewOpen}>
                        <SimpleTreeView>
                        { Object.entries(databases).map(([key, dbs]) => (
                            <TreeItem itemId={key} label={
                                <Box display='flex'>
                                    <Folder sx={{marginRight:'8px'}}/>
                                    {key}
                                </Box>
                            }>
                            { dbs.map((data: DatabaseEntry)  => (

                                <TreeItem onClick={() => changeCurrDb(data)} itemId={"db-" + data.id} label={
                                    <Box display='flex'>
                                        <Storage sx={{marginRight:'8px'}}/>
                                        {data.data.connection_data.database}
                                    </Box>
                                }/>
                                
                                              ))
                            }
                            </TreeItem>
                        ))}
                          </SimpleTreeView>
                        </Drawer>
                        <Box>
                            <Fab color="secondary"
                            style={{
                                position: 'fixed',
                                top: '95px',
                                left: treeViewOpen ? drawerWidth + 25 : 25,
                                transition: 'left 0.2s',
                                width: 50,
                                height: 50,
                                borderRadius: '12px',
                            }}
                            onClick={() => {setTreeViewOpen(!treeViewOpen)}}>
                              <Menu />
                            </Fab>
                        </Box>
                    </Box>

                    <Container
                        sx={{
                            maxWidth: '100%',
                            marginLeft: treeViewOpen && !isMobile ? `${drawerWidth / 2}px` : '0',
                            transition: 'margin-left 0.3s',
                        }}
                    >
                    <Box marginTop={15} marginBottom={2} display='flex'>

                        <Typography fontWeight='bold' variant={isMobile ? 'h3' : 'h2'} color='#35485F'>
                            {db?.data.connection_data.database}
                        </Typography>
                            <Fab color="secondary"
                            style={{
                                position: 'relative',
                                top: '15px',
                                left: '15px',
                                transition: 'left 0.2s',
                                width: 50,
                                height: 50,
                                borderRadius: '12px',
                            }}
                            >
                              <Edit />
                            </Fab>
                    </Box>
                        <Container
                        sx={{
                            backgroundColor: '#FEF7FF',
                            width: '100%',
                            borderRadius: '25px',
                        }}
                        >
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab sx={{
                                color: '#5C4E8D',
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }} label="Overview" />
                            <Tab sx={{
                                color: '#5C4E8D',
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }} label="Database" />
                            <Tab sx={{
                                color: '#5C4E8D',
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }} label="SQL Editor" />
                            </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                            overview
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <DatabaseView db={db}/>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                            sql
                            </CustomTabPanel>
                            </Container>
                        </Container>
                    </Container>
            }

      
    </ThemeProvider>
    );
};

export default Dashboard;
