const Question = require("../models/Question");

exports.getQuestion = async (req, res) =>{
    try {
        const question = await Question.find();
        res.json(question);
    } catch (error){
        res.status(500).json({message: error.massage});
    }
    
};


exports.fetchQuestionsadmin = async (req, res) => {
    try {
        const { category, difficulty, type, search, page = 1, limit = 10 } = req.query;

        const filter = {};

        
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (type) filter.type = type;

        
        if (search) {
            filter.question = { $regex: search, $options: 'i' }; 
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        
        const questions = await Question.find(filter)
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await Question.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            questions,
            totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createQuestion = async (req, res) =>{
    try{
        const {type, difficulty, category, question, correct_answer, incorrect_answers  } = req.body;
        const newQuestion = new Question({type, difficulty, category, question, correct_answer, incorrect_answers});
        await newQuestion.save();
        res.status(201).json(newQuestion);
    }catch (error){
        res.status(500).json({message: error.message});
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true});

        if (!updatedQuestion){
            return res.status(404).json({ message: "user not found"});
        }

        res.json(updatedQuestion);
    }catch(error){
        res.status(400).json({ message: error.message});
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion){
            return res.status(404).json({ message: "question not found"});
        }

        res.json({ message: "Question deleted successfully"});
    }catch(error){
        res.status(500).json({ message: error.message});

    }
};

exports.getQuestionsByIds = async (req, res) => {
    try {
        const { ids } = req.body; 

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Please provide an array of IDs." });
        }

        
        const questions = await Question.find({ '_id': { $in: ids } });

        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for the given IDs." });
        }

        
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

