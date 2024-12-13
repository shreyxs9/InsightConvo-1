import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Trash2, Plus } from "lucide-react";

interface AddMeetingProps {
  onMeetingAdded: () => void;
  closePopup: () => void;
}

const AddMeeting: React.FC<AddMeetingProps> = ({ onMeetingAdded, closePopup }) => {
  const initialFormData = {
    name: "",
    date: "",
    time: "",
    intervieweeName: "",
    email: "",
    role: "",
    jobDescription: "",
    interviewType: "",
    importantQuestions: [""],
    interviewerName: "",
    interviewerEmail: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return {
        interviewerName: decodedToken.name,
        interviewerEmail: decodedToken.email,
      };
    }
    return { interviewerName: "", interviewerEmail: "" };
  };

  React.useEffect(() => {
    const interviewerInfo = decodeToken();
    setFormData((prevData) => ({
      ...prevData,
      interviewerName: interviewerInfo.interviewerName,
      interviewerEmail: interviewerInfo.interviewerEmail,
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newQuestions = [...formData.importantQuestions];
    newQuestions[index] = e.target.value;
    setFormData({ ...formData, importantQuestions: newQuestions });
  };

  const removeQuestionField = (index: number) => {
    const newQuestions = formData.importantQuestions.filter((_, i) => i !== index);
    setFormData({ ...formData, importantQuestions: newQuestions });
  };

  const addQuestionField = () => {
    setFormData({
      ...formData,
      importantQuestions: [...formData.importantQuestions, ""],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem("token");

    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:5000/admin/meetings/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Meeting added successfully");
      setFormData(initialFormData);
      onMeetingAdded();
      closePopup();
    } catch (error) {
      console.error("Failed to add meeting:", error);
      setMessage("Failed to add meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add Meeting</h2>
        <button 
          onClick={closePopup} 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Meeting Name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
          <div className="col-span-1">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div className="col-span-1">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="intervieweeName"
            placeholder="Interviewee Name"
            value={formData.intervieweeName}
            onChange={handleChange}
            className="col-span-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="col-span-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="col-span-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
          <input
            type="text"
            name="interviewType"
            placeholder="Interview Type"
            value={formData.interviewType}
            onChange={handleChange}
            className="col-span-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
        </div>

        <textarea
          name="jobDescription"
          placeholder="Job Description"
          value={formData.jobDescription}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[100px]"
          required
        ></textarea>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Important Questions
            </h3>
            <button
              type="button"
              onClick={addQuestionField}
              className="text-blue-500 hover:text-blue-600 flex items-center dark:text-blue-300"
            >
              <Plus className="mr-1" size={16} /> Add Question
            </button>
          </div>
          
          {formData.importantQuestions.map((question, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Important Question ${index + 1}`}
                value={question}
                onChange={(e) => handleQuestionsChange(e, index)}
                className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {formData.importantQuestions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestionField(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`w-full p-3 rounded-md text-white font-semibold transition-colors ${
            loading 
              ? "bg-blue-400 cursor-not-allowed" 
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : message || "Add Meeting"}
        </button>
      </form>
    </div>
  );
};

export default AddMeeting;