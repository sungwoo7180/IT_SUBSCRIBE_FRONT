// src/App.tsx
import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Navbar from './components/Navbar';
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ArticleDetail from "./pages/ArticleDetail";
import ArticlesView from "./pages/ArticlesView";
import MyPage from "./pages/MyPage";
import axios from "axios";

function App() {
    useEffect(() => {
        // 이후 모든 요청에 세션 쿠키를 포함하도록 axios 기본 설정
        axios.defaults.withCredentials = true;
    }, []); // 빈 배열을 넣어 컴포넌트가 마운트될 때 한 번만 실행
    return (
        <Router>
            <Routes>
                {/* 이동은 <LINK> 컴포넌트를 사용해서 전환 */}
                {/* Link 컴포넌트는 리액트 라우터에서 제공하는 페이지 전환을 위한 컴포넌트 */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/main" element={<><Navbar /><Main /></>} />
                <Route path="/password-reset" element={<><ForgotPassword /></>} />
                <Route path="/article/:article-id" element={<><Navbar /><ArticleDetail /></>} /> {/* 기사 상세 페이지 라우트 */}
                <Route path="/all-articles/:category?" element={<><Navbar /><ArticlesView /></>} />
                <Route path="/my-page" element={<><Navbar /><MyPage /></>} />
            </Routes>
        </Router>
    );
}

export default App;
