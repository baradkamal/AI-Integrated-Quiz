const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const categoryExitsts = await Category.findOne({ name });
        if (categoryExitsts) return res.status(400).json({message: "category already exists"});
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error){
        res.status(500).json({message: error.message});
    }
};
exports.createCategories = async (req, res) => {
    try {
        const categories = req.body; 
        const createdCategories = [];

        for (const { name, description } of categories) {
            const categoryExists = await Category.findOne({ name });
            if (categoryExists) {
                return res.status(400).json({ message: `Category '${name}' already exists` });
            }
            const newCategory = new Category({ name, description });
            await newCategory.save();
            createdCategories.push(newCategory);
        }

        res.status(201).json(createdCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategory = async (req, res) =>{
    try {
        const category = await Category.find();
        res.json(category);
    } catch(error){
        res.status(500).json({ message: error.message});
    }
};

exports.getCategoryById = async (req, res) =>{
    try {
        const id = req.params;
        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch(error){
        res.status(500).json({ message: error.message});
    }
};