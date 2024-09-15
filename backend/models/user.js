// models/user.js (modified existing User schema)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
  userType: { type: String, default: 'user' },
  dob: String,
  mobile:String,
  location: String,
  college: String,
  collegeLocation: String,
  cgpa: Number,
  skills: [String], 
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
