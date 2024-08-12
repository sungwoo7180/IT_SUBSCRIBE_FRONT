// import React, { useState } from 'react';
// import { Button, Typography, Grid, Box } from '@mui/material';
// import CustomTextField from '../components/CustomTextField';
// import { isEmpty, isValidEmail, isPasswordMatch, validatePassword } from '../utils/validation';
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
//
// const ForgotPassword: React.FC = () => {
//     const navigate = useNavigate();
//     const [step, setStep] = useState(1);
//     const [userDetails, setUserDetails] = useState({
//         userId: 'wild-mantle', // 초기 더미 데이터 설정
//         email: '',
//         code: '',
//         password: '',
//         confirmPassword: ''
//     });
//     const [errors, setErrors] = useState({
//         userId: false,
//         email: false,
//         code: false,
//         password: false,
//         confirmPassword: false
//     });
//     const [passwordErrors, setPasswordErrors] = useState({
//         length: true,
//         hasNumberAndLetter: true,
//         passwordsMatch: true
//     });
//
//     const handleSendEmail = () => {
//         if (isEmpty(userDetails.email) || !isValidEmail(userDetails.email)) {
//             setErrors(prev => ({ ...prev, email: true }));
//             return;
//         }
//         axios.post('http://localhost:8080/api/members/send-code', { email: userDetails.email }, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//             .then(response => {
//                 setStep(2);
//                 setErrors(prev => ({ ...prev, email: false }));
//             })
//             .catch(error => {
//                 console.error("There was an error sending the email!", error);
//             });
//     };
//
//     const handleVerifyCode = () => {
//         if (isEmpty(userDetails.code)) {
//             setErrors(prev => ({ ...prev, code: true }));
//             return;
//         }
//         setStep(3);
//         setErrors(prev => ({ ...prev, code: false }));
//     };
//
//     const handleSetPassword = () => {
//         const { userId, password, confirmPassword } = userDetails;
//         const validationResults = validatePassword(password, confirmPassword);
//         if (isEmpty(userId) || isEmpty(password) || isEmpty(confirmPassword) ||
//             !validationResults.length || !validationResults.hasNumberAndLetter || !validationResults.passwordsMatch) {
//             setErrors(prev => ({
//                 ...prev,
//                 userId: isEmpty(userId),
//                 password: isEmpty(password),
//                 confirmPassword: !isPasswordMatch(password, confirmPassword)
//             }));
//             setPasswordErrors(validationResults);
//             return;
//         }
//         navigate('/');
//     };
//
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setUserDetails(prev => {
//             const updatedDetails = { ...prev, [name]: value };
//             if (name === 'password' || name === 'confirmPassword') {
//                 const validationResults = validatePassword(updatedDetails.password, updatedDetails.confirmPassword);
//                 setPasswordErrors(validationResults);
//             }
//             return updatedDetails;
//         });
//         setErrors(prev => ({ ...prev, [name]: false }));
//     };
//
//     return (
//         <Grid container sx={{ height: '100vh' }}>
//             <Grid item xs={12} sm={6} sx={{
//                 backgroundColor: '#152238', overflow: 'auto',
//                 display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: 3
//             }}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Forgot ID/password?
//                 </Typography>
//                 {step < 3 && (
//                     <>
//                         <CustomTextField label="Email" onChange={handleChange} name="email" value={userDetails.email} error={errors.email} disabled={step > 1} />
//                         {step >= 2 && (
//                             <>
//                                 <CustomTextField label="Code" onChange={handleChange} name="code" value={userDetails.code} error={errors.code} />
//                             </>
//                         )}
//                     </>
//                 )}
//                 {step === 3 && (
//                     <>
//                         <CustomTextField label="User ID" onChange={handleChange} name="userId" value={userDetails.userId} error={errors.userId} disabled />
//                         <CustomTextField label="New Password" type="password" onChange={handleChange} name="password" value={userDetails.password} error={errors.password} />
//                         <CustomTextField label="Confirm Password" type="password" onChange={handleChange} name="confirmPassword" value={userDetails.confirmPassword} error={errors.confirmPassword} />
//                         {(!passwordErrors.length || !passwordErrors.hasNumberAndLetter || !passwordErrors.passwordsMatch) && (
//                             <Box sx={{ mt: 2, background: '#e0e0e0', borderRadius: '5px', p: 2, color: '#333' }}>
//                                 <Typography>Password must be:</Typography>
//                                 <Typography>{passwordErrors.length ? '✔ 8 characters minimum' : '✖ 8 characters minimum'}</Typography>
//                                 <Typography>{passwordErrors.hasNumberAndLetter ? '✔ At least one number & one letter' : '✖ At least one number & one letter'}</Typography>
//                                 <Typography>{passwordErrors.passwordsMatch ? '✔ Passwords match' : '✖ Passwords do not match'}</Typography>
//                             </Box>
//                         )}
//                     </>
//                 )}
//                 {step === 1 && (
//                     <Button variant="contained" color="primary" fullWidth onClick={handleSendEmail} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
//                         SEND EMAIL
//                     </Button>
//                 )}
//                 {step === 2 && (
//                     <Button variant="contained" color="primary" fullWidth onClick={handleVerifyCode} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
//                         VERIFY CODE
//                     </Button>
//                 )}
//                 {step === 3 && (
//                     <Button variant="contained" color="primary" fullWidth onClick={handleSetPassword} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
//                         SET PASSWORD
//                     </Button>
//                 )}
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ background: 'url(login-background.png) no-repeat center center', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
//             </Grid>
//         </Grid>
//     );
// };
//
// export default ForgotPassword;

import React, { useState } from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';
import CustomTextField from '../components/CustomTextField';
import { isEmpty, isValidEmail, isPasswordMatch, validatePassword } from '../utils/validation';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContainer, AuthLeftSection, AuthRightSection, AuthButton, AuthTitle } from '../style/StyledComponents';

const apiUrl = process.env.REACT_APP_API_URL;

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userDetails, setUserDetails] = useState({
        id: '',
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        id: false,
        email: false,
        code: false,
        password: false,
        confirmPassword: false
    });
    const [passwordErrors, setPasswordErrors] = useState({
        length: true,
        hasNumberAndLetter: true,
        passwordsMatch: true
    });

    const handleSendEmail = () => {
        if (isEmpty(userDetails.email) || !isValidEmail(userDetails.email)) {
            setErrors(prev => ({ ...prev, email: true }));
            return;
        }

        axios.post(`${apiUrl}/api/members/send-code`, { email: userDetails.email }, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(() => {
                setStep(2);
                setErrors(prev => ({ ...prev, email: false }));
            })
            .catch(error => {
                console.error("There was an error sending the email!", error);
            });
    };

    const handleVerifyCode = () => {
        if (isEmpty(userDetails.code)) {
            setErrors(prev => ({ ...prev, code: true }));
            return;
        }

        axios.post(`${apiUrl}/api/members/verify-code-change-pw`, { email: userDetails.email, code: userDetails.code }, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (response.data.message === "인증이 완료되었습니다.") {
                    setStep(3);
                    setUserDetails(prev => ({ ...prev, id: response.data.id }));
                    setErrors(prev => ({ ...prev, code: false }));
                } else {
                    setErrors(prev => ({ ...prev, code: true }));
                }
            })
            .catch(error => {
                console.error("There was an error verifying the code!", error);
            });
    };

    const handleSetPassword = () => {
        const { id, password, confirmPassword } = userDetails;
        const validationResults = validatePassword(password, confirmPassword);
        if (isEmpty(password) || isEmpty(confirmPassword) ||
            !validationResults.length || !validationResults.hasNumberAndLetter || !validationResults.passwordsMatch) {
            setErrors(prev => ({
                ...prev,
                password: isEmpty(password),
                confirmPassword: !isPasswordMatch(password, confirmPassword)
            }));
            setPasswordErrors(validationResults);
            return;
        }
        axios.post(`${apiUrl}/api/members/change-password?action=change_password&id=${id}`, {
            newPw: password,
            newPwConfirm: confirmPassword
        }, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(() => {
                navigate('/');
            })
            .catch(error => {
                console.error("There was an error setting the password!", error);
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
        setErrors(prev => ({ ...prev, [name]: false }));
    };

    return (
        <AuthContainer container>
            <AuthLeftSection item xs={12} sm={6}>
                <AuthTitle variant="h4" as="h1" gutterBottom>
                    Forgot ID/password?
                </AuthTitle>
                {step < 3 && (
                    <>
                        <CustomTextField label="Email" onChange={handleChange} name="email" value={userDetails.email} error={errors.email} disabled={step > 1} />
                        {step >= 2 && (
                            <CustomTextField label="Code" onChange={handleChange} name="code" value={userDetails.code} error={errors.code} />
                        )}
                    </>
                )}
                {step === 3 && (
                    <>
                        <CustomTextField label="Email" onChange={handleChange} name="email" value={userDetails.email} error={errors.email} disabled />
                        <CustomTextField label="New Password" type="password" onChange={handleChange} name="password" value={userDetails.password} error={errors.password} />
                        <CustomTextField label="Confirm Password" type="password" onChange={handleChange} name="confirmPassword" value={userDetails.confirmPassword} error={errors.confirmPassword} />
                        {(!passwordErrors.length || !passwordErrors.hasNumberAndLetter || !passwordErrors.passwordsMatch) && (
                            <Box sx={{ mt: 2, background: '#e0e0e0', borderRadius: '5px', p: 2, color: '#333' }}>
                                <Typography>Password must be:</Typography>
                                <Typography>{passwordErrors.length ? '✔ 8 characters minimum' : '✖ 8 characters minimum'}</Typography>
                                <Typography>{passwordErrors.hasNumberAndLetter ? '✔ At least one number & one letter' : '✖ At least one number & one letter'}</Typography>
                                <Typography>{passwordErrors.passwordsMatch ? '✔ Passwords match' : '✖ Passwords do not match'}</Typography>
                            </Box>
                        )}
                    </>
                )}
                {step === 1 && (
                    <AuthButton variant="contained" color="primary" fullWidth onClick={handleSendEmail}>
                        SEND EMAIL
                    </AuthButton>
                )}
                {step === 2 && (
                    <AuthButton variant="contained" color="primary" fullWidth onClick={handleVerifyCode}>
                        VERIFY CODE
                    </AuthButton>
                )}
                {step === 3 && (
                    <AuthButton variant="contained" color="primary" fullWidth onClick={handleSetPassword}>
                        SET PASSWORD
                    </AuthButton>
                )}
            </AuthLeftSection>
            <AuthRightSection item xs={12} sm={6} />
        </AuthContainer>
    );
};

export default ForgotPassword;
