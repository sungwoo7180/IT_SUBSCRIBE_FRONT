// src/components/SignUp.tsx
import React from 'react';
import { Button, Typography, Link, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../components/CustomTextField';  // 이미 만든 CustomTextField 컴포넌트 임포트

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const handleSignUp = () => {
        // 회원 가입 로직 구현 부분
        navigate('/main');  // 회원가입 성공 후 메인 페이지로 리다이렉트
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} sx={{ backgroundColor: '#152238', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up to DeepTech
                </Typography>
                <CustomTextField label="User ID" />
                <CustomTextField label="New Password" type="password" inputColor="black" />
                <CustomTextField label="Confirm Password" type="password" inputColor="black" />
                <Button variant="contained" color="primary" fullWidth onClick={handleSignUp} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                    SIGN UP
                </Button>
                <Link href="#" underline="hover" sx={{ mt: 2 }}>
                    Already have an account? Log in
                </Link>
            </Grid>
            {/* 오른쪽 배경 이미지 부분 (여기에는 실제 내용이 추가될 수 있음) */}
            <Grid item xs={12} sm={6} sx={{ background: 'url(background.png) no-repeat center center', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                {/* 내용을 추가할 수 있습니다 */}
            </Grid>
        </Grid>
    );
};

export default SignUp;
