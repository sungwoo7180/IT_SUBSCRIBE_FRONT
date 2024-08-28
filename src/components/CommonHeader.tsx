import React from 'react';
import { Typography, Box } from '@mui/material';

interface CommonHeaderProps {
    title: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({ title }) => {
    return (
        <Box sx={{ paddingBottom: 2 }}>
            <Typography variant="h5" gutterBottom color="white" align="center">
                {title}
            </Typography>
        </Box>
    );
};

export default CommonHeader;
