const Quiz = require('../models/Quiz');


exports.createQuiz = async (req, res) => {
    try {
        const {title, categoryId, difficultyId, createdBy, questions, createdAt } = req.body;
        const newQuiz = new Quiz({title, categoryId, difficultyId, createdBy, questions, createdAt});
        await newQuiz.save();
        res.status(201).json(newQuiz);
    }catch (error){
        res.status(500).json({message: error.message});
    }
};

exports.getQuiz = async (req, res) => {
    try {
        const quizs = await Quiz.find();
        res.json(quizs);
    }catch (error){
        res.status(500).json({ message: error.message});
    }
};

exports.getQuizbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id);
        if(!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    }catch (error){
        res.status(500).json({ message: error.message});
    }
};

exports.getQuizzesByIds = async (req, res) => {
    try {
        const { quizIds } = req.body; 

        if (!quizIds || !Array.isArray(quizIds) || quizIds.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing quiz IDs' });
        }

        
        const quizzes = await Quiz.find({ _id: { $in: quizIds } });

        if (!quizzes.length) {
            return res.status(404).json({ message: 'No quizzes found' });
        }

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteQuiz = async (req, res) => {
    try { 
        const { id } = req.params;
        const deletedQuiz = await Quiz.findByIdAndDelete(id);

        if (!deletedQuiz){
            return res.status(404).json({ message: "question not found"});
        }

        res.json({ message: "Question deleted successfully"});
    }catch (error){
        res.status(500).json({ message: error.message});
    }
}

exports.updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updateQuiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true});

        if (!updateQuiz){
            return res.status().json({ message: "question is not updated"});
        }
        res.json(updateQuiz);
    }catch (error){
        res.status(500).json({ message: error.message});
    }
}