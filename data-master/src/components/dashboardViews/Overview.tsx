
import { Tabs, Tab, Box, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, CardContent, CardActions, Card, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, List, CardHeader } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { memo, useEffect } from "react";
import { authenticatedFetch, cancelAllRequests, havePendingRequests } from "../../utils/apiUtil";
import { DatabaseEntry, Db } from '../Dashboard';
import { useState } from "react";
import { Delete, Done, Edit, Inbox, Upgrade } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import axios, { CancelTokenSource } from "axios";

interface Props {
  db: DatabaseEntry | undefined;
  setValue?: (value: number) => void;
}

interface ChartData {
    data: number,
    timestamp: string,
}

const Overview: React.FC<Props> = ({db, setValue}) => {
    const [stats, setStats] = useState<object>({});

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

    const getCurrentTimestamp = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const boundData = (data: any[]) => {
        if(data.length > 10) {
            data = data.slice(data.length - 11, data.length - 1);
        }
        return data
    }

    useEffect(() => {
        
        const parseMemoryUsage = (currMemoryUsage: any | undefined) => {
            const localStorageKey = `memoryUsage-${db?.db}-${db?.data.connection_data.database}`;
            const memoryUsageDataStr = localStorage.getItem(localStorageKey);
            let memoryUsage: ChartData[] = [];
            if(memoryUsageDataStr) {
                memoryUsage = JSON.parse(memoryUsageDataStr);
            }
            if(currMemoryUsage) {
                const currentData = {
                    data: currMemoryUsage.databaseTotal,
                    timestamp: getCurrentTimestamp(),
                }

                memoryUsage = boundData([...memoryUsage, currentData]);
                localStorage.setItem(localStorageKey, JSON.stringify(memoryUsage));
            }
        }

        const parseActiveConnections = (currActiveConnections: number | undefined) => {
            const localStorageKey = `activeConnections-${db?.db}-${db?.data.connection_data.database}`;
            const activeConnectionsDataStr = localStorage.getItem(localStorageKey);
            let activeConnections: ChartData[] = [];
            if(activeConnectionsDataStr) {
                activeConnections = JSON.parse(activeConnectionsDataStr);
            }
            if(currActiveConnections) {
               const currentData = {
                   data: currActiveConnections,
                   timestamp: getCurrentTimestamp(),
               } 

               activeConnections = boundData([...activeConnections, currentData]);
               localStorage.setItem(localStorageKey, JSON.stringify(activeConnections));
            }
        };

        const parseOperations = (currOperations: any | undefined) => {
            const localStorageKey = `operations-${db?.db}-${db?.data.connection_data.database}`;
            const operationsDataStr = localStorage.getItem(localStorageKey);
            let operations: ChartData[] = [];
            if(operationsDataStr) {
                operations = JSON.parse(operationsDataStr);
            }
            if(currOperations) {
                const currentData = {
                    data: currOperations,
                    timestamp: getCurrentTimestamp(),
                }
                operations = boundData([...operations, currentData]);
                console.log(operations.length);
                localStorage.setItem(localStorageKey, JSON.stringify(operations));
            }
        }

        const fetchStats = async () => {
            let provider = 'postgres';
            if(db?.db === Db.MySQL) {
                provider = 'mysql';
            }
            if(db?.db === Db.MongoDB) {
                provider = 'mongo';
            }
            const dbName = db?.data["connection_data"]["database"];
            if(!dbName) {
                return;
            }
            let currStats = undefined;
            try {
                if(havePendingRequests()) {
                    cancelAllRequests();
                }
                const url = `${process.env.REACT_APP_BACKEND_URL}/${provider}/stats?database=${dbName}`;
                const response = await authenticatedFetch(url);
                setStats(response?.data as object);
                currStats = response?.data;
            } catch(e) {
                if(axios.isAxiosError(e) && axios.isCancel(e)) {
                    return;
                }
            }

            if(!currStats) {
                return;
            }

            parseMemoryUsage((currStats as any)["memoryUsage"]);
            parseActiveConnections((currStats as any)["activeConnections"]);
            parseOperations((currStats as any)["operations"]);
        }

        fetchStats();

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
    };

    const changeTabToSqlEditor = () => {
        if(setValue) {
            setValue(2);
        }
    };

    const memoryUsageChart = () => {

        let dataStr = localStorage.getItem(`memoryUsage-${db?.db}-${db?.data.connection_data.database}`);

        if(!dataStr) {
            dataStr = '[]';
        }

        const data = JSON.parse(dataStr);

        const labels = data.map((item: ChartData, index: number) => item.timestamp);

        const chartData = {
            labels,
            datasets: [
                {
                    label: 'Memory Usage (bytes)',
                    data: data.map((item: any) => item.data),
                        borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
            ],
        };
        const options = {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            return `${context.dataset.label}: ${context.raw} bytes`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
            },
        };

        return (
            <Box>
                <Line data={chartData} options={options}/>
            </Box>
        );
    };

    const activeConnectionsChart = () => {
        let dataStr = localStorage.getItem(`activeConnections-${db?.db}-${db?.data.connection_data.database}`);

        if(!dataStr) {
            dataStr = '[]';
        }

        const data = JSON.parse(dataStr);

        const labels = data.map((item: ChartData, index: number) => item.timestamp);

        const chartData = {
            labels,
            datasets: [
                {
                    label: 'Active Connections',
                    data: data.map((item: any) => item.data),
                        borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
            ],
        };
        const options = {
            responsive: true,
            plugins: {
                title: {
                    text: 'Active Connections',
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            return `${context.dataset.label}: ${context.raw}`
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
            },
        };

        return (
            <Box>
                <Line data={chartData} options={options}/>
            </Box>
        );
    };

    const operationsChart = () => {

        let dataStr = localStorage.getItem(`operations-${db?.db}-${db?.data.connection_data.database}`);

        if(!dataStr) {
            dataStr = '[]';
        }

        const data = JSON.parse(dataStr);

        let eachOperationData: any = {};
        data.forEach((item: any) => {
            Object.keys(item.data).forEach((key) => {
                eachOperationData[key] = [];
            }); 
        });
        data.forEach((item: any) => {
            Object.entries(item.data).forEach(([key, value]) => {
                eachOperationData[key].push(value);
            }); 
        });
        console.log(eachOperationData);

        const labels = data.map((item: ChartData, index: number) => item.timestamp);

        const getRandomColor = () => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return `rgb(${r},${g},${b})`;
        }

        const operationsDatasets = Object.entries(eachOperationData).map(([key, value]) => {
            return {
                label: key,
                data: value,
                fill: true,
                backgroundColor: getRandomColor(),
            }
        });


        const chartData = {
            labels,
            datasets: [
                ...operationsDatasets,
            ],
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            return `${context.dataset.label}: ${context.raw}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
            },
        };

        return (
            <Box>
            <Line data={chartData} options={options}/>
            </Box>
        );
    }

    const recentQueriesList = () => {
            const localStorageKey = `queryHistory-${db?.db}-${db?.data.connection_data.database}`;
            const historyStr = localStorage.getItem(localStorageKey);

            let recentQueries: string[] = [];
            if(historyStr) {
                recentQueries = JSON.parse(historyStr).slice(0, 5);
            }

            return (

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
            )
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
                           <Divider/>
                           <CardContent>
                                {memoryUsageChart()} 
                           </CardContent>
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
                                        Active Connections
                                    </Typography>
                               } 
                           />
                           <Divider/>
                           <CardContent>
                                {activeConnectionsChart()} 
                           </CardContent>
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
                                        Operations
                                    </Typography>
                               } 
                           />
                           <Divider/>
                           <CardContent>
                                {operationsChart()} 
                           </CardContent>
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
                            {recentQueriesList()}
                           </CardContent>
                       </Card> 
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Overview;
