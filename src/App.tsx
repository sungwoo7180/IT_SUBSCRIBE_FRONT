// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Navbar from './components/Navbar';
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ArticleDetail from "./pages/ArticleDetail";
import ArticlesView from "./pages/ArticlesView";
import MyPage from "./pages/MyPage";

function App() {
    return (
        <Router>
            <Routes>
                {/* 이동은 <LINK> 컴포넌트를 사용해서 전환 */}
                {/* Link 컴포넌트는 리액트 라우터에서 제공하는 페이지 전환을 위한 컴포넌트 */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/main" element={<><Navbar /><Main /></>} />
                <Route path="/password-reset" element={<><ForgotPassword /><Main /></>} />
                <Route path="/article/:article-id" element={<><Navbar /><ArticleDetail /></>} /> {/* 기사 상세 페이지 라우트 */}
                <Route path="/all-articles/:category?" element={<><Navbar /><ArticlesView /></>} />
                <Route path="/my-page" element={<><Navbar /><MyPage /></>} />
            </Routes>
        </Router>
    );
}

export default App;
