import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    element: JSX.Element; // children 대신 element 사용
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const isAuthenticated = localStorage.getItem('user'); // 로컬 스토리지에서 사용자 인증 상태 확인

    if (!isAuthenticated) {
        // 사용자가 인증되지 않았다면 로그인 페이지로 리다이렉트
        return <Navigate to="/" replace />;
    }

    return element; // 인증된 사용자에게는 요청한 페이지를 보여줌
};

export default ProtectedRoute;
// 이제 ProtectedRoute 컴포넌트를 사용하여 사용자가 로그인한 경우에만 MyPage 페이지로 이동할 수 있도록 설정할 수 있습니다.
// 이제 MyPage 컴포넌트를 사용자가 로그인한 경우에만 보여주도록 수정해보겠습니다.