const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  intervieweeName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  jobDescription: { type: String, required: true },
  interviewType: { type: String, required: true },
  importantQuestions: { type: [String], required: true },
  interviewerName: { type: String, required: true },
  interviewerEmail: { type: String, required: true },
});

module.exports = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
