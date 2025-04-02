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
        const quizs = await Quiz.find()
        .populate("questions", "question -_id")
        .populate("createdBy", "name -_id")
        .select('-_id');

        const newQuiz = quizs.map(quiz => ({
            ...quiz.toObject(), 
            questionCount: quiz.questions.length 
        }));
        res.json(newQuiz);
    }catch (error){
        res.status(500).json({ message: error.message});
    }
};

exports.getQuizadmin = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        
        const skip = (page - 1) * limit;

       
        const quizs = await Quiz.find()
            .skip(skip)  
            .limit(limit) 
            .populate("questions", "question -_id")
            .populate("createdBy", "name -_id")
            .select('-_id');

        // Add question count to each quiz
        const newQuiz = quizs.map(quiz => ({
            ...quiz.toObject(),
            questionCount: quiz.questions.length
        }));

        // Calculate total count of quizzes for pagination
        const totalCount = await Quiz.countDocuments();

        // Send paginated result with total count and total pages
        res.json({
            quizzes: newQuiz,
            totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
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