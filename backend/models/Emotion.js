const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Emotion schema
const emotionSchema =  new Schema({
    inference_id: { type: String, required: true }, // ID of the inference
  time: { type: Number, required: true }, // Time taken for analysis
  class: { type: String, required: true }, // Emotion class (e.g., happy, sad)
  confidence: { type: Number, required: true }, // Confidence of the prediction
  email: { type: String, required: true }, // Email associated with the analysis
  timestamp: { type: Date, default: Date.now }, // Timestamp of record creation
});

// Create and export the Emotion model
const Emotion = mongoose.models.Emotion || mongoose.model('Emotion', emotionSchema);

module.exports = Emotion;
