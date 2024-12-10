import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RulesAndRegulations from "../../models/RulesAndRegulations";

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

  // Start the local video stream
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
      } catch (error) {
        console.error("Error accessing local video:", error);
      }
    };

    startLocalVideo();

    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Start recording (audio)
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

  // Stop recording (audio)
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Send audio to transcription service
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
    <div>
      {isModalOpen && (
        <RulesAndRegulations
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onFileUpload={setResumeFile}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full rounded-xl"
            ></video>
            <div className="absolute bottom-4 left-4 flex space-x-4">
              <button
                onClick={startRecording}
                className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white transition disabled:bg-gray-500"
                disabled={isRecording || questionCount >= MAX_QUESTIONS}
              >
                Start Recording
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-400 text-white transition disabled:bg-gray-500"
                disabled={!isRecording || questionCount >= MAX_QUESTIONS}
              >
                Stop Recording
              </button>
            </div>
          </div>
          <div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Current Question</h2>
              <p className="text-lg text-gray-300 mb-4">{currentQuestion}</p>
              <p className="text-sm text-gray-500">
                Question {questionCount} of {MAX_QUESTIONS}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mt-6">
              <h2 className="text-xl font-semibold mb-4">Transcription</h2>
              <p className="text-lg text-gray-300">
                {transcription || "Waiting for transcription..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
