import React, { useState, useEffect, useRef } from "react";
import {
  IoMic,
  IoMicOff,
  IoVideocam,
  IoVideocamOff,
  IoCall,
  IoCallSharp,
} from "react-icons/io5";
import { io } from 'socket.io-client';
import { jwtDecode } from "jwt-decode";
import Nav from "../../models/nav";
import RulesAndRegulations from "../../models/RulesAndRegulations";

const MeetingDashboard: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true); // For modal visibility
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<any>(null);

  // Function to decode JWT and extract user information
  const getUserFromToken = () => {
    const token = localStorage.getItem("token"); // Adjust the key if it's different
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return {
        name: decoded.name, // Adjust these fields based on your token's structure
        email: decoded.email,
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = io('http://localhost:5000'); // Backend URL

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socketRef.current.disconnect(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const startMediaStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: isCameraOn,
          audio: isMicOn,
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
          videoRef.current.play();
        }
        console.log("Media stream started");
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    if (isCameraOn || isMicOn) {
      startMediaStream();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn, isMicOn]);

  useEffect(() => {
    if (stream && socketRef.current) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.onended = () => {
          console.log('Audio track ended');
        };

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socketRef.current) {
            socketRef.current.emit('audio', event.data);
          }
        };
        mediaRecorder.start(1000); // Send data every second

        return () => {
          mediaRecorder.stop();
        };
      }
    }
  }, [stream]);

  const handleMicToggle = () => setIsMicOn(!isMicOn);
  const handleCameraToggle = () => setIsCameraOn(!isCameraOn);

  // Handle modal close and file upload
  const handleFileUpload = (file: File | null) => {
    console.log("Uploaded file:", file);
    // You can add further handling or state updates as needed
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* <RulesAndRegulations
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onFileUpload={handleFileUpload} // Pass the callback function
        /> */}

        <div className="max-w-screen-xl mx-auto  p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          {/* Video Feed Area */}
          <div className="flex flex-col mt-10 items-center">
            <div className="relative w-full md:w-3/5 h-80 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {/* Video feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {!stream && (
                  <p className="text-gray-500 dark:text-gray-300">
                    Your Video Feed
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="flex space-x-4">
              {/* Microphone Toggle */}
              <button
                onClick={handleMicToggle}
                className={`p-3 rounded-full ${
                  isMicOn
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-500 hover:bg-gray-700"
                }`}
              >
                {isMicOn ? (
                  <IoMic className="text-white" />
                ) : (
                  <IoMicOff className="text-white" />
                )}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={handleCameraToggle}
                className={`p-3 rounded-full ${
                  isCameraOn
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-500 hover:bg-gray-700"
                }`}
              >
                {isCameraOn ? (
                  <IoVideocam className="text-white" />
                ) : (
                  <IoVideocamOff className="text-white" />
                )}
              </button>
            </div>

            {/* Meeting Action Button */}
            <div className="mt-4">
              {isCameraOn || isMicOn ? (
                <button
                  onClick={() => setStream(null)}
                  className="p-3 bg-red-500 hover:bg-red-700 text-white rounded-full"
                >
                  <IoCallSharp className="text-white" />
                </button>
              ) : (
                <button
                  onClick={() => setStream(null)}
                  className="p-3 bg-green-500 hover:bg-green-700 text-white rounded-full"
                >
                  <IoCall className="text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeetingDashboard;
