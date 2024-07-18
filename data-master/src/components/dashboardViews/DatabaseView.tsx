import { Tabs, Tab, Box, Container, Typography } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect } from "react";
import authenticatedFetch from "../../utils/apiUtil";
import { DatabaseEntry, Db } from '../Dashboard';
import { useState } from "react";
import { setCommentRange } from "typescript";

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

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        setCurrTable(tables[newValue]);
    };

    useEffect(() => {
        const fetchData = async() => {
            const resp = await authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/postgres/tables?database=${db?.data.connection_data.database}`)
            setTables(resp.data);
            if(!currTable) {
                setCurrTable(tables[0]);
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
            const newRows = resp.data;
            console.log(newRows);
            await fetchColumns(newRows);
            setRows(newRows);
/*
            setRows(
                [
                    {
                        "id": 1,
                        "firstname": "Max",
                        "lastname": "Ivanyshen"
                    }
                ]
            );
            */

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
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </Box>
                </CustomTabPanel>
            ))}
        </Container>
    )
}

export default DatabaseView;
