const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
});

const User = mongoose.model('User', userSchema);

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = '1h';

// Helper function to create a JWT token
const createToken = (user) => {
  return jwt.sign({ name: user.name , email: user.email  }, jwtSecret, { expiresIn: jwtExpiry });
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = createToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
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
    res.redirect(`${process.env.BASE_FRONTEND_URL}?token=${token}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
