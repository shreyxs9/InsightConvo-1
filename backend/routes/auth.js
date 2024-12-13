// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/user'); // Import the User model
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = '10h';

// Helper function to create a JWT token
const createToken = (user) => {
  return jwt.sign({ name: user.name, email: user.email, type: user.userType }, jwtSecret, { expiresIn: jwtExpiry });
};

// Middleware to authenticate and extract user from token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          if (err.name === "TokenExpiredError") {
              return res.status(401).json({ message: "Token expired. Please log in again." });
          }
          return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      req.user = decoded;
      next();
  });
};


// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If password is provided, update the existing user
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.userType = userType || existingUser.userType; // Update userType if provided
        await existingUser.save();
        const token = createToken(existingUser);
        return res.status(200).json({ token });
      } else {
        // If no password is provided, return an error
        return res.status(400).json({ error: 'User already exists. Password is required to update.' });
      }
    }

    // If user does not exist, create a new user
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new User({ name, email, password: hashedPassword, userType });
    await user.save();

    const token = createToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = createToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Google OAuth callback
router.get('/googleurl', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    });

    const { access_token } = response.data;
    const googleUser = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, id } = googleUser.data;
    let user = await User.findOne({ email: email });

    if (!user) {
      user = new User({ name, email, googleId: id });
      await user.save();
    }

    const token = createToken(user);
    res.redirect(`${process.env.BASE_FRONTEND_URL}/user?token=${token}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get user type
router.get('/userType', authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });
    const userType = user.userType === 'interviewer' ? 'admin' : 'user';
    res.status(200).json({ userType });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, mobile, dob, location, college, collegeLocation, cgpa, skills } = user;
    res.status(200).json({ name, email, mobile, dob, location, college, collegeLocation, cgpa, skills });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { email } = req.user; // Email is extracted from the token, so it cannot be updated
    const { name, mobile, dob, location, college, collegeLocation, cgpa, skills } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name;
    user.mobile = mobile;
    user.dob = dob;
    user.location = location;
    user.college = college;
    user.collegeLocation = collegeLocation;
    user.cgpa = cgpa;
    user.skills = skills;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
