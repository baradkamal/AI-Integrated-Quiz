const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        
    },
    difficulty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'difficulty',
        required: true,
        
    },
    timeLimit: {
        type: Number,
        min: 1,
        max: 120
    },
    description: {
        type: String,
        required: true
    },
    passingScore: {
        type: Number,
        min: 1,
        max: 100
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'archived'],
        default: 'draft'
    },
    settings: {
        showAnswers: {
            type: Boolean,
            default: false
        },
        publicLeaderboard: {
            type: Boolean,
            default: false
        }
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

const AdvanceQuiz = mongoose.model('AdvanceQuiz', quizSchema);
module.exports = AdvanceQuiz;
