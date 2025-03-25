const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    type: String,
    difficulty: String,
    category: String,
    question: String,
    correct_answer: String,
    incorrect_answers: [String]
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
