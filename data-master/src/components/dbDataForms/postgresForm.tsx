import { useState } from "react";
import {
    Grid,
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Switch,
} from "@mui/material";
import { Navigate } from "react-router-dom";

function PostgresForm() {
    const [formData, setFormData] = useState({
        connection_string: "",
        host: "",
        port: 0,
        database: "",
        user: "",
        password: "",
        allowCustomQuery: true,
    });
    const [redirect, setRedirect] = useState("");

    function handleSwitchChange(e: React.ChangeEvent<HTMLInputElement>) {
            setFormData({
                ...formData,
                allowCustomQuery: e.target.checked
            });
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function sendDbData(e: any) {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        try {
            const url = `${process.env.REACT_APP_BACKEND_URL}/postgres/add-data`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "connection_string": formData.connection_string,
                    "connection_data": {
                        "host": formData.host,
                        "port": formData.port,
                        "user": formData.user,
                        "password": formData.password,
                        "database": formData.database,
                    },
                    "allowCustomQuery": formData.allowCustomQuery,
                })
            });
            if(response.status == 200) {
                setRedirect("/dashboard");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if(redirect !== "") {
        return (<Navigate to={redirect}/>)
    }
    return (
        <Container style={{ display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <form onSubmit={sendDbData}>
                <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Box>
                                    <Typography  marginLeft='-150px' variant='h5' color='#5C4E8D'>
                                        Insert connection data:
                                    </Typography>
                                    <TextField
                                        label="Host"
                                        type="text"
                                        variant="outlined"
                                        margin="normal"
                                        name="host"
                                        value={formData.host}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        inputProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        sx={{
                                            width: '70%',
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
                                    <TextField
                                        label="Port"
                                        type="number"
                                        variant="outlined"
                                        margin="normal"
                                        name="port"
                                        value={formData.port}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        inputProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        sx={{
                                            width: '70%',
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
                                    <TextField
                                        label="User"
                                        type="text"
                                        variant="outlined"
                                        margin="normal"
                                        name="user"
                                        value={formData.user}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        inputProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        sx={{
                                            width: '70%',
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
                                    <TextField
                                        label="Password"
                                        type="password"
                                        variant="outlined"
                                        margin="normal"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        inputProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        sx={{
                                            width: '70%',
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
                                    <TextField
                                        label="Database"
                                        type="text"
                                        variant="outlined"
                                        margin="normal"
                                        name="database"
                                        value={formData.database}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        inputProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        sx={{
                                            width: '70%',
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
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box>
                                    <Typography marginLeft='-150px' variant='h5' color='#5C4E8D'>
                                        Use a connection string:
                                    </Typography>
                                    <TextField
                                        label="Connection String"
                                        type="text"
                                        variant="outlined"
                                        margin="normal"
                                        name="connection_string"
                                        value={formData.connection_string}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        inputProps={{
                                            style: { color: '#5C4E8D' },
                                        }}
                                        sx={{
                                            width: '70%',
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
                            </Box>
                            <Typography my={1} marginLeft='-150px' variant='h5' color='#5C4E8D'>
                                Additional parameters:
                            </Typography>
                            <Box>
                                <Box display='flex' alignContent='center' justifyContent='center' marginLeft='-60px'>
                                    <Typography variant="h6" color='#5C4E8D'>
                                        Allow custom queries:
                                    </Typography>
                                    <Box marginTop='-2px'>
                                        <Switch color="info" value={formData.allowCustomQuery} onChange={handleSwitchChange}/>
                                    </Box>
                                </Box>
                                <Typography variant="body2" style={{ width: '50%', marginLeft: '90px' , textAlign: 'left' }}  color="textSecondary">
                                    Enable this if you want to be able to write custom SQL queries and run them on this database
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                    <Button 
                            type="submit" 
                            variant="contained" 
                            color="info" 
                            sx={{ mt: 2, textTransform: 'none',  borderRadius: '25px', fontSize: '18px', width: '180px' }}
                        >
                            Add Database
                        </Button>
            </form>
        </Container>
    );
}

export default PostgresForm;
