import axios from 'axios';

// 환경 변수 REACT_APP_API_URL이 아닌 로컬 주소로 고정
const BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: `${BASE_URL}/api/wordbook`, 
});

// 요청 인터셉터: 모든 요청에 JWT 토큰을 헤더에 추가
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 응답 인터셉터: 인증 실패(401) 시 로그인 페이지로 강제 이동
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // 토큰 만료 또는 유효하지 않은 토큰일 경우
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        window.location.href = '/Login'; 
    }
    return Promise.reject(error);
});

export default api;