import React, { useEffect, useState } from "react";
import axios from "axios";

const CandidatesListView = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch candidates data
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/candidates"); // Replace with your backend URL
        setCandidates([...response.data.selected, ...response.data.notSelected]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch candidates. Please try again.");
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleBackToList = () => {
    setSelectedCandidate(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      {selectedCandidate ? (
        // Detailed view of a candidate
        <div>
          <button onClick={handleBackToList} style={{ marginBottom: "20px" }}>
            Back to List
          </button>
          <h1>Candidate Details</h1>
          <p><strong>Name:</strong> {selectedCandidate.name || "N/A"}</p>
          <p><strong>Email:</strong> {selectedCandidate.email}</p>
          <p><strong>Resume Score:</strong> {selectedCandidate.resumeScore}</p>
          <p><strong>Transcription Score:</strong> {selectedCandidate.transcriptionScore}</p>
          <p><strong>Confidence:</strong> {selectedCandidate.confidence}</p>
          <p><strong>Overall Emotion:</strong> {selectedCandidate.overallEmotion}</p>
          <p><strong>Overall Score:</strong> {selectedCandidate.overallScore}</p>
          <p><strong>Confidence Analysis:</strong> {selectedCandidate.confidenceAnalysis}</p>
        </div>
      ) : (
        // List view of candidates
        <div>
          <h1>Candidate List</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  width: "200px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleCandidateClick(candidate)}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || candidate.email)}`}
                  alt="Candidate DP"
                  style={{ borderRadius: "50%", width: "80px", height: "80px" }}
                />
                <p><strong>{candidate.name || "N/A"}</strong></p>
                <p>{candidate.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesListView;
