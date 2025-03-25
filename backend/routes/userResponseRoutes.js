const express = require("express");
const {getUserResponse, createUserResponse} = require("../controllers/userResponseController");
const router = express.Router();

router.get("/userResponse",getUserResponse);
router.post("/userResponse",createUserResponse);

module.exports = router;