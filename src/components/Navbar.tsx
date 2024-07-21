import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import categories from '../data/Categories';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleCategoryClick = (category: string) => {
        if (category === 'ALL') {
            navigate('/all-articles');
        } else {
            window.location.href = `/articles/?categories=${encodeURIComponent(category)}`;
        }
    };

    const handleLogout = () => {
        fetch('http://localhost:8080/api/members/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
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
                <Link to="/main" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h4" component="div" style={{ textAlign: 'center', flexGrow: 1, paddingRight: `180px` }}>
                        ITScribe
                    </Typography>
                </Link>
                <Box>
                    {user && user.avatarUrl ? (
                        <IconButton color="inherit" onClick={() => navigate('/my-page')}>
                            <img src={user.avatarUrl} alt="Profile" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                        </IconButton>
                    ) : (
                        <Link to="/" style={{ color: 'inherit' }}>
                            <IconButton color="inherit">
                                <PersonIcon />
                            </IconButton>
                        </Link>
                    )}
                    <IconButton color="inherit">
                        <MailIcon />
                    </IconButton>
                    {Object.keys(user).length > 0 ? (
                        <Button color="inherit" onClick={handleLogout}>
                            <ExitToAppIcon /> Logout
                        </Button>
                    ) : (
                        <Link to="/" style={{ color: 'inherit' }}>
                            <Button color="inherit">Login</Button>
                        </Link>
                    )}
                </Box>
            </Toolbar>
            <Toolbar variant="dense" style={{ backgroundColor: '#1f2a3c', justifyContent: 'center' }}>
                <Button
                    key="all"
                    variant="text"
                    style={{ color: 'white', padding: '0 15px' }}
                    onClick={() => handleCategoryClick('ALL')}
                >
                    ALL
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant="text"
                        style={{ color: 'white', padding: '0 15px' }}
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
//변경전