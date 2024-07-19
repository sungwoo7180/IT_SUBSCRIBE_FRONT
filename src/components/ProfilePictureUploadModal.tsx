import React, { useState } from 'react';
import { Box, Button, Modal, Typography, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface ProfilePictureUploadModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (file: File) => void;
}

const ProfilePictureUploadModal: React.FC<ProfilePictureUploadModalProps> = ({ open, onClose, onSave }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
    };

    const handleSave = () => {
        if (selectedFile) {
            onSave(selectedFile);
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Upload New Profile Picture
                </Typography>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" startIcon={<PhotoCamera />} sx={{ mt: 2, mb: 2 }}>
                        Choose Image
                    </Button>
                </label>
                {selectedFile && <Typography>{selectedFile.name}</Typography>}
                <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default ProfilePictureUploadModal;