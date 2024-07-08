// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Navbar from './components/Navbar';
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
    return (
        <Router>
            <Routes>
                {/* 이동은 <LINK> 컴포넌트를 사용해서 전환 */}
                {/* Link 컴포넌트는 리액트 라우터에서 제공하는 페이지 전환을 위한 컴포넌트 */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/main" element={<><Navbar /><Main /></>} />
                <Route path="/passwordReset" element={<><ForgotPassword /><Main /></>} />
            </Routes>
        </Router>
    );
}

export default App;
