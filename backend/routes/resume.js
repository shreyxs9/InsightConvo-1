const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();
const fs = require('fs');
// Set up Multer for file upload
const upload = multer({ dest: 'uploads/' }); // Save files to 'uploads' folder

const Resume = mongoose.model('Resume', new mongoose.Schema({
  filename: String,
  content: String,
  name: String,
  email: String,
}));

// Route to handle PDF upload
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    const { name, email } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
  
    // Get the path to the uploaded file
    const filePath = path.join(__dirname, '../', req.file.path);
  
    try {
      // Read the file as a Buffer
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
    //   console.log('User Name:', name);
    //   console.log('User Email:', email);
    //   console.log('Extracted PDF Text:', data.text);
  
      fs.unlinkSync(filePath);
      const resume = new Resume({
        filename: req.file.originalname,
        content: data.text,
        name: name || 'Unknown', 
        email: email || 'Unknown',
      });
      await resume.save();  
      res.status(200).json({ message: 'PDF uploaded and content extracted successfully.', content: data.text });
    } catch (error) {
      console.error('Error processing PDF:', error);
      res.status(500).json({ message: 'Error processing PDF', error: error.message });
    }
  });

module.exports = router;
