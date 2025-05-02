const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Controller function
const processFileAndExtractText = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const ext = path.extname(file.originalname).toLowerCase();

  try {
    let extractedText = '';

    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      
      const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
      extractedText = text;
    } else if (ext === '.pdf') {
      const buffer = fs.readFileSync(file.path);
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    fs.unlinkSync(file.path); 
    return res.json({ text: extractedText.trim() });

  } catch (error) {
    console.error('OCR Error:', error);
    return res.status(500).json({ error: 'Failed to process file' });
  }
};

module.exports = { processFileAndExtractText };
