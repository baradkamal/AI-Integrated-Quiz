const mongoose = require("mongoose");


const userResponseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdvanceQuiz',
        required: true
    },
    responses: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        userAnswer: {
            type: String,
            trim: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        points: {
            type: Number,
            default: 0
        }
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['started', 'completed', 'abandoned'],
        default: 'started'
    }
  }, { timestamps: true });
  
  const UserResponse = mongoose.model('UserResponse', userResponseSchema);

module.exports = UserResponse;