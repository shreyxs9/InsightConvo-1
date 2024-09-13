import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Nav from "./nav";

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      // Save token in local storage
      localStorage.setItem("token", token);

      // Decode the token to get user info

      // Redirect to home page after storing token
      navigate("/");
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
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <Nav />
      <h1 className="text-4xl text-black dark:text-white">Home Screen</h1>
      {userName && (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome, {userName}!
        </p>
      )}
    </div>
  );
};

export default Home;
