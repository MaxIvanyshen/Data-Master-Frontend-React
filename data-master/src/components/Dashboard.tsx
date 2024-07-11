import { Toolbar, Drawer, Fab, Button, Typography, Container, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authenticatedFetch from '../utils/apiUtil';
import Header from './Header';
import AddDatabase from './AddDatabase';
import { Menu } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

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

function Dashboard() {
    const [data, setData] = useState(null);
    const [redirect, setRedirect] = useState("");
    const [addDb, setAddDb] = useState(false);
    const [treeViewOpen, setTreeViewOpen] = useState(true);
    const token = useCheckAccessToken();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    const drawerVariant = isMobile ? 'temporary' : 'persistent';
    return (<ThemeProvider theme={theme}>
            <Header user={data}/>
            {addDb ?
                <AddDatabase/>
                    : 
                <Container
                    style={{
                        width: '100%',
                        maxWidth: '100%',
                    }}
                    >
                    
                        <Box display='flex'>
                        <Drawer 
                        sx={{
                            zIndex: -1,
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                            backgroundColor: '#35485F',
                            color: 'white',
                                width: drawerWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                            anchor='left'
                        variant={drawerVariant} open={treeViewOpen}>
                        <Toolbar sx={{ height: '80px' }}/>
                            <RichTreeView items={MUI_X_PRODUCTS} />
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

                </Container>
            }

      
    </ThemeProvider>
    );
};

export default Dashboard;
