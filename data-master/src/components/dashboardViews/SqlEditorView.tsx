import { useState, useRef, useEffect} from "react";
import { DatabaseEntry } from "../Dashboard";
import { Container, TextField, Button, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, DialogTitle, DialogContent, DialogActions, Dialog } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { Box } from "@mui/system";
import { Db } from "../Dashboard";
import { authenticatedFetch } from "../../utils/apiUtil";
import axios from "axios";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

interface Props {
  db: DatabaseEntry | undefined;
}

function InfoScreen() {
    return (
        <h1>You need to go to database settings and enable custom queries</h1>
    );
}

const SqlEditor: React.FC<Props> = ({db}) => {

    const [query, setQuery] = useState("");
    const [tables, setTables] = useState([]);
    const [history, setHistory] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [queryResultRows, setQueryResultRows] = useState<object[]>([]);
    const [queryResultDialogOpen, setQueryResultDialogOpen] = useState(false);
    const [columns, setColumns] = useState<readonly GridColDef<object, any, any>[]>([]);
    const textFieldRef = useRef();

    const localStorageKey = `queryHistory-${db?.db}-${db?.data.connection_data.database}`;

    useEffect(() => {
        const fetchData = async() => {
            let provider = 'postgres';
            if(db?.db === Db.MySQL) {
                provider = 'mysql';
            }
            if(db?.db === Db.MongoDB) {
                provider = 'mongo';
            }
            const resp = await authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/${provider}/tables?database=${db?.data.connection_data.database}`)
            setTables(resp?.data);
        }
        fetchData();

    }, [db]);

    useEffect(() => {
        const storedHistory = localStorage.getItem(localStorageKey);
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, [localStorageKey]);

    const saveHistoryToLocalStorage = (newHistory: string[]) => {
        localStorage.setItem(localStorageKey, JSON.stringify(newHistory));
    };

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newQuery = e.target.value;
        setQuery(newQuery);
    }

    const insertTemplate = async () => {
        await setQuery("INSERT INTO  VALUES ();");
        (textFieldRef?.current as any).focus();
        (textFieldRef?.current as any).selectionStart = 12;
        (textFieldRef?.current as any).selectionEnd = 12;
    }

    const selectTemplate = async () => {
        const queryStr = "SELECT * FROM ";
        await setQuery(queryStr);
        (textFieldRef?.current as any).focus();
        (textFieldRef?.current as any).selectionStart = queryStr.length;
        (textFieldRef?.current as any).selectionEnd = queryStr.length;
    }

    const updateTemplate = async () => {
        const queryStr = "UPDATE  SET ";
        await setQuery(queryStr);
        (textFieldRef?.current as any).focus();
        (textFieldRef?.current as any).selectionStart = 7;
        (textFieldRef?.current as any).selectionEnd = 7;
    }

    const deleteTemplate = async () => {
        const queryStr = "DELETE FROM ";
        await setQuery(queryStr);
        (textFieldRef?.current as any).focus();
        (textFieldRef?.current as any).selectionStart = queryStr.length;
        (textFieldRef?.current as any).selectionEnd = queryStr.length;
    }

    const renderIcon = (query: string) => {
        if (query.startsWith('INSERT')) {
            return <EditIcon />;
        } else if (query.startsWith('UPDATE')) {
            return <UpgradeIcon />;
        } else if (query.startsWith('DELETE')) {
            return <DeleteIcon />;
        } else if (query.startsWith('SELECT')) {
            return <DoneIcon />;
        } else {
            return <InboxIcon />;
        }
    }

    const rowsWithId: readonly object[] = queryResultRows ? queryResultRows.map((row, index) => ({ id: `row-${index}`, ...row })) : [];

    const fetchColumns = async (newRows: any) =>  {
        if(!newRows || newRows.length == 0) {
            return;
        }

        const keys = Object.keys(newRows[0]);
        let gridColumns = []

        for(let i = 0; i < keys.length; i++) {
            gridColumns.push({
                field: keys[i],
                headerName: keys[i],
                width: 120,
            });
        }

        setColumns(gridColumns);
    }

    const runQuery = async () => {
        if(query == "") {
            return;
        }    

        let provider = 'postgres';
        if(db?.db === Db.MySQL) {
            provider = 'mysql';
        }
        if(db?.db === Db.MongoDB) {
            provider = 'mongo';
        }
        
        try {
            const response = await authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/${provider}/custom`, 
            {
                method: 'POST',
                data: {
                    'database': db?.data.connection_data.database,
                    'data': {
                        'query': query
                    }
                },
                withCredentials: false,
            });
            console.log(response?.data);

            if(response?.status == 200) {
                if(Array.isArray(response?.data)) {
                    await fetchColumns(response?.data);
                    setQueryResultRows(response?.data);
                    setQueryResultDialogOpen(true);
                }

                setError("");
                setErrorDialogOpen(false);

                const newHistory = [query, ...history ];
                setHistory(newHistory); 
                saveHistoryToLocalStorage(newHistory);
            }


        } catch(error: any) {
            console.log(error);
            if(axios.isAxiosError(error) && error.response?.status == 400) {
                setError("Error while running query: " + error.response?.data.message);
                setErrorDialogOpen(true);
            }
            return;
        }
    }

    return (
        <Container sx={{ width: '100%'}}>
            <Box sx={{ marginBottom: 2, textAlign: 'left'}}>
                <Typography sx={{ marginBottom: 1 }}>
                    Templates:
                </Typography>
                <Button
                sx={{
                    marginLeft: 5,
                    marginTop: '10px',
                    height: '65px',
                    width: '120px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    textTransform: 'none',
                }}
                onClick={insertTemplate}
                variant="contained" color='info'>
                    <EditIcon sx={{ marginRight: '5px' }}/> 
                    Insert
                </Button>
                <Button
                sx={{
                    marginLeft: 5,
                    marginTop: '10px',
                    height: '65px',
                    width: '120px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    textTransform: 'none',
                }}
                onClick={
                    selectTemplate
                }
                variant="contained" color='info'>
                    <DoneIcon sx={{ marginRight: '5px' }}/> 
                    Select
                </Button>
                <Button
                sx={{
                    marginLeft: 5,
                    marginTop: '10px',
                    height: '65px',
                    width: '120px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    textTransform: 'none',
                }}
                onClick={updateTemplate}
                variant="contained" color='info'>
                    <UpgradeIcon sx={{ marginRight: '1px' }}/> 
                    Update  
                </Button>

                <Button
                sx={{
                    marginLeft: 5,
                    marginTop: '10px',
                    height: '65px',
                    width: '120px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    textTransform: 'none',
                }}
                onClick={deleteTemplate}
                variant="contained" color='info'>
                    <DeleteIcon sx={{ marginRight: '5px' }}/> 
                    Delete
                </Button>
            </Box>
            <Box display='flex' width='100%'>
                <TextField
                inputRef={textFieldRef}
                label="SQL Query"
                type="text"
                variant="outlined"
                margin="normal"
                name="host"
                value={query}
                onChange={handleChange}
                InputLabelProps={{
                    style: { color: '#5C4E8D' },
                }}
                inputProps={{
                    style: { color: '#5C4E8D' },
                }}
                sx={{
                    width: '80%',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#5C4E8D',
                        },
                        '&:hover fieldset': {
                            borderColor: '#5C4E8D',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#5C4E8D',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#5C4E8D',
                    },
                    '& .MuiInputBase-input': {
                        color: '#5C4E8D',
                    },
                }}
                />
              <Button
                sx={{
                    marginLeft: 5,
                    marginTop: '10px',
                    height: '65px',
                    width: '120px',
                    borderRadius: '20px',
                    fontSize: '18px',
                }}
                onClick={runQuery}
                variant="contained" color='info'>
                    Run
                </Button>
            </Box>
            <Box>
                <Typography sx={{ marginTop: 2 }}>
                    Recent queries:
                </Typography>
                <List sx={{ maxHeight: '250px', overflow: 'auto' }}>
                { history.map(q => (
                    <Box>
                    <Divider/>
                    <ListItem disablePadding>
                    <ListItemButton onClick={() => {setQuery(q)}}>
                        <ListItemIcon>
                            {renderIcon(q)}                        
                        </ListItemIcon>
                      <ListItemText primary={q} />
                    </ListItemButton>
                  </ListItem>
                    </Box>
                ))}
                </List>
            </Box>
            <Dialog 
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
             maxWidth="xs" fullWidth>
          <DialogTitle>
            <Typography variant="h6" color="error">
              <ErrorIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Error
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {error}
            </Typography>
          </DialogContent>
          <DialogActions>
           <Box sx={{textAlign: 'center'}}>
            <Button onClick={() => { setErrorDialogOpen(false) }}
            sx={{
                borderRadius: '12px',
                fontSize: '17px',
                textTransform: 'none',
            }}
            color="info" variant="contained">
              Close
            </Button>
            </Box>
          </DialogActions>
        </Dialog>


            <Dialog 
                open={queryResultDialogOpen}
                onClose={() => setQueryResultDialogOpen(false)}
             maxWidth="lg" fullWidth>
          <DialogTitle>
            <Typography variant="h6" color="green">
              <DoneIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Query Result
            </Typography>
          </DialogTitle>
          <DialogContent>
      <DataGrid
       rows={rowsWithId}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        slots={{ toolbar: GridToolbar }}
      />
          </DialogContent>
          <DialogActions>
           <Box sx={{textAlign: 'center'}}>
            <Button onClick={() => { setQueryResultDialogOpen(false) }}
            sx={{
                borderRadius: '12px',
                fontSize: '17px',
                textTransform: 'none',
            }}
            color="info" variant="contained">
              Close
            </Button>
            </Box>
          </DialogActions>
        </Dialog>
        </Container>
    )
}

const SqlEditorView: React.FC<Props> = ({db}) => {
    const sqlEditorEnabled = db?.data.allowCustomQuery;
    return (
            ( sqlEditorEnabled ?
                (
                    <SqlEditor db={db}/>
                )
            :
                <InfoScreen/>
            )
    )
}

export default SqlEditorView;
