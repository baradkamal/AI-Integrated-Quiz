const express = require('express');
const multer = require('multer');
const { processFileAndExtractText } = require('../controllers/ocrController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), processFileAndExtractText);

module.exports = router;
