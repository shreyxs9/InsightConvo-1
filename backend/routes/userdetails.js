const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting"); // Assuming Meeting model exists
const User = require("../models/user"); // Assuming User model exists

// Get user details by meetingId
router.get("/meeting-details/:meetingId", async (req, res) => {
  try {
    const { meetingId } = req.params;

    // Find the meeting by meetingId
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found." });
    }

    // Use the email from the meeting to find the user
    const user = await User.findOne({ email: meeting.email });
    if (!user) {
      return res.status(404).json({ error: "User not found for this meeting." });
    }

    // Return user details
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
