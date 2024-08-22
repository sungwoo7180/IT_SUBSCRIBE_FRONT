import React, { useState } from 'react';
import {List, IconButton, Typography, Button} from '@mui/material';
import { ReportProblemOutlined as ReportIcon, Share as ShareIcon, ThumbUp as ThumbUpIcon } from '@mui/icons-material';
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
    replies?: ReplyType[];
}

interface ReplyType {
    id: number;
    content: string;
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
    const [openReplies, setOpenReplies] = useState<{ [key: number]: boolean }>({}); // 대댓글 토글 상태 관리

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            onAddComment(newComment.trim()); // 댓글 추가
            setNewComment(''); // 입력 필드 초기화
        }
    };

    // 공유 버튼 클릭 시 동작
    const handleShare = () => {
        alert('댓글을 공유합니다!');
    };

    // 좋아요 버튼 클릭 시 동작
    const handleLike = (commentId: number) => {
        alert(`댓글 ${commentId}에 좋아요를 눌렀습니다.`);
    };

    // 답글 토글 버튼 클릭 시 동작
    const handleToggleReplies = (commentId: number) => {
        setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    function handleReply(id: number): void {
        throw new Error('Function not implemented.');
    }

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
                                    <IconButton size="small" sx={{ ml: 2, color: 'white' }} onClick={() => handleLike(comment.id)}>
                                        <ThumbUpIcon />
                                    </IconButton>
                                    <IconButton size="small" sx={{ ml: 1, color: 'white' }} onClick={handleShare}>
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton size="small" sx={{ ml: 1, color: 'white' }}>
                                        <ReportIcon />
                                    </IconButton>
                                </CommentMetaBox>
                                <Typography variant="body2" component="div">
                                    {comment.content}
                                </Typography>
                                <div>
                                    <Button variant="text" color="primary" onClick={() => handleReply(comment.id)}>
                                        답글 달기
                                    </Button>
                                </div>
                                <div>
                                    <Button variant="text" color="primary" onClick={() => handleToggleReplies(comment.id)}>
                                        {openReplies[comment.id] ? '댓글 숨기기' : `댓글 더보기 (${comment.replies?.length || 0})`}
                                    </Button>
                                </div>
                                {openReplies[comment.id] && comment.replies && (
                                    <List sx={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
                                        {comment.replies.map((reply) => (
                                            <React.Fragment key={reply.id}>
                                                <CommentListItem>
                                                    <CommentAvatar src={reply.profileImageURL} />
                                                    <CommentContentBox>
                                                        <CommentMetaBox>
                                                            <Typography variant="subtitle1" component="span">
                                                                {reply.memberNickname}
                                                            </Typography>
                                                            <Typography variant="caption" component="span">
                                                                {reply.timestamp}
                                                            </Typography>
                                                        </CommentMetaBox>
                                                        <Typography variant="body2" component="div">
                                                            {reply.content}
                                                        </Typography>
                                                    </CommentContentBox>
                                                </CommentListItem>
                                                <CommentDivider />
                                            </React.Fragment>
                                        ))}
                                    </List>
                                )}
                            </CommentContentBox>
                        </CommentListItem>
                        <CommentDivider/>
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
