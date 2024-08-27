import React, { useEffect, useState, ChangeEvent } from 'react';
import {Box, Typography, Button, Modal, Snackbar, Alert} from '@mui/material';
import CategoryFilter from '../components/CategoryFilter';
import AlarmSettings from '../components/AlarmSettings';
import UserInfo from '../components/UserInfo';
import ResetPassword from '../components/ResetPassword';
import { Link, Element } from 'react-scroll';
import '../style/MyPage.css';
import SectionHeader from "../components/SectionHeader";
import axios from "axios";
import ProfilePictureUploadModal from "../components/ProfilePictureUploadModal";
const apiUrl = process.env.REACT_APP_API_URL;

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

// 이 코드 수정 필수!!!
// data/Categories.ts 파일에서 가져온 카테고리 목록으로 하드 코딩
// DB 에서 Category 를 받아오는 형식으로 바뀌어야함.
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

// 카테고리 ID를 이름으로 매핑하는 객체 생성
const categoryReverseMapping: { [key: number]: string } = Object.keys(categoryMapping).reduce<{ [key: number]: string }>((acc, key) => {
    const id = categoryMapping[key];
    acc[id] = key;
    return acc;
}, {});

const MyPage: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        email: '',
        nickname: '',
        joinedDate: '',
        avatarUrl: ''
    });

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);  // 항상 배열로 초기화
    const [preferences, setPreferences] = useState<Preferences>({
        alarm: false,
        emailUpdates: false
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // const baseURL = 'http://localhost:8080';

    // 사용자 정보 불러오기
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/api/members/mypage`,
                {
                    method: 'GET',
                    credentials: 'include'  // 세션 쿠키를 포함합니다.
                }
            );
            const data = await response.json();
            setUserDetails({
                email: data.email,
                nickname: data.nickname,
                joinedDate: data.createdAt.split('T')[0], // 날짜만 필요하므로 'T'를 기준으로 분리
                avatarUrl: data.profileImageUrl
            });
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    // 선호 카테고리 불러오기
    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/api/members/mypage/get-favorite-category`,
                {
                    method: 'GET',
                    credentials: 'include',  // 세션 쿠키를 포함합니다.
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const categoryIds = await response.json();
            // 서버에서 응답받은 카테고리 ID 배열을 이름 배열로 변환
            const categoryNames = categoryIds.map((id: number) => categoryReverseMapping[id]);
            setSelectedCategories(categoryNames); // 변환된 이름 배열로 상태 업데이트
        } catch (error) {
            console.error('Error fetching categories:', error);
            setSelectedCategories([]); // 오류 발생 시 빈 배열로 설정
        }
    };

    // 알람 설정 불러오기
    const fetchPreferences = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/api/members/mypage/get-preferences`,
                {
                    method: 'GET',
                    credentials: 'include'  // 세션 쿠키를 포함합니다.
                }
            );
            const data = await response.json();
            setPreferences(data);
        } catch (error) {
            console.error('Error fetching preferences:', error);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

    // 모달 열기
    const openModal = () => setIsModalOpen(true);

    // 모달 닫기
    const closeModal = () => setIsModalOpen(false);

    // 프로필 이미지 업로드 후 모달 닫기 및 상태 업데이트
    const handleProfileImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${apiUrl}/api/members/mypage/update-profile-image`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            if (response.status === 200) {
                setUserDetails(prev => (
                    { ...prev, avatarUrl: response.data.avatarUrl }
                ));
                closeModal(); // 모달 닫기
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
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
            const response = await fetch(
                `${apiUrl}/api/members/mypage/update-user-info`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(userDetails),
                    credentials: 'include'  // 세션 쿠키를 포함합니다.
                }
            );
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
            const response = await axios.post(`${apiUrl}/api/members/mypage/edit-favorite-category`, {
                categoryIds: selectedCategoryIds }
            );
            console.log(response)

            if (response.status === 200) {
                setSnackbarMessage('Categories saved successfully');
                setOpenSnackbar(true);
                console.log('Categories saved successfully');
                //fetchCategories();
            } else {
                setSnackbarMessage('Error saving categories');
                setOpenSnackbar(true);
                console.error('Error saving categories');
            }
        } catch (error) {
            console.error('Error saving categories:', selectedCategoryIds);
            setSnackbarMessage('Error saving categories');
            setOpenSnackbar(true);
            console.error('Error saving categories:', selectedCategoryIds);
        }
    };

    // 알람 설정 저장하기
    const savePreferences = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/api/members/mypage/update-preferences`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(preferences),
                    credentials: 'include'  // 세션 쿠키를 포함합니다.
                }
            );
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

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
                    <Button className="bookmarkListButton" onClick={openModal} >Bookmark List</Button>
                </Box>
                <Box sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ my: 3 }}>
                        <Element name="userInfo">
                            <UserInfo userDetails={userDetails} handleInputChange={handleInputChange} handleSubmit={saveUserInfo} handleProfileImageUpload={handleProfileImageUpload} openModal={openModal} />
                        </Element>
                        <Button variant="contained" onClick={saveUserInfo}>Save User Info</Button>
                    </Box>
                    <ProfilePictureUploadModal open={isModalOpen} onClose={closeModal} onSave={handleProfileImageUpload} />
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
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('successfully') ? "success" : "error"} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MyPage;