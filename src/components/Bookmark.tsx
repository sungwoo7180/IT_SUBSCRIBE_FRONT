import React from 'react';
import {IconButton, Tooltip} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const Bookmark: React.FC = () => {
    return (
        <Tooltip title="Bookmark this article">
            <IconButton color="primary">
                <BookmarkBorderIcon />
            </IconButton>
        </Tooltip>
    );
};

export default Bookmark;