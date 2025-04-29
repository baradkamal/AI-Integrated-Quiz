// backend/controllers/dashboardController.js
const UserResponse = require('../models/UserResponse');
const AdvanceQuiz = require('../models/AdvanceQuiz');
const mongoose = require('mongoose');

// Helper function to get quizzes grouped by category
async function getQuizzesByCategory() {
    // Aggregate quizzes by category
    const quizzesByCategory = await AdvanceQuiz.aggregate([
        { $match: { status: 'active' } },
        { $lookup: { 
            from: 'categories', 
            localField: 'category', 
            foreignField: '_id', 
            as: 'categoryData' 
        }},
        { $unwind: '$categoryData' },
        { $group: {
            _id: '$categoryData._id',
            categoryName: { $first: '$categoryData.name' },
            count: { $sum: 1 },
            quizzes: { $push: { 
                _id: '$_id',
                title: '$title',
                difficulty: '$difficulty'
            }}
        }},
        { $sort: { categoryName: 1 } }
    ]);
    
    return quizzesByCategory;
}

// Get dashboard stats for a specific user
exports.getUserDashboardStats = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Create a proper ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Get total number of active quizzes
        const totalQuizzes = await AdvanceQuiz.countDocuments({ status: 'active' });
        
        // Get quizzes by category
        const quizzesByCategory = await getQuizzesByCategory();
        
        // Get user's responses with populated quiz data to get question counts
        const userResponses = await UserResponse.find({ user: userId })
            .sort({ completedAt: -1 }) // Most recent first
            .populate({
                path: 'quiz',
                select: 'title category difficulty questions',
                populate: [
                    { path: 'category', select: 'name' },
                    { path: 'difficulty', select: 'name' }
                ]
            });
        
        // Calculate stats
        const completedQuizzes = userResponses.filter(r => r.status === 'completed').length;
        const startedQuizzes = userResponses.filter(r => r.status === 'started').length;
        
        // Calculate average score with percentage conversion
        const completedResponses = userResponses.filter(r => r.status === 'completed');
        let averageScore = 0;
        
        if (completedResponses.length > 0) {
            // Calculate percentage for each response and then average
            const percentageScores = completedResponses.map(response => {
                const questionCount = response.quiz?.questions?.length || 1;
                return (response.totalScore / questionCount) * 100;
            });
            
            averageScore = percentageScores.reduce((sum, score) => sum + score, 0) / percentageScores.length;
        }
        
        // Get recent activity (last 5 responses)
        const recentActivity = userResponses.slice(0, 5);
        
        // Calculate performance by category by joining with quizzes to get question counts
        const categoryPerformance = await UserResponse.aggregate([
            { $match: { user: userObjectId, status: 'completed' }},
            // Join with quizzes
            { $lookup: { 
                from: 'advancequizzes', 
                localField: 'quiz', 
                foreignField: '_id', 
                as: 'quizData' 
            }},
            { $unwind: '$quizData' },
            // Add a field with question count
            { $addFields: { 
                questionCount: { $size: '$quizData.questions' },
                // Calculate percentage for this response
                scorePercentage: { 
                    $multiply: [
                        { $divide: ['$totalScore', { $size: '$quizData.questions' }] },
                        100
                    ]
                }
            }},
            // Join with categories
            { $lookup: { 
                from: 'categories', 
                localField: 'quizData.category', 
                foreignField: '_id', 
                as: 'categoryData' 
            }},
            { $unwind: '$categoryData' },
            // Group by category
            { $group: {
                _id: '$categoryData._id',
                categoryName: { $first: '$categoryData.name' },
                avgScore: { $avg: '$scorePercentage' }, // Average of percentage scores
                count: { $sum: 1 }
            }}
        ]);
        
        
        
        // Enhance category performance with total available quizzes in that category
        const enhancedCategoryPerformance = categoryPerformance.map(performance => {
            const categoryQuizzes = quizzesByCategory.find(c => 
                c._id.toString() === performance._id.toString()
            );
            
            return {
                ...performance,
                totalQuizzesInCategory: categoryQuizzes ? categoryQuizzes.count : 0
            };
        });
        
        res.status(200).json({
            totalQuizzes,
            quizzesByCategory,
            userStats: {
                completedQuizzes,
                startedQuizzes,
                averageScore,
                totalAttempts: userResponses.length
            },
            recentActivity: recentActivity.map(activity => {
                // Calculate percentage score
                const questionCount = activity.quiz?.questions?.length || 1;
                const scorePercentage = (activity.totalScore / questionCount) * 100;
                
                return {
                    quizId: activity.quiz?._id || null,
                    quizTitle: activity.quiz?.title || 'Unknown Quiz',
                    status: activity.status,
                    score: scorePercentage,
                    completedAt: activity.completedAt
                };
            }),
            categoryPerformance: enhancedCategoryPerformance
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get quizzes by category
exports.getQuizzesByCategory = async (req, res) => {
    try {
        const quizzesByCategory = await getQuizzesByCategory();
        res.status(200).json(quizzesByCategory);
    } catch (error) {
        console.error('Error getting quizzes by category:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get leaderboard stats
exports.getLeaderboardStats = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        
        // If quizId is provided, get leaderboard for specific quiz
        if (quizId && mongoose.Types.ObjectId.isValid(quizId)) {
            const leaderboard = await UserResponse.find({ 
                quiz: quizId,
                status: 'completed'
            })
            .sort({ totalScore: -1, completedAt: 1 }) // Higher score first, then earliest completion
            .limit(10)
            .populate('user', 'name username profileImage')
            .select('totalScore completedAt');
            
            // Calculate total points for each response
            const leaderboardWithPoints = await Promise.all(leaderboard.map(async (entry) => {
                // Get the sum of points from the responses array
                const userResponse = await UserResponse.findById(entry._id).select('responses');
                const totalPoints = userResponse.responses.reduce((sum, response) => sum + (response.points || 0), 0);
                
                return {
                    ...entry.toObject(),
                    totalPoints
                };
            }));
            
            // Re-sort by points
            leaderboardWithPoints.sort((a, b) => {
                if (b.totalPoints !== a.totalPoints) {
                    return b.totalPoints - a.totalPoints; // Sort by points descending
                }
                return new Date(a.completedAt) - new Date(b.completedAt); // Then by completion time ascending
            });
            
            return res.status(200).json(leaderboardWithPoints);
        }
        
        // Otherwise get global leaderboard (top performers across all quizzes)
        const globalLeaderboard = await UserResponse.aggregate([
            { $match: { status: 'completed' }},
            // Join with quizzes to get question counts
            { $lookup: { 
                from: 'advancequizzes', 
                localField: 'quiz', 
                foreignField: '_id', 
                as: 'quizData' 
            }},
            { $unwind: '$quizData' },
            // Add a field with question count and calculate percentage
            { $addFields: { 
                questionCount: { $size: '$quizData.questions' },
                // Calculate percentage for this response
                scorePercentage: { 
                    $multiply: [
                        { $divide: ['$totalScore', { $size: '$quizData.questions' }] },
                        100
                    ]
                }
            }},
            // First unwind to process each response
            { $unwind: '$responses' },
            // Group by user and sum up points
            { $group: {
                _id: '$user',
                totalScore: { $sum: '$totalScore' },
                totalPoints: { $sum: '$responses.points' },
                quizCount: { $sum: { $cond: [{ $eq: ["$_id", "$_id"] }, 1, 0] } }, // Count unique quizzes
                avgScore: { $avg: '$scorePercentage' } // Now using percentage-based score average
            }},
            { $sort: { totalPoints: -1, avgScore: -1 }}, // Sort by points first, then avgScore
            { $limit: 10 },
            { $lookup: { 
                from: 'users', 
                localField: '_id', 
                foreignField: '_id', 
                as: 'userData' 
            }},
            { $unwind: '$userData' },
            { $project: {
                _id: 1,
                name: '$userData.name',
                username: '$userData.username',
                profileImage: '$userData.profileImage',
                totalPoints: 1,
                totalScore: 1,
                quizCount: 1,
                avgScore: 1
            }}
        ]);
        
        res.status(200).json(globalLeaderboard);
    } catch (error) {
        console.error('Leaderboard Error:', error);
        res.status(500).json({ message: error.message });
    }
};