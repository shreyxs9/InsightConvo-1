const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const mongoose = require("mongoose"); // Import mongoose
const router = express.Router();
const Emotion = require("../models/Emotion");
const Meeting = require("../models/Meeting");




// Set up multer to store images in the 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Ensure the uploads directory exists
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.jpg`); // Generate a unique filename for each image
  },
});

const upload = multer({ storage: storage });

// Route to handle image upload and external API call
router.post("/confidence/:meetingId", upload.single("screenshot"), async (req, res) => {
  const { meetingId } = req.params;
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  // File uploaded successfully
  const filePath = path.join(__dirname, "uploads", req.file.filename);
  console.log("Image saved at:", filePath);

  try {
    // Read the image file and encode it as base64
     const meeting = await Meeting.findById(meetingId);
     if (!meeting) {
      return res.status(404).json({ error: "Meeting not found." });
    }
        const email = meeting.email;

    const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });

    // Send the image to the external emotion detection API
    const response = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/facial-emotion-recognition/2",
      params: {
        api_key: "VwQnKGgYfDKsvyJnFkdX", // Replace with your actual API key
      },
      data: imageBase64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("Emotion Analysis Result:", response.data);

    // Extract predictions and store in MongoDB
    const predictions = response.data.predictions || [];

    for (const prediction of predictions) {
      const emotion = new Emotion({
        inference_id: response.data.inference_id,
        time: response.data.time,
        class: prediction.class,
        confidence: prediction.confidence,
        email: email, // Save email with the prediction
      });

      await emotion.save(); // Save to MongoDB
    }

    // Respond with the analysis result
    res.send({
      message: "Image uploaded and analyzed successfully",
      analysis: response.data,
    });
  } catch (error) {
    console.error("Error processing image:", error.message);
    res.status(500).send({ error: "Failed to analyze image", details: error.message });
  }
});

module.exports = router;