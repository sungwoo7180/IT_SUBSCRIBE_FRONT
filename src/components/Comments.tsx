import React, { useState } from 'react';
import { List, IconButton, Typography, Box, Avatar, TextField, Button, Divider, ListItem, Modal } from '@mui/material';
import { ReportProblemOutlined as ReportIcon, ThumbUpAltOutlined as LikeIcon, ThumbUpAlt as LikedIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import {CommentType} from "../types/Article";

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

const Comments: React.FC<{ comments: CommentType[], onAddComment: (text: string) => void, user: any }> = ({ comments, onAddComment, user }) => {
    const [newComment, setNewComment] = useState<string>('');
    const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
    const [reportOpen, setReportOpen] = useState(false);

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

    const handleReportClick = () => {
        setReportOpen(true);
    };

    const handleCloseReportModal = () => {
        setReportOpen(false);
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
                                        <IconButton size="small" sx={{ ml: 2, color: 'white' }} onClick={handleReportClick}>
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
            <Modal open={reportOpen} onClose={handleCloseReportModal}>
                <Box sx={{ ...modalStyle }}>
                    <Typography variant="h6">Report Comment</Typography>
                    <TextField
                        label="Reason for Report"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        sx={{ marginTop: '1rem' }}
                    />
                    <Button variant="contained" color="secondary" sx={{ marginTop: '1rem' }} onClick={handleCloseReportModal}>
                        Submit Report
                    </Button>
                </Box>
            </Modal>
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
