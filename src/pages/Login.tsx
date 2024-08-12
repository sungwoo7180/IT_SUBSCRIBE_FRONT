import React, { ChangeEvent, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import CustomLoginTextField from '../components/CustomLoginTextField';
import axios from 'axios';
import { AuthContainer, AuthLeftSection, AuthButton, AuthRightSection, AuthTitle } from '../style/StyledComponents';
import { Link as MuiLink } from '@mui/material';  // MUI의 Link를 import

const apiUrl = process.env.REACT_APP_API_URL;

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}/api/members/login`,
                { id: username, password },
                { withCredentials: true }
            );
            // const response = await axios.post('http://localhost:8080/api/members/login', { id: username, password : password }, { withCredentials: true });

            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data)); // 로컬 스토리지에 사용자 정보 저장
                navigate('/main'); // 로그인 성공 후 메인 페이지로 리다이렉트
            }
        } catch (error) {
            console.error('로그인 오류', error);
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <AuthContainer container>
            <AuthLeftSection item xs={12} sm={6}>
                <AuthTitle variant="h4" as="h1" gutterBottom>
                    Log in to <span>DeepTech</span>
                </AuthTitle>
                <CustomLoginTextField label="User ID" value={username} onChange={handleUsernameChange} />
                <CustomLoginTextField label="Password" type="password" value={password} onChange={handlePasswordChange} />

                {/* MUI Link 컴포넌트를 사용하여 RouterLink로 연결 */}
                <MuiLink component={RouterLink} to="/password-reset" underline="hover">
                    Forgot your password?
                </MuiLink>

                <AuthButton variant="contained" color="primary" fullWidth onClick={handleLogin}>
                    LOG IN
                </AuthButton>

                <MuiLink component={RouterLink} to="/register" underline="hover">
                    Need an account? Register here
                </MuiLink>
            </AuthLeftSection>
            <AuthRightSection item xs={12} sm={6} />
        </AuthContainer>
    );
};

export default Login;
