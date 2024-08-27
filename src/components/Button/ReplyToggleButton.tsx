import React from 'react';
import { Button } from '@mui/material';

interface ReplyToggleButtonProps {
    isReplying: boolean;
    onClick: () => void;
}

const ReplyToggleButton: React.FC<ReplyToggleButtonProps> = ({ isReplying, onClick }) => {
    return (
        <Button
            onClick={onClick}
            variant="text"
            sx={{
                textTransform: 'none',
                borderRadius: '20px',
                padding: '0.3rem 1rem',
                backgroundColor: isReplying ? '#f5f5f5' : 'transparent',
                color: isReplying ? '#00796b' : '#1976d2',
                '&:hover': {
                    backgroundColor: isReplying ? '#e0f7fa' : '#e3f2fd',
                },
            }}
        >
            {isReplying ? '답글 취소' : '답글 달기'}
        </Button>
    );
};

export default ReplyToggleButton;
