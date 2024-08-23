import React, { useState, useEffect } from 'react';
import { List, IconButton, Typography, Box, Avatar, TextField, Button, Divider, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { ReportProblemOutlined as ReportIcon, ThumbUpAltOutlined as LikeIcon, ThumbUpAlt as LikedIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import {CommentType} from "../types/Article";
import axiosInstance from '../config/AxiosConfig';

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

const CommentsContainer = styled(Box)({
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1f2a3c',
    color: 'white',
    border: '1px solid white',
});

const CommentListItem = styled(ListItem)({
    marginBottom: 16,
    alignItems: 'flex-start',
});

const CommentContentBox = styled(Box)({
    flex: 1,
    marginTop: '0.5rem',
});

const CommentMetaBox = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const CommentNickname = styled(Typography)({
    fontWeight: 'bold',
    color: 'white',
});

const CommentTimestamp = styled(Typography)({
    marginLeft: 16,
    color: 'gray',
});

const CommentDivider = styled(Divider)({
    borderColor: 'white',
});

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

const SubmitButton = styled(Button)({
    marginTop: 8,
});

interface ReportReason {
    name: string;
    description: string;
}

const Comments: React.FC<{ comments: CommentType[], onAddComment: (text: string) => void, user: any }> = ({ comments, onAddComment, user }) => {
    const [newComment, setNewComment] = useState<string>('');
    const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
    const [openReportModal, setOpenReportModal] = useState<boolean>(false);
    const [reportReasons, setReportReasons] = useState<ReportReason[]>([]);
    const [selectedComment, setSelectedComment] = useState<number | null>(null);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

    useEffect(() => {
        if (openReportModal) {
            axiosInstance.get('/enum-list/comment-report-reasons')
                .then(response => {
                    setReportReasons(response.data);
                })
                .catch(error => {
                    console.error('Failed to fetch report reasons:', error);
                });
        }
    }, [openReportModal]);


    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
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
            axiosInstance.post(`/api/comment/${selectedComment}/report`, reportData)
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
            <Typography variant="h6">{`Comments: ${comments.length}`}</Typography>
            <List>
                {comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                        <CommentListItem>
                            <CommentFormAvatar src={comment.profileImageURL} />
                            <CommentContentBox>
                                <CommentMetaBox>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CommentNickname variant="subtitle1">
                                            {comment.memberNickname}
                                        </CommentNickname>
                                        <CommentTimestamp variant="caption">
                                            {comment.timestamp}
                                        </CommentTimestamp>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton size="small" sx={{ ml: 2, color: 'white' }} onClick={() => handleLikeToggle(comment.id)}>
                                            {liked[comment.id] ? <LikedIcon sx={{ color: 'red' }} /> : <LikeIcon />}
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            sx={{ ml: 2, color: 'white' }}
                                            onClick={() => handleReportClick(comment.id)}
                                        >
                                            <ReportIcon />
                                        </IconButton>
                                    </Box>
                                </CommentMetaBox>
                                <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
                                    {comment.content}
                                </Typography>
                            </CommentContentBox>
                        </CommentListItem>
                        <CommentDivider />
                    </React.Fragment>
                ))}
            </List>
            <CommentFormContainer>
                <CommentFormAvatar src={user.avatarUrl || "https://via.placeholder.com/50"} />
                <Box sx={{ flexGrow: 1 }}>
                    <CommentTextField
                        label="Add a comment"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={4}
                        value={newComment}
                        onChange={handleCommentChange}
                        sx={{
                            overflow: 'hidden',
                            '& textarea': {
                                resize: 'none',
                                color: 'white',
                            }
                        }}
                    />
                </Box>
                <SubmitButton
                    variant="contained"
                    color="primary"
                    onClick={handleCommentSubmit}
                    sx={{ marginLeft: '1rem' }}
                >
                    Submit
                </SubmitButton>
            </CommentFormContainer>

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
                        심각하거나 반복적인 위반에 해당할 경우 ITScribe에서 이 댓글 작성자가 댓글을 올리지 못하도록 일시적으로 제한할 수 있습니다.
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

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default Comments;
