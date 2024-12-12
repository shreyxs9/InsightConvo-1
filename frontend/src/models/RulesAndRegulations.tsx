import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FileText, CheckCircle, Upload } from "lucide-react";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleCloseModal = async () => {
    const user = getUserFromToken();

    if (!isAgreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    if (!selectedFile) {
      alert("Please upload your resume.");
      return;
    }

    if (user) {
      setIsUploading(true);
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
          onFileUpload(selectedFile);
          setIsModalOpen(false);
        } else {
          alert("Failed to upload PDF.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
      } finally {
        setIsUploading(false);
      }
    } else {
      alert("No user information available.");
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 border-b dark:border-gray-700 p-6 pb-4">
              <div className="flex items-center space-x-4">
                <FileText className="w-10 h-10 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Interview Rules and Regulations
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Please read the following rules and regulations carefully before proceeding with your interview.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Respectful Conduct",
                    description: "Maintain a professional and respectful demeanor throughout the interview process."
                  },
                  {
                    title: "Technology Requirements",
                    description: "Ensure a stable internet connection and a device with functioning audio and video capabilities."
                  },
                  {
                    title: "Honesty and Accuracy",
                    description: "Provide honest and accurate responses to all interview questions."
                  },
                  {
                    title: "Privacy and Confidentiality",
                    description: "Do not share interview questions, responses, or proprietary information."
                  }
                ].map((rule, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {rule.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {rule.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-3 mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Upload Resume
                  </label>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-blue-900/50 dark:file:text-blue-300
                    dark:hover:file:bg-blue-900/70"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3 mt-4">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={isAgreed}
                  onChange={() => setIsAgreed(!isAgreed)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label 
                  htmlFor="agree-terms" 
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  I agree to the terms and conditions of InsightConvo
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 p-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseModal}
                disabled={!isAgreed || !selectedFile || isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                  hover:bg-blue-700 transition-colors duration-300
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                  flex items-center space-x-2"
              >
                {isUploading ? (
                  <span>Uploading...</span>
                ) : (
                  <>
                    <span>Proceed to Interview</span>
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RulesAndRegulations;