import React from 'react';
import { TextField, Box } from '@mui/material';

interface CustomTextFieldProps {
    label: string;
    type?: string;
    fontSize?: string;
    inputColor?: string;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ label, type = 'text',
                                                             fontSize = '20px', inputColor = 'white'
                                                         }) => {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <TextField
                label={label}
                type={type}
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: 'white', fontSize: '25px' } }}
                inputProps={{ style: { color: inputColor, fontSize } }}
                sx={{ "& .MuiOutlinedInput-root": { height: '55px', width: '500px' }, "& .MuiInputLabel-root": { lineHeight: 1.5 } }}
            />
        </Box>
    );
};

export default CustomTextField;