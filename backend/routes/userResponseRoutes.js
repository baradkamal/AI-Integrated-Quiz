const express = require("express");
const {getUserResponse, createUserResponse, userResponseByuser,getUserResponses2} = require("../controllers/userResponseController");
const router = express.Router();

router.get("/userResponse",getUserResponse);
router.post("/userResponse",createUserResponse);
router.get("/userResponsebyuser/:id",userResponseByuser);


module.exports = router;