import React from 'react';
import { Box, Typography, Paper, Card, CardContent, Chip } from '@mui/material';

const hotArticles = [
    { id: 1, title: 'Hot Article 1', rank: 1, category: 'AI / ML', tags: ['Tag1', 'Tag2'] },
    { id: 2, title: 'Hot Article 2', rank: 2, category: 'Cloud', tags: ['Tag1', 'Tag2'] },
    { id: 3, title: 'Hot Article 3', rank: 3, category: 'Engineering', tags: ['Tag1', 'Tag2'] },
    { id: 4, title: 'Hot Article 4', rank: 4, category: 'Security', tags: ['Tag1', 'Tag2'] },
    { id: 5, title: 'Hot Article 5', rank: 5, category: 'Framework', tags: ['Tag1', 'Tag2'] },
    { id: 6, title: 'Hot Article 6', rank: 6, category: 'Game', tags: ['Tag1', 'Tag2'] },
];

const MostHotArticles: React.FC = () => {
    return (
        <Paper sx={{ padding: 2, backgroundColor: '#1f2a3c' }}>
            <Typography variant="h6" gutterBottom color="white">Most Hot Articles</Typography>
            {hotArticles.map((article) => (
                <Card key={article.id} sx={{ marginBottom: 2, backgroundColor: '#152238', color: 'white' }}>
                    <CardContent>
                        <Typography variant="h6">#{article.rank} {article.title}</Typography>
                        <Box sx={{ marginTop: 1 }}>
                            <Chip label={article.category} color="primary" />
                            {article.tags.map((tag, index) => (
                                <Chip key={index} label={tag} sx={{ marginLeft: 1, backgroundColor: '#2e3b4e', color: 'white' }} />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Paper>
    );
};

export default MostHotArticles;
