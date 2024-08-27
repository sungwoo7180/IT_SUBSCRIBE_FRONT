import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {Box, Typography, Paper, Grid, Button, Chip, Snackbar} from '@mui/material';
import axiosInstance from '../config/AxiosConfig';
import MostHotArticles from '../components/MostHotArticles';
import Comments from '../components/Comments';
import BookmarkButton from '@mui/icons-material/Bookmark';
import CategoryChip from '../components/Button/CategoryButton';
import {Article as ArticleType, CommentType, ReplyType} from '../types/Article';

const ArticleDetail: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const location = useLocation();
    const initialArticle = location.state?.article as ArticleType;
    const [article, setArticle] = useState<ArticleType | null>(initialArticle);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);


    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axiosInstance.get(`/article/article/${articleId}`);
                setArticle(response.data);
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
                const response = await axiosInstance.get(`/api/comment/articles/${articleId}/comments`);
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

    const handleAddComment = async (comment: CommentType) => {
        try {
            const response = await axiosInstance.post('/api/comment', {
                content: comment.content,
                articleId: article?.id,
                memberId: comment.memberId,
                memberNickname: comment.memberNickname,
                profileImageURL: comment.profileImageURL,
                timestamp: new Date().toISOString(),
            });
            setComments([...comments, response.data]);
        } catch (err) {
            setError('Failed to add comment');
        }
    };

    const handleEditComment = async (comment: CommentType) => {
        try {
            const response = await axiosInstance.put(`/api/comment/${comment.id}`, {
                content: comment.content,
            });
            setComments(comments.map(c =>
                c.id === comment.id ? { ...c, content: response.data.content } : c
            ));
        } catch (err) {
            setError('Failed to edit comment');
        }
    };

    const handleEditReply = async (reply: ReplyType) => {
        try {
            const response = await axiosInstance.put(`/api/comment/reply/${reply.id}`, {
                content: reply.content,
            });
            setComments(comments.map(comment =>
                comment.id === reply.parentCommentId ? {
                    ...comment,
                    replies: comment.replies?.map(r => r.id === reply.id ? { ...r, content: response.data.content } : r)
                } : comment
            ));
        } catch (err) {
            setError('Failed to edit reply');
        }
    };

// 댓글 삭제 함수
    const handleDeleteComment = async (commentId: number) => {
        try {
            await axiosInstance.delete(`/api/comment/${commentId}`);
            setComments(comments.map(comment =>
                comment.id === commentId ? { ...comment, isDeleted: true, content: "삭제된 댓글입니다.", memberNickname: "익명" } : comment
            ));
            setSnackbarMessage("댓글이 성공적으로 삭제되었습니다.");
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Failed to delete comment', err);
        }
    };

    const handleToggleLike = async (commentId: number) => {
        alert(`Comment ${commentId} liked/unliked.`);
        // 이후 실제 좋아요 토글 API 통신 로직을 추가할 수 있습니다.
    };

    const handleReportComment = async (commentId: number) => {
        alert(`Comment ${commentId} reported.`);
        // 이후 실제 API 통신 로직을 추가할 수 있습니다.
    };

    const handleAddReply = async (reply: ReplyType) => {
        try {
            const response = await axiosInstance.post(`/api/comment/${reply.parentCommentId}/reply`, {
                content: reply.content,
                parentCommentId: reply.parentCommentId,
                memberId: reply.memberId,
                memberNickname: reply.memberNickname,
                profileImageURL: reply.profileImageURL,
                timestamp: new Date().toISOString(),
            });
            setComments(comments.map(comment =>
                comment.id === reply.parentCommentId
                    ? { ...comment, replies: [...(comment.replies || []), response.data], replyCount: comment.replyCount + 1 } : comment
            ));
        } catch (err) {
            setError('Failed to add reply');
        }
    };

    if (!article || !article.content) return <p>기사를 찾을 수 없습니다.</p>;

    const formatContent = (content: string) => {
        if (!content) return '';
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
                                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: "0.5rem", marginTop: "1rem"
                                }}>
                                    <CategoryChip category={article.category} />
                                    {article.tags && article.tags.length > 0 && article.tags.map(tag => (
                                        <Chip key={tag.id} label={tag.name} sx={{ marginRight: "0.5rem", marginBottom: "0.05rem" }} />
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
                        </Box>
                        <hr />
                        <img
                            src={article.imgUrls && article.imgUrls[0] ? article.imgUrls[0] : 'https://via.placeholder.com/150'}
                            alt={article.title}
                            style={{ width: '100%', height: 'auto', maxHeight: '200rem', marginBottom: '1rem' }}
                        />
                        <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
                            <div style={{ color: '#91bad3', fontSize: '1.2rem' }}>
                                {formatContent(article.content)}
                            </div>
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" startIcon={<BookmarkButton />} sx={{ bgcolor: '#ff4081', my: 2 }}>
                        Bookmark
                    </Button>
                </Grid>
                <Grid item xs={12} md={9}>
                    {loading ? <p>Loading comments...</p> : <Comments
                        articleId={article?.id || 0}
                        comments={comments}
                        onAddComment={handleAddComment}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                        onReportComment={handleReportComment}
                        onToggleLike={handleToggleLike}
                        onAddReply={handleAddReply}
                        onEditReply={handleEditReply}
                        setComments={setComments} // 이걸 전달하고
                        setSnackbarMessage={setSnackbarMessage} // 스낵바 메세지 설정 함수 전달
                        setOpenSnackbar={setOpenSnackbar} // 스낵바 열기 설정 함수 전달
                    />}
                </Grid>
                <Grid item xs={12} md={3} sx={{ position: 'relative', top: '-100px' }}>
                    <MostHotArticles />
                </Grid>
            </Grid>
            <Snackbar
                open={openSnackbar} // 상태 값인 boolean 전달
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)} // 상태 업데이트 함수는 이벤트 핸들러로 사용
                message={snackbarMessage} // 상태 값인 string 전달
            />
        </Box>
    );
};

export default ArticleDetail;
