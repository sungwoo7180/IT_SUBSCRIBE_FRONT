import React, { useState, useEffect } from 'react';
import {Box, CardMedia, Grid, Pagination} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/AxiosConfig';
import MostHotArticles from "../components/MostHotArticles";
import categories from '../data/Categories';
import CategoryChip from '../components/Button/CategoryButton';
import { Article } from '../types/Article';
import { CommonGridContainer, CommonCardMedia, CommonTypography, CommonChip, CommonCircularProgress, LoadingBox, CategoryTagBox, TagsContainer, ArticleCard } from '../style/StyledComponents';

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
                console.log("불러오기 진입")
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
        <CommonGridContainer>
            {loading ? (
                <LoadingBox>
                    <CommonCircularProgress />
                </LoadingBox>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            {filteredArticles.map((article) => (
                                <Grid item xs={12} sm={6} md={4} key={article.id} onClick={() => handleOpenArticle(article)}>
                                    <ArticleCard>
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
                                            <Box sx={{ mt: 1 }}>
                                                <CategoryTagBox>
                                                    <CategoryChip category={article.category} />
                                                    <TagsContainer>
                                                        {article.tags.map(tag => (
                                                            <CommonChip key={tag.id} label={tag.name} />
                                                        ))}
                                                    </TagsContainer>
                                                </CategoryTagBox>
                                            </Box>
                                        </Box>
                                    </ArticleCard>
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

export default ArticlesView;
