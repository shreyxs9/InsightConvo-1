import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import 'webrtc-adapter';

const AdminPanel: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [error, setError] = useState<string | null>(null);
  
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.emit('join-room', { roomId: meetingId, role: 'admin' });

    setupWebRTC();

    return () => {
      peerConnectionRef.current?.close();
      socket.disconnect();
    };
  }, [meetingId]);

  const setupWebRTC = async () => {
    try {
      // Create and configure peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });
      peerConnectionRef.current = peerConnection;

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            roomId: meetingId,
            candidate: event.candidate
          });
        }
      };

      // Listen for signaling events
      socketRef.current?.on('user-joined', ({ role }) => {
        if (role === 'candidate') {
          socketRef.current?.emit('request-offer', { roomId: meetingId });
        }
      });

      socketRef.current?.on('receive-offer', async ({ offer }) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketRef.current?.emit('send-answer', {
          roomId: meetingId,
          answer
        });
      });

      socketRef.current?.on('receive-ice-candidate', async ({ candidate }) => {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      });

    } catch (error) {
      console.error('Error setting up WebRTC:', error);
      setError('Failed to set up video connection');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Interview Session</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default AdminPanel;