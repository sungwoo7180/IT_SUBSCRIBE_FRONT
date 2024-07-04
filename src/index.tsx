import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css'; // Ensure your CSS is loaded
import App from './App';
import reportWebVitals from './reportWebVitals';

// Material-UI 테마 생성
const theme = createTheme({
    typography: {
        fontFamily: 'Verdana, Arial, sans-serif',
        fontWeightRegular: 700, // 700 is equivalent to 'bold'
        allVariants: {
            fontWeight: 'bold' // Apply bold weight to all typography variants
        }
    }
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>  {/* Apply the theme across all React components */}
            <CssBaseline />  {/* Normalize the default CSS across browsers */}
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

reportWebVitals();
