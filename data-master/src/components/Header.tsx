import { AppBar, Toolbar, Button, Typography, Container, Box, Grid, Card, CardContent, CardActions, Divider } from '@mui/material';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import { Menu, MenuItem, ListItemIcon  } from '@mui/material';
import icon from './assets/icon.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import SupportIcon from '@mui/icons-material/Support';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import authenticatedFetch from '../utils/apiUtil';

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


function Header(user?: any) {
    const savedUser = localStorage.getItem('user');
    if(savedUser) {
        user = savedUser;
    } else {
        user = user.user;
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const logout = () => {
        authenticatedFetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
            method: 'POST',
        })
        localStorage.removeItem('accessToken');
        navigate("/");
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
      <AppBar 
        style={{
            boxShadow: 'none',
        }}

      position="static">
        <Toolbar style={{height: 75}}>
            <a href="/" style={{ 
                textDecoration: 'none',
                textTransform: 'none',
                color: 'inherit',
            }}>
            <img src={icon} style={{ width: 50, height: 50, borderRadius: '12px' }} ></img>
            </a>
          <Typography variant="h6" fontWeight="bold" sx={{ ml: 2, flexGrow: 1 }}>
            Data Master
          </Typography>
          { user && 
              <Button 
                  variant="contained"
                  sx={
                  { 
                      ml: 2,
                      borderRadius: '100px',
                      boxShadow: 'none',
                      fontWeight: 'bold',
                      fontSize: '17px',
                      width: '120px',
                      height: '40px',
                      textTransform: 'none',
                  }} 
                  onClick={handleClick}
                  color="info">
                <Box display="flex" alignItems="center">
                  <Typography style={{ fontSize: '17px', fontWeight: 'bold'}}>{ user.firstname }</Typography>
                  <ExpandMoreIcon
                    style={{
                      transition: 'transform 0.3s',
                      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </Box>
              </Button>
          }
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          User profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          Documentation
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SupportIcon fontSize="small" />
          </ListItemIcon>
          Support
        </MenuItem>
        <Divider/>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
        </Toolbar>
        
      </AppBar>
    );
}

export default Header;
