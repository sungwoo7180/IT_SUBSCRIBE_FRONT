import React, { useState, useEffect } from 'react';
import { List, IconButton, Typography, Box, Avatar, Snackbar, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, MenuItem, Menu, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { ReportProblemOutlined as ReportIcon} from '@mui/icons-material';
import { styled } from '@mui/system';
import { Edit as EditIcon, Delete as DeleteIcon, Share as ShareIcon, ThumbUp as ThumbUpIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
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

const apiUrl = process.env.REACT_APP_API_URL;

const CommentFormContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginTop: '1rem',
    gap: '1rem',
});

const CommentFormAvatar = styled(Avatar)({
    width: 40,
    height: 40,
});

// const CommentsContainer = styled(Box)({
//     marginTop: 16,
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: '#1f2a3c',
//     color: 'white',
//     border: '1px solid white',
// });

// const CommentListItem = styled(ListItem)({
//     marginBottom: 16,
//     alignItems: 'flex-start',
// });

// const CommentContentBox = styled(Box)({
//     flex: 1,
//     marginTop: '0.5rem',
// });

// const CommentMetaBox = styled(Box)({
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
// });

const CommentNickname = styled(Typography)({
    fontWeight: 'bold',
    color: 'white',
});

const CommentTimestamp = styled(Typography)({
    marginLeft: 16,
    color: 'gray',
});

// const CommentDivider = styled(Divider)({
//     borderColor: 'white',
// });

const CommentTextField = styled(TextField)({
    marginTop: 16,
    input: {
        color: 'white',
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "white"
        },
        "&:hover fieldset": {
            borderColor: "white"
        },
        "&.Mui-focused fieldset": {
            borderColor: "white"
        }
    },
    "& .MuiInputLabel-root": {
        color: "white"
    }
});

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

// const SubmitButton = styled(Button)({
//     marginTop: 8,
// });

interface ReportReason {
    name: string;
    description: string;
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
    const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
    const [openReportModal, setOpenReportModal] = useState<boolean>(false);
    const [reportReasons, setReportReasons] = useState<ReportReason[]>([]);
    const [selectedComment, setSelectedComment] = useState<number | null>(null);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
    const [openReplies, setOpenReplies] = useState<{ [key: number]: boolean }>({});
    const [replyingTo, setReplyingTo] = useState<{ id: number | null, isReply: boolean | null }>({ id: null, isReply: null });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [anchorEl, setAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});


    useEffect(() => {
        if (openReportModal) {
            axiosInstance.get('${apiUrl}/api/enum-list/comment-report-reasons')
                .then(response => {
                    setReportReasons(response.data);
                })
                .catch(error => {
                    console.error('Failed to fetch report reasons:', error);
                });
        }
    }, [openReportModal]);


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

    // const handleCommentSubmit = () => {
    //     if (newComment.trim()) {
    //         onAddComment(newComment.trim());
    //         setNewComment('');
    //     }
    // };

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
            const response = await axiosInstance.get(`${apiUrl}/api/comment/${commentId}/replies`);
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
            await axiosInstance.delete(`${apiUrl}/api/comment/reply/${replyId}`);
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

    const handleLikeToggle = (commentId: number) => {
        setLiked((prevLiked) => ({
            ...prevLiked,
            [commentId]: !prevLiked[commentId],
        }));
    };

    const handleReportClick = (commentId: number) => {
        setSelectedComment(commentId);
        setOpenReportModal(true);
    };

    const handleReportModalClose = () => {
        setOpenReportModal(false);
        setSelectedReason('');
    };

    const handleReportReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedReason(event.target.value);
    };

    const handleReportSubmit = () => {
        if (selectedComment !== null && selectedReason) {
            const reportData = {
                commentId: selectedComment,
                reason: selectedReason,
            };
            axiosInstance.post(`${apiUrl}/api/comment/${selectedComment}/report`, reportData)
                .then(response => {
                    setOpenReportModal(false);
                    setOpenConfirmationModal(true);
                })
                .catch(error => {
                    console.error('Failed to submit report:', error);
                });
        }
    };

    const handleConfirmationModalClose = () => {
        setOpenConfirmationModal(false);
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
                                            <MenuItem onClick={() => handleReportClick(comment.id)} style={{ color: 'black' }}>
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
            {/* 신고 모달 */}
            <Dialog
                open={openReportModal}
                onClose={handleReportModalClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1f2a3c',
                        color: 'white',
                        borderRadius: '12px'
                    },
                }}
            >
                <DialogTitle sx={{ bgcolor: '#1f2a3c', color: 'white', borderRadius: '12px 12px 0 0' }}>
                    Select a report reason
                </DialogTitle>
                <DialogContent sx={{ bgcolor: '#1f2a3c', color: 'white' }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ color: 'white' }}>What's going on?</FormLabel>
                        <RadioGroup
                            aria-label="report-reason"
                            name="report-reason"
                            value={selectedReason}
                            onChange={handleReportReasonChange}
                        >
                            {reportReasons.map((reason) => (
                                <FormControlLabel
                                    key={reason.name}
                                    value={reason.name}
                                    control={<Radio sx={{ color: 'white' }} />}
                                    label={reason.description}
                                    sx={{ color: 'white' }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#1f2a3c', color: 'white', borderRadius: '0 0 12px 12px' }}>
                    <Button onClick={handleReportModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleReportSubmit} color="primary" disabled={!selectedReason}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Modal */}
            <Dialog
                open={openConfirmationModal}
                onClose={handleConfirmationModalClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1f2a3c',
                        color: 'white',
                        borderRadius: '12px'
                    },
                }}
            >
                <DialogTitle sx={{ bgcolor: '#1f2a3c', color: 'white', borderRadius: '12px 12px 0 0' }}>
                    신고
                </DialogTitle>
                <DialogContent sx={{ bgcolor: '#1f2a3c', color: 'white' }}>
                    <Typography variant="body1">
                        커뮤니티에 도움을 주셔서 감사합니다
                    </Typography>
                    <div style={{ margin: '16px 0' }} />
                    <Typography variant="body1">
                        신고해 주신 내용은 유해한 콘텐츠로부터 커뮤니티를 보호하는 데 도움이 됩니다.
                    </Typography>
                    <div style={{ margin: '16px 0' }} />
                    <Typography variant="body1">
                        누군가 위급한 상황에 처했다고 생각한다면 현지 법 집행 기관에 연락하세요.
                    </Typography>
                    <div style={{ margin: '16px 0' }} />
                    <Typography variant="body1">
                        다음 단계
                    </Typography>
                    <div style={{ margin: '16px 0' }} />
                    <Typography variant="body1">
                        심각하거나 반복적인 위반에 해당할 경우 ITScribe 에서 이 댓글 작성자가 댓글을 올리지 못하도록 일시적으로 제한할 수 있습니다.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#1f2a3c', color: 'white', borderRadius: '0 0 12px 12px' }}>
                    <Button onClick={handleConfirmationModalClose} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </CommentsContainer>

    );
};

export default Comments;
