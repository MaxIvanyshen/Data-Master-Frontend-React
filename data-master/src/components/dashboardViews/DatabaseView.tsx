import { Tabs, Tab, Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import authenticatedFetch from "../../utils/apiUtil";
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

async function parseTable(table: string,
                          db: Db | undefined, 
                          dbName: string | undefined): Promise<object> {
    let provider = 'postgres';
    if(db === Db.MySQL) {
        provider = 'mysql';
    }
    const resp = await authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/${provider}`, {
        data: JSON.stringify({
           'database': dbName,
           'table': table,
           'data': {
                'query': {}
           }
        }),  
    });
    const columns = await resp.data;
    console.log(columns);
    return columns;
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

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        const fetchData = async() => {
            const resp = await authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/postgres/tables?database=${db?.data.connection_data.database}`)
            console.log(resp);
            setTables(await resp.data);
        }
        fetchData();
    }, [db]); 

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
            { tables.map((table, idx) =>(
                <CustomTabPanel value={value} index={idx}>
                </CustomTabPanel>
            ))}
        </Container>
    )
}

export default DatabaseView;
