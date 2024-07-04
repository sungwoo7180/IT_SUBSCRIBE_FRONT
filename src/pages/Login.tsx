import React from 'react';
import { Button, Grid, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomTextField from '../components/CustomTextField';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/main');  // 로그인 성공 후 메인 페이지로 리다이렉트
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} sx={{ backgroundColor: '#152238', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Log in to <span style={{ color: '#0026ED' }}>DeepTech</span>
                </Typography>
                {/*<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}> /!* 추가된 Box 컨테이너 *!/*/}
                {/*    <TextField*/}
                {/*        label="User ID"*/}
                {/*        variant="outlined"*/}
                {/*        margin="normal"*/}
                {/*        InputLabelProps={{ style: { color: 'white', fontSize: '25px' } }}*/}
                {/*        inputProps={{ style: { color: 'white', fontSize: '20px' } }}*/}
                {/*        sx={{ "& .MuiOutlinedInput-root": { height: '55px', width: '500px' }, "& .MuiInputLabel-root": { lineHeight: 1.5 } }}*/}
                {/*    />*/}
                {/*</Box>*/}
                {/*<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>*/}
                {/*    <TextField*/}
                {/*        label="Password"*/}
                {/*        type="password"*/}
                {/*        variant="outlined"*/}
                {/*        margin="normal"*/}
                {/*        InputLabelProps={{ style: { color: 'white', fontSize: '25px' } }}*/}
                {/*        inputProps={{ style: { color: 'black', fontSize: '20px' } }}*/}
                {/*        sx={{ "& .MuiOutlinedInput-root": { height: '55px', width: '500px' }, "& .MuiInputLabel-root": { lineHeight: 1.5 } }}*/}
                {/*    />*/}
                {/*</Box>*/}
                <CustomTextField label="User ID" />
                <CustomTextField label="Password" type="password" />
                <MuiLink component={RouterLink} to="/forgot-password" underline="hover" sx={{ mt: 1 }}>
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
            <Grid item xs={12} sm={6} sx={{ background: 'url(background.png) no-repeat center center', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                {/* 내용 없음 */}
            </Grid>
        </Grid>
    );
};

export default Login;
