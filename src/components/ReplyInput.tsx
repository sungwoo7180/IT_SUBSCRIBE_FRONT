import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

interface ReplyInputProps {
    onAddReply: (text: string) => void;
    onCancel: () => void;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ onAddReply, onCancel }) => {
    const [replyText, setReplyText] = useState('');

    const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReplyText(event.target.value);
    };

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onAddReply(replyText.trim());
            setReplyText(''); // 입력 필드 초기화
        }
    };

    return (
        <Box sx={{ mt: 2, ml: 4 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="답글 추가..."
                value={replyText}
                onChange={handleReplyChange}
                multiline
                rows={2}
                inputProps={{ maxLength: 200 }}
                sx={{ backgroundColor: 'white' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                    onClick={onCancel}
                    sx={{
                        textTransform: 'none',
                        marginRight: 2,
                        borderRadius: '20px',
                        padding: '0.3rem 1rem',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                    }}
                >
                    취소
                </Button>
                <Button
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '20px',
                        padding: '0.3rem 1rem',
                        backgroundColor: '#00796b',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#004d40',
                        },
                    }}
                >
                    답글
                </Button>
            </Box>
        </Box>
    );
};

export default ReplyInput;
