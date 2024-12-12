import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User as UserIcon,
  FileText as FileTextIcon,
  Award as AwardIcon,
  CheckCircle2 as CheckIcon,
  XCircle as XIcon,
  ArrowLeft as BackIcon,
  RefreshCw as RefreshIcon,
  Moon as MoonIcon,
  Sun as SunIcon
} from "lucide-react";

const AdminPanel: React.FC = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference for initial theme
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
           (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    // Apply dark mode class to root element
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoadingUser(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/meeting-details/${meetingId}`
        );
        setUserDetails(response.data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch user details");
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

    try {
      const response = await axios.get(
        `http://localhost:5000/api/evaluate-candidate/${meetingId}`
      );
      setEvaluationResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch evaluation");
    } finally {
      setLoadingEvaluation(false);
    }
  };

  const renderScoreIndicator = (score: number) => {
    const baseClasses = "h-2 rounded-full transition-all duration-300 ease-in-out";
    const getColorClass = (score: number) => {
      if (score >= 8) return "bg-green-500";
      if (score >= 5) return "bg-yellow-500";
      return "bg-red-500";
    };

    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
        <div
          className={`${baseClasses} ${getColorClass(score)}`}
          style={{ width: `${score * 10}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen py-10 px-5">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleDarkMode} 
        className="fixed top-4 right-4 z-50 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6 text-blue-600" />}
      </button>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Navigation Header */}
        <header className="bg-blue-600 dark:bg-blue-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 hover:bg-blue-500 dark:hover:bg-blue-700 p-2 rounded-full transition"
            >
              <BackIcon className="w-6 h-6" />
            </button>
            <AwardIcon className="mr-4 w-10 h-10" />
            <h1 className="text-2xl font-bold">Candidate Evaluation Portal</h1>
          </div>
        </header>

        <main className="p-8">
          {/* User Details Section */}
          <section className="mb-8">
            <header className="flex items-center mb-4">
              <UserIcon className="mr-3 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Candidate Profile</h2>
            </header>

            {loadingUser ? (
              <div className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
                Fetching candidate details...
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : userDetails ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{userDetails.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{userDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User ID</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{userDetails._id}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">No user details available</div>
            )}
          </section>

          {/* Evaluation Button */}
          <div className="flex space-x-4">
            <button
              onClick={evaluateCandidate}
              className="flex-grow bg-blue-600 dark:bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition flex items-center justify-center disabled:opacity-50"
              disabled={loadingEvaluation || !userDetails}
            >
              {loadingEvaluation ? (
                <>
                  <RefreshIcon className="animate-spin mr-3 w-5 h-5" />
                  Evaluating...
                </>
              ) : (
                "Evaluate Candidate"
              )}
            </button>
            {evaluationResult && (
              <button
                onClick={() => setEvaluationResult(null)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Reset
              </button>
            )}
          </div>

          {/* Evaluation Results */}
          {evaluationResult && (
            <section className="mt-8 animate-fade-in">
              <header className="flex items-center mb-4">
                <FileTextIcon className="mr-3 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Evaluation Results</h2>
              </header>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 grid md:grid-cols-2 gap-4">
                {[
                  { label: "Resume Score", value: evaluationResult.resumeScore },
                  { label: "Transcription Score", value: evaluationResult.transcriptionScore },
                  { label: "Confidence Score", value: evaluationResult.confidence.toFixed(1) },
                  { label: "Overall Score", value: evaluationResult.overallScore.toFixed(1) }
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{value}/10</span>
                    </div>
                    {renderScoreIndicator(parseFloat(value))}
                  </div>
                ))}
              </div>

              {/* Candidate Status */}
              <div
                className={`mt-6 p-6 rounded-lg text-center flex flex-col items-center transition-all duration-300 ${
                  evaluationResult.candidateStatus === "Selected"
                    ? "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
                    : "bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700"
                }`}
              >
                {evaluationResult.candidateStatus === "Selected" ? (
                  <>
                    <CheckIcon className="w-16 h-16 text-green-600 dark:text-green-400 mb-4" />
                    <p className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Candidate Selected</p>
                    <p className="text-green-600 dark:text-green-400">
                      Congratulations! The candidate has successfully met the selection criteria.
                    </p>
                  </>
                ) : (
                  <>
                    <XIcon className="w-16 h-16 text-red-600 dark:text-red-400 mb-4" />
                    <p className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Candidate Rejected</p>
                    <p className="text-red-600 dark:text-red-400">
                      Unfortunately, the candidate did not meet the required evaluation criteria.
                    </p>
                  </>
                )}
              </div>

              {/* Confidence Analysis */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Confidence Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">{evaluationResult.confidenceAnalysis}</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;