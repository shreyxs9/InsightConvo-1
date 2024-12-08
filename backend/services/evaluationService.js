const { GoogleGenerativeAI } = require("@google/generative-ai");
const Resume = require("../models/Resume");
const Meeting = require("../models/Meeting");

class EvaluationService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async evaluateResumeMatch(meetingId) {
    try {
      const meeting = await Meeting.findById(meetingId);
      const resume = await Resume.findOne({ meetingId });

      if (!meeting || !resume) {
        throw new Error('Meeting or resume not found');
      }

      const prompt = `
        Compare this job description and resume, and provide a match score from 0-100:
        
        Job Description:
        ${meeting.jobDescription}

        Resume:
        ${resume.content}

        Provide the score and brief explanation in JSON format:
        {
          "score": number,
          "explanation": "string"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = JSON.parse(result.response.text());
      
      return response.score;
    } catch (error) {
      console.error('Resume evaluation error:', error);
      throw error;
    }
  }

  async evaluateInterview(transcriptions) {
    try {
      const prompt = `
        Analyze these interview responses and provide a score from 0-100:
        
        Transcriptions:
        ${JSON.stringify(transcriptions)}

        Consider:
        - Clarity of responses
        - Relevance to questions
        - Technical accuracy
        - Communication skills

        Provide the score and brief explanation in JSON format:
        {
          "score": number,
          "explanation": "string"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = JSON.parse(result.response.text());
      
      return response.score;
    } catch (error) {
      console.error('Interview evaluation error:', error);
      throw error;
    }
  }

  calculateOverallScore(resumeScore, interviewScore) {
    // Weight distribution: 40% resume match, 60% interview performance
    return (resumeScore * 0.4) + (interviewScore * 0.6);
  }
}

module.exports = EvaluationService;