const express = require('express');
const {createQuiz, getQuiz, deleteQuiz, updateQuiz, getQuizbyid,getQuizzesByIds,getQuizadmin} = require('../controllers/quizController');
const {createAdvanceQuiz, getAllAdvanceQuizzes, getAdvanceQuizById, deleteAdvanceQuiz,getAdminAdvanceQuiz,updateAdvanceQuiz,patchAdvanceQuiz} = require('../controllers/advanceQuizController');


const router = express.Router();

router.post("/quiz",createQuiz);
router.get("/quiz",getQuiz);
router.get("/quizbyid/:id",getQuizbyid);
router.post("/quizbyids/",getQuizzesByIds);
router.put("/quiz/:id",updateQuiz);
router.delete("/quiz/:id",deleteQuiz);
router.get("/quiz/admin", getQuizadmin);

// advance quiz
router.post("/Advancequiz",createAdvanceQuiz);
router.get("/Advancequiz", getAllAdvanceQuizzes);     
router.get("/advancequiz/:id", getAdvanceQuizById);   
router.delete("/advancequiz/:id", deleteAdvanceQuiz);
router.put("/advancequiz/:id", updateAdvanceQuiz);
router.patch("/advancequiz/:id", patchAdvanceQuiz);
router.get("/adminadvancequiz", getAdminAdvanceQuiz);
module.exports = router;