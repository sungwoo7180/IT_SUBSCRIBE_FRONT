import React, { useState, useEffect } from 'react';
import { Box, Typography, CardContent, Chip, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/AxiosConfig';
import { CommonCard, LoadingBox } from '../style/StyledComponents';
import CommonHeader from "./CommonHeader"; // 공통 스타일 컴포넌트 가져오기

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
const CACHE_TIME = 60 * 60 * 1000; // 1 시간

const MostHotArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
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

    return (
        loading ? (
            <LoadingBox>
                <CircularProgress />
            </LoadingBox>
        ) : (
            <Box sx={{ padding: 2, backgroundColor: '#1f2a3c', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: 'auto' }}>
                <CommonHeader title="Most Hot Articles" />
                <Grid container spacing={0.1} sx={{ flex: 1 }}>
                    {articles.map((article, index) => (
                        <Grid item xs={12} key={article.id}>
                            <CommonCard onClick={() => handleOpenArticle(article)} sx={{ marginBottom: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                        #{index + 1} {article.title}
                                    </Typography>
                                    <Box sx={{ marginTop: 1 }}>
                                        <Chip label={article.category.name} color="primary" />
                                    </Box>
                                </CardContent>
                            </CommonCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        )
    );
};

export default MostHotArticles;
