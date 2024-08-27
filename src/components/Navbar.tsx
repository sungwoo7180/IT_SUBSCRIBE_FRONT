import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Button } from '@mui/material';
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import categories from '../data/Categories';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('categories');
        if (category) {
            setSelectedCategory(category);
        } else if (location.pathname === '/all-articles') {
            setSelectedCategory('ALL');
        } else {
            setSelectedCategory('');
        }
    }, [location]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        if (category === 'ALL') {
            window.location.href = '/all-articles';
        } else {
            window.location.href = `/articles?categories=${encodeURIComponent(category)}`;
        }
    };

    const handleLogoClick = () => {
        setSelectedCategory(''); // 로고를 클릭하면 선택된 카테고리를 초기화
        navigate('/main');
    };

    const handleLogout = () => {
        // API 호출을 통한 로그아웃 처리
        fetch(`${apiUrl}/api/members/logout`,
            {
                method: 'POST',
                credentials: 'include',  // 중요: 쿠키를 포함시키기 위해 필요
                headers: {'Content-Type': 'application/json'}
            }
        )
            .then(response => {
                // 로그아웃 후 처리, 로그인 페이지로 리다이렉션
                if (response.ok) {
                    console.log("로그아웃에 성공했습니다.");
                    localStorage.removeItem('user');
                    navigate('/');
                }
            })
            .catch(error => console.error('로그아웃 에러:', error));
    };

    return (
        <AppBar position="static" style={{ backgroundColor: '#152238' }}>
            <Toolbar style={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SearchIcon />
                    <InputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        style={{
                            color: 'inherit',
                            backgroundColor: '#ffffff33',
                            padding: '0 10px',
                            borderRadius: '4px',
                            width: '300px',
                            marginLeft: '10px'
                        }}
                    />
                </Box>
                <Typography
                    variant="h4"
                    component="div"
                    style={{ textAlign: 'center', flexGrow: 1, paddingRight: `180px`, cursor: 'pointer' }}
                    onClick={handleLogoClick}
                >
                    ITScribe
                </Typography>
                <Box>
                    {Object.keys(user).length > 0 ? (
                        <>
                            { (user.role == "ADMIN" || user.role =="SUPER_ADMIN") && (
                                <Button color="inherit" onClick={() => navigate('/admin')}>
                                    Admin Panel
                                </Button>
                            )}
                            <IconButton color="inherit" onClick={() => navigate('/my-page')}>
                                <img src={user.avatarUrl} alt="Profile" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                            </IconButton>
                            <IconButton color="inherit">
                                <MailIcon />
                            </IconButton>
                            <Button color="inherit" onClick={handleLogout}>
                                <ExitToAppIcon /> Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/" style={{ color: 'inherit' }}>
                                <IconButton color="inherit">
                                    <PersonIcon />
                                </IconButton>
                            </Link>
                            <Link to="/" style={{ color: 'inherit' }}>
                                <Button color="inherit">Login</Button>
                            </Link>
                        </>
                    )}
                </Box>
            </Toolbar>
            <Toolbar variant="dense" style={{ backgroundColor: '#1f2a3c', justifyContent: 'center' }}>
                <Button
                    key="all"
                    variant="text"
                    style={{ color: selectedCategory === 'ALL' ? '#2979ff' : 'white', padding: '0 15px', fontSize: '18px' }}
                    onClick={() => handleCategoryClick('ALL')}
                >
                    ALL
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant="text"
                        style={{ color: selectedCategory === category.name ? '#2979ff' : 'white', padding: '0 15px', fontSize: '18px' }}
                        onClick={() => handleCategoryClick(category.name)}
                    >
                        {category.name}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
