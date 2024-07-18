import React, { useEffect, useState, ChangeEvent } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CategoryFilter from '../components/CategoryFilter';
import AlarmSettings from '../components/AlarmSettings';
import UserInfo from '../components/UserInfo';
import ResetPassword from '../components/ResetPassword';
import { Link, Element } from 'react-scroll';
import '../style/MyPage.css';
import SectionHeader from "../components/SectionHeader";

// 사용자 정보 타입 정의
interface UserDetails {
    email: string;
    nickname: string;
    joinedDate: string;
    avatarUrl: string;
    emailUpdates?: boolean; // emailUpdates 추가
}

// 선호 카테고리 타입 정의
interface Preferences {
    alarm: boolean;
    emailUpdates: boolean;
}

const categoryMapping: { [key: string]: number } = {
    'FrontEnd': 1,
    'BackEnd': 2,
    'AI / ML': 3,
    'Cloud': 4,
    'Security': 5,
    'VR': 6,
    'Data Science': 7,
    'Network': 8,
    'Digital Device': 9,
    'Embed': 10,
    'Mobile': 11,
    'Game': 12,
};

const MyPage: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        email: 'wildmantle@gmail.com',
        nickname: 'Lazy Seong bin',
        joinedDate: '2024-06-29',
        avatarUrl: '.jpg'
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);  // 항상 배열로 초기화
    const [preferences, setPreferences] = useState<Preferences>({
        alarm: false,
        emailUpdates: false
    });

    const baseURL = 'http://localhost:8080';

    // 사용자 정보 불러오기
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${baseURL}/api/members/mypage`);
            const data = await response.json();
            setUserDetails(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    // 선호 카테고리 불러오기
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${baseURL}/api/members/mypage/get-favorite-category`);
            const data = await response.json();
            setSelectedCategories(Array.isArray(data) ? data : []); // 데이터를 배열로 변환
        } catch (error) {
            console.error('Error fetching categories:', error);
            setSelectedCategories([]); // 오류 발생 시 빈 배열로 설정
        }
    };

    // 알람 설정 불러오기
    const fetchPreferences = async () => {
        try {
            const response = await fetch(`${baseURL}/api/members/mypage/get-preferences`);
            const data = await response.json();
            setPreferences(data);
        } catch (error) {
            console.error('Error fetching preferences:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchCategories();
        fetchPreferences();
    }, []);

    // 사용자 정보 저장하기
    const saveUserInfo = async () => {
        try {
            const response = await fetch(`${baseURL}/api/members/mypage/update-user-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails)
            });
            if (response.ok) {
                console.log('User info saved successfully');
                fetchUserInfo();
            } else {
                console.error('Error saving user info');
            }
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    // 선택된 카테고리를 숫자 ID 배열로 변환
    const getSelectedCategoryIds = (categories: string[]): number[] => {
        return categories.map(category => categoryMapping[category]);
    };

    // 선호 카테고리 저장하기
    const saveCategories = async () => {
        const selectedCategoryIds = getSelectedCategoryIds(selectedCategories);
        console.log('Selected Category IDs:', selectedCategoryIds); // 배열 확인

        if (!Array.isArray(selectedCategoryIds)) {
            console.error('selectedCategoryIds is not an array');
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/members/mypage/edit-favorite-category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedCategoryIds)
            });

            if (response.ok) {
                console.log('Categories saved successfully');
                fetchCategories();
            } else {
                console.error('Error saving categories');
            }
        } catch (error) {
            console.error('Error saving categories:', error);
        }
    };

    // 알람 설정 저장하기
    const savePreferences = async () => {
        try {
            const response = await fetch(`${baseURL}/api/members/mypage/update-preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferences)
            });
            if (response.ok) {
                console.log('Preferences saved successfully');
                fetchPreferences();
            } else {
                console.error('Error saving preferences');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    // 사용자 정보 변경 핸들러
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserDetails(prev => ({ ...prev, [name]: value }));
    };

    // 비밀번호 재설정 핸들러
    const handlePasswordReset = (newPassword: string, confirmPassword: string) => {
        console.log("Password Reset", newPassword, confirmPassword);
        // 추가적인 비밀번호 재설정 로직 구현
    };

    return (
        <Box sx={{ padding: 3, backgroundImage: 'url(Background.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', height: '200vh', backgroundColor: '#1e1e2f' }}>
                <Box className="sidebar" sx={{ position: 'sticky', height: '100vh' }}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#fff', textAlign: 'center', py: 3 }}>
                        Settings
                    </Typography>
                    <Link to="userInfo" smooth={true}>User Info</Link>
                    <Link to="categoryPreferences" smooth={true}>Favorite Categories</Link>
                    <Link to="alarmSettings" smooth={true}>Alarm</Link>
                    <Link to="resetPassword" smooth={true}>Reset Password</Link>
                </Box>
                <Box sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ my: 3 }}>
                        <Element name="userInfo">
                            <UserInfo userDetails={userDetails} handleInputChange={handleInputChange} handleSubmit={saveUserInfo} />
                        </Element>
                        <Button variant="contained" onClick={saveUserInfo}>Save User Info</Button>
                    </Box>
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
                        <Button variant="contained" onClick={saveCategories}>Save Categories</Button>
                    </Box>
                    <Box sx={{ my: 3 }}>
                        <Element name="alarmSettings">
                            <AlarmSettings preferences={preferences} setPreferences={setPreferences} />
                        </Element>
                        <Button variant="contained" onClick={savePreferences}>Save Preferences</Button>
                    </Box>
                    <Box sx={{ my: 3 }}>
                        <Element name="resetPassword">
                            <ResetPassword onPasswordReset={handlePasswordReset} />
                        </Element>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MyPage;
