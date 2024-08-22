import React, { useState } from 'react';
import { List, IconButton, Typography } from '@mui/material';
import { ReportProblemOutlined as ReportIcon } from '@mui/icons-material';
import {
    CommentsContainer,
    CommentListItem,
    CommentAvatar,
    CommentContentBox,
    CommentMetaBox,
    CommentNickname,
    CommentTimestamp,
    CommentDivider,
    CommentTextField,
    SubmitButton
} from '../style/StyledComponents';

interface CommentType {
    id: number;
    content: string;
    articleId: number;
    memberId: number;
    memberNickname: string;
    profileImageURL: string;
    timestamp: string;
}

interface CommentsProps {
    comments: CommentType[];
    onAddComment: (text: string) => void; // 댓글 추가 함수
}

const Comments: React.FC<CommentsProps> = ({ comments, onAddComment }) => {
    const [newComment, setNewComment] = useState<string>('');

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            onAddComment(newComment.trim()); // 댓글 추가
            setNewComment(''); // 입력 필드 초기화
        }
    };

    return (
        <CommentsContainer>
            <Typography variant="h6" component="div">{`Comments: ${comments.length}`}</Typography>
            <List>
                {comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                        <CommentListItem>
                            <CommentAvatar src={comment.profileImageURL} />
                            <CommentContentBox>
                                <CommentMetaBox>
                                    <Typography variant="subtitle1" component="span">
                                        {comment.memberNickname}
                                    </Typography>
                                    <Typography variant="caption" component="span">
                                        {comment.timestamp}
                                    </Typography>
                                    <IconButton size="small" sx={{ ml: 2, color: 'white' }}>
                                        <ReportIcon />
                                    </IconButton>
                                </CommentMetaBox>
                                <Typography variant="body2" component="div">
                                    {comment.content}
                                </Typography>
                            </CommentContentBox>
                        </CommentListItem>
                        <CommentDivider />
                    </React.Fragment>
                ))}
            </List>
            <CommentTextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={handleCommentChange}
            />
            <SubmitButton
                variant="contained"
                color="primary"
                onClick={handleCommentSubmit}
            >
                Submit
            </SubmitButton>
        </CommentsContainer>
    );
};

export default Comments;
