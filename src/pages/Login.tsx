import React from 'react';
import {Button, Grid, Typography, Link as MuiLink, useMediaQuery, Theme} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomLoginTextField from "../components/CustomLoginTextField";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/main');  // 로그인 성공 후 메인 페이지로 리다이렉트
    };

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} sx={{ backgroundColor: '#152238', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Log in to <span style={{ color: '#0026ED' }}>DeepTech</span>
                </Typography>
                <CustomLoginTextField label="User ID" />
                <CustomLoginTextField label="Password" type="password" />
                <MuiLink component={RouterLink} to="/password-reset" underline="hover" sx={{ mt: 1 }}>
                    Forgot your password?
                </MuiLink>
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ marginTop: 2, maxWidth: '500px', height: '50px' }}>
                    LOG IN
                </Button>
                <MuiLink component={RouterLink} to="/register" underline="hover" sx={{ mt: 2 }}>
                    Need an account? Register here
                </MuiLink>
            </Grid>
            <Grid item xs={12} sm={6} sx={{
                background: 'url(login-back.jpeg) no-repeat center center',
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
                order: isSmallScreen ? -1 : 0,
            }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{
                    textAlign: 'center',
                    color: 'rgba(0, 0, 139, 1.0)', /* Dark Blue */
                    'text-shadow':
                        '2px 2px 2px rgba(144, 144, 238, 0.8),' + /* Light Blue */
                        '4px 4px 10px rgba(144, 144, 238, 0.6)'
                }}>
                    Here we can provide
                </Typography>
                <Typography variant="h6" component="p" sx={{
                    textAlign: 'center',
                    color: 'rgba(0, 0, 100, 1.0)', /* Dark Blur */
                    'text-shadow':
                        '2px 2px 2px rgba(144, 144, 238, 0.8),' + /* Light Blue */
                        '4px 4px 10px rgba(144, 144, 238, 0.6)'
                }}>
                    ● Various sort of it news<br />
                    ● Saving Articles<br />
                    ● get email of your favorite domain
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Login;
