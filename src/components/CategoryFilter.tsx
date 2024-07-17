import React from 'react';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

interface CategoryFilterProps {
    selectedCategories: string[];
    onFilterChange: (selectedCategories: string[]) => void;
}

const categories = ['FrontEnd', 'BackEnd', 'AI / ML', 'Cloud', 'Security', 'VR', 'Data Science', 'Network', 'Digital Device', 'Embed', 'Mobile', 'Game'];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onFilterChange }) => {
    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const category = event.target.name;
        if (event.target.checked) {
            onFilterChange([...selectedCategories, category]);
        } else {
            onFilterChange(selectedCategories.filter(c => c !== category));
        }
    };

    return (
        <FormGroup row>
            {categories.map(category => (
                <FormControlLabel
                    key={category}
                    control={<Checkbox checked={selectedCategories.includes(category)} onChange={handleCategoryChange} name={category} />}
                    label={category}
                />
            ))}
        </FormGroup>
    );
};

export default CategoryFilter;
