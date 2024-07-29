import { Box, Container, createTheme, ThemeProvider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../utils/apiUtil";
import { Db } from "./Dashboard";
import MongoForm from "./dbDataForms/mongoForm";
import MysqlForm from "./dbDataForms/mysqlForm";
import PostgresForm from "./dbDataForms/postgresForm";
import Header from "./Header";
import bg from './assets/bg.jpg';

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

function EditDatabase() {
    const navigate = useNavigate();
    const dbDataStr = localStorage.getItem('editingDb');
    if(!dbDataStr) {
        navigate("/");
    }
    const db = JSON.parse(dbDataStr as string);

    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchUrl = `${process.env.REACT_APP_BACKEND_URL}/user`
                const response = await authenticatedFetch(fetchUrl)

                if (response?.status == 401) {
                    navigate("/login");
                    return
                }
                else if (response?.status != 200) {
                    throw new Error('Network response was not ok');
                }

                const resp = await response.data;
                setData(resp);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const renderForm = () => {
        const formData = {
            ...db?.data.connection_data,
            connection_string: db?.data.connection_string,
            allowCustomQuery: db?.data.allowCustomQuery,
        }
        switch(db?.db) {
            case Db.PostgreSQL: 
                return ( <PostgresForm form={formData} edit={true}/> );
            case Db.MySQL: 
                return ( <MysqlForm form={formData} edit={true}/>);
            case Db.MongoDB: 
                return ( <MongoForm form={formData} edit={true}/> );
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Header user={data}/>
      <Container 
      sx={{
                height: {'xs': '100vh', 'md': '91.9vh'},
      }}
      style={{
                width: '100%',
                maxWidth: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundImage: `url(${bg})`,
                backgroundPosition: 'bottom',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                textAlign: 'center',
     }} maxWidth="xl">
              <Typography color='#35485F' sx={{ paddingTop: 5, fontWeight: 'bold', fontSize: {'xs': '35px', 'sm': '50px', 'md': '65px'}}} gutterBottom>
                    {db?.data.connection_data.database}
              </Typography>
              <Container
                sx={{
                    backgroundColor: '#FEF7FF',
                    width: '100%',
                    borderRadius: '25px',
                    textAlign: 'center',
                }}
              >
            <Box sx={{ padding: 5, borderBottom: 1, borderColor: 'divider' }}>
                {renderForm()}
            </Box>
              </Container>
          </Container>
        </ThemeProvider>
    );
}

export default EditDatabase;
