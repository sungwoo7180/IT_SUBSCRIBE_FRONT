import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, Chip } from '@mui/material';
import axiosInstance from '../config/AxiosConfig';
import MostHotArticles from '../components/MostHotArticles';
import Comments from '../components/Comments';
import CategoryChip from '../components/Button/CategoryButton'; // CategoryChip 임포트
import Bookmark from '../components/Bookmark';
import { Article as ArticleType, CommentType } from '../types/Article';

const ArticleDetail: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const location = useLocation();
    const initialArticle = location.state?.article as ArticleType;
    const [article, setArticle] = useState<ArticleType | null>(initialArticle);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // 사용자 정보 가져오기

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (!initialArticle) {
                    const response = await axiosInstance.get(`/article/article/${articleId}`);
                    console.log(user);
                    setArticle(response.data);
                }
            } catch (err) {
                setError('Failed to fetch article');
            }
        };

        const incrementCount = async () => {
            try {
                await axiosInstance.post(`/rank/increment-article-count/${articleId}`);
            } catch (err) {
                console.error('Failed to increment article count', err);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axiosInstance.get(`/api/comment/article/${articleId}`);
                setComments(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch comments');
                setLoading(false);
            }
        };

        if (!initialArticle) {
            fetchArticle();
        }
        incrementCount();
        fetchComments();
    }, [articleId, initialArticle]);

    const handleAddComment = async (text: string) => {
        try {
            const response = await axiosInstance.post('/api/comment', {
                content: text,
                articleId: article?.id
            });
            setComments([...comments, response.data]);
        } catch (err) {
            setError('Failed to add comment');
        }
    };

    if (!article) return <p>기사를 찾을 수 없습니다.</p>;

    const formatContent = (content: string) => {
        const segments = content.split('.');
        const lines = [];
        for (let i = 0; i < segments.length; i += 5) {
            lines.push(segments.slice(i, i + 5).join('.') + '.');
        }
        return lines.join('\n\n');
    };

    return (
        <Box sx={{
            p: 3,
            backgroundImage: 'url(/Background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh'
        }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                    <Paper elevation={3} sx={{ padding: '20px', color: 'white', bgcolor: '#1f2a3c' }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h4" gutterBottom sx={{ marginBottom: '2rem' }}>
                                    {article.title}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: "0.5rem",
                                    marginTop: "1rem"
                                }}>
                                    <CategoryChip category={article.category} />
                                    {article.tags?.map(tag => (
                                        <Chip key={tag.id} label={tag.name}
                                              sx={{ marginRight: "0.5rem", marginBottom: "0.05rem" }} />
                                    ))}
                                </Box>
                            </Box>
                            <Typography component="a" href={article.source} target="_blank" rel="noopener noreferrer"
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: 'white',
                                            textDecoration: 'none',
                                            marginLeft: 'auto'
                                        }}>
                                {article.source}
                            </Typography>
                            {/* bookmark mui import 로 해결 */}
                            <Bookmark articleId={article.id} />
                        </Box>
                        <hr />
                        <img src={article.imgUrls[0] || 'https://via.placeholder.com/150'} alt={article.title}

                             style={{width: '100%', height: 'auto', maxHeight: '200rem', marginBottom: `1rem`}}/>
                        <hr/>
                        <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
                            <div style={{ color: '#91bad3', fontSize: '1.2rem' }}>
                                {formatContent(article.content)}
                            </div>

                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    {loading ? (
                        <Typography>Loading comments...</Typography>
                    ) : (
                        <Box sx={{ width: '100%', bgcolor: '#1f2a3c', p: 2, borderRadius: 2 }}>
                            <Comments comments={comments} onAddComment={handleAddComment} user={user} />
                        </Box>
                    )}
                </Grid>
                <Grid item xs={12} md={3} sx={{ position: 'relative', top: '-100px' }}>
                    <MostHotArticles />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ArticleDetail;
