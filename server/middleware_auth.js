// const jwt = require('jsonwebtoken'); // JWT를 사용하지만, 실제 검증은 단순화

const protect = (req, res, next) => {
    let token;
    // HTTP 헤더의 'Authorization'에서 토큰 추출(Bearer <token> 형식)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // DB 연동 없이 로컬 환경에서만 작동하도록 단순화
    // 유효한 'mock-token'이 있을 경우에만 인증 성공 처리
    if (token && token === 'mock-token') {
        // 하드코딩된 사용자 ID를 할당 (In-Memory 데이터에서 사용할 ID와 일치해야 함)
        req.user_id = 1; 
        next(); 
    } else {
        // 토큰이 없거나 유효하지 않으면 인증 실패(401 오류)
        return res.status(401).json({ message: '인증 실패: 로그인이 필요합니다.' });
    }
};

module.exports = protect;