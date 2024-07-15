import React from 'react';
import { TextField, Box } from '@mui/material';

interface CustomLoginTextFieldProps {
    label: string;
    type?: string;
    fontSize?: string;
    inputColor?: string;
}

const CustomLoginTextField: React.FC<CustomLoginTextFieldProps> = (
    {label,type = 'text', fontSize = '20px', inputColor = 'white'}
) => {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <TextField
                label={label}
                type={type}
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: 'white', fontSize: '25px' } }}
                inputProps={{ style: { color: inputColor, fontSize } }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        width: '100%',
                        maxWidth: '500px',  // 최대 너비를 500px로 제한
                        '& fieldset': {
                            borderColor: 'white',  // 테두리 색상
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',  // 호버 시 테두리 색상
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',  // 포커스 시 테두리 색상
                        },
                        '& input': {
                            color: 'white',  // 입력 필드 텍스트 색상
                        },
                        '& input:-webkit-autofill': {
                            WebkitTextFillColor: 'white', // 자동 완성 텍스트 색상
                            WebkitBoxShadow: '0 0 0px 1000px #152238 inset'  // 자동 완성 배경 색상 변경
                        }
                    },
                    "& .MuiInputLabel-root": {
                        lineHeight: 1.5,
                        color: 'white',  // 레이블 색상
                    }
                }}
            />
        </Box>
    );
};

export default CustomLoginTextField;
