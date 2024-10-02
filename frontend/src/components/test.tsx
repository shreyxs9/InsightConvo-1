import React, { useState, useEffect, useRef } from "react";

const SpeechToText: React.FC = () => {
  const [transcript, setTranscript] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket("ws://localhost:5000");
    setWs(socket);

    socket.onmessage = (event) => {
      setTranscript(event.data);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result?.toString().split(",")[1];
            console.log(base64Audio);
            if (base64Audio) {
              ws.send(base64Audio);
            }
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorderRef.current.start(100); // Send audio in chunks of 100ms
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div>
      <h1>Speech to Text</h1>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <div>
        <h2>Transcript:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default SpeechToText;
