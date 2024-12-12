import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RulesAndRegulations from "../../models/RulesAndRegulations";
import { jwtDecode } from "jwt-decode";

const MAX_QUESTIONS = 10;

const Interview: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(
    "Tell me about yourself and your background."
  );
  const [transcription, setTranscription] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

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
    const startLocalVideo = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = localStream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        const screenshotInterval = setInterval(() => {
          captureScreenshot();
        }, 10000);

        return () => clearInterval(screenshotInterval);
      } catch (error) {
        console.error("Error accessing local video:", error);
      }
    };

    startLocalVideo();

    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const captureScreenshot = async () => {
    try {
      if (!localStreamRef.current) {
        console.error("No video stream available.");
        return;
      }
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);
  
      const imageBitmap = await imageCapture.grabFrame();
  
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
  
      const context = canvas.getContext("2d");
      if (context) {
        const user = getUserFromToken();

        context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
  
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("screenshot", blob, "screenshot.jpg");
          formData.append("email", user.email);
  
          try {
            const response = await axios.post("http://localhost:5000/api/confidence", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
  
            console.log("Emotion Analysis Result:", response.data);
          } catch (error) {
            console.error("Error sending image to emotion detection API:", error);
          }
        }, "image/jpeg");
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];
        await sendToTranscriptionService(audioBlob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendToTranscriptionService = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/transcribe/${meetingId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setTranscription(response.data.transcription);

      if (response.data.questions && response.data.questions.length > 0) {
        const nextQuestion = response.data.questions[0];
        setCurrentQuestion(nextQuestion);
        setQuestionCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {isModalOpen && (
        <RulesAndRegulations
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onFileUpload={setResumeFile}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="relative bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            ></video>
            <div className="absolute bottom-6 left-6 right-6 flex justify-center space-x-4">
              <button
                onClick={startRecording}
                className="px-6 py-3 rounded-full 
                  bg-blue-600 hover:bg-blue-700 
                  text-white font-semibold 
                  transition duration-300 
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                  shadow-md hover:shadow-lg"
                disabled={isRecording || questionCount >= MAX_QUESTIONS}
              >
                Start Recording
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 rounded-full 
                  bg-red-600 hover:bg-red-700 
                  text-white font-semibold 
                  transition duration-300 
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                  shadow-md hover:shadow-lg"
                disabled={!isRecording || questionCount >= MAX_QUESTIONS}
              >
                Stop Recording
              </button>
            </div>
          </div>

          {/* Information Section */}
          <div className="space-y-6">
            {/* Current Question Card */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Current Question
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Question {questionCount} of {MAX_QUESTIONS}
                </span>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {currentQuestion}
              </p>
            </div>

            {/* Transcription Card */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Transcription
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300 
                min-h-[100px] italic">
                {transcription || "Waiting for your response..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;