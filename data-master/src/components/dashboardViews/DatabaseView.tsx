import { Typography } from "@mui/material";
import { useEffect } from "react";
import authenticatedFetch from "../../utils/apiUtil";
import { DatabaseEntry, Db } from '../Dashboard';

interface Props {
  db: DatabaseEntry | undefined;
}

const DatabaseView: React.FC<Props> = ({db}) => {
    useEffect(() => {
        const fetchData = async() => {
            const resp = await authenticatedFetch('http://localhost:42069/postgres/tables', {
                method: 'POST',
                body: JSON.stringify({
                    "database": "test_db",
                })
            })
            console.log(resp);
        }

        fetchData();
    }); 
    return (
        <Typography variant="h1">
         {db?.db}
        </Typography>
    )
}

export default DatabaseView;
