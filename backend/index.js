const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Meeting Routes
const adminmeetingRoutes = require('./routes/admin_meeting');
app.use('/admin/meetings', adminmeetingRoutes);

const usermeetingRoutes = require('./routes/user_meeting');
app.use('/user/meetings', usermeetingRoutes);

const uploadPdfRoute = require('./routes/resume'); // Adjust path as needed
app.use('/api', uploadPdfRoute);


// Socket.io connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('video', (track) => {
    console.log('Received video track');
    // Handle video track data
  });

  socket.on('audio', (track) => {
    console.log('Received audio track');
    // Handle audio track data
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
