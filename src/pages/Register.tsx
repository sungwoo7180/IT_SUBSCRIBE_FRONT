import React, { useState } from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';
import CustomTextField from '../components/CustomTextField';
import { isEmpty, isValidEmail, isPasswordMatch, validatePassword } from '../utils/validation';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // API 요청에 사용될 axios

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userDetails, setUserDetails] = useState({
        userId: '',
        email: '',
        code: '',
        password: '',
        confirmPassword: '',
        nickname: '' // nickname 필드 추가
    });
    const [errors, setErrors] = useState({
        userId: false,
        email: false,
        emailFormat: false, // 이메일 형식 오류 필드 추가
        code: false,
        password: false,
        confirmPassword: false,
        nickname: false // nickname 필드에 대한 오류 추가
    });
    const [passwordErrors, setPasswordErrors] = useState({
        length: true,
        hasNumberAndLetter: true,
        passwordsMatch: true
    });

    const handleSendEmail = () => {
        const { userId, email, nickname } = userDetails;
        if (isEmpty(userId)) {
            setErrors(prev => ({ ...prev, userId: true }));
            return;
        }
        if (isEmpty(email)) {
            setErrors(prev => ({ ...prev, email: true, emailFormat: false }));
            return;
        }
        if (!isValidEmail(email)) {
            setErrors(prev => ({ ...prev, email: false, emailFormat: true }));
            return;
        }
        if (isEmpty(nickname)) {
            setErrors(prev => ({ ...prev, nickname: true }));
            return;
        }

        // (1) 중복 확인 및 이메일 발송 API 요청
        axios.post('http://localhost:8080/api/members/check-duplicate', { username: userId, email: email, nickname: nickname })
            .then(response => {
                const { username, email: emailResponse, nickname: nicknameResponse } = response.data;
                if (username === "사용할 수 있는 아이디입니다." &&
                    emailResponse === "사용할 수 있는 이메일입니다." &&
                    nicknameResponse === "사용할 수 있는 닉네임입니다.") {
                    // 중복되지 않은 경우 코드 전송 후 단계 이동
                    setStep(2);
                    setErrors(prev => ({ ...prev, userId: false, email: false, emailFormat: false, nickname: false }));
                    axios.post('http://localhost:8080/api/members/send-code', { email: userDetails.email }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            console.log("Email sent successfully.");
                        })
                        .catch(error => {
                            console.error("There was an error sending the email!", error);
                        });
                } else {
                    // 중복된 필드가 있을 경우 처리
                    setErrors(prev => ({
                        ...prev,
                        userId: username !== "사용할 수 있는 아이디입니다.",
                        email: emailResponse !== "사용할 수 있는 이메일입니다.",
                        nickname: nicknameResponse !== "사용할 수 있는 닉네임입니다."
                    }));
                }
            })
            .catch(error => {
                console.error("There was an error checking the user details!", error);
            });
    };

    const handleVerifyCode = () => {
        const { email, code } = userDetails;
        if (isEmpty(userDetails.code)) {
            setErrors(prev => ({ ...prev, code: true }));
            return;
        }

        // (2) 인증 코드 확인 API 요청
        axios.post('http://localhost:8080/api/members/verify-code', { email: email, code: code }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.data.message === "인증이 완료되었습니다.") {
                    setStep(3);
                    setErrors(prev => ({ ...prev, code: false }));
                } else {
                    setErrors(prev => ({ ...prev, code: true }));
                }
            })
            .catch(error => {
                console.error("There was an error verifying the code!", error);
            });
    };

    const handleRegister = () => {
        const { userId, password, confirmPassword, nickname, email } = userDetails;
        const validationResults = validatePassword(password, confirmPassword);
        if (isEmpty(userId) || isEmpty(password) || isEmpty(confirmPassword) || isEmpty(nickname) ||
            !validationResults.length || !validationResults.hasNumberAndLetter || !validationResults.passwordsMatch) {
            setErrors(prev => ({
                ...prev,
                userId: isEmpty(userId),
                password: isEmpty(password),
                confirmPassword: !isPasswordMatch(password, confirmPassword),
                nickname: isEmpty(nickname)
            }));
            setPasswordErrors(validationResults);
            return;
        }

        // (3) 회원 가입 API 요청
        axios.post('http://localhost:8080/api/members/register', {
            username: userId,
            nickname: nickname,
            email: email,
            password: password,
            password2: confirmPassword
        })
            .then(response => {
                navigate('/');
            })
            .catch(error => {
                console.error("There was an error registering the user!", error);
            });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails(prev => {
            const updatedDetails = { ...prev, [name]: value };
            if (name === 'password' || name === 'confirmPassword') {
                const validationResults = validatePassword(updatedDetails.password, updatedDetails.confirmPassword);
                setPasswordErrors(validationResults);
            }
            return updatedDetails;
        });
        setErrors(prev => ({ ...prev, [name]: false, emailFormat: name === 'email' ? false : prev.emailFormat }));
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} sx={{
                backgroundColor: '#152238', overflow: 'auto',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: 3
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Join the DeepTech!
                </Typography>
                <CustomTextField label="User ID" onChange={handleChange} name="userId" value={userDetails.userId} error={errors.userId} disabled={step > 1} />
                <CustomTextField label="Email" onChange={handleChange} name="email" value={userDetails.email} error={errors.email || errors.emailFormat} disabled={step > 1} />
                <CustomTextField label="Nickname" onChange={handleChange} name="nickname" value={userDetails.nickname} error={errors.nickname} disabled={step > 1} />
                {errors.userId && <Typography color="error">User ID is required or already taken</Typography>}
                {errors.email && <Typography color="error">Email is required or already taken</Typography>}
                {errors.emailFormat && <Typography color="error">Invalid email format</Typography>}
                {errors.nickname && <Typography color="error">Nickname is required or already taken</Typography>}
                <Button variant="contained" color="primary" fullWidth onClick={handleSendEmail} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                    SEND EMAIL
                </Button>
                {step >= 2 && (
                    <>
                        <CustomTextField label="Code" onChange={handleChange} name="code" value={userDetails.code} error={errors.code} />
                        <Button variant="contained" color="primary" fullWidth onClick={handleVerifyCode} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                            VERIFY CODE
                        </Button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <CustomTextField label="Password" type="password" onChange={handleChange} name="password" value={userDetails.password} error={errors.password} />
                        <CustomTextField label="Confirm Password" type="password" onChange={handleChange} name="confirmPassword" value={userDetails.confirmPassword} error={errors.confirmPassword} />
                        {(!passwordErrors.length || !passwordErrors.hasNumberAndLetter || !passwordErrors.passwordsMatch) && (
                            <Box sx={{ mt: 2, background: '#e0e0e0', borderRadius: '5px', p: 2, color: '#333' }}>
                                <Typography>Password must be:</Typography>
                                <Typography>{passwordErrors.length ? '✔ 8 characters minimum' : '✖ 8 characters minimum'}</Typography>
                                <Typography>{passwordErrors.hasNumberAndLetter ? '✔ At least one number & one letter' : '✖ At least one number & one letter'}</Typography>
                                <Typography>{passwordErrors.passwordsMatch ? '✔ Passwords match' : '✖ Passwords do not match'}</Typography>
                            </Box>
                        )}
                        <Button variant="contained" color="primary" fullWidth onClick={handleRegister} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                            REGISTER
                        </Button>
                    </>
                )}
            </Grid>
            <Grid item xs={12} sm={6} sx={{ background: 'url(login-background.png) no-repeat center center', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                {/* 내용 없음 */}
            </Grid>
        </Grid>
    );
};

export default Register;
