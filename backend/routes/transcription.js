const express = require("express");
const multer = require("multer");
const axios = require("axios");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Transcription = require("../models/Transcript");
const Meeting = require("../models/Meeting");

const router = express.Router();
const upload = multer();

// AssemblyAI and Google Generative AI API Keys
const ASSEMBLY_AI_API_KEY = "01b3b3567b654babb19545d0f6728235";
const genAI = new GoogleGenerativeAI("AIzaSyA-wPQiu6SQ3uPs2UMWZziZAPyF97UJsjM");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Transcription and follow-up handling
router.post("/transcribe/:meetingId", upload.single("file"), async (req, res) => {
  const { meetingId } = req.params;
  const audioBuffer = req.file?.buffer;

  if (!audioBuffer || !meetingId) {
    return res.status(400).json({ error: "Audio data and Meeting ID are required." });
  }

  try {
    // Retrieve meeting details using meeting ID
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found." });
    }
    const email = meeting.email;


    console.log("Meeting found. Email:", email);

    // Upload audio file to AssemblyAI
    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      audioBuffer,
      {
        headers: {
          authorization: ASSEMBLY_AI_API_KEY,
          "content-type": "application/octet-stream",
        },
      }
    );

    console.log("Audio uploaded. Upload URL:", uploadResponse.data.upload_url);

    // Request transcription
    const transcriptResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: uploadResponse.data.upload_url,
      },
      {
        headers: {
          authorization: ASSEMBLY_AI_API_KEY,
        },
      }
    );

    console.log("Transcription requested. Transcript ID:", transcriptResponse.data.id);

    // Poll for transcription completion
    let transcriptionData;
    while (true) {
      const transcriptResult = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptResponse.data.id}`,
        {
          headers: {
            authorization: ASSEMBLY_AI_API_KEY,
          },
        }
      );
      transcriptionData = transcriptResult.data;

      if (transcriptionData.status === "completed") {
        console.log("Transcription completed.");
        break;
      }
      if (transcriptionData.status === "failed") {
        console.error("Transcription failed.");
        throw new Error("Transcription failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Poll every 2 seconds
    }

    const transcription = transcriptionData.text;
    console.log("Transcription text:", transcription);

    if (!transcription) {
      throw new Error("Transcription is empty.");
    }

    // Generate follow-up question
    const followUpQuestions = await generateFollowUpQuestions(transcription, meetingId);
    const nextQuestion = followUpQuestions[0];

    if (!nextQuestion) {
      throw new Error("Failed to generate follow-up question.");
    }

    console.log("Generated follow-up question:", nextQuestion);

    // Save transcription and next question in MongoDB
    const transcriptionRecord = new Transcription({
      email,
      meetingId,
      transcription,
      currentQuestion: nextQuestion,
    });

    await transcriptionRecord.save();
    // console.log("Transcription successfully saved:", transcriptionRecord);

    res.json({
      transcription,
      questions: [nextQuestion],
      message: "Transcription saved. Follow-up question generated.",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to process audio." });
  }
});

// Helper function to generate follow-up questions
const generateFollowUpQuestions = async (responseText, meetingId) => {
  const meeting = await Meeting.findById(meetingId);
  const jobDescription = meeting.jobDescription;

  const prompt = `Based on the following :"${jobDescription}":and "${responseText}", generate one follow-up question related to the job description.`;
  try {
    const result = await model.generateContent(prompt);
    const question = result.response.text();
    console.log("Generated follow-up question:", question); // Debug log
    return [question]; // Returns an array with a single follow-up question
  } catch (error) {
    console.error("Error generating follow-up question:", error);
    return []; // Return an empty array in case of failure
  }
};

module.exports = router;
