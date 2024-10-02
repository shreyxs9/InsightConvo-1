import React, { useState } from "react";

const Video: React.FC = () => {
  const [transcription, setTranscription] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    const audioStream = new ReadableStream({
      start(controller) {
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            controller.enqueue(event.data);
          }
        };

        recorder.onstop = () => {
          controller.close();
        };

        recorder.onerror = (err) => {
          console.error("Recorder error:", err);
          controller.error(err);
        };
      },
    });

    // fetch("http://localhost:5000/api/stream", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "audio/webm",
    //   },
    //   body: audioStream,
    //   duplex: "half", // Fixes the streaming body issue
    // })
    //   .then((response) => {
    //     const reader = response.body?.getReader();
    //     if (reader) {
    //       readStream(reader);
    //     }
    //   })
    //   .catch((error) => console.error("Error:", error));
    console.log("test" + audioStream);
    recorder.start(200); // Send audio every 200ms
    setMediaRecorder(recorder);
  };

  const readStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>
  ) => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const decodedString = new TextDecoder().decode(value);
      const jsonResponse = JSON.parse(decodedString);
      setTranscription((prev) => `${prev} ${jsonResponse.transcription}`);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Real-Time Speech to Text</h1>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 text-white ${
            isRecording ? "bg-red-500" : "bg-green-500"
          } rounded-full`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-lg">
          <p className="text-lg">Real-Time Transcription:</p>
          <p className="mt-2 text-gray-700">{transcription}</p>
        </div>
      </div>
    </div>
  );
};

export default Video;
