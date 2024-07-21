import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Card, CardMedia, CardContent, Chip, IconButton, CircularProgress } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../config/AxiosConfig';

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Article {
    id: number;
    title: string;
    content: string;
    postDate: string;
    category: Category;
    source: string;
    tags: Tag[];
    imgUrls: string[];
}

const getRandomArticles = (articles: Article[], count: number) => {
    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const RecommendArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [currentArticle, setCurrentArticle] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');  // 인증 토큰을 로컬 스토리지에서 가져옴
                const response = await axiosInstance.get('/recommend-article/recent', {
                    headers: {
                        Authorization: `Bearer ${token}`  // Authorization 헤더에 토큰 추가
                    },
                    params: {
                        limit: 12
                    }
                });
                console.log("recommend fetch done");
                const fetchedArticles = response.data;
                setArticles(fetchedArticles.length > 5 ? getRandomArticles(fetchedArticles, 5) : fetchedArticles);
            } catch (error) {
                console.error('Failed to fetch articles', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handlePrevClick = () => {
        setCurrentArticle((prevArticle) => (prevArticle === 0 ? articles.length - 1 : prevArticle - 1));
    };

    const handleNextClick = () => {
        setCurrentArticle((prevArticle) => (prevArticle === articles.length - 1 ? 0 : prevArticle + 1));
    };

    const handleOpenArticle = (article: Article) => {
        navigate(`/article/${article.id}`, { state: { article } });
    };

    return (
        <Paper sx={{ padding: 2, backgroundColor: '#1f2a3c' }}>
            <Typography variant="h5" gutterBottom color="white" align="center">Recommended Articles</Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress color="inherit" />
                </Box>
            ) : (
                articles.length > 0 ? (
                    <>
                        <Box sx={{ marginBottom: 3 }} /> {/* Typography와 카드 사이에 간격 추가 */}
                        <Card sx={{ backgroundColor: '#152238', color: 'white' }} onClick={() => handleOpenArticle(articles[currentArticle])}>
                            {articles[currentArticle] && articles[currentArticle].imgUrls && articles[currentArticle].imgUrls[0] && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={articles[currentArticle].imgUrls[0]}
                                    alt={articles[currentArticle].title}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" sx={{ marginBottom: '1rem'}}>{articles[currentArticle]?.title}</Typography>
                                <Typography variant="body2" sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 8,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {articles[currentArticle]?.content}
                                </Typography>
                                <Box sx={{ marginTop: 1 }}>
                                    {articles[currentArticle] && articles[currentArticle].category && (
                                        <Chip label={articles[currentArticle].category.name} color="primary" />
                                    )}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}>
                                        {articles[currentArticle]?.tags.map((tag, index) => (
                                            <Chip key={index} label={tag.name} sx={{ backgroundColor: '#2e3b4e', color: 'white' }} />
                                        ))}
                                    </Box>
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
                    </>
                ) : (
                    <Typography color="white" align="center">No articles found.</Typography>
                )
            )}
        </Paper>
    );
};

export default RecommendArticles;
