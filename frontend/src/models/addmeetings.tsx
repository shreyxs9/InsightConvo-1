import React, { useState } from "react";
import axios from "axios";

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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    setMessage(""); // Reset the message

    try {
      await axios.post("http://localhost:5000/api/meetings/", formData);
      setMessage("Meeting added successfully");
      setFormData(initialFormData); // Reset form fields
      onMeetingAdded(); // Call the callback function
    } catch (error) {
      console.error("Failed to add meeting:", error);
      setMessage("Failed to add meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-700 p-4 rounded shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 dark:text-white">Add Meeting</h2>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Meeting Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={formData.date}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />
        <input
          type="time"
          name="time"
          placeholder="Time"
          value={formData.time}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />
        <input
          type="text"
          name="intervieweeName"
          placeholder="Interviewee Name"
          value={formData.intervieweeName}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />
        <textarea
          name="jobDescription"
          placeholder="Job Description"
          value={formData.jobDescription}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        ></textarea>
        <input
          type="text"
          name="interviewType"
          placeholder="Type of Interview"
          value={formData.interviewType}
          onChange={handleChange}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />
        {formData.importantQuestions.map((question, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Important Question ${index + 1}`}
            value={question}
            onChange={(e) => handleQuestionsChange(e, index)}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        ))}
        <button
          type="button"
          onClick={addQuestionField}
          className="text-blue-500 dark:text-blue-300"
        >
          Add Question
        </button>
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : message || "Add Meeting"}
        </button>
      </div>
    </form>
  );
};

export default AddMeeting;
