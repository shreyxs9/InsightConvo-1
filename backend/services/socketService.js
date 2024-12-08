const { Server } = require('socket.io');

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Specify frontend origin
        methods: ['GET', 'POST'], // Allow necessary methods
        credentials: true, // Allow credentials (cookies, headers)
      },
    });

    this.meetings = new Map();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('New connection:', socket.id);

      socket.on('join-meeting', (meetingId) => {
        socket.join(meetingId);
        if (!this.meetings.has(meetingId)) {
          this.meetings.set(meetingId, new Set());
        }
        this.meetings.get(meetingId).add(socket.id);
      });

      socket.on('signal', ({ meetingId, signal }) => {
        socket.to(meetingId).emit('signal', signal);
      });

      socket.on('stream-chunk', ({ meetingId, chunk }) => {
        socket.to(meetingId).emit('stream-chunk', chunk);
      });

      socket.on('disconnect', () => {
        this.meetings.forEach((participants, meetingId) => {
          if (participants.has(socket.id)) {
            participants.delete(socket.id);
            if (participants.size === 0) {
              this.meetings.delete(meetingId);
            }
          }
        });
      });
    });
  }
}

module.exports = SocketService;
