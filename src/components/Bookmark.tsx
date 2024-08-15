import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface BookmarkProps {
    articleId: number;
}

const Bookmark: React.FC<BookmarkProps> = ({ articleId }) => {
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 북마크 상태를 확인합니다.
        const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
        if (bookmarkedArticles.includes(articleId)) {
            setIsBookmarked(true);
        }
    }, [articleId]);

    // bookmark 관련 함수
    // localStorage 에 bookmarked 된 기사를 추가하거나 삭제하는 함수
    // 추후 backend API 를 통해 사용자의 bookmarked 기사 목록을 업데이트하는 방식으로 변경
    const handleBookmarkClick = () => {
        let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');

        if (isBookmarked) {
            // 이미 북마크된 경우 -> 북마크 해제
            bookmarkedArticles = bookmarkedArticles.filter((id: number) => id !== articleId);
        } else {
            // 북마크되지 않은 경우 -> 북마크 추가
            bookmarkedArticles.push(articleId);
        }

        // 업데이트된 북마크 상태를 로컬 스토리지에 저장
        localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
        setIsBookmarked(!isBookmarked);
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
