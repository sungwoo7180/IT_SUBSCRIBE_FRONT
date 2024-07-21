import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Grid, Button, Chip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../config/AxiosConfig';
import CategoryChip from '../components/Button/CategoryButton';

// 기사 데이터 인터페이스 정의
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

// 캐시 키와 만료 시간 (1시간)
const CACHE_KEY = 'recentArticles';
const CACHE_EXPIRY = 1 * 60 * 60 * 1000; // 1시간 (밀리초)

const RecentArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentArticles = async () => {
            try {
                const response = await axiosInstance.get('/article/recent');
                const data = response.data;
                const now = new Date().getTime();
                // 캐시에 저장
                localStorage.setItem(CACHE_KEY, JSON.stringify({ data, expiry: now + CACHE_EXPIRY }));
                setArticles(data);
            } catch (error) {
                console.error('Failed to fetch recent articles', error);
            }
        };

        // 캐시에서 데이터 가져오기
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, expiry } = JSON.parse(cached);
            if (new Date().getTime() < expiry) {
                setArticles(data);
            } else {
                fetchRecentArticles();
            }
        } else {
            fetchRecentArticles();
        }
    }, []);

    const handleOpen = (article: Article) => {
        navigate(`/article/${article.id}`, { state: { article } }); // 네비게이트 함수를 사용하여 기사 상세 페이지로 이동
    };

    const getRandomArticles = (articles: Article[], count: number) => {
        const shuffled = [...articles].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const randomArticles = getRandomArticles(articles, 6);

    return (
        <Box sx={{ padding: 2, backgroundColor: '#1f2a3c' }}>
            <Typography variant="h5" color="white" align="center" marginBottom={1}>Recent Articles</Typography>
            <Box sx={{ marginBottom: 3 }} /> {/* Typography와 카드 사이에 간격 추가 */}
            <Grid container spacing={2}>
                {randomArticles.map(article => (
                    <Grid item xs={12} sm={6} md={4} key={article.id} onClick={() => handleOpen(article)}>
                        <Card sx={{ height: '25rem', display: 'flex', flexDirection: 'column', backgroundColor: '#152238', color: 'white' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={article.imgUrls[0] || 'https://via.placeholder.com/150'}
                                alt={article.title}
                                sx={{ marginBottom: 2, paddingBottom: 0 }} // 사진과 글 사이에 여백
                            />
                            <CardContent sx={{ paddingTop: 0, marginBottom: 0 }}>
                                <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>{article.title}</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1 }}>
                                    <CategoryChip category={article.category}/>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        {article.tags.slice(0, 2).map(tag => (
                                            <Chip key={tag.id} label={tag.name} sx={{ mr: 1, mb: 1, color: 'white', backgroundColor: '#3f51b5', fontSize: '0.875rem' }} />
                                        ))}
                                    </Box>
                                </Box>
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
