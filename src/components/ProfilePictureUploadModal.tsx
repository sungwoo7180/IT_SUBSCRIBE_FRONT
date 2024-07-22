import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Button, Modal, Typography, IconButton } from '@mui/material';
import { PhotoCamera, Close, CloudUpload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ProfilePictureUploadModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (file: File) => void;
}

interface CustomCrop extends Crop {
    aspect?: number;
}

const ProfilePictureUploadModal: React.FC<ProfilePictureUploadModalProps> = ({ open, onClose, onSave }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [crop, setCrop] = useState<CustomCrop>({ unit: '%', width: 50, aspect: 1 / 1, x: 0, y: 0, height: 50 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        noClick: selectedFile !== null
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSave = () => {
        if (selectedFile && completedCrop && preview && imgRef.current) {
            getCroppedImg(imgRef.current, completedCrop, selectedFile.name);
        }
        onClose();
    };

    const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop, fileName: string) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );
        }

        canvas.toBlob(blob => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            const croppedFile = new File([blob], fileName, { type: blob.type });
            onSave(croppedFile);
            const previewUrl = window.URL.createObjectURL(blob);
            setCroppedImage(previewUrl);
        }, 'image/jpeg');
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
        setCroppedImage(null);
    };

    useEffect(() => {
        if (selectedFile) {
            setCrop({ unit: '%', width: 50, aspect: 1 / 1, x: 0, y: 0, height: 50 });
        }
    }, [selectedFile]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: '#f0f0f0',
                color: 'black',
                p: 4,
                borderRadius: 2,
                boxShadow: 24,
                textAlign: 'center'
            }}>
                <Box sx={{
                    bgcolor: '#32CD32',
                    color: 'white',
                    p: 2,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                }}>
                    <Typography variant="h6">
                        Upload New Profile Picture
                    </Typography>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, fontSize: 20 }}>
                        <Close sx={{ color: 'white', fontSize: 30 }} />
                    </IconButton>
                </Box>
                <Box {...getRootProps()} sx={{ border: '2px dashed #cccccc', padding: '20px', borderRadius: '10px', cursor: 'pointer', bgcolor: '#ffffff', mt: 2, width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <input {...getInputProps()} />
                    {preview ? (
                        <Box sx={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%', overflow: 'hidden' }}>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, newCrop) => setCrop(newCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <img ref={imgRef} src={preview} alt="Preview" style={{ width: '100%', height: 'auto', borderRadius: '10px', objectFit: 'contain' }} />
                            </ReactCrop>
                            <IconButton onClick={handleClear} sx={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0, 0, 0, 0.5)', fontSize: 20 }}>
                                <Close sx={{ color: 'white', fontSize: 30 }} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Typography sx={{ color: 'black' }}>Drag 'n' drop an image here, or click to select an image</Typography>
                    )}
                </Box>
                {selectedFile && (
                    <Typography sx={{ mt: 2 }}>
                        {selectedFile.name}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: '100%' }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file" style={{ width: '100%' }}>
                        <Button variant="contained" component="span" startIcon={<PhotoCamera />} sx={{ mt: 1 , mb: 2, bgcolor: '#1976d2', width: '100%' }}>
                            Choose Image
                        </Button>
                    </label>
                    <Button onClick={handleSave} variant="contained" color="primary" startIcon={<CloudUpload />} sx={{ mt: 0, mb: 2, bgcolor: '#1976d2', width: '100%' }}>
                        Upload
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ProfilePictureUploadModal;
