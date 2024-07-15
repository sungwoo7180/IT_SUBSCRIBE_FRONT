import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { isEmpty, validatePassword, isPasswordMatch } from '../utils/validation';
import SectionHeader from "./SectionHeader";
import CustomTextField from "./CustomTextField";

interface PasswordResetProps {
    onPasswordReset: (newPassword: string, confirmPassword: string) => void;
}

const ResetPassword: React.FC<PasswordResetProps> = ({ onPasswordReset }) => {
    const [userDetails, setUserDetails] = useState({
        password: '',
        confirmPassword: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({
        length: true,
        hasNumberAndLetter: true,
        passwordsMatch: true,
    });
    const [errors, setErrors] = useState({
        password: false,
        confirmPassword: false,
    });

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

    const handleResetSubmit = () => {
        const { password, confirmPassword } = userDetails;
        const validationResults = validatePassword(password, confirmPassword);
        if (isEmpty(password) || isEmpty(confirmPassword) ||
            !validationResults.length || !validationResults.hasNumberAndLetter || !validationResults.passwordsMatch) {
            setErrors(prev => ({
                ...prev,
                password: isEmpty(password),
                confirmPassword: !isPasswordMatch(password, confirmPassword),
            }));
            setPasswordErrors(validationResults);
            return;
        }

        onPasswordReset(password, confirmPassword);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <SectionHeader title="Reset Password" />
            <Box sx={{ textAlign: 'left', width: '100%', maxWidth: '500px' }}>
                <Typography sx={{ marginTop: '16px' }}>New Password</Typography>
                <CustomTextField
                    label="Password"
                    type="password"
                    onChange={handleChange}
                    name="password"
                    value={userDetails.password}
                    error={errors.password}

                />
                <Typography sx={{ marginTop: '16px' }}>Confirm New Password</Typography>
                <CustomTextField
                    label="Confirm Password"
                    type="password"
                    onChange={handleChange}
                    name="confirmPassword"
                    value={userDetails.confirmPassword}
                    error={errors.confirmPassword}
                />
                {(!passwordErrors.length || !passwordErrors.hasNumberAndLetter || !passwordErrors.passwordsMatch) && (
                    <Box sx={{ mt: 2, background: '#e0e0e0', borderRadius: '5px', p: 2, color: '#333' }}>
                        <Typography>Password must be:</Typography>
                        <Typography>{passwordErrors.length ? '✔ 8 characters minimum' : '✖ 8 characters minimum'}</Typography>
                        <Typography>{passwordErrors.hasNumberAndLetter ? '✔ At least one number & one letter' : '✖ At least one number & one letter'}</Typography>
                        <Typography>{passwordErrors.passwordsMatch ? '✔ Passwords match' : '✖ Passwords do not match'}</Typography>
                    </Box>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResetSubmit}
                    sx={{ mt: 2, width: '100%', maxWidth: '500px', height: '50px' }}
                >
                    SET PASSWORD
                </Button>
            </Box>
        </Box>
    );
};

export default ResetPassword;
