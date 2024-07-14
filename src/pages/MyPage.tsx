    import React, {useState} from 'react';
    import { Box, Typography } from '@mui/material';
    import CategoryFilter from '../components/CategoryFilter';
    import AlarmSettings from '../components/AlarmSettings';
    import UserInfo from '../components/UserInfo';
    import ResetPassword from '../components/ResetPassword';
    import { Link, Element } from 'react-scroll';
    import '../style/MyPage.css';
    import SectionHeader from "../components/SectionHeader";

    const MyPage = () => {

        // 더미 데이터
        const [userDetails, setUserDetails] = useState({
            email: 'wildmantle@gmail.com',
            nickname: 'Lazy Seong bin',
            joinedDate: '2024-06-29',
            avatarUrl: '.jpg'
        });


        const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
        const [preferences, setPreferences] = useState({
            alarm: false,
            emailUpdates: false

        });


        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            setUserDetails(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = () => {
            console.log("User details submitted:", userDetails);
            // Form submission logic here
        };

        const handlePasswordReset = (newPassword: string, confirmPassword: string) => {
            console.log("Password Reset", newPassword, confirmPassword);
            // 추가적인 비밀번호 리셋 로직 구현
        };

        return (
            <>
                <Box sx={{
                    padding: 3,
                    backgroundImage: 'url(Background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh'
                }}>
                    <Box sx={{ display: 'flex', height: '200vh', backgroundColor: '#1e1e2f' }}>
                        <Box className="sidebar" sx = {{
                            position: 'sticky',
                            height: '100vh'
                        }}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#fff', textAlign: 'center', py: 3 }}>
                                Settings
                            </Typography>
                            <Link to="categoryPreferences" smooth={true}>Favorite Categories</Link>
                            <Link to="alarmSettings" smooth={true}>Alarm</Link>
                            <Link to="userInfo" smooth={true}>User Info</Link>
                            <Link to="resetPassword" smooth={true}>Reset Password</Link>
                        </Box>
                        <Box sx={{ flex: 1, p: 3 }}>
                            <Box sx={{ my: 3 }}>
                                <Element name="categoryPreferences">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ width: '70%' }}>
                                            <SectionHeader title="Favorite Categories" />
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                                <CategoryFilter selectedCategories={selectedCategories} onFilterChange={setSelectedCategories} />
                                            </Box>
                                        </Box>
                                        <Box sx={{ width: '25%', ml: 2 }}>
                                            <Typography variant="h6" sx={{ color: 'lightgray' }}>Note</Typography>
                                            <Typography variant="body2" sx={{ color: 'lightgray', mt: 1 }}>
                                                Our site algorithm recommends you articles based on your selected favorite categories
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Element>
                            </Box>
                            <Box sx={{ my: 3 }}>
                                <Element name="alarmSettings">
                                    <AlarmSettings preferences={preferences} setPreferences={setPreferences} />
                                </Element>
                            </Box>
                            <Box sx={{ my: 3}}>
                                <Element name="userInfo">
                                    <UserInfo userDetails={userDetails} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
                                </Element>
                            </Box>
                            <Box sx={{ my: 3 }}>
                                <Element name="resetPassword">
                                    <ResetPassword onPasswordReset={handlePasswordReset} />
                                </Element>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </>
        );
    };

    export default MyPage;