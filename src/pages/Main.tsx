// src/components/Main.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Main: React.FC = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" component="h1">
                Welcome to the Main Page
            </Typography>
            <Typography variant="body1">
                This is the main content of the application.
            </Typography>
        </Box>
    );
};

export default Main;
