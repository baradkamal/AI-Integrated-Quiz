const express = require('express');
const {createQuiz, getQuiz, deleteQuiz, updateQuiz} = require('../controllers/quizController');


const router = express.Router();

router.post("/quiz",createQuiz);
router.get("/quiz",getQuiz);
router.put("/quiz/:id",updateQuiz);
router.delete("/quiz/:id",deleteQuiz);


module.exports = router;