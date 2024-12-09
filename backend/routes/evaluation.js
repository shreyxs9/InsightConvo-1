const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");
const Resume = require("../models/Resume");
const Transcription = require("../models/Transcript");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini AI Setup
const genAI = new GoogleGenerativeAI("AIzaSyA-wPQiu6SQ3uPs2UMWZziZAPyF97UJsjM");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper Function to Get Score
async function getGeminiScore(prompt) {
  const result = await model.generateContent(prompt);
  const scoreMatch = result.response.text().match(/(\d+(\.\d+)?)/);
  return scoreMatch ? parseFloat(scoreMatch[0]) : 0;
}

// Evaluate Candidate API
router.get("/evaluate-candidate/:meetingId", async (req, res) => {
  const { meetingId } = req.params;

  try {
    // Fetch Data
    const meeting = await Meeting.findById(meetingId);
    const email = meeting.email;

    const resume = await Resume.findOne({ email });
    const transcriptions = await Transcription.find({ email });
  
    
    if (!meeting || !resume || transcriptions.length === 0) {
      return res.status(404).json({ error: "Required data not found" });
    }

    const jobDescription = meeting.jobDescription;
    const resumeContent = resume.content;
    const transcriptionTexts = transcriptions.map((t) => t.transcriptionText).join("\n");
    console.log(transcriptionTexts);

    // 1. Resume and Job Description Matching Score
    const resumePrompt = `
    Analyze the following resume against the given job description:
    1. Evaluate how well the candidate's skills, experiences, and qualifications align with the requirements of the job.
    2. Consider factors such as technical skills, soft skills, relevant experiences, certifications, and overall compatibility with the role.
    3. Assign a score out of 10, where 10 indicates a perfect match.
    
    Resume:
    ${resumeContent}
    
    Job Description:
    ${jobDescription}
    `;
        const resumeScore = await getGeminiScore(resumePrompt);

    // 2. Transcriptions and Follow-up Questions Matching Score
    const transcriptionPrompt = `
Evaluate the following transcriptions by comparing the questions asked with the provided answers:
1. Assess the relevance and correctness of the answers in relation to the questions.
2. Consider the clarity, completeness, and depth of the answers.
3. Provide a score out of 10, where 10 indicates a perfect match between questions and answers.

Transcriptions:
${transcriptionTexts}
`;

    const transcriptionScore = await getGeminiScore(transcriptionPrompt);

    // 3. Overall Score Calculation
    const overallScore = (resumeScore * 0.6) + (transcriptionScore * 0.4);

    // 4. Suggestions for Similar Roles
    const suggestionPrompt = `Based on this job description:\n${jobDescription}\nSuggest similar roles for the candidate.`;
    const suggestions = await model.generateContent(suggestionPrompt);

    res.json({
      resumeScore,
      transcriptionScore,
      overallScore,
      suggestions: suggestions.response.text(),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
