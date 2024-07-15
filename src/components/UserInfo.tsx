import React from 'react';
import { Box, Button, Typography, Avatar, Paper } from '@mui/material';
import CustomTextField from './CustomTextField';
import SectionHeader from "./SectionHeader";

interface UserInfoProps {
    userDetails: {
        email: string;
        nickname: string;
        joinedDate: string;
        avatarUrl: string;
    };
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ userDetails, handleInputChange, handleSubmit }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <SectionHeader title="User Info" />
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#1e1e2f', color: 'white', borderRadius: '10px', width: '100%' }}>
                <Avatar src={userDetails.avatarUrl} sx={{ width: 90, height: 90 }} />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>{userDetails.nickname}</Typography>
                    <Typography>Joined on {userDetails.joinedDate}</Typography>
                    <Box sx={{ mt: 2 }}>
                        <CustomTextField
                            label="Email"
                            type="email"
                            name="email"
                            value={userDetails.email}
                            onChange={handleInputChange}
                            fontSize="16px"
                            inputColor="white"
                            disabled={true}
                        />
                        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2, backgroundColor: '#2979ff', color: 'white' }}>
                            Update Email
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserInfo;
