const express = require('express');
const router = express.Router();
const EvaluationService = require('../services/evaluationService');
const auth = require('./auth');

const evaluationService = new EvaluationService(process.env.GEMINI_API_KEY);

router.get('/scores/:meetingId', auth, async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    const resumeScore = await evaluationService.evaluateResumeMatch(meetingId);
    const interviewScore = await evaluationService.evaluateInterview(req.transcriptions);
    const overallScore = evaluationService.calculateOverallScore(resumeScore, interviewScore);

    res.json({
      resumeScore,
      interviewScore,
      overallScore
    });
  } catch (error) {
    console.error('Error calculating scores:', error);
    res.status(500).json({ error: 'Failed to calculate scores' });
  }
});

module.exports = router;