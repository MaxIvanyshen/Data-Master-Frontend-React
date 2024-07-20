import { useState } from "react";
import {
    Grid,
    Box,
    Container,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import { Navigate } from "react-router-dom";

function MongoForm() {
    const [formData, setFormData] = useState({
        connection_string: "",
        host: "",
        port: 0,
        database: "",
        user: "",
        password: "",
    });
    const [redirect, setRedirect] = useState("");

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
            const url = `${process.env.REACT_APP_BACKEND_URL}/mongo/add-data`;
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

export default MongoForm;

