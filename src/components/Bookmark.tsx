import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axiosInstance from '../config/AxiosConfig';

interface BookmarkProps {
    articleId: number;
}

const Bookmark: React.FC<BookmarkProps> = ({ articleId }) => {
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

    useEffect(() => {
        const fetchBookmarkedArticles = async () => {
            try {
                const response = await axiosInstance.post(`/api/bookmark/articles/${articleId}`);

                if(response.status==200){
                    setIsBookmarked(true);
                }
                else if(response.status==204){
                    setIsBookmarked(false);
                }
            } catch (err) {
                console.error('Failed to fetch bookmarked articles', err);
            }
        };

        fetchBookmarkedArticles();
    }, [articleId]);

    const handleBookmarkClick = async () => {
        try {
            if (isBookmarked) {
                // 현재 백엔드 로직에는 북마크 제거 기능이 없으므로 여기에 필요한 로직을 추가해야 함
                // 예시: DELETE 요청을 보낼 수 있도록 백엔드에 추가 구현 필요
                // alert('이미 북마크된 기사를 제거하려면 해당 기능을 백엔드에 구현해야 합니다.');
                await axiosInstance.delete(`/api/bookmark/delete-bookmark/${articleId}`);
                setIsBookmarked(false);
            } else {
                await axiosInstance.post(`/api/bookmark/add-bookmark/${articleId}`);
                setIsBookmarked(true);
            }
        } catch (err) {
            console.error('Failed to add or remove bookmark', err);
        }
    };

    return (
        <Tooltip title={isBookmarked ? "Remove from bookmarks" : "Bookmark this article"}>
            <IconButton color="primary" onClick={handleBookmarkClick}>
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default Bookmark;
