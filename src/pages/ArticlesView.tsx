import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Pagination } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/AxiosConfig';
import MostHotArticles from "../components/MostHotArticles";
import categories from '../data/Categories';

interface Article {
    id: number;
    title: string;
    content: string;
    postDate: string;
    category: {
        id: number;
        name: string;
    };
    source: string;
    tags: {
        id: number;
        name: string;
    }[];
}

const ArticlesView: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoriesQueryParam = searchParams.get('categories');
    const initialCategories = categoriesQueryParam ? categoriesQueryParam.split(',') : categories.map(c => c.name);

    const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const categoryIds = categories
                    .filter(category => selectedCategories.includes(category.name))
                    .map(category => category.id);

                const response = await axiosInstance.get(`/article/category/${categoryIds[0]}`, {
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
            }
        };

        fetchArticles();
    }, [selectedCategories, currentPage]);

    const handleCategoryChange = (newCategories: string[]) => {
        setSelectedCategories(newCategories);
        if (newCategories.length === categories.length) {
            navigate("/all-articles", { replace: true });
        } else {
            const queryParams = newCategories.length > 0 ? `categories=${encodeURIComponent(newCategories.join(','))}` : '';
            navigate(`/all-articles?${queryParams}`, { replace: true });
        }
        setCurrentPage(1);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        setSearchParams({ categories: selectedCategories.join(','), page: page.toString() }, { replace: true });
    };

    const handleOpenArticle = (articleId: number) => {
        navigate(`/article/${articleId}`);
    };

    const articlesPerPage = 12;
    const displayedArticles = filteredArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);

    return (
        <Box sx={{ flexGrow: 1, padding: 3, backgroundImage: 'url(Background.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    {/*<CategoryFilter selectedCategories={selectedCategories} onFilterChange={handleCategoryChange} />*/}
                    <Grid container spacing={2}>
                        {displayedArticles.map((article) => (
                            <Grid item xs={12} sm={6} md={4} key={article.id} onClick={() => handleOpenArticle(article.id)}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#152238', color: 'white' }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={'https://via.placeholder.com/150'}
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
                                        <Typography variant="caption" sx={{ color: 'white' }}>
                                            {article.category.name}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            {article.tags.map(tag => (
                                                <Chip key={tag.id} label={tag.name} sx={{ mr: 1, mb: 1, color: 'white', backgroundColor: '#3f51b5' }} />
                                            ))}
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
        </Box>
    );
};

export default ArticlesView;
