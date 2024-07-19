// src/pages/ArticleDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import axiosInstance from '../config/AxiosConfig';
import MostHotArticles from '../components/MostHotArticles';
import Comments from '../components/Comments';
import BookmarkButton from '@mui/icons-material/Bookmark';

interface CommentType {
    id: number;
    content: string;
    articleId: number;
    memberId: number;
    memberNickname: string;
    profileImageURL: string;
    timestamp: string;
}


interface ArticleType {
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
    imgUrls: string[];
}

const ArticleDetail: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const location = useLocation();
    const initialArticle = location.state?.article as ArticleType;
    const [article, setArticle] = useState<ArticleType | null>(initialArticle);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axiosInstance.get(`/comment/article/${articleId}`);
                setComments(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch comments');
                setLoading(false);
            }
        };

        fetchComments();
    }, [articleId]);

    const handleAddComment = async (text: string) => {
        try {
            const response = await axiosInstance.post('/comment', {
                content: text,
                articleId: article?.id,
                memberId: 1, // 예시로 회원 ID를 하드코딩합니다. 실제 구현에서는 현재 로그인한 사용자의 ID를 사용해야 합니다.
                memberNickname: 'User', // 예시로 사용자 이름을 하드코딩합니다. 실제 구현에서는 현재 로그인한 사용자의 이름을 사용해야 합니다.
                profileImageURL: 'https://via.placeholder.com/50', // 예시로 사용자 이미지 URL을 하드코딩합니다. 실제 구현에서는 현재 로그인한 사용자의 이미지 URL을 사용해야 합니다.
                timestamp: new Date().toISOString(), // 예시로 현재 시간을 사용합니다.
            });
            setComments([...comments, response.data]);
        } catch (err) {
            setError('Failed to add comment');
        }
    };

    if (!article) return <p>기사를 찾을 수 없습니다.</p>;

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
                        <Typography variant="h4" gutterBottom>
                            {article.title}
                        </Typography>
                        <img src={article.imgUrls[0] || 'https://via.placeholder.com/150'} alt={article.title} style={{ width: '100%', height: 'auto', maxHeight: '300px' }} />
                        <Typography variant="subtitle1" gutterBottom>
                            {`Category: ${article.category.name}`}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            {`Tags: ${article.tags.map(tag => tag.name).join(', ')}`}
                        </Typography>
                        <Typography paragraph>
                            {article.content}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" startIcon={<BookmarkButton />} sx={{ bgcolor: '#ff4081', my: 2 }}>
                        Bookmark
                    </Button>
                </Grid>
                <Grid item xs={12} md={9}>
                    {loading ? <p>Loading comments...</p> : <Comments comments={comments} onAddComment={handleAddComment} />}
                </Grid>
                <Grid item xs={12} md={3}>
                    <MostHotArticles />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ArticleDetail;
