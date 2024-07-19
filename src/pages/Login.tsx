import React, {ChangeEvent, useState} from 'react';
import { Button, Grid, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomLoginTextField from "../components/CustomLoginTextField";
import axios from "axios";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/members/login',
                { id: username, password : password },
                { withCredentials: true }
            );
            // const response = await axios.post('http://localhost:8080/api/members/login', { id: username, password : password }, { withCredentials: true });

            if (response.status === 200) {
                navigate('/main');  // 로그인 성공 후 메인 페이지로 리다이렉트

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
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} sx={{ backgroundColor: '#152238', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Log in to <span style={{ color: '#0026ED' }}>DeepTech</span>
                </Typography>
                <CustomLoginTextField label="User ID" value={username} onChange={handleUsernameChange} />
                <CustomLoginTextField label="Password" type="password" value={password} onChange={handlePasswordChange} />
                <MuiLink component={RouterLink} to="/password-reset" underline="hover" sx={{ mt: 1 }}>
                    Forgot your password?
                </MuiLink>
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ marginTop: 2, width : '500px',height: '50px' }}>
                    LOG IN
                </Button>
                <MuiLink component={RouterLink} to="/register" underline="hover" sx={{ mt: 2 }}>
                    Need an account? Register here
                </MuiLink>
            </Grid>
            {/* 오른쪽 배경 이미지 부분 */}
            <Grid item xs={12} sm={6} sx={{ background: 'url(login-background.png) no-repeat center center', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                {/* 내용 없음 */}
            </Grid>
        </Grid>
    );
};

export default Login;
