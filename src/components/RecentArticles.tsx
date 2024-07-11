import React, {useState} from 'react';
import {Box, Typography, Card, CardMedia, CardContent, Grid, Modal, Button} from '@mui/material';
import {useNavigate} from "react-router-dom";

interface Article {
    id: number;
    title: string;
    content: string;
    image: string;
    category: string;
    tags: string[];
}

const articles : Article[] = [
        { id: 1, title: 'Dummy Article 1', content: 'Content of dummy article 1.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 2, title: 'Dummy Article 2', content: 'Content of dummy article 2.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 3, title: 'Dummy Article 3', content: 'Content of dummy article 3.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 4, title: 'Dummy Article 4', content: 'Content of dummy article 4.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 5, title: 'Dummy Article 5', content: 'Content of dummy article 5.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
];

const RecentArticles: React.FC = () => {
    const navigate = useNavigate();

    const handleOpen = (articleId: number) => {
        navigate(`/article/${articleId}`); // 네비게이트 함수를 사용하여 기사 상세 페이지로 이동
    };

    return (
        <Box sx={{ padding: 2, backgroundColor: '#1f2a3c' }}>
            <Typography variant="h5" color="white" align="center" marginBottom={1}>Recent Articles</Typography>
            <Grid container spacing={2}>
                {articles.map(article => (
                    <Grid item xs={12} sm={6} md={4} key={article.id} onClick={() => handleOpen(article.id)}>
                        <Card sx={{ height: 300, display: 'flex', flexDirection: 'column', backgroundColor: '#152238', color: 'white' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={article.image}
                                alt={article.title}
                                sx={{ marginBottom: 2 , paddingBottom : 0 }} // 사진과 글 사이에 여백
                            />
                            <CardContent sx={{ paddingTop: 0, marginBottom : 0}}>
                                <Typography variant="h6">{article.title}</Typography>
                                <Typography variant="body2" sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: 5 }}>
                                    {article.content}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: '#3b5998' }} onClick={() => navigate('/all-articles')}>View All Articles</Button>
            </Box>
        </Box>
    );
};

export default RecentArticles;