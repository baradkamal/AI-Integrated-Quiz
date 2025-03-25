const User = require("../models/User");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
// get all users

exports.getUsers = async (req, res) =>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (error){
        res.status(500).json({ message: error.message});
    }
};

exports.getUserProfile = async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    });
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password"); // Get all users (hide passwords)
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.registerUser = async (req, res) => {
    const { name, email, age , username , password  } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({  name, email, age , username , password });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                password: user.password,
                token: generateToken(user._id), // Generate JWT token
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                admin: user.isAdmin,
                token: generateToken(user._id)
            })
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        } 
    }catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, email, age , username , password  } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });
        const newUser = new User({ name, email, age , username , password  });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateuserrole = async (req, res) => {
    try{ 
        const {id} = req.params;
        const updaterole = await User.findByIdAndUpdate(id, { isAdmin: true},{ new: true});

        if(!updaterole){
            return res.status(404).json({ message: "user not found"});
        }

        res.json(updaterole);
    }catch (error){
        res.status(400).json({message: error.message });
    }
};
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const {id} = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true});
        

        if(!updatedUser){
            return res.status(404).json({ message: "user not found"});
        }

        res.json(updatedUser);
    } catch(error){
        res.status(400).json({ message: error.message });
    }
};
// exports.updateUser = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//       const { id } = req.params;
//       // Exclude password from req.body
//       const { password, ...updateData } = req.body;
  
//       const updatedUser = await User.findByIdAndUpdate(
//         id, 
//         { $set: updateData }, 
//         { new: true }
//       );
  
//       if (!updatedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       res.json(updatedUser);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };
  

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser){
            return res.status(404).json({ message: "user not found"});
        }

        res.json({message: "user deleted successfully"});
    } catch (error){
        res.status(500).json({ message: error.message});
    }
};

exports.getUserById = async (req, res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user){
            return res.status(404).json({ message: "user not found"});
        }
        res.json({name:user.name});
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

