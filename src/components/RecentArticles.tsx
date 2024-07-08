import React from 'react';
import { Box, Typography, Paper, Button, Card, CardMedia, CardContent, Chip } from '@mui/material';

const articles = [
    { id: 1, title: 'Dummy Article 1', content: 'Content of dummy article 1.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 2, title: 'Dummy Article 2', content: 'Content of dummy article 2.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 3, title: 'Dummy Article 3', content: 'Content of dummy article 3.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 4, title: 'Dummy Article 4', content: 'Content of dummy article 4.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
    { id: 5, title: 'Dummy Article 5', content: 'Content of dummy article 5.', image: 'https://via.placeholder.com/150', category: 'Game', tags: ['Tag1', 'Tag2'] },
];

const RecentArticles: React.FC = () => {
    return (
        <Paper sx={{ padding: 2, backgroundColor: '#1f2a3c' }}>
            <Typography variant="h6" gutterBottom color="white">Recent Articles</Typography>
            {articles.map((article) => (
                <Card key={article.id} sx={{ marginBottom: 2, backgroundColor: '#152238', color: 'white' }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={article.image}
                        alt={article.title}
                    />
                    <CardContent>
                        <Typography variant="h6">{article.title}</Typography>
                        <Typography variant="body2">{article.content}</Typography>
                        <Box sx={{ marginTop: 1 }}>
                            <Chip label={article.category} color="primary" />
                            {article.tags.map((tag, index) => (
                                <Chip key={index} label={tag} sx={{ marginLeft: 1, backgroundColor: '#2e3b4e', color: 'white' }} />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            ))}
            <Button variant="contained" sx={{ backgroundColor: '#3b5998' }}>View all Articles</Button>
        </Paper>
    );
};

export default RecentArticles;