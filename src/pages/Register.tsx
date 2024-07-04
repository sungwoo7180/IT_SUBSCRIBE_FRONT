import React, { useState } from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../components/CustomTextField';  // 이미 만든 CustomTextField 컴포넌트 임포트

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);

    const handleSendEmail = () => {
        // 이메일에 영문과 숫자가 섞인 6자리 난수를 보내줌

        setEmailSent(true);
    };

    const handleVerifyCode = () => {
        // 코드 검증 로직 구현 필요
        //
        // navigate('/main');  // 코드 검증 성공 후 메인 페이지로 리다이렉트
    };

    const handleLogin = () => {
        // DB 로 데이터 보내서 저장해주는 로직 필요
        navigate('/main');  // 로그인 성공 후 메인 페이지로 리다이렉트
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} sx={{
                backgroundColor: '#152238', overflow : 'auto',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Join the DeepTech!
                </Typography>
                <CustomTextField label="User ID" />
                <CustomTextField label="Email" />
                <Button variant="contained" color="primary" fullWidth onClick={handleSendEmail} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                    SEND EMAIL
                </Button>
                {emailSent && (
                    <>
                        <CustomTextField label="Code" />
                        <Button variant="contained" color="primary" fullWidth onClick={handleVerifyCode} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                            VERIFY CODE
                        </Button>
                        <CustomTextField label="Password" type="password" />
                        <CustomTextField label="Confirm Password" type="password" />
                        <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                            REGISTER
                        </Button>
                    </>
                )}
            </Grid>
            <Grid item xs={12} sm={6} sx={{ background: 'url(background.png) no-repeat center center', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                {/* 내용 없음 */}
            </Grid>
        </Grid>
    );
};

export default Register;