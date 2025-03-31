const express = require('express');
const {createQuiz, getQuiz, deleteQuiz, updateQuiz, getQuizbyid,getQuizzesByIds} = require('../controllers/quizController');


const router = express.Router();

router.post("/quiz",createQuiz);
router.get("/quiz",getQuiz);
router.get("/quizbyid/:id",getQuizbyid);
router.post("/quizbyids/",getQuizzesByIds);
router.put("/quiz/:id",updateQuiz);
router.delete("/quiz/:id",deleteQuiz);


module.exports = router;