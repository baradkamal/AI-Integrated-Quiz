const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    difficultyId: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
