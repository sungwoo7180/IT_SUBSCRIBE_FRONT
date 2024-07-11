import React from 'react';
import {AppBar, Toolbar, Typography, IconButton, InputBase, Box, Button} from '@mui/material';
import { Link } from "react-router-dom";  // React Router 를 사용하기 위해 추가
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';

const Navbar: React.FC = () => {
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
                    <IconButton color="inherit">
                        <PersonIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <MailIcon />
                    </IconButton>
                </Box>
            </Toolbar>
            <Toolbar variant="dense" style={{ backgroundColor: '#1f2a3c', justifyContent: 'center' }}>
                {['Framework', 'Engineering', 'AI / ML', 'Cloud', 'Security', 'VR', 'Data Science', 'Network', 'Digital Device', 'Embed', 'Mobile', 'Game'].map((category) => (
                    <Button key={category} variant="text" style={{ color: 'white', padding: '0 15px' }}>
                        {category}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;





