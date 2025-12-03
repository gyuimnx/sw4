const express = require('express');
const router = express.Router();
const protect = require('./middleware_auth');

const MOCK_USER_ID = 1;

let chapters = [
    { chapter_id: 1, user_id: MOCK_USER_ID, name: '기본 단어' },
    { chapter_id: 2, user_id: MOCK_USER_ID, name: '토익 필수' },
];
let nextChapterId = 3;

let words = [
    { word_id: 1, chapter_id: 1, english: 'apple', korean: '사과', is_memorized: false },
    { word_id: 2, chapter_id: 1, english: 'computer', korean: '컴퓨터', is_memorized: false },
    { word_id: 3, chapter_id: 2, english: 'negotiation', korean: '협상', is_memorized: false },
    { word_id: 4, chapter_id: 2, english: 'invoice', korean: '청구서', is_memorized: true },
];
let nextWordId = 5;

const getChaptersByUserId = (userId) => chapters.filter(c => c.user_id === userId);
const getWordsByChapterId = (chapterId) => words.filter(w => w.chapter_id === parseInt(chapterId));
const isChapterOwner = (chapterId, userId) => chapters.some(c => c.chapter_id === parseInt(chapterId) && c.user_id === userId);
const isWordOwner = (wordId, userId) => {
    const word = words.find(w => w.word_id === parseInt(wordId));
    if (!word) return false;
    return isChapterOwner(word.chapter_id, userId);
};

router.use(protect);

// 챕터 목록 조회
router.get('/chapters', async (req, res) => {
    const user_id = req.user_id;
    const userChapters = getChaptersByUserId(user_id);
    res.json({ chapters: userChapters });
});

// 새 챕터 추가
router.post('/chapters', async (req, res) => {
    const user_id = req.user_id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: '챕터 이름을 입력해주세요.' });
    }

    // 중복 이름 확인
    const normalizedName = name.trim();
    if (getChaptersByUserId(user_id).some(c => c.name.toLowerCase() === normalizedName.toLowerCase())) {
        return res.status(409).json({ message: '이미 같은 이름의 챕터가 있습니다.' });
    }

    const newChapter = {
        chapter_id: nextChapterId++,
        user_id,
        name: normalizedName,
    };
    chapters.push(newChapter);

    res.status(201).json({
        message: '챕터가 성공적으로 추가되었습니다.',
        chapter_id: newChapter.chapter_id,
        newChapter: { chapter_id: newChapter.chapter_id, name: newChapter.name }
    });
});

// 챕터의 단어 목록 조회
router.get('/words/:chapterId', async (req, res) => {
    const user_id = req.user_id;
    const { chapterId } = req.params;

    if (!isChapterOwner(chapterId, user_id)) {
        return res.status(404).json({ message: '해당 챕터를 찾을 수 없거나 접근 권한이 없습니다.' });
    }

    const chapterWords = getWordsByChapterId(chapterId);
    res.json({ words: chapterWords });
});

// 단어 추가
router.post('/words', async (req, res) => {
    const user_id = req.user_id;
    const { chapter_id, english, korean } = req.body;

    if (!chapter_id || !english || !korean) {
        return res.status(400).json({ message: '필수 필드를 모두 입력해주세요.' });
    }

    if (!isChapterOwner(chapter_id, user_id)) {
        return res.status(403).json({ message: '단어를 추가할 권한이 없습니다.' });
    }

    const newWord = {
        word_id: nextWordId++,
        chapter_id: parseInt(chapter_id),
        english: english.trim(),
        korean: korean.trim(),
        is_memorized: false,
    };
    words.push(newWord);

    res.status(201).json({
        message: '단어가 성공적으로 추가되었습니다.',
        word_id: newWord.word_id
    });
});

// 단어 암기 상태 토글
router.put('/words/:wordId/toggle', async (req, res) => {
    const user_id = req.user_id;
    const wordId = parseInt(req.params.wordId);

    const wordIndex = words.findIndex(w => w.word_id === wordId);

    if (wordIndex === -1 || !isWordOwner(wordId, user_id)) {
        return res.status(404).json({ message: '해당 단어를 찾을 수 없거나 권한이 없습니다.' });
    }

    const newMemorizedState = !words[wordIndex].is_memorized;
    words[wordIndex].is_memorized = newMemorizedState;

    res.json({
        message: `단어 암기 상태가 ${newMemorizedState ? '암기됨' : '미암기'}으로 변경되었습니다.`,
        is_memorized: newMemorizedState
    });
});


// 단어 삭제
router.delete('/words/:wordId', async (req, res) => {
    const user_id = req.user_id;
    const wordId = parseInt(req.params.wordId);

    const wordIndex = words.findIndex(w => w.word_id === wordId);

    if (wordIndex === -1 || !isWordOwner(wordId, user_id)) {
        return res.status(403).json({ message: '단어를 삭제할 권한이 없거나 찾을 수 없습니다.' });
    }

    words.splice(wordIndex, 1);
    res.status(200).json({ message: '단어가 성공적으로 삭제되었습니다.' });
});


// 챕터 삭제
router.delete('/chapters/:chapterId', async (req, res) => {
    const user_id = req.user_id;
    const chapterId = parseInt(req.params.chapterId);

    const chapterIndex = chapters.findIndex(c => c.chapter_id === chapterId);

    if (chapterIndex === -1 || chapters[chapterIndex].user_id !== user_id) {
        return res.status(403).json({ message: '챕터를 삭제할 권한이 없거나 찾을 수 없습니다.' });
    }

    // 챕터 삭제
    chapters.splice(chapterIndex, 1);
    // 챕터의 단어 모두 삭제
    words = words.filter(w => w.chapter_id !== chapterId);

    res.status(200).json({ message: '챕터가 성공적으로 삭제되었습니다.' });
});

// 챕터 이름 수정
router.put('/chapters/:chapterId', async (req, res) => {
    const user_id = req.user_id;
    const chapterId = parseInt(req.params.chapterId);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: '수정할 챕터 이름을 입력해주세요.' });
    }

    const chapterIndex = chapters.findIndex(c => c.chapter_id === chapterId);

    if (chapterIndex === -1 || chapters[chapterIndex].user_id !== user_id) {
        return res.status(403).json({ message: '수정 권한이 없거나 챕터를 찾을 수 없습니다.' });
    }
    
    const normalizedName = name.trim();

    // 중복 이름 확인
    if (getChaptersByUserId(user_id).some((c, i) => c.name.toLowerCase() === normalizedName.toLowerCase() && i !== chapterIndex)) {
        return res.status(409).json({ message: '이미 같은 이름의 챕터가 있습니다.' });
    }

    chapters[chapterIndex].name = normalizedName;

    res.json({ message: '챕터 이름이 수정되었습니다.', newName: normalizedName });
});

// 단어 수정
router.put('/words/:wordId', async (req, res) => {
    const user_id = req.user_id;
    const wordId = parseInt(req.params.wordId);
    const { english, korean } = req.body;

    if (!english || !korean) {
        return res.status(400).json({ message: '단어와 뜻을 모두 입력해주세요.' });
    }

    const wordIndex = words.findIndex(w => w.word_id === wordId);

    if (wordIndex === -1 || !isWordOwner(wordId, user_id)) {
        return res.status(403).json({ message: '수정 권한이 없거나 단어를 찾을 수 없습니다.' });
    }

    words[wordIndex].english = english.trim();
    words[wordIndex].korean = korean.trim();

    res.json({ message: '단어가 수정되었습니다.', updatedWord: { english: english.trim(), korean: korean.trim() } });
});


module.exports = router;