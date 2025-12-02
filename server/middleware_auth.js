// server/middleware_auth.js

const protect = (req, res, next) => {
    // wordbook.js에 정의된 MOCK_USER_ID와 동일한 ID를 사용합니다.
    const MOCK_USER_ID = 1; 
    
    // JWT 검증 없이 임시로 user_id 설정
    req.user_id = MOCK_USER_ID;
    
    // 다음 라우터로 제어를 전달하여 요청이 계속 진행되도록 합니다.
    next();
};

module.exports = protect;