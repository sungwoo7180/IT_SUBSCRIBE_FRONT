    import React from 'react';
    import { TextField, Box } from '@mui/material';

    interface CustomTextFieldProps {
        label: string;
        type?: string;
        fontSize?: string;
        inputColor?: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        name: string;
        value: string;
        error?: boolean;
        disabled?: boolean;
        fixed?: boolean; // 고정된 필드인지 여부 추가
    }

    const CustomTextField: React.FC<CustomTextFieldProps> = ({
                                                                 label,
                                                                 type = 'text',
                                                                 fontSize = '20px',
                                                                 inputColor = 'white',
                                                                 onChange,
                                                                 name,
                                                                 value,
                                                                 error = false,
                                                                 disabled = false,
                                                                 fixed = false // 기본값 false
                                                             }) => {
        return (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <TextField
                    label={label}
                    type={type}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{ style: { color: fixed ? '#152238' : 'white', fontSize: '25px' } }} // 고정된 필드면 Label 색상을 변경
                    inputProps={{ style: { color: fixed ? '#152238' : inputColor, fontSize } }} // 고정된 필드면 텍스트 색상을 변경
                    onChange={onChange}
                    name={name}
                    value={value}
                    error={error}
                    disabled={disabled}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            height: '55px',
                            width: '500px',
                            '& fieldset': {
                                borderColor: 'white !important',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white !important',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white !important',
                            },
                            '&.Mui-disabled fieldset': {
                                borderColor: fixed ? '#152238 !important' : 'white !important', // 고정된 필드면 테두리 색상을 변경
                            },
                            '& input': {
                                color: fixed ? '#152238 !important' : 'white !important', // 고정된 필드면 텍스트 색상을 변경
                                backgroundColor: fixed ? 'white !important' : 'transparent', // 고정된 필드면 배경 색상을 변경
                            },
                            '&.Mui-disabled input': {
                                color: fixed ? '#152238 !important' : 'white !important', // 고정된 필드면 텍스트 색상을 변경
                                backgroundColor: fixed ? 'white !important' : 'transparent', // 고정된 필드면 배경 색상을 변경
                            },
                            '& input:-webkit-autofill': {
                                WebkitTextFillColor: 'white !important',
                                WebkitBoxShadow: '0 0 0px 1000px #152238 inset'
                            }
                        },
                        "& .MuiInputLabel-root": {
                            lineHeight: 1.5,
                            color: fixed ? '#152238' : 'white', // 고정된 필드면 Label 색상을 변경
                        }
                    }}
                />
            </Box>
        );
    };

    export default CustomTextField;
