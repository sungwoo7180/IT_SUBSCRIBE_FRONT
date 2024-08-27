import React from 'react';
import { Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface ToggleButtonProps {
    isOpen: boolean;
    onClick: () => void;
    label: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, onClick, label }) => {
    return (
        <Button
            onClick={onClick}
            variant="text"
            sx={{
                textTransform: 'none',
                borderRadius: '20px',
                padding: '0.3rem 1rem',
                backgroundColor: isOpen ? '#f5f5f5' : 'transparent',
                color: isOpen ? '#00796b' : '#1976d2',
                '&:hover': {
                    backgroundColor: isOpen ? '#e0f7fa' : '#e3f2fd',
                },
            }}
        >
            {isOpen ? <ExpandLessIcon sx={{ verticalAlign: 'middle', marginRight: '4px' }} /> : <ExpandMoreIcon sx={{ verticalAlign: 'middle', marginRight: '4px' }} />}
            {label}
        </Button>
    );
};

export default ToggleButton;
