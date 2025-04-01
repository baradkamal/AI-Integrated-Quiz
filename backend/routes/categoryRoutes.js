const express = require('express');
const {createCategory,createCategories,getCategory,getCategoryById} = require('../controllers/categoryController');

const router = express.Router();

router.post("/category",createCategory);
router.post("/categorys",createCategories);
router.get("/category",getCategory);
router.post("/category",getCategoryById);

module.exports = router;