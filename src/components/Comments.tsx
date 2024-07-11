import React from 'react';
import { List, ListItem, Typography, TextField, Button, Avatar, Box, IconButton, Divider } from '@mui/material';
import { ReportProblemOutlined as ReportIcon } from '@mui/icons-material';

interface CommentType {
    id: number;
    username: string;
    userImg: string;
    text: string;
    timestamp: string;
}

interface CommentsProps {
    comments: CommentType[];
}

const Comments: React.FC<CommentsProps> = ({ comments }) => {
    return (
        <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: '#1f2a3c', color: 'white', border: '1px solid white' }}>
            <Typography variant="h6" sx={{ color: 'white' }}>{`Comments: ${comments.length}`}</Typography>
            <List sx={{ width: '100%' }}>
                {comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                        <ListItem sx={{ mb: 2, alignItems: 'flex-start' }}>
                            <Avatar src={comment.userImg} sx={{ width: 56, height: 56, mr: 2 }} />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        {comment.username}
                                    </Typography>
                                    <Typography variant="caption" sx={{ ml: 2, color: 'gray' }}>
                                        {comment.timestamp}
                                    </Typography>
                                    <IconButton size="small" sx={{ ml: 2, color: 'white' }}>
                                        <ReportIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" sx={{ color: 'white' }}>
                                    {comment.text}
                                </Typography>
                            </Box>
                        </ListItem>
                        <Divider sx={{ borderColor: 'white' }} />
                    </React.Fragment>
                ))}
            </List>
            <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                sx={{ mt: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' } } }}
            />
            <Button variant="contained" color="primary" sx={{ mt: 1 }}>
                Submit
            </Button>
        </Box>
    );
};

export default Comments;
