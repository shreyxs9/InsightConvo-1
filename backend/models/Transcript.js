const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for storing transcription data
const transcriptionSchema = new Schema({
  email: { 
    type: String, 
    required: true,  // Make intervieweeEmail required
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Simple regex validation for email format
  },
  currentQuestion: { 
    type: String, 
    required: true 
  },
  transcription: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists before defining it
const Transcription = mongoose.models.Transcription || mongoose.model('Transcription', transcriptionSchema);

module.exports = Transcription;
