const express = require("express");
const { getQuestion, createQuestion, updateQuestion, deleteQuestion, getQuestionsByIds,fetchQuestionsadmin } = require("../controllers/questionController");

const router = express.Router();

// router.get("/question", (req, res) => {
//     res.json({ message: "Fetching all questions..." });
// });

// router.post("/question", (req, res) => {
//     res.json({ message: "Creating a new question" });
// });

router.get("/question",getQuestion);

router.get("/questionadmin",fetchQuestionsadmin);

router.post("/questionbyid",getQuestionsByIds);

router.post("/question", createQuestion);

router.put("/question/:id", updateQuestion);

router.delete("/question/:id",deleteQuestion);

module.exports = router; // Corrected here
