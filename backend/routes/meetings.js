// routes/meetings.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define the Meeting schema and model directly in this file
const meetingSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Meeting name
  date: { type: Date, required: true },
  time: { type: String, required: true },
  intervieweeName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  jobDescription: { type: String, required: true },
  interviewType: { type: String, required: true },
  importantQuestions: { type: [String], required: true }, // Array of strings
});

// Create the Meeting model
const Meeting = mongoose.model('Meeting', meetingSchema);

// Get all meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find();
    const currentDate = new Date();

    // Map meetings to include 'isUpcoming'
    const formattedMeetings = meetings.map(meeting => ({
      ...meeting._doc,
      isUpcoming: new Date(meeting.date) >= currentDate,
    }));

    res.json(formattedMeetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Create a new meeting
router.post('/', async (req, res) => {
  const { name, date, time, intervieweeName, email, role, jobDescription, interviewType, importantQuestions } = req.body;

  try {
    const meeting = new Meeting({
      name,
      date,
      time,
      intervieweeName,
      email,
      role,
      jobDescription,
      interviewType,
      importantQuestions,
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create meeting' });
  }
});

// Update a meeting
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, time, intervieweeName, email, role, jobDescription, interviewType, importantQuestions } = req.body;

  try {
    const meeting = await Meeting.findByIdAndUpdate(
      id,
      { name, date, time, intervieweeName, email, role, jobDescription, interviewType, importantQuestions },
      { new: true }
    );
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update meeting' });
  }
});

// Delete a meeting
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Meeting.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete meeting' });
  }
});

module.exports = router;
