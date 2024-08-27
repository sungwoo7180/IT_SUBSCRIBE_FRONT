import React, { useState } from 'react';
import { List, IconButton, Typography, Button, MenuItem, Menu, TextField, Box, Snackbar } from '@mui/material';
import { ReportProblemOutlined as ReportIcon, Edit as EditIcon, Delete as DeleteIcon, Share as ShareIcon, ThumbUp as ThumbUpIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
    CommentsContainer,
    CommentListItem,
    CommentAvatar,
    CommentContentBox,
    CommentMetaBox,
    CommentDivider,
    SubmitButton
} from '../style/StyledComponents';
import { CommentType, ReplyType } from "../types/Article";
import ReplyInput from './ReplyInput';
import axiosInstance from "../config/AxiosConfig";

interface CommentsProps {
    articleId: number;
    comments: CommentType[];
    onAddComment: (comment: CommentType) => void;
    onToggleLike: (commentId: number) => void;
    onDeleteComment: (commentId: number) => void;
    onEditComment: (comment: CommentType) => void;
    onReportComment: (commentId: number) => void;
    onAddReply: (reply: ReplyType) => void;
    onEditReply: (reply: ReplyType) => void;
    setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
    setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Comments: React.FC<CommentsProps> = ({
                                               articleId,
                                               comments,
                                               onAddComment,
                                               onToggleLike,
                                               onEditComment,
                                               onDeleteComment,
                                               onReportComment,
                                               onAddReply,
                                               onEditReply,
                                               setComments,
                                               setSnackbarMessage,
                                               setOpenSnackbar
                                           }) => {
    const [newComment, setNewComment] = useState<string>('');
    const [openReplies, setOpenReplies] = useState<{ [key: number]: boolean }>({});
    const [replyingTo, setReplyingTo] = useState<{ id: number | null, isReply: boolean | null }>({ id: null, isReply: null });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [anchorEl, setAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});

    // 삭제 flag 렌더링 함수
    const renderComment = (comment: CommentType) => {
        return (
            <Typography variant="subtitle1" component="span">
                {comment.isDeleted ? "익명" : comment.memberNickname}
            </Typography>
        );
    };

    // 댓글 내용 변경 핸들러
    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    // 댓글 제출 핸들러
    const handleCommentSubmit = async () => {
        if (newComment.trim()) {
            const newCommentData: CommentType = {
                id: 0, // 임시 ID, 서버에서 반환된 후 수정
                content: newComment.trim(),
                articleId: articleId,
                memberId: user.id,
                memberNickname: user.nickname,
                profileImageURL: user.profileImageURL,
                likeCount: 0,
                timestamp: new Date().toISOString(),
                relativeTime: '방금 전',
                liked: false,
                replies: [],
                replyCount: 0, // 처음에는 0으로 설정
                isDeleted: false
            };
            onAddComment(newCommentData);
            setNewComment('');
        }
    };

    // 댓글 좋아요 토글 핸들러
    const handleLike = (commentId: number) => {
        onToggleLike(commentId);
    };

    // 대댓글 토글 핸들러
    const handleToggleReplies = async (commentId: number) => {
        if (openReplies[commentId]) {
            setOpenReplies(prev => ({ ...prev, [commentId]: false }));
            return;
        }
        try {
            const response = await axiosInstance.get(`/api/comment/${commentId}/replies`);
            const replies = response.data;

            setComments(comments.map((comment: CommentType) =>
                comment.id === commentId
                    ? { ...comment, replies }
                    : comment
            ));
            setOpenReplies(prev => ({ ...prev, [commentId]: true }));
        } catch (err) {
            console.error('Failed to fetch replies', err);
        }
    };

    // 메뉴 열기 핸들러
    const handleMenuOpen = (commentId: number, event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl({ ...anchorEl, [commentId]: event.currentTarget });
    };

    // 메뉴 닫기 핸들러
    const handleMenuClose = (commentId: number) => {
        setAnchorEl({ ...anchorEl, [commentId]: null });
    };

    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId: number) => {
        try {
            await onDeleteComment(commentId);
            setSnackbarMessage("댓글이 성공적으로 삭제되었습니다.");
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Failed to delete comment', err);
        }
    };

    // 대댓글 삭제 핸들러 (ArticleDetail 에서 이곳으로 이동)
    const handleDeleteReply = async (replyId: number, parentCommentId: number) => {
        try {
            await axiosInstance.delete(`/api/comment/reply/${replyId}`);
            setComments(comments.map(comment => ({
                ...comment,
                replies: comment.id === parentCommentId
                    ? comment.replies?.filter(reply => reply.id !== replyId)
                    : comment.replies
            })));
            setSnackbarMessage("대댓글이 성공적으로 삭제되었습니다.");
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Failed to delete reply', err);
        }
    };

    // 답글 클릭 핸들러
    const handleReplyClick = (commentId: number, isReply: boolean = false) => {
        setReplyingTo(prev =>
            prev.id === commentId && prev.isReply === isReply ? { id: null, isReply: null } : { id: commentId, isReply }
        );
    };

    // 답글 추가 핸들러
    const handleAddReply = (commentId: number, text: string) => {
        if (text.trim()) {
            const newReply: ReplyType = {
                id: 0,
                content: text.trim(),
                parentCommentId: commentId,
                memberId: user.id,
                memberNickname: user.nickname,
                profileImageURL: user.profileImageURL,
                likeCount: 0,
                relativeTime: '방금 전',
                liked: false,
                timestamp: new Date().toISOString()
            };
            onAddReply(newReply);
            setReplyingTo({ id: null, isReply: null });
        }
    };

    return (
        <CommentsContainer>
            <Typography variant="h6" component="div">{`Comments: ${comments.length}`}</Typography>
            <List>
                {comments.map((comment: CommentType) => (
                    <React.Fragment key={comment.id}>
                        <CommentListItem>
                            <CommentAvatar src={comment.profileImageURL} />
                            <CommentContentBox>
                                <CommentMetaBox>
                                    {renderComment(comment)}
                                    <Typography variant="caption" component="span" sx={{ marginLeft: '8px' }}>
                                        {comment.relativeTime}
                                    </Typography>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                        <IconButton size="small" sx={{ ml: 2, color: 'red' }} onClick={() => handleLike(comment.id)}>
                                            <ThumbUpIcon color={comment.liked ? 'primary' : 'inherit'} />
                                        </IconButton>
                                        {comment.likeCount > 0 && (
                                            <Typography variant="caption" component="span" sx={{ marginLeft: '4px', marginRight: '12px' }}>
                                                {comment.likeCount}
                                            </Typography>
                                        )}
                                        <IconButton size="small" sx={{ ml: 1 }} onClick={() => { }}>
                                            <ShareIcon />
                                        </IconButton>
                                        <IconButton size="small" sx={{ ml: 1 }} onClick={event => handleMenuOpen(comment.id, event)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </div>
                                    <Menu
                                        anchorEl={anchorEl[comment.id]}
                                        open={Boolean(anchorEl[comment.id])}
                                        onClose={() => handleMenuClose(comment.id)}
                                    >
                                        {comment.memberNickname === user.nickname ? (
                                            <>
                                                <MenuItem onClick={() => onEditComment(comment)} style={{ color: 'black' }}>
                                                    <EditIcon sx={{ color: 'black', marginRight: '8px' }} />
                                                    수정
                                                </MenuItem>
                                                <MenuItem onClick={() => handleDeleteComment(comment.id)} style={{ color: 'black' }}>
                                                    <DeleteIcon sx={{ color: 'black', marginRight: '8px' }} />
                                                    삭제
                                                </MenuItem>
                                            </>
                                        ) : (
                                            <MenuItem onClick={() => onReportComment(comment.id)} style={{ color: 'black' }}>
                                                <ReportIcon sx={{ marginRight: '8px' }} />
                                                신고
                                            </MenuItem>
                                        )}
                                    </Menu>
                                </CommentMetaBox>
                                <Typography variant="body2" component="div">
                                    {comment.isDeleted ? "삭제된 댓글입니다." : comment.content}
                                </Typography>
                                <div>
                                    <Button variant="text" color="primary" onClick={() => handleReplyClick(comment.id, false)}>
                                        {replyingTo.id === comment.id && replyingTo.isReply === false ? '답글 취소' : '답글 달기'}
                                    </Button>
                                </div>
                                {replyingTo.id === comment.id && replyingTo.isReply === false && (
                                    <ReplyInput
                                        onAddReply={text => handleAddReply(comment.id, `@${comment.memberNickname} ${text}`)}
                                        onCancel={() => setReplyingTo({ id: null, isReply: null })}
                                    />
                                )}
                                {comment.replyCount > 0 && (
                                    <div>
                                        <Button variant="text" color="primary" onClick={() => handleToggleReplies(comment.id)}>
                                            {openReplies[comment.id] ? (
                                                <>
                                                    <ExpandLessIcon sx={{ verticalAlign: 'middle' }} />
                                                    {` 대댓글 ${comment.replyCount}개`}
                                                </>
                                            ) : (
                                                <>
                                                    <ExpandMoreIcon sx={{ verticalAlign: 'middle' }} />
                                                    {` 대댓글 ${comment.replyCount}개`}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                                {openReplies[comment.id] && comment.replies && (
                                    <List sx={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
                                        {comment.replies.map((reply: ReplyType) => (
                                            <React.Fragment key={reply.id}>
                                                <CommentListItem>
                                                    <CommentAvatar src={reply.profileImageURL} />
                                                    <CommentContentBox>
                                                        <CommentMetaBox>
                                                            <Typography variant="subtitle1" component="span">
                                                                {reply.memberNickname}
                                                            </Typography>
                                                            <Typography variant="caption" component="span" sx={{ marginLeft: '8px' }}>
                                                                {reply.relativeTime}
                                                            </Typography>
                                                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                                                <IconButton size="small" sx={{ ml: 2, color: 'red' }} onClick={() => handleLike(reply.id)}>
                                                                    <ThumbUpIcon color={reply.liked ? 'primary' : 'inherit'} />
                                                                </IconButton>
                                                                {reply.likeCount > 0 && (
                                                                    <Typography variant="caption" component="span" sx={{ marginLeft: '4px', marginRight: '12px' }}>
                                                                        {reply.likeCount}
                                                                    </Typography>
                                                                )}
                                                                <IconButton size="small" sx={{ ml: 1 }} onClick={() => { }}>
                                                                    <ShareIcon />
                                                                </IconButton>
                                                                <IconButton size="small" sx={{ ml: 1 }} onClick={event => handleMenuOpen(reply.id, event)}>
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                                <Menu
                                                                    anchorEl={anchorEl[reply.id]}
                                                                    open={Boolean(anchorEl[reply.id])}
                                                                    onClose={() => handleMenuClose(reply.id)}
                                                                >
                                                                    {reply.memberNickname === user.nickname ? (
                                                                        <>
                                                                            <MenuItem onClick={() => onEditReply(reply)} style={{ color: 'black' }}>
                                                                                <EditIcon sx={{ color: 'black', marginRight: '8px' }} />
                                                                                수정
                                                                            </MenuItem>
                                                                            <MenuItem onClick={() => handleDeleteReply(reply.id, reply.parentCommentId)} style={{ color: 'black' }}>
                                                                                <DeleteIcon sx={{ color: 'black', marginRight: '8px' }} />
                                                                                삭제
                                                                            </MenuItem>
                                                                        </>
                                                                    ) : (
                                                                        <MenuItem onClick={() => onReportComment(reply.id)} style={{ color: 'black' }}>
                                                                            <ReportIcon sx={{ marginRight: '8px' }} />
                                                                            신고
                                                                        </MenuItem>
                                                                    )}
                                                                </Menu>
                                                            </div>
                                                        </CommentMetaBox>
                                                        <Typography variant="body2" component="div">
                                                            {reply.content}
                                                        </Typography>
                                                        <Button variant="text" color="primary" onClick={() => handleReplyClick(reply.id, true)}>
                                                            {replyingTo.id === reply.id && replyingTo.isReply === true ? '답글 취소' : '답글 달기'}
                                                        </Button>
                                                        {replyingTo.id === reply.id && replyingTo.isReply === true && (
                                                            <ReplyInput
                                                                onAddReply={text => handleAddReply(reply.parentCommentId, `@${reply.memberNickname} ${text}`)}
                                                                onCancel={() => setReplyingTo({ id: null, isReply: null })}
                                                            />
                                                        )}
                                                    </CommentContentBox>
                                                </CommentListItem>
                                                <CommentDivider />
                                            </React.Fragment>
                                        ))}
                                    </List>
                                )}
                            </CommentContentBox>
                        </CommentListItem>
                        <CommentDivider />
                    </React.Fragment>
                ))}
            </List>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <CommentAvatar src={user.profileImageURL} />
                <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    multiline
                    maxRows={4}
                    value={newComment}
                    onChange={handleCommentChange}
                    sx={{
                        marginLeft: '10px',
                        backgroundColor: '#2b2b2b',
                        color: '#FFF',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#FFF',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#FFF',
                        },
                        '& .MuiOutlinedInput-input': {
                            color: '#FFF',
                        },
                    }}
                />
                <SubmitButton variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ marginLeft: '10px' }}>
                    Submit
                </SubmitButton>
            </Box>
        </CommentsContainer>
    );
};

export default Comments;
