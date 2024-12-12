import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Calendar, Clock, User, Mail, Briefcase, FileText, List, Plus, Send } from "lucide-react";

interface AddMeetingProps {
  onMeetingAdded: () => void;
}

const AddMeeting: React.FC<AddMeetingProps> = ({ onMeetingAdded }) => {
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

  // Decode token and set interviewer info
  useEffect(() => {
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

    const interviewerInfo = decodeToken();
    setFormData((prevData) => ({
      ...prevData,
      interviewerName: interviewerInfo.interviewerName,
      interviewerEmail: interviewerInfo.interviewerEmail,
    }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQuestionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newQuestions = [...formData.importantQuestions];
    newQuestions[index] = e.target.value;
    setFormData({ ...formData, importantQuestions: newQuestions });
  };

  const addQuestionField = () => {
    setFormData({
      ...formData,
      importantQuestions: [...formData.importantQuestions, ""],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/admin/meetings/", formData);
      setMessage("Meeting added successfully");
      setFormData(initialFormData);
      onMeetingAdded();
    } catch (error) {
      console.error("Failed to add meeting:", error);
      setMessage("Failed to add meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <div className="flex items-center mb-6">
        <Calendar className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Schedule New Interview
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Meeting Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Meeting Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>

          {/* Date */}
          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Time */}
          <div className="relative">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>

          {/* Interviewee Name */}
          <div className="relative">
            <input
              type="text"
              name="intervieweeName"
              placeholder="Interviewee Name"
              value={formData.intervieweeName}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>

          {/* Role */}
          <div className="relative">
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Job Description */}
        <div className="relative">
          <textarea
            name="jobDescription"
            placeholder="Job Description"
            value={formData.jobDescription}
            onChange={handleChange}
            className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
            required
          ></textarea>
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Interview Type */}
          <div className="relative">
            <input
              type="text"
              name="interviewType"
              placeholder="Type of Interview"
              value={formData.interviewType}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <List className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Important Questions */}
        <div>
          <div className="flex items-center mb-2">
            <List className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Important Questions
            </h3>
          </div>
          {formData.importantQuestions.map((question, index) => (
            <div key={index} className="relative mb-2">
              <input
                type="text"
                placeholder={`Important Question ${index + 1}`}
                value={question}
                onChange={(e) => handleQuestionsChange(e, index)}
                className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <List className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestionField}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Question
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin mr-2">🔄</div>
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          {message || "Schedule Interview"}
        </button>
      </form>
    </div>
  );
};

export default AddMeeting;