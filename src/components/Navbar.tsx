import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category: string) => {
        navigate(`/all-articles?categories=${encodeURIComponent(category)}`);
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
                    <Typography variant="h4" component="div" style={{ textAlign: 'center', flexGrow: 1, paddingRight: `275px` }}>
                        ITScribe
                    </Typography>
                </Link>
                <Box>
                    <Link to="/my-page" style={{ color: 'inherit' }}>
                        <IconButton color="inherit">
                            <PersonIcon />
                        </IconButton>
                    </Link>
                    <IconButton color="inherit">
                        <MailIcon />
                    </IconButton>
                </Box>
            </Toolbar>
            <Toolbar variant="dense" style={{ backgroundColor: '#1f2a3c', justifyContent: 'center' }}>
                {['Framework', 'Engineering', 'AI / ML', 'Cloud', 'Security', 'VR', 'Data Science', 'Network', 'Digital Device', 'Embed', 'Mobile', 'Game'].map((category) => (
                    <Button
                        key={category}
                        variant="text"
                        style={{ color: 'white', padding: '0 15px' }}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
