import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ReportModal: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6">Report Comment</Typography>
                <TextField
                    label="Reason for Report"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: '1rem' }}
                />
                <Button variant="contained" color="secondary" sx={{ marginTop: '1rem' }} onClick={onClose}>
                    Submit Report
                </Button>
            </Box>
        </Modal>
    );
};

export default ReportModal;
