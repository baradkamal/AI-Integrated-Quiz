const User = require("../models/User");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile-images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}).single('profileImage');

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
        profileImage: req.user.profileImage
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

exports.createUserAdmin = async (req, res) => {
    try {
        upload(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: "File upload error: " + err.message });
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }

            const { name, email, age, username, password, isAdmin, Status } = req.body;

            // Check if user already exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Create user object
            const userData = {
                name,
                email,
                age,
                username,
                password,
                isAdmin: isAdmin || false,
                Status: Status || 'active'
            };

            // If a file was uploaded, add the profile image path
            if (req.file) {
                userData.profileImage = '/public/uploads/profile-images/' + req.file.filename;
            }

            // Create new user
            const user = await User.create(userData);

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    age: user.age,
                    isAdmin: user.isAdmin,
                    Status: user.Status,
                    profileImage: user.profileImage,
                    token: generateToken(user._id)
                });
            } else {
                res.status(400).json({ message: "Invalid user data" });
            }
        });
    } catch (error) {
        console.error('Error in createUserAdmin:', error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateUserAdmin = async (req, res) => {
    try {
        upload(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: "File upload error: " + err.message });
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }

            const { id } = req.params;
            const { name, email, age, username, isAdmin, Status } = req.body;

            // Create update object
            const updateData = {
                name,
                email,
                age,
                username,
                isAdmin,
                Status
            };

            // If a file was uploaded, add the profile image path
            if (req.file) {
                updateData.profileImage = '/public/uploads/profile-images/' + req.file.filename;
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(updatedUser);
        });
    } catch (error) {
        console.error('Error in updateUserAdmin:', error);
        res.status(500).json({ message: "Server error" });
    }
};



exports.getUsersAdmin = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 

        
        const skip = (page - 1) * limit;

        
        const users = await User.find({})
            .select("-password") 
            .skip(skip)
            .limit(limit);

        
        const totalCount = await User.countDocuments();

        
        const totalPages = Math.ceil(totalCount / limit);

        
        res.json({
            users,
            totalCount,
            page,
            limit,
            totalPages
        });
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};

exports.getUserprofileadmin = async (req, res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        .select("-password");
        if (!user){
            return res.status(404).json({ message: "user not found"});
        }
        res.json(user);
    }catch(error){
        res.status(500).json({ message: error.message});
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
        res.json({name:user.name, email:user.email, profileImage:user.profileImage});
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

