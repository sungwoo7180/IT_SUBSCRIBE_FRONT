import React, { useState, useEffect } from 'react';
import { Box, CardMedia, CardContent, Chip, IconButton, CircularProgress, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../config/AxiosConfig';
import { CommonCard, LoadingBox } from '../style/StyledComponents';
import CommonHeader from './CommonHeader';

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
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('/api/recommend-article/recent', {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                    },
                    params: {
                        limit: 12
                    }
                });

                const fetchedArticles = response.data;

                // 선호 카테고리가 없는 경우 전체 기사에서 랜덤으로 추천
                if (!fetchedArticles || fetchedArticles.length === 0) {
                    // 여기에 기본적으로 랜덤 기사 12개를 불러오는 로직을 추가
                    const randomArticlesResponse = await axiosInstance.get('/articles/random', {
                        params: { limit: 12 },
                    });
                    setArticles(getRandomArticles(randomArticlesResponse.data, 5));
                } else {
                    setArticles(fetchedArticles.length > 5 ? getRandomArticles(fetchedArticles, 5) : fetchedArticles);
                }
            } catch (error) {
                console.error('Failed to fetch articles', error);
                setArticles([]); // 오류 발생 시 빈 배열로 설정
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
        <Box sx={{ padding: 2, backgroundColor: '#1f2a3c' }}>
            <CommonHeader title="Recommended Articles" />
            {loading ? (
                <LoadingBox>
                    <CircularProgress color="inherit" />
                </LoadingBox>
            ) : (
                articles.length > 0 ? (
                    <>
                        <CommonCard onClick={() => handleOpenArticle(articles[currentArticle])}>
                            {articles[currentArticle]?.imgUrls?.length > 0 && (
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
                                    {articles[currentArticle]?.category && (
                                        <Chip label={articles[currentArticle].category.name} color="primary" />
                                    )}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}>
                                        {articles[currentArticle]?.tags?.map((tag, index) => (
                                            <Chip key={index} label={tag.name} sx={{ backgroundColor: '#2e3b4e', color: 'white' }} />
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                        </CommonCard>
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
                    </>
                ) : (
                    <Typography color="white" align="center">No articles found.</Typography>
                )
            )}
        </Box>
    );
};

export default RecommendArticles;
