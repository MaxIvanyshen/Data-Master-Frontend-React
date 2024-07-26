import { Tabs, Tab, Box, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import ErrorIcon from '@mui/icons-material/Error';
import { useEffect } from "react";
import { authenticatedFetch } from "../../utils/apiUtil";
import { DatabaseEntry, Db } from '../Dashboard';
import { useState } from "react";

interface Props {
  db: DatabaseEntry | undefined;
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

const DatabaseView: React.FC<Props> = ({db}) => {
    const [tables, setTables] = useState([]);
    const [value, setValue] = useState(0);
    const [currTable, setCurrTable] = useState(null);
    const [rows, setRows] = useState<object[]>([]);
    const [columns, setColumns] = useState<readonly GridColDef<object, any, any>[]>([]);

    const [error, setError] = useState("");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        setCurrTable(tables[newValue]);
    };

    const rowsWithId = rows.map((row, index) => ({ id: `row-${index}`, ...row }));

    useEffect(() => {
        const fetchData = async() => {
            let provider = 'postgres';
            if(db?.db === Db.MySQL) {
                provider = 'mysql';
            }
            if(db?.db === Db.MongoDB) {
                provider = 'mongo';
            }
            try {
                const resp = await authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/${provider}/tables?database=${db?.data.connection_data.database}`)
                setTables(resp?.data);
                if(!currTable) {
                    setCurrTable(tables[0]);
                }
            } catch(error: any) {
                setError("Error while connecting to database");
                setErrorDialogOpen(true);
            }
        }
        fetchData();

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
        const fetchTable = async() => {
            if (!currTable) {
                return 
            }
            let provider = 'postgres';
            if(db?.db === Db.MySQL) {
                provider = 'mysql';
            }
            if(db?.db === Db.MongoDB) {
                provider = 'mongo';
            }
            try {
                const dbName = db?.data.connection_data.database;
                const resp = await authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/${provider}/select`, {
                    method: 'POST',
                    data: {
                        "database": dbName,
                        "table": currTable,
                        "data": {
                            "query": {

                            }
                        },
                    }
                });
                const newRows = resp?.data;
                await fetchColumns(newRows);
                setRows(newRows);
            } catch(error: any) {
                setError("Error while fetching table");
                setErrorDialogOpen(true);
            }
        }
        fetchTable();

    }, [db, currTable]); 

    return (
        <Container style={{ width: '1100px', marginLeft: '-45px'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                { tables.map(table =>(
                    <Tab sx={{
                        color: '#5C4E8D',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }} label={table} />
                ))}
            </Tabs>
            </Box>
            { tables.map((table, idx) => (
                <CustomTabPanel value={value} index={idx}>
                <Box sx={{ height: 400, width: '100%' }}>
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
    </Box>
                </CustomTabPanel>
            ))}

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
        </Container>
    )
}

export default DatabaseView;
