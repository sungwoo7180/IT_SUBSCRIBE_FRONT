import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Card, CardMedia, CardContent, Chip, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import {useNavigate} from "react-router-dom";

const articles = [
    { id: 1, title: 'Dummy Article 1', content: 'Content of dummy article 1.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 2, title: 'Dummy Article 2', content: 'Content of dummy article 2.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 3, title: 'Dummy Article 3', content: 'Content of dummy article 3.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 4, title: 'Dummy Article 4', content: 'Content of dummy article 4.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 5, title: 'Dummy Article 5', content: 'Content of dummy article 5.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
];

const RecommendArticles: React.FC = () => {
    const [currentArticle, setCurrentArticle] = useState(0);
    const navigate = useNavigate();
    const handlePrevClick = () => {
        setCurrentArticle((prevArticle) => (prevArticle === 0 ? articles.length - 1 : prevArticle - 1));
    };

    const handleNextClick = () => {
        setCurrentArticle((prevArticle) => (prevArticle === articles.length - 1 ? 0 : prevArticle + 1));
    };

    return (
        <Paper sx={{ padding: 2, backgroundColor: '#1f2a3c' }}>
            <Typography variant="h5" gutterBottom color="white" align="center" >Recommended Articles</Typography>
            <Box sx={{ marginBottom: 3 }} /> {/* Typography와 카드 사이에 간격 추가 */}
            <Card sx={{ backgroundColor: '#152238', color: 'white' }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={articles[currentArticle].image}
                    alt={articles[currentArticle].title}
                />
                <CardContent>
                    <Typography variant="h6" >{articles[currentArticle].title}</Typography>
                    <Typography variant="body2">{articles[currentArticle].content}</Typography>
                    <Box sx={{ marginTop: 1 }}>
                        <Chip label={articles[currentArticle].category} color="primary" />
                        {articles[currentArticle].tags.map((tag, index) => (
                            <Chip key={index} label={tag} sx={{ marginLeft: 1, backgroundColor: '#2e3b4e', color: 'white' }} />
                        ))}
                    </Box>
                </CardContent>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                <IconButton onClick={handlePrevClick} sx={{ color: 'white' }}>
                    <ArrowBackIos />
                </IconButton>
                {articles.map((_, index) => (
                    <Box key={index} sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: currentArticle === index ? 'white' : 'gray',
                        margin: '0 4px'
                    }} />
                ))}
                <IconButton onClick={handleNextClick} sx={{ color: 'white' }}>
                    <ArrowForwardIos />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: '#3b5998' }} onClick={() => navigate('/custom-all-articles')}>View favorite categories</Button>
            </Box>
        </Paper>
    );
};

export default RecommendArticles;
