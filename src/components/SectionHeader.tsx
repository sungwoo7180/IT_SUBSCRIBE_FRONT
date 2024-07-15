import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
    title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
    return (
        <Box sx={{
            backgroundColor: '#2979ff',
            borderRadius: '0px 30px 30px 0px',
            padding: '10px 20px',
            color: 'white',
            marginBottom: '5px',
            width: {
                xs: '150px',  // 작은 화면에서는 너비를 150px로 설정
                sm: '200px',  // 중간 화면에서는 너비를 200px로 설정
                md: '450px',  // 큰 화면에서는 너비를 250px로 설정
            }}}>
            <Typography variant="h5">{title}</Typography>

        </Box>
    );
};

export default SectionHeader;
