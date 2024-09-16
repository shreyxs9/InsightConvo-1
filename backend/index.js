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

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Meeting Routes
const adminmeetingRoutes = require('./routes/admin_meeting');
app.use('/admin/meetings', adminmeetingRoutes);

const usermeetingRoutes = require('./routes/user_meeting');
app.use('/user/meetings', usermeetingRoutes);

// Google Cloud Speech-to-Text client
const client = new speech.SpeechClient();

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

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
    .on('data', (data) => {
      const transcription = data.results[0]?.alternatives[0]?.transcript || '';
      console.log('Transcription:', transcription);
      socket.emit('transcription', transcription);
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

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    passThroughStream.end();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
