import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./nav"; // Adjust the import path as necessary

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    location: "",
    college: "",
    collegeLocation: "",
    cgpa: "",
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: token, // Ensure the Bearer prefix is included
            },
          }
        );

        console.log("Profile data:", response.data);

        setProfileData({
          name: response.data.name || "",
          email: response.data.email || "",
          mobile: response.data.mobile || "",
          dob: response.data.dob || "",
          location: response.data.location || "",
          college: response.data.college || "",
          collegeLocation: response.data.collegeLocation || "",
          cgpa: response.data.cgpa || "",
          skills: response.data.skills || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    if (name !== "email") {
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setSuccessMessage(""); // Clear previous success message
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        profileData,
        {
          headers: {
            Authorization: token, // Ensure the Bearer prefix is included
          },
        }
      );
      console.log("Profile updated successfully:", response.data);

      setSuccessMessage("Profile updated successfully!"); // Set success message
    } catch (error) {
      console.error("Error updating profile:", error);
      setSuccessMessage("Failed to update profile. Please try again."); // Set failure message
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Navigation */}
      <Nav />

      {/* Profile Form */}
      <div className="max-w-2xl mx-auto mt-10 p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

        <div className="space-y-4">
          {Object.keys(profileData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                name={key}
                value={profileData[key as keyof typeof profileData]}
                onChange={handleChange}
                readOnly={key === "email"} // Lock email field
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  key === "email"
                    ? "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:text-white text-gray-900 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                }`}
              />
            </div>
          ))}
        </div>

        {successMessage && (
          <div
            className={`p-4 mt-4 text-center ${
              successMessage.includes("Failed")
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            } rounded-md`}
          >
            {successMessage}
          </div>
        )}

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className={`mt-6 w-full px-4 py-2 font-semibold rounded-lg shadow-md ${
            isUpdating
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white`}
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
