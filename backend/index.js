const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const { execFile } = require('child_process');
const fs = require('fs');
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

const uploadPdfRoute = require('./routes/resume'); // Adjust path as needed
app.use('/api', uploadPdfRoute);

// MongoDB Schema
const Transcription = mongoose.model('Transcription', new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now }
}));

// Function to call Whisper Python script
function transcribeAudio(audioFilePath, callback) {
  execFile('python3', ['./whisper_transcribe.py', audioFilePath], (error, stdout, stderr) => {
    if (error) {
      console.error(`execFile error: ${error}`);
      return callback(error, null);
    }
    console.log(`Whisper Transcription: ${stdout}`);
    callback(null, stdout);
  });
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('audio', (audioChunk) => {
    console.log('Received audio track');
    
    // Save audioChunk to a temporary file
    const filePath = `./uploads/audio_${Date.now()}.wav`;
    fs.writeFileSync(filePath, audioChunk);

    // Call the Whisper transcription function
    transcribeAudio(filePath, (err, transcription) => {
      if (err) {
        console.error('Transcription error:', err);
        return;
      }

      // Save transcription to MongoDB
      const newTranscription = new Transcription({ text: transcription });
      newTranscription.save()
        .then(() => console.log('Transcription saved to MongoDB'))
        .catch(err => console.error('Error saving transcription:', err));

      // Clean up the temporary file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting temporary file:', err);
        }
      });

      // Send transcription result back to client
      socket.emit('transcription', transcription);
    });
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
