const express = require('express');
const router = express.Router();
const { reviewAnswer,createQuestation,createQuiz,createquizfromtext } = require('../controllers/genAiController');


router.post('/genaireviewanswer', reviewAnswer);
router.post('/genaiquestation', createQuestation);
router.post('/genaiquiz', createQuiz);
router.post('/genaiquizfromtext', createquizfromtext);


router.get('/content', (req, res) => {
    res.json({ message: 'GET /api/genai/content works fine' });
});

module.exports = router;
