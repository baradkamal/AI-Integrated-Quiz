const express = require('express');
const { 
    createDifficulty, 
    createDifficulties, 
    getDifficulties, 
    getDifficultyById 
} = require('../controllers/difficultyController');

const router = express.Router();

router.post("/difficulty", createDifficulty);
router.post("/difficulties", createDifficulties);
router.get("/difficulty", getDifficulties);
router.get("/difficulty/:id", getDifficultyById);

module.exports = router;
