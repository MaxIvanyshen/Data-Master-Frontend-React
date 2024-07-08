import { Typography, Container, Button, Box, TextField, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import bg from './assets/bg.jpg'
import icon from './assets/icon.png';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';

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

function Signup() {
    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('')
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if(response.status == 400) {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
    <ThemeProvider theme={theme}>
         <Container 
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    justifyContent: { xs: 'center', md: 'flex-start' }, 
                    alignItems: 'center', 
                    width: '100%',
                    height: '100vh',
                    padding: 0
                }} 
                maxWidth={false}
            >
            <Box sx={{ backgroundColor: '#35485F', textAlign: 'center', height: '100vh', width: { 'xs': '100%', 'md': '55%', 'lg': '23%'}, marginLeft: {'md': '-25px'}}}>
                <Box sx={{ paddingTop: 6 }}>
                    <a href="/" style={{ 
                        textDecoration: 'none',
                        textTransform: 'none',
                        color: 'inherit',
                    }}>
                    <img src={icon} style={{ width: 50, height: 50, borderRadius: '12px' }} ></img>
                    </a>
                    <Typography color='white' sx={{ fontWeight: 'bold', fontSize: '35px', textAlign: 'center', marginTop: 4}} gutterBottom>
                        Sign Up
                    </Typography>
                    <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            margin="normal"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}        
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                            inputProps={{
                                style: { color: 'white' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                            }}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            margin="normal"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}        
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                            inputProps={{
                                style: { color: 'white' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                            }}
                        />
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            type="email"
                            margin="normal"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}        
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                            inputProps={{
                                style: { color: 'white' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
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
                                style: { color: 'white' },
                            }}
                            inputProps={{
                                style: { color: 'white' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                            }}
                        />
                    </Box>
                    {error && 
                            <Typography 
                            sx={{ 
                                color: 'red',
                                fontWeight: 'bold' 
                            }}
                                >
                                {error}
                            </Typography>
                    }
                    <a href="http://localhost:42069/oauth/google">
                    <Button 
                            variant="contained" 
                            color="info" 
                            startIcon={<GoogleIcon/>}
                            sx={{ mt: 2, textTransform: 'none', borderRadius: '25px', fontSize: '16px', width: '260px' }}
                        >
                            Continue with Google
                        </Button>
                        </a>
                    <Box textAlign='center'>
                        <Button 
                                type="submit" 
                                variant="contained" 
                                color="info" 
                                sx={{ mt: 2, textTransform: 'none',  borderRadius: '25px', fontSize: '16px', width: '122px' }}
                            >
                                SignUp
                            </Button>
                        <a href="/login">
                        <Button 
                                variant="outlined" 
                                sx={{ mt: 2, textTransform: 'none', borderColor: 'info', color: 'white', marginLeft: 2, borderRadius: '25px', fontSize: '16px', width: '122px' }}
                            >
                                Log In
                            </Button>
                            </a>
                    </Box>
                        </form>
                </Box>
            </Box>
            { isMediumOrLarger && (
              <Box 
                  style={{
                            width: '100%',
                            maxWidth: '100%',
                            height: '100vh',
                            marginLeft: 'auto',
                            marginRight: '-24px',
                            backgroundImage: `url(${bg})`,
                            backgroundPosition: 'bottom',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                 }} maxWidth="xl">
              </Box>
            )}  
        </Container>
    </ThemeProvider>
    );
};

export default Signup;

