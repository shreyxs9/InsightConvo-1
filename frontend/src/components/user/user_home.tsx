import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  Home, 
  Clock, 
  Archive, 
  Calendar 
} from "lucide-react";

import Nav from "../../models/nav";
import MeetingCard from "../../models/meetingcard";

interface Meeting {
  _id: string;
  name: string;
  date: string;
  time: string;
  email: string;
  isUpcoming: boolean;
  isAdmin:false;
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
    navigate(`/user/meeting/${meetingId}`);
  };

  const renderMeetingSection = (title: string, filterUpcoming: boolean) => {
    const filteredMeetings = meetings.filter(
      (meeting) => meeting.isUpcoming === filterUpcoming
    );

    return (
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center p-4 border-b dark:border-gray-700">
          {filterUpcoming ? (
            <Clock className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
          ) : (
            <Archive className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-400" />
          )}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100">
            {title}
          </h2>
        </div>

        {filteredMeetings.length > 0 ? (
          <div className="grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredMeetings.map((meeting) => (
           <MeetingCard
           key={meeting._id}
           name={meeting.name}
           date={meeting.date}
           time={meeting.time}
           email={meeting.email}
           isAdmin={false} // Non-admin users
           onClick={() => handleCardClick(meeting._id)}
         />
         
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No {title.toLowerCase()} available
            </p>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center mb-8 space-x-4">
          <Home className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <div>
            {userName && (
              <>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Welcome, {userName}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Here's an overview of your meetings
                </p>
              </>
            )}
          </div>
        </header>

        <div className="space-y-8">
          {renderMeetingSection("Upcoming Meetings", true)}
          {renderMeetingSection("Past Meetings", false)}
        </div>
      </div>
    </div>
  );
};

export default UserHome;