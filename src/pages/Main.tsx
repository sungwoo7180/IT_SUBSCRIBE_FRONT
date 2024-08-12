import React from 'react';
import { Box, Grid } from '@mui/material';
import RecommendArticles from '../components/RecommendArticles';
import RecentArticles from '../components/RecentArticles';
import MostHotArticles from '../components/MostHotArticles';

const Main: React.FC = () => {
    return (
        <>
            <Box sx={{
                padding: 3,
                backgroundImage: 'url(Background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh'
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} sx={{ height: 650 }}>
                        <RecommendArticles />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RecentArticles />
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <MostHotArticles />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Main;
