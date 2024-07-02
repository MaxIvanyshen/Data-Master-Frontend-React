import React from 'react';
import { Container, Grid, Typography, Divider, Box, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#35485F', color: '#ffffff', padding: '40px 0' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              About us
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }} fontSize={16}>
              We are dedicated to providing a powerful and intuitive environment for database professionals and developers.
              Our service simplifies SQL query editing, database management, and data visualization, empowering users to
              streamline their database workflows.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5} marginLeft={{ 'lg': 12 }} >
            <Typography variant="h5" gutterBottom>
              Contact us
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }} fontSize={16}>
              Email: support@datamaster.com
              <br />
              Phone Number: +380980161463
              <br />
              Location: Vinnytsia, Ukraine
            </Typography>
            <Box sx={{ display: 'flex', marginTop: 2 }}>
              <IconButton href="#" sx={{ color: '#ffffff' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: '#ffffff' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: '#ffffff' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: '#ffffff' }}>
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', margin: '20px 0' }} />
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          © 2024 Data Master. All rights reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
