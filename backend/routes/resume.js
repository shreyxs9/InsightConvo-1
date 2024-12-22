const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();
const fs = require('fs');

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be stored temporarily in the 'uploads' folder

// Define the Resume schema and model
const Resume = mongoose.model('Resume', new mongoose.Schema({
  filename: String,
  content: String,
  name: String,
  email: { type: String, unique: true }, // Ensure email is unique in the collection
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
    // Read the uploaded file as a Buffer
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    // Delete the temporary file
    fs.unlinkSync(filePath);

    // Check if a resume with the same email already exists
    const existingResume = await Resume.findOne({ email });

    if (existingResume) {
      // Update the existing resume record
      existingResume.filename = req.file.originalname;
      existingResume.content = pdfData.text;
      existingResume.name = name || 'Unknown';
      await existingResume.save();
      res.status(200).json({
        message: 'Resume updated successfully.',
        content: pdfData.text,
      });
    } else {
      // Create a new resume record
      const newResume = new Resume({
        filename: req.file.originalname,
        content: pdfData.text,
        name: name || 'Unknown',
        email: email || 'Unknown',
      });
      await newResume.save();
      res.status(200).json({
        message: 'Resume uploaded and saved successfully.',
        content: pdfData.text,
      });
    }
  } catch (error) {
    console.error('Error processing PDF:', error);

    // Cleanup the temporary file in case of error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      message: 'Error processing PDF',
      error: error.message,
    });
  }
});

module.exports = router;
