
import { Tabs, Tab, Box, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, CardContent, CardActions, Card, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, List, CardHeader } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import ErrorIcon from '@mui/icons-material/Error';
import { useEffect } from "react";
import authenticatedFetch from "../../utils/apiUtil";
import { DatabaseEntry, Db } from '../Dashboard';
import { useState } from "react";
import { Delete, Done, Edit, Inbox, Upgrade } from "@mui/icons-material";

interface Props {
  db: DatabaseEntry | undefined;
  setValue?: (value: number) => void;
}

const Overview: React.FC<Props> = ({db, setValue}) => {

    const [recentQueries, setRecentQueries] = useState<string[]>([]);

    useEffect(() => {
        const localStorageKey = `queryHistory-${db?.db}-${db?.data.connection_data.database}`;
        const historyStr = localStorage.getItem(localStorageKey);

        if(historyStr) {
            setRecentQueries(JSON.parse(historyStr));
        }    
    }, [db]);

    const renderIcon = (query: string) => {
        if (query.startsWith('INSERT')) {
            return <Edit />;
        } else if (query.startsWith('UPDATE')) {
            return <Upgrade />;
        } else if (query.startsWith('DELETE')) {
            return <Delete />;
        } else if (query.startsWith('SELECT')) {
            return <Done/>;
        } else {
            return <Inbox />;
        }
    }

    const changeTabToSqlEditor = () => {
        if(setValue) {
            setValue(2);
        }
    }

    return (
        <Container>
            <Box display='flex' flexDirection='row'>
                <Grid container spacing={6}>
                    <Grid item>
                       <Card sx={{ 
                           borderRadius: '18px',
                           border: '1px solid #CAC4D0',
                           backgroundColor: '#FEF7FF',
                           boxShadow: 'none',
                       }}> 
                           <CardHeader
                               title={
                                    <Typography variant="body1">
                                        Memory Usage
                                    </Typography>
                               } 
                           />
                       </Card> 
                    </Grid>
                    <Grid item>
                       <Card sx={{ 
                           borderRadius: '18px',
                           border: '1px solid #CAC4D0',
                           backgroundColor: '#FEF7FF',
                           boxShadow: 'none',
                       }}> 
                           <CardHeader
                               title={
                                    <Typography variant="body1">
                                        Recent Queries
                                    </Typography>
                               } 
                           />
                           <Divider/>
                           <CardContent>
                                <List>
                                { recentQueries.map((query) => (
                                    <ListItem>
                                        <ListItemButton onClick={changeTabToSqlEditor} sx={{ width: '100%' }}>
                                            <ListItemIcon sx={{ marginRight: '-18px' }}>
                                                {renderIcon(query)}             
                                            </ListItemIcon>
                                            {query}
                                        </ListItemButton>
                                    </ListItem>

                                ))}
                                </List>
                           </CardContent>
                       </Card> 
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Overview;
