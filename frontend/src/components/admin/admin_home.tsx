import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import without destructuring
import Nav from "../../models/nav";
import MeetingCard from "../../models/meetingcard";
import AddMeeting from "../../models/addmeetings";
import { FaTimes } from "react-icons/fa";

interface Meeting {
  _id: string;
  name: string;
  date: string;
  time: string;
  email: string;
  isUpcoming: boolean;
}

const AdminHome: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/admin");
    }
    const tokenstored = localStorage.getItem("token");
    if (tokenstored) {
      try {
        const decodedToken: any = jwtDecode(tokenstored);
        setUserName(decodedToken.name);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      navigate("/login");
    }

    fetchMeetings();
  }, [location, navigate]);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch("http://localhost:5000/admin/meetings", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }

      const data = await response.json();
      setMeetings(data);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    }
  };

  const handleCardClick = (meetingId: string) => {
    console.log(`Meeting ID: ${meetingId}`);
    navigate(`/admin/meeting/${meetingId}`);
  };

  const toggleAddMeeting = () => {
    setShowAddMeeting(!showAddMeeting);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddMeeting(false);
      }
    };

    if (showAddMeeting) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAddMeeting]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <Nav />
      {userName && (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome, {userName}!
        </p>
      )}

      <div className="container mx-auto mt-8 p-4">
        {/* Upcoming Meetings Section */}
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
          Upcoming Meetings
        </h2>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {meetings
            .filter((meeting) => meeting.isUpcoming)
            .map((meeting) => (
              <MeetingCard
                key={meeting._id}
                name={meeting.name}
                date={meeting.date}
                time={meeting.time}
                email={meeting.email}
                onClick={() => handleCardClick(meeting._id)}
              />
            ))}
        </div>

        {/* Past Meetings Section */}
        <h2 className="text-2xl font-semibold text-black dark:text-white mt-8 mb-4">
          Past Meetings
        </h2>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {meetings
            .filter((meeting) => !meeting.isUpcoming)
            .map((meeting) => (
              <MeetingCard
                key={meeting._id}
                name={meeting.name}
                date={meeting.date}
                time={meeting.time}
                email={meeting.email}
                onClick={() => handleCardClick(meeting._id)}
              />
            ))}
        </div>
      </div>

      {showAddMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded w-1/2 h-3/4 overflow-auto">
            <button
              onClick={toggleAddMeeting}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            >
              <FaTimes size={24} />
            </button>
            <AddMeeting onMeetingAdded={fetchMeetings} />
          </div>
        </div>
      )}

      <button
        onClick={toggleAddMeeting}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
      >
        + Add Meeting
      </button>
    </div>
  );
};

export default AdminHome;
