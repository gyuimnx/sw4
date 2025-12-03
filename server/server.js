const express = require('express');
const cors = require('cors');
const wordbookRoutes = require('./wordbook');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
const corsOptions = {
    origin: [
        'http://localhost:3000', // 로컬 개발용
        process.env.CLIENT_URL   // 배포된 프론트엔드 주소(나중에 클라우드타입에서 설정)
    ], 
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('English Wordbook Server is running!');
});


// 단어장 라우터 연결 (JWT 토큰 필요)
app.use('/api/wordbook', wordbookRoutes);

// 서버 시작
app.listen(PORT, () => {
    console.log(`수신 중인 서버: ${PORT}`);
});