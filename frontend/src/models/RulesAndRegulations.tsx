import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

interface RulesAndRegulationsProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFileUpload: (file: File | null) => void;
}

const RulesAndRegulations: React.FC<RulesAndRegulationsProps> = ({
  isModalOpen,
  setIsModalOpen,
  onFileUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // For file upload
  const [, setIsUploading] = useState(false); // For loading state

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

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // Handle modal close and file upload
  const handleCloseModal = async () => {
    const user = getUserFromToken(); // Get user information from the token

    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    if (user) {
      setIsUploading(true); // Show loading indicator
      // Create form data
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("name", user.name);
      formData.append("email", user.email);

      try {
        const response = await fetch("http://localhost:5000/api/upload-pdf", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          //   alert("PDF uploaded and content extracted successfully.");
        } else {
          alert("Failed to upload PDF.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
      } finally {
        setIsUploading(false); // Hide loading indicator
        setIsModalOpen(false); // Close the modal
        onFileUpload(selectedFile); // Callback to parent component with uploaded file
      }
    } else {
      alert("No user information available.");
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed overflow-y-auto inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mt-8 mb-4">
              Rules and Regulations
            </h2>
            <p className="mb-4">
              Please read the following rules and regulations carefully before
              proceeding.
            </p>
            {/* Rules content here */}
            <ul>
              <li>
                <strong>Respectful Conduct:</strong> Candidates must maintain a
                respectful demeanor throughout the interview process.
              </li>
              <li>
                <strong>Microphone and Camera Usage:</strong> Candidates are
                required to keep their microphone muted when not speaking and
                ensure their camera is on during the interview session.
              </li>
              <li>
                <strong>Honesty and Accuracy:</strong> Candidates must provide
                honest and accurate responses to all interview questions.
              </li>
              <li>
                <strong>Compliance with Instructions:</strong> Candidates must
                follow all instructions provided by the AI interviewer and
                platform interface.
              </li>
              <li>
                <strong>Privacy and Confidentiality:</strong> Candidates are
                prohibited from sharing interview questions, responses, or any
                proprietary information obtained during the interview process.
              </li>
              <li>
                <strong>Technology Requirements:</strong> Candidates must have a
                stable internet connection and suitable device with functioning
                audio and video capabilities.
              </li>
              <li>
                <strong>Feedback and Review:</strong> Candidates may receive
                feedback and a summary of their performance after the interview.
              </li>
              <li>
                <strong>Equal Opportunity:</strong> InsightConvo provides equal
                opportunities to all candidates regardless of protected
                characteristics.
              </li>
              <li>
                <strong>Code of Conduct Violations:</strong> Violations may
                result in disqualification from the hiring process or future
                opportunities with InsightConvo.
              </li>
              <li>
                <strong>Agreement to Terms:</strong> Participation in an
                interview on InsightConvo implies agreement to these rules and
                regulations.
              </li>
            </ul>

            {/* File upload section */}
            <div className="mt-4">
              <label className="block mb-2">
                Upload your Resume without photo (PDF):
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg"
              />
            </div>

            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              I Agree and Upload
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RulesAndRegulations;
