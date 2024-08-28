import React, { useState, useEffect } from 'react';
import { Box, Grid, Pagination, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MostHotArticles from '../components/MostHotArticles';
import axiosInstance from '../config/AxiosConfig';
import { Article } from '../types/Article';
import { CommonGridContainer, CommonCard, CommonTypography, CommonChip, CommonCircularProgress, LoadingBox } from '../style/StyledComponents';

const BookmarkListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/api/bookmark/articles', {
                    params: {
                        page: currentPage - 1,
                        size: 12
                    }
                });

                const { content, totalPages } = response.data;
                setArticles(content);
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Failed to fetch articles', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [currentPage]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleOpenArticle = (article: Article) => {
        navigate(`/article/${article.id}`, { state: { article } });
    };

    return (
        <CommonGridContainer>
            {loading ? (
                <LoadingBox>
                    <CommonCircularProgress />
                </LoadingBox>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            {articles.map((article) => (
                                <Grid item xs={12} sm={6} md={4} key={article.id} onClick={() => handleOpenArticle(article)}>
                                    <CommonCard>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={article.imgUrls[0] || 'https://via.placeholder.com/150'}
                                            alt={article.title}
                                            sx={{
                                                marginBottom: '2rem',
                                                paddingBottom: 0,
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <Box sx={{ padding: '1rem' }}>
                                            <CommonTypography variant="h6" sx={{ marginBottom: '1rem' }}>
                                                {article.title}
                                            </CommonTypography>
                                            <CommonTypography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                {article.content}
                                            </CommonTypography>
                                            <CommonTypography variant="caption">
                                                {new Date(article.postDate).toLocaleDateString()}
                                            </CommonTypography>
                                            <CommonTypography variant="caption" sx={{ marginLeft: '0.5rem' }}>
                                                {article.category.name}
                                            </CommonTypography>
                                            <Box sx={{ mt: 1 }}>
                                                {article.tags.map(tag => (
                                                    <CommonChip key={tag.id} label={tag.name} sx={{ mr: 1, mb: 1 }} />
                                                ))}
                                            </Box>
                                        </Box>
                                    </CommonCard>
                                </Grid>
                            ))}
                        </Grid>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            sx={{ mt: 2, display: 'flex', justifyContent: 'center', '& .MuiPaginationItem-root': { color: 'white' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <MostHotArticles />
                    </Grid>
                </Grid>
            )}
        </CommonGridContainer>
    );
};

export default BookmarkListPage;
