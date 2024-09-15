import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import without destructuring
import Nav from "../../models/nav";
import MeetingCard from "../../models/meetingcard";

interface Meeting {
  _id: string;
  name: string;
  date: string;
  time: string;
  email: string;
  isUpcoming: boolean;
}

const UserHome: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/user");
    }

    const tokenStored = localStorage.getItem("token");
    if (tokenStored) {
      try {
        const decodedToken: any = jwtDecode(tokenStored);
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
      const response = await fetch("http://localhost:5000/user/meetings", {
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
    navigate(`/user/meeting/${meetingId}`);
  };

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
    </div>
  );
};

export default UserHome;
