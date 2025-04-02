const Difficulty = require("../models/Difficulty");

// Create a single difficulty
exports.createDifficulty = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if difficulty already exists
        const difficultyExists = await Difficulty.findOne({ name });
        if (difficultyExists) {
            return res.status(400).json({ message: "Difficulty already exists" });
        }

        const newDifficulty = new Difficulty({ name, description });
        await newDifficulty.save();

        res.status(201).json(newDifficulty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create multiple difficulties at once
exports.createDifficulties = async (req, res) => {
    try {
        const difficulties = req.body;
        const createdDifficulties = [];

        for (const { name, description } of difficulties) {
            const difficultyExists = await Difficulty.findOne({ name });
            if (difficultyExists) {
                return res.status(400).json({ message: `Difficulty '${name}' already exists` });
            }

            const newDifficulty = new Difficulty({ name, description });
            await newDifficulty.save();
            createdDifficulties.push(newDifficulty);
        }

        res.status(201).json(createdDifficulties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all difficulties
exports.getDifficulties = async (req, res) => {
    try {
        const difficulties = await Difficulty.find();
        res.json(difficulties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get difficulty by ID
exports.getDifficultyById = async (req, res) => {
    try {
        const { id } = req.params;
        const difficulty = await Difficulty.findById(id);

        if (!difficulty) {
            return res.status(404).json({ message: "Difficulty not found" });
        }

        res.json(difficulty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
