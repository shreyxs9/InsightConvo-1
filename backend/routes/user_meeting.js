// routes/userMeetings.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Meeting = require('../models/Meeting');

const jwtSecret = process.env.JWT_SECRET;



const authenticate = (req, res, next) => {
  const token = req.headers.authorization; // Directly get the token
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all meetings for the user
router.get('/', authenticate, async (req, res) => {
  try {
    const userEmail = req.user.email; // Get user's email from the decoded token

    const meetings = await Meeting.find({ email: userEmail }); // Fetch meetings for this user
    const currentDate = new Date();

    const formattedMeetings = meetings.map(meeting => ({
      ...meeting._doc,
      isUpcoming: new Date(meeting.date) >= currentDate,
    }));

    res.json(formattedMeetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Get a specific meeting by ID
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    if (meeting.email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meeting' });
  }
});

module.exports = router;
