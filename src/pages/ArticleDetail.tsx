import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import MostHotArticles from '../components/MostHotArticles';
import Comments from '../components/Comments';
import BookmarkButton from '@mui/icons-material/Bookmark';


const articles = [
    {
        id: 1,
        title: '하반기 계획 공개, 넷마블 신의 탑 1주년 방송한다',
        content: '넷마블은 수집형 애니메이션 RPG \'신의 탑: 새로운 세계\' 출시 1주년을 기념해 오는 12일 오후 8시 공식 라이브 방송을 진행한다고 9일 밝혔다.\n' +
            '이번 방송에는 넷마블엔투 정언산 개발PD, 전투 기획자가 출연해 특별 이벤트를 소개하고 하반기 로드맵을 공개할 예정이다. 이용자들과의 질의응답을 통해 그간의 궁금증도 해소할 계획이다.\n' +
            '게임의 신규 캐릭터가 특별 게스트로 등장해 이용자들과 인사하며 지난 1년간의 게임 기록을 돌아보는 시간도 마련됐다. 방송 중 특별 쿠폰을 제공하는 기념 이벤트도 진행된다.\n' +
            '\'신의 탑: 새로운 세계\'는 조회수 60억회를 돌파한 네이버웹툰 \'신의 탑\'을 기반으로 한 수집형 애니메이션 RPG다. 쉽고 간편한 게임성을 앞세워 지난해 7월 26일 출시했다.',
        image: 'https://via.placeholder.com/150',
        comments: [
            {
                id: 1,
                username: 'User1',
                userImg: 'https://via.placeholder.com/50',
                text: 'Lorem Ipsum is simply dummy text...',
                timestamp: '2024-06-29 19:23'
            },
            {
                id: 2,
                username: 'User2',
                userImg: 'https://via.placeholder.com/50',
                text: 'Lorem Ipsum has been the industry\'s standard...',
                timestamp: '2024-06-29 21:17'
            }
        ],
        category: 'Game',
        tags: ['RPG', 'Action']
    }
];

const ArticleDetail: React.FC = () => {
    let { articleId } = useParams<{ articleId: string }>();
    const article = articles.find(article => article.id.toString() === articleId);
    if (!article) return <p>기사를 찾을 수 없습니다.</p>;

    return (
        <Box sx={{
            p: 3,
            backgroundImage: 'url(/Background.png)',  // image 상대경로 쓰면 문제, 절대경로 사용 또는 import 해야 함
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh'
        }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                    <Paper elevation={3} sx={{ padding: '20px', color: 'white', bgcolor: '#1f2a3c' }}>
                        <Typography variant="h4" gutterBottom>
                            {article.title}
                        </Typography>
                        <img src={article.image} alt={article.title} style={{ width: '100%', height: 'auto', maxHeight: '300px' }} />
                        <Typography variant="subtitle1" gutterBottom>   
                            {`Category: ${article.category}`}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            {`Tags: ${article.tags.join(', ')}`}
                        </Typography>
                        <Typography paragraph>
                            {article.content}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" startIcon={<BookmarkButton />} sx={{ bgcolor: '#ff4081', my: 2 }}>
                        Bookmark
                    </Button>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Comments comments={article.comments} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <MostHotArticles />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ArticleDetail;
