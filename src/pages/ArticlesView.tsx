import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Pagination } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import dummyArticles from '../dummyData/dummyArticles.json';
import CategoryFilter from "../components/CategoryFilter";
import MostHotArticles from "../components/MostHotArticles";

interface Article {
    id: number;
    title: string;
    content: string;
    date: string;
    category: string;
    tags: string[];
    originalUrl: string;
}

const categories = ['FrontEnd', 'BackEnd', 'AI / ML', 'Cloud', 'Security', 'VR', 'Data Science', 'Network', 'Digital Device', 'Embed', 'Mobile', 'Game'];

const ArticlesView: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoriesQueryParam = searchParams.get('categories');
    const initialCategories = categoriesQueryParam ? categoriesQueryParam.split(',') : categories;

    const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

    useEffect(() => {
        const articles = dummyArticles.filter(article =>
            selectedCategories.some(category => article.category.includes(category))
        );
        setFilteredArticles(articles);
    }, [selectedCategories]);

    useEffect(() => {
        const categoriesParam = searchParams.get('categories');
        if (categoriesParam) {
            setSelectedCategories(categoriesParam.split(','));
        } else {
            setSelectedCategories(categories);
        }
    }, [searchParams]);

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
                    <CategoryFilter selectedCategories={selectedCategories} onFilterChange={handleCategoryChange} />
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
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination
                        count={Math.ceil(filteredArticles.length / articlesPerPage)}
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
