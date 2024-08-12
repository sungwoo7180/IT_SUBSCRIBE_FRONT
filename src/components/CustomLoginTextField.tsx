// src/components/CustomLoginTextField.tsx
import React from 'react';
import { StyledBox, CommonTextField } from '../style/StyledComponents'; // 공통 스타일 컴포넌트 가져오기

interface CustomLoginTextFieldProps {
    label: string;
    type?: string;
    fontSize?: string;
    inputColor?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomLoginTextField: React.FC<CustomLoginTextFieldProps> = ({
                                                                       label,
                                                                       type = 'text',
                                                                       fontSize = '20px',
                                                                       inputColor = 'white',
                                                                       value,
                                                                       onChange
                                                                   }) => {
    return (
        <StyledBox>
            <CommonTextField
                label={label}
                type={type}
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: 'white', fontSize: '25px' } }}
                inputProps={{ style: { color: inputColor, fontSize } }}
                value={value}
                onChange={onChange}
            />
        </StyledBox>
    );
};

export default CustomLoginTextField;
