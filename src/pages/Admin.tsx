import React from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import Navbar from '../components/Navbar';

const apiUrl = process.env.REACT_APP_API_URL;

const PageContainer = styled(Box)({
    padding: '20px',
    backgroundColor: '#1f2a3c',
    minHeight: '100vh',
    color: 'white'
});

const Card = styled(Paper)({
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#2a3b4c',
    color: 'white',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
        backgroundColor: '#1f2a3c'
    }
});

const Admin: React.FC = () => {

    const handleNavigation = (url: string) => {
        window.location.href = url;
    };

    return (
        <PageContainer>
            <Navbar />
            <Typography variant="h4" gutterBottom>
                ADMIN PAGE
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <Typography variant="h5" gutterBottom>
                            View Reported Comments
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleNavigation(`${apiUrl}/api/admin/reported-comments`)}
                        >
                            Go to Admin
                        </Button>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <Typography variant="h5" gutterBottom>
                            View Banned Users
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleNavigation(`${apiUrl}/api/admin/banned-users`)}
                        >
                            View Banned Users
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default Admin;
