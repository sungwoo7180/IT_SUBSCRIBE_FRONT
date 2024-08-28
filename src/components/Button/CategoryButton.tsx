import React from 'react';
import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import categories from '../../data/Categories';

interface CategoryChipProps {
    category: {
        id: number;
        name: string;
    };
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category }) => {
    const navigate = useNavigate();

    const handleCategoryClick = () => {
        const selectedCategory = categories.find(cat => cat.name === category.name);
        if (selectedCategory) {
            window.location.href = `/all-articles?categories=${encodeURIComponent(selectedCategory.name)}`;
        }
    };

    return (
        <Chip label={category.name} color="primary" onClick={handleCategoryClick} />
    );
};

export default CategoryChip;
