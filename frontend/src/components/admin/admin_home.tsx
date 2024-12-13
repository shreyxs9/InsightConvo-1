import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  Home, 
  CalendarPlus, 
  UserCircle, 
  Clock, 
  Archive,
  X 
} from "lucide-react";

import Nav from "../../models/nav";
import MeetingCard from "../../models/meetingcard";
import AddMeeting from "../../models/addmeetings";

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
        navigate("/login");
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
          Authorization: `Bearer ${token}`,
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
      navigate("/login");
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:5000/admin/meetings/${meetingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete meeting");
      }

      // Remove the deleted meeting from the state
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting._id !== meetingId)
      );
    } catch (error) {
      console.error("Failed to delete meeting:", error);
    }
  };


  const handleCardClick = (meetingId: string) => {
    console.log("Navigating to meeting details:", meetingId);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Nav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Home className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Admin Dashboard
              </h1>
              {userName && (
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome, {userName}
                </p>
              )}
            </div>
          </div>
          
          {/* Add Meeting Button on Top */}
          <button
            onClick={toggleAddMeeting}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            <CalendarPlus size={20} />
            <span>Add Meeting</span>
          </button>
        </div>

        {/* Meetings Sections */}
        <div className="space-y-8">
          {/* Upcoming Meetings */}
          <section>
            <div className="flex items-center mb-4 space-x-2">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Upcoming Meetings
              </h2>
            </div>
            {meetings.filter((meeting) => meeting.isUpcoming).length === 0 ? (
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">
                  No upcoming meetings scheduled
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings
                  .filter((meeting) => meeting.isUpcoming)
                  .map((meeting) => (
                    <div 
                      key={meeting._id}
                      onClick={() => handleCardClick(meeting._id)}
                      className="cursor-pointer"
                    >
                      <MeetingCard
               name={meeting.name}
               isAdmin={true}
  date={meeting.date}
  time={meeting.time}
  email={meeting.email}
  onDelete={() => deleteMeeting(meeting._id)} // New delete handler

/>
                    </div>
                  ))}
              </div>
            )}
          </section>

          {/* Past Meetings */}
          <section>
            <div className="flex items-center mb-4 space-x-2">
              <Archive className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Past Meetings
              </h2>
            </div>
            {meetings.filter((meeting) => !meeting.isUpcoming).length === 0 ? (
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">
                  No past meetings found
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings
                  .filter((meeting) => !meeting.isUpcoming)
                  .map((meeting) => (
                    <div 
                      key={meeting._id}
                      onClick={() => handleCardClick(meeting._id)}
                      className="cursor-pointer"> 
                      <MeetingCard
               name={meeting.name}
               isAdmin={true}
  date={meeting.date}
  time={meeting.time}
  email={meeting.email}
  onDelete={() => deleteMeeting(meeting._id)} // New delete handler

/>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Add Meeting Modal */}
      {showAddMeeting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <button
              onClick={toggleAddMeeting}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 z-10"
            >
              <X size={24} />
            </button>
            <AddMeeting onMeetingAdded={fetchMeetings} closePopup={toggleAddMeeting} />
          </div>
        </div>
      )}

      {/* Remove the floating button since we now have a top button */}
    </div>
  );
};

export default AdminHome;