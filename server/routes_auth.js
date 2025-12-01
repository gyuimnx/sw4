const express = require('express');
const router = express.Router();

// 하드코딩된 사용자 정보 (DB 연동 없이 로컬 환경에서만 사용)
const MOCK_USERNAME = 'user';
const MOCK_PASSWORD = 'password'; 
const MOCK_USER_ID = 1;

// 회원가입 (실제 DB에 저장하지 않고 성공 응답만 반환)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // 실제 로직 없이 성공 메시지만 반환
    if (username && password) {
        return res.status(201).json({ message: '회원가입 성공! (모의) 로그인 페이지로 이동합니다.' });
    }
    res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
});


// 로그인 (하드코딩된 계정으로만 가능)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
        // Mock JWT 토큰 발급 및 성공 응답
        const token = 'mock-token'; 
        
        res.json({
            message: '로그인 성공! 환영합니다.',
            token,
            user: { id: MOCK_USER_ID, username: MOCK_USERNAME }
        });
    } else {
        res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다. (모의 계정: user/password)' });
    }
});

module.exports = router;