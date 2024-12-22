const express = require("express");
const router = express.Router();
const Evaluation = require("../models/Evaluation");

// Get All Evaluated Candidates
router.get("/candidates", async (req, res) => {
  try {
    // Fetch all evaluations
    const evaluations = await Evaluation.find();

    // Separate into "Selected" and "Not Selected"
    const selectedCandidates = evaluations.filter(candidate => candidate.candidateStatus === "Selected");
    const notSelectedCandidates = evaluations.filter(candidate => candidate.candidateStatus === "Rejected");

    // Send the response
    res.status(200).json({
      selected: selectedCandidates,
      notSelected: notSelectedCandidates,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
