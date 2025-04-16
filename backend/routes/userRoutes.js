const express = require("express");
const {body, validationresult } = require("express-validator");
const { getUsers, createUser, updateUser, deleteUser, registerUser, loginUser, getUserProfile, getAllUsers, updateuserrole, getUserById, getUsersAdmin, createUserAdmin, updateUserAdmin, getUserprofileadmin } = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");
const router = express.Router();

const validateUser = [
    body("name").not().isEmpty().withMessage("name is required"),
    body("email").isEmail().withMessage("valid email is required"),
    body("age").isInt({ min: 1}).withMessage("age must be a positive number"),
]
router.get("/users", getUsers);
router.post("/users",validateUser, createUser);
router.put("/users/:id",validateUser, updateUser);
router.delete("/users/:id",validateUser, deleteUser);
router.put("/users/updateuserrole/:id", updateuserrole);
router.post("/users/signup", registerUser);
router.post("/users/login",loginUser);
router.get("/users/profile", protect, getUserProfile);
router.get("/users/profile/:id", protect, getUserprofileadmin);
router.get("/allusers", protect, admin, getAllUsers);
router.get("/usersadmin", protect, admin, getUsersAdmin);
router.post("/createuser", protect, admin, createUserAdmin);
router.put("/updateuseradmin/:id", protect, admin, updateUserAdmin);
router.delete("/deleteuseradmin/:id", protect, admin, deleteUser);
router.get("/userbyid/:id",getUserById);
router.get("/error", (req, res, next) => {
    next(new Error("This is a test error!")); 
});


module.exports = router;