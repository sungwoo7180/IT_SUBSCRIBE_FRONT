import React, { ChangeEvent, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import CustomLoginTextField from '../components/CustomLoginTextField';
import axios from 'axios';
import { AuthContainer, AuthLeftSection, AuthButton, AuthRightSection, AuthTitle } from '../style/StyledComponents';
import { Link as MuiLink, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';  // MUI의 import

const apiUrl = process.env.REACT_APP_API_URL;

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);  // 팝업 상태 관리
    const [dialogMessage, setDialogMessage] = useState<string>('');  // 팝업 메시지
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
            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                if (status === 403) {
                    // 계정 정지 상태인 경우
                    const endDate = new Date(data.banEndDate);
                    const localEndDate = endDate.toLocaleString(); // UTC를 로컬 시간으로 변환
                    setDialogMessage(data.message + ` (정지 종료일: ${localEndDate})`);
                    setOpenDialog(true);
                } else {
                    console.error('로그인 오류', error);
                }
            } else {
                console.error('로그인 오류', error);
            }
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (
        <AuthContainer container>
            <AuthLeftSection item xs={12} sm={6}>
                <AuthTitle variant="h4" as="h1" gutterBottom>
                    Log in to <span>DeepTech</span>
                </AuthTitle>
                <CustomLoginTextField label="User ID" value={username} onChange={handleUsernameChange} />
                <CustomLoginTextField label="Password" type="password" value={password} onChange={handlePasswordChange} />

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

            {/* Dialog 컴포넌트 */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle sx={{ color: 'black' }}>계정 정지</DialogTitle>
                <DialogContent sx={{ color: 'black' }}>
                    {dialogMessage}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>

        </AuthContainer>
    );
};

export default Login;
