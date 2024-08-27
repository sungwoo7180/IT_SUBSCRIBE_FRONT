import React, { useState } from 'react';
import { InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search…" }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchQuery.trim()) {
            navigate(`/searched-articles?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
            <InputBase
                placeholder={placeholder}
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearch}
                onKeyPress={handleKeyPress} // 엔터 키를 눌렀을 때 처리
                style={{
                    color: 'inherit',
                    backgroundColor: '#ffffff33',
                    padding: '0 1rem',
                    borderRadius: '3rem',
                    width: '30rem',
                    marginLeft: '2rem',
                    marginRight: '-10rem'
                }}
            />
        </Box>
    );
};

export default SearchBar;
