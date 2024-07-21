import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const CACHE_KEY = 'mostHotArticles';
const CACHE_TIME = 1 * 60 * 60 * 1000; // 1 시간

const MostHotArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        // 매번 로딩이 너무 느려서 캐싱을 적용
        const fetchHotArticles = async () => {
            const cachedData = localStorage.getItem(CACHE_KEY);
            const cacheExpiry = localStorage.getItem(`${CACHE_KEY}_expiry`);

            if (cachedData && cacheExpiry && new Date().getTime() < parseInt(cacheExpiry)) {
                setArticles(JSON.parse(cachedData));
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get('/rank/top-articles');
                setArticles(response.data);
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
                localStorage.setItem(`${CACHE_KEY}_expiry`, (new Date().getTime() + CACHE_TIME).toString());
            } catch (error) {
                console.error('Failed to fetch hot articles', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotArticles();
    }, []);

    const handleOpenArticle = (article: Article) => {
        navigate(`/article/${article.id}`, { state: { article } });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2, backgroundColor: '#1f2a3c' }}>
            <Typography variant="h5" gutterBottom color="white" align="center">Most Hot Articles</Typography>
            <Box sx={{ marginBottom: 3 }} /> {/* Typography와 카드 사이에 간격 추가 */}
            <Grid container spacing={0.1}> {/* Grid 컨테이너를 사용하여 카드 사이의 간격을 조절 */}
                {articles.map((article, index) => (
                    <Grid item xs={12} key={article.id}> {/* Grid 아이템을 사용하여 각 카드를 배치 */}
                        <Card sx={{ marginBottom: 1.2, backgroundColor: '#152238', color: 'white' }} onClick={() => handleOpenArticle(article)}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>{/* 글자 크기 조절 */}
                                    #{index + 1} {article.title}
                                </Typography>
                                <Box sx={{ marginTop: 1 }}>
                                    <Chip label={article.category.name} color="primary" />
                                    {/*{article.tags.map((tag, index) => (*/}
                                    {/*    <Chip key={index} label={tag.name} sx={{ marginLeft: 1, backgroundColor: '#2e3b4e', color: 'white' }} />*/}
                                    {/*))}*/}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MostHotArticles;
