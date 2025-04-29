// backend/routes/dashboardRoutes.js
const express = require('express');
const { getUserDashboardStats, getLeaderboardStats, getQuizzesByCategory } = require('../controllers/dashboardController');
const router = express.Router();

// Get user dashboard stats
router.get('/user/:userId', getUserDashboardStats);

// Get quizzes by category
router.get('/categories', getQuizzesByCategory);

// Get leaderboard stats
router.get('/leaderboard', getLeaderboardStats);
router.get('/leaderboard/:quizId', getLeaderboardStats);

module.exports = router;