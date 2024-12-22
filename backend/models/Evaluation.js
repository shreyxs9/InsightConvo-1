const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
  email: { type: String, required: true },
  resumeScore: { type: Number, required: true },
  transcriptionScore: { type: Number, required: true },
  confidence: { type: Number, required: true },
  overallEmotion: { type: String, required: true },
  overallScore: { type: Number, required: true },
  candidateStatus: { type: String, required: true },
  confidenceAnalysis: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
