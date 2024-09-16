const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const { PassThrough } = require('stream');
const speech = require('@google-cloud/speech');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schema
const Transcription = mongoose.model('Transcription', new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now }
}));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Meeting Routes
const adminmeetingRoutes = require('./routes/admin_meeting');
app.use('/admin/meetings', adminmeetingRoutes);

const usermeetingRoutes = require('./routes/user_meeting');
app.use('/user/meetings', usermeetingRoutes);

// Google Cloud Speech-to-Text client
const client = new speech.SpeechClient();

// WebSocket Connection Handling
io.on('connection', (socket) => {
  console.log('New WebSocket connection:', socket.id);

  const passThroughStream = new PassThrough();

  // Google Cloud Speech-to-Text streaming request
  const request = {
    config: {
      encoding: 'LINEAR16', // Ensure this matches the audio encoding
      sampleRateHertz: 16000, // Ensure this matches the audio sample rate
      languageCode: 'en-US',
    },
    interimResults: false, // Set to true if you want interim results
  };

  const recognizeStream = client.streamingRecognize(request)
    .on('data', async (data) => {
      const transcription = data.results[0]?.alternatives[0]?.transcript || '';
      console.log('Transcription:', transcription);
      socket.emit('transcription', transcription);

      // Save transcription to MongoDB
      const newTranscription = new Transcription({ text: transcription });
      try {
        await newTranscription.save();
        console.log('Transcription saved to MongoDB');
      } catch (err) {
        console.error('Error saving transcription:', err);
      }
    })
    .on('error', (error) => {
      console.error('Error:', error);
    });

  passThroughStream.pipe(recognizeStream);

  socket.on('audio', (data) => {
    if (data) {
      passThroughStream.write(data);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    passThroughStream.end();
  });

  socket.on('error', (error) => {
    console.error('WebSocket Error:', error);
  });
});

// Route for testing or additional functionality
app.get('/api/test', (req, res) => {
  res.send('API is working');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
