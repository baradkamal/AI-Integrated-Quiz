const AdvanceQuiz = require('../models/AdvanceQuiz');

// Create a new quiz
exports.createAdvanceQuiz = async (req, res) => {
    try {
        const { title, category, difficulty, timeLimit, description, passingScore, status, settings, createdBy, questions } = req.body;

        const newQuiz = new AdvanceQuiz({ title, category, difficulty, timeLimit, description, passingScore, status, settings, createdBy, questions }); 
        await newQuiz.save();

        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all quizzes with question count
exports.getAllAdvanceQuizzes = async (req, res) => {
    try {
        const quizzes = await AdvanceQuiz.find()
            .populate("questions", "question -_id")
            .populate("category", "name -_id")
            .populate("difficulty", "name -_id")
            .populate("createdBy", "name -_id")
            .select('-_id');

        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminAdvanceQuiz = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const quizzes = await AdvanceQuiz.find()
            .skip(skip)
            .limit(limit)
            .populate("questions", "question -_id")
            .populate("category", "name -_id")
            .populate("difficulty", "name -_id")
            .populate("createdBy", "name -_id")
            

        

        const totalCount = await AdvanceQuiz.countDocuments();

        res.json({
            quizzes,
            totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a single quiz by ID
exports.getAdvanceQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await AdvanceQuiz.findById(id)
            .populate("questions", "question correct_answer -_id")
            .populate("category", "name -_id")
            .populate("difficulty", "name -_id")
            .populate("createdBy", "name -_id")
            .select('-_id');

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({ 
            ...quiz.toObject(),
            questionCount: quiz.questions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a quiz by ID
exports.deleteAdvanceQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await AdvanceQuiz.findByIdAndDelete(id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAdvanceQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find the quiz by ID and update it
        const updatedQuiz = await AdvanceQuiz.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate("questions", "question -_id")
            .populate("category", "name -_id")
            .populate("difficulty", "name -_id")
            .populate("createdBy", "name -_id")
            .select('-_id');

        if (!updatedQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.patchAdvanceQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        
        const updatedQuiz = await AdvanceQuiz.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate("questions", "question -_id")
        .populate("category", "name -_id")
        .populate("difficulty", "name -_id")
        .populate("createdBy", "name -_id")
        

        if (!updatedQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

