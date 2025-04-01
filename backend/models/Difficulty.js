const mongoose = require('mongoose');

const difficultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Difficulty = mongoose.model('difficulty', difficultySchema);

module.exports = Difficulty;
