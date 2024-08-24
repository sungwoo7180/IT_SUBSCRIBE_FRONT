import React from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';

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
            <Typography variant="h4" gutterBottom>
                Welcome to ABCD Page
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <Typography variant="h5" gutterBottom>
                            Go to Admin Page
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleNavigation('/admin/reported-comments')}
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
                            onClick={() => handleNavigation('/admin/banned-users')}
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
