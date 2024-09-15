import React, { useState, useEffect, useRef } from "react";
import {
  IoMic,
  IoMicOff,
  IoVideocam,
  IoVideocamOff,
  IoCall,
  IoCallSharp,
} from "react-icons/io5";
import Nav from "../../models/nav";

const MeetingDashboard: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const handleMicToggle = () => setIsMicOn(!isMicOn);
  const handleCameraToggle = () => setIsCameraOn(!isCameraOn);

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-screen-xl mx-auto  p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Meeting Dashboard
          </h2>

          {/* Video Feed Area */}
          <div className="flex flex-col items-center">
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
