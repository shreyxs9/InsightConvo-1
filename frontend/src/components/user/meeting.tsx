import React, { useState, useEffect, useRef } from "react";
import {
  IoMic,
  IoMicOff,
  IoVideocam,
  IoVideocamOff,
  IoCall,
  IoCallSharp,
} from "react-icons/io5";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import Nav from "../../models/nav";

const MeetingDashboard: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Function to decode JWT and extract user information
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return {
        name: decoded.name,
        email: decoded.email,
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socketRef.current.on("transcription", (text: string) => {
      setTranscribedText(text);
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

        // Start recording if microphone is on
        if (isMicOn) {
          const mediaRecorder = new MediaRecorder(userStream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && socketRef.current) {
              socketRef.current.emit("audio", event.data);
            }
          };

          mediaRecorder.start(10000); // Send data every 10 seconds
        }
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
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
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

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-screen-xl mx-auto p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          {/* Video Feed Area */}
          <div className="flex flex-col mt-10 items-center">
            <div className="relative w-full md:w-3/5 h-80 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
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
                  onClick={() => {
                    setIsMicOn(false);
                    setIsCameraOn(false);
                    if (stream) {
                      stream.getTracks().forEach((track) => track.stop());
                    }
                    if (mediaRecorderRef.current) {
                      mediaRecorderRef.current.stop();
                    }
                  }}
                  className="p-3 bg-red-500 hover:bg-red-700 text-white rounded-full"
                >
                  <IoCallSharp className="text-white" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMicOn(true);
                    setIsCameraOn(true);
                  }}
                  className="p-3 bg-green-500 hover:bg-green-700 text-white rounded-full"
                >
                  <IoCall className="text-white" />
                </button>
              )}
            </div>

            {/* Transcribed Text */}
            {transcribedText && (
              <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200">
                  {transcribedText}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MeetingDashboard;
