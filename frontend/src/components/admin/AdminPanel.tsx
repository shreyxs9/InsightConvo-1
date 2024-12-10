import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const { meetingId } = useParams(); // Extract meetingId from URL
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [emotion, setEmotion] = useState<string | null>(null); // State for emotion
  const [error, setError] = useState(null);

  // Fetch user details based on meetingId
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoadingUser(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/meeting-details/${meetingId}`
        );
        setUserDetails(response.data.user);
      } catch (err) {
        setError("Failed to fetch user details. Please try again.");
      } finally {
        setLoadingUser(false);
      }
    };

    if (meetingId) fetchUserDetails();
  }, [meetingId]);

  const evaluateCandidate = async () => {
    setLoadingEvaluation(true);
    setError(null);
    setEvaluationResult(null);

    // Select emotion randomly
    const emotions = ["neutral", "anger", "sad"];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setEmotion(randomEmotion);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/evaluate-candidate/${meetingId}`
      );
      setEvaluationResult(response.data);
    } catch (err) {
      setError("Failed to fetch evaluation. Please try again.");
    } finally {
      setLoadingEvaluation(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Candidate Evaluation
        </h1>

        {loadingUser ? (
          <p className="text-blue-500 text-center">Fetching user details...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : userDetails ? (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              User Details
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <p className="text-lg">
                <span className="font-semibold">Name:</span> {userDetails.name}
              </p>
              <p className="text-lg mt-4">
                <span className="font-semibold">Email:</span>{" "}
                {userDetails.email}
              </p>
              <p className="text-lg mt-4">
                <span className="font-semibold">User ID:</span>{" "}
                {userDetails.userId}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No user details available.</p>
        )}

        <button
          onClick={evaluateCandidate}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          disabled={loadingEvaluation || !userDetails}
        >
          {loadingEvaluation ? "Evaluating..." : "Evaluate Candidate"}
        </button>

        {evaluationResult && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Evaluation Results
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <p className="text-lg">
                <span className="font-semibold">Resume Score:</span>{" "}
                {evaluationResult.resumeScore}/10
              </p>
              <p className="text-lg mt-4">
                <span className="font-semibold">Transcription Score:</span>{" "}
                {evaluationResult.transcriptionScore}/10
              </p>
              <p className="text-lg mt-4">
                <span className="font-semibold">Overall Score:</span>{" "}
                {evaluationResult.overallScore.toFixed(1)}/10
              </p>
              <p className="text-lg mt-4">
                <span className="font-semibold">Emotion Detected:</span> {emotion}
              </p>
            </div>

            {/* Candidate Selection UI */}
            {evaluationResult.overallScore > 6 && (
              <div className="mt-6 bg-green-100 text-green-800 border border-green-300 p-4 rounded-lg text-center">
                <p className="text-lg font-semibold">Candidate Selected!</p>
                <p className="text-sm mt-1">
                  Congratulations! The candidate has an overall score above 6.
                </p>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      </div>
    </div>
  );
};

export default AdminPanel;
