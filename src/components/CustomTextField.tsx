import React from 'react';
import { StyledBox, CommonTextField } from '../style/StyledComponents'; // 공통 스타일 컴포넌트 가져오기

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
    sx?: object; // 추가적인 스타일을 받을 수 있도록 설정
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
                                                             fixed = false,
                                                             sx = {} // 기본값을 빈 객체로 설정
                                                         }) => {
    return (
        <StyledBox sx={sx}> {/* 추가적인 스타일을 병합 */}
            <CommonTextField
                label={label}
                type={type}
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: fixed ? '#152238' : 'white', fontSize: '25px' } }} // 고정된 필드면 Label 색상을 변경
                inputProps={{ style: { color: fixed ? '#152238' : inputColor, fontSize, backgroundColor: 'rgba(21, 34, 56, 0.8)' } }} // 배경색 추가
                onChange={onChange}
                name={name}
                value={value}
                error={error}
                disabled={disabled}
                sx={sx} // 추가적인 스타일을 병합
            />
        </StyledBox>
    );
};

export default CustomTextField;
