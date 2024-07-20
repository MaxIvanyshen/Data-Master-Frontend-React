import { useState, useRef, useEffect} from "react";
import { DatabaseEntry } from "../Dashboard";
import { Container, TextField, Button, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import { Box } from "@mui/system";
import { Db } from "../Dashboard";
import authenticatedFetch from "../../utils/apiUtil";

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
            setTables(resp.data);
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

        const resp = await authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/${provider}/custom`, {
            method: 'POST',
            data: {
                'database': db?.data.connection_data.database,
                'data': {
                    'query': query
                }
            }
        });

        const newHistory = [...history, query];
        setHistory(newHistory); 
        saveHistoryToLocalStorage(newHistory);
    }

    return (
        <Container sx={{ width: '100%'}}>
            <Box sx={{ marginBottom: 2, textAlign: 'left'}}>
                <Typography sx={{ marginBottom: 1 }}>
                    Templates
                </Typography>
                <Button
                sx={{
                    marginLeft: 5,
                    marginTop: '10px',
                    height: '65px',
                    width: '120px',
                    borderRadius: '20px',
                    fontSize: '18px',
                }}
                onClick={insertTemplate}
                variant="contained" color='info'>
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
                }}
                onClick={
                    selectTemplate
                }
                variant="contained" color='info'>
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
                }}
                onClick={updateTemplate}
                variant="contained" color='info'>
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
                }}
                onClick={deleteTemplate}
                variant="contained" color='info'>
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
                <List>
                { history.map(q => (
                    <ListItem disablePadding>
                    <ListItemButton onClick={() => {setQuery(q)}}>
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary={q} />
                    </ListItemButton>
                  </ListItem>
                ))}
                </List>
            </Box>
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
