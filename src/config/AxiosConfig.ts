import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // API의 기본 URL을 설정합니다.
    timeout: 40000, // 요청 타임아웃 시간을 설정합니다 (단위: ms).
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


export default axiosInstance;
