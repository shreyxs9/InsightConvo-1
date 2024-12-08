const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  fileUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model already exists before creating it
module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
