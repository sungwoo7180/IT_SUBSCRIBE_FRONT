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
        <FormGroup row> {/* 'row' 속성을 추가하여 가로로 배열 */}
            {categories.map(category => (
                <FormControlLabel
                    key={category}
                    control={
                        <Checkbox
                            checked={selectedCategories.includes(category)}
                            onChange={handleCategoryChange}
                            name={category}
                            sx={{
                                color: 'lightblue', // 체크되지 않은 상태에서도 보이는 색상
                                '&.Mui-checked': {
                                    color: 'cyan', // 체크된 상태에서의 색상
                                }
                            }}
                        />
                    }
                    label={category}
                    sx={{ color: 'white' }}
                />
            ))}
        </FormGroup>
    );
};

export default CategoryFilter;
