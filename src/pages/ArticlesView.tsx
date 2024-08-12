import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Pagination, CircularProgress } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/AxiosConfig';
import MostHotArticles from "../components/MostHotArticles";
import categories from '../data/Categories';
import CategoryChip from '../components/Button/CategoryButton';
import { Article } from '../types/Article';

const ArticlesView: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoriesQueryParam = searchParams.get('categories');
    const initialCategories = categoriesQueryParam ? decodeURIComponent(categoriesQueryParam).split(',') : [];

    const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const categoryIds = categories
                    .filter(category => selectedCategories.includes(category.name))
                    .map(category => category.id);

                const response = await axiosInstance.get(`/article/category/${categoryIds.join(',')}`, {
                    params: {
                        page: currentPage - 1,
                        size: 12
                    }
                });

                const { content, totalPages } = response.data;
                setFilteredArticles(content);
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Failed to fetch articles', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [selectedCategories, currentPage]);

    const handleCategoryChange = (newCategories: string[]) => {
        setSelectedCategories(newCategories);
        setCurrentPage(1);
        const queryParams = newCategories.length > 0 ? `categories=${encodeURIComponent(newCategories.join(','))}` : '';
        setSearchParams({ categories: newCategories.join(','), page: '1' });
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        setSearchParams({ categories: selectedCategories.join(','), page: page.toString() });
    };

    const handleOpenArticle = (article: Article) => {
        navigate(`/article/${article.id}`, { state: { article } });
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3, backgroundImage: 'url(/Background.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress color="inherit" />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            {filteredArticles.map((article) => (
                                <Grid item xs={12} sm={6} md={4} key={article.id} onClick={() => handleOpenArticle(article)}>
                                    <Card sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#152238', color: 'white' }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={article.imgUrls[0] || 'https://via.placeholder.com/150'}
                                            alt={article.title}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: 'white' }}>{article.title}</Typography>
                                            <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', color: 'white' }}>
                                                {article.content}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'white' }}>
                                                {new Date(article.postDate).toLocaleDateString()}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: "0.5rem"
                                                }}>
                                                    <CategoryChip category={article.category} />
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        maxHeight: '4.5rem', // 두 줄의 높이를 제한
                                                        overflow: 'hidden',
                                                        alignItems: 'center',
                                                        mt: 0.5 // 카테고리 칩과 태그 칩의 정렬을 위해 여백 추가
                                                    }}>
                                                        {article.tags.map(tag => (
                                                            <Chip key={tag.id} label={tag.name} sx={{ mr: 1, mb: 1, color: 'white', backgroundColor: '#3f51b5', height: '32px' }} />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
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
        </Box>
    );
};

export default ArticlesView;
