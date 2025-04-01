const express = require("express");
const {getUserResponse, createUserResponse, userResponseByuser,getUserResponses2} = require("../controllers/userResponseController");
const router = express.Router();

router.get("/userResponse",getUserResponse);
router.post("/userResponse",createUserResponse);
router.get("/userResponsebyuser/:id",userResponseByuser);
router.get("/userResponsebyuser2/:id",getUserResponses2);

module.exports = router;