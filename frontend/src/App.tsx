import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminHome from "./components/admin_home";
import Login from "./components/login";
import Signup from "./components/signup";
import UserHome from "./components/user_home";

const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(
            "http://localhost:5000/api/auth/userType",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const data = await response.json();
          setUserType(data.userType);
        }
      } catch (error) {
        console.error("Authentication check failed", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userType) {
    return <Navigate to="/login" />;
  }

  if (userType === "admin") {
    return <Navigate to="/admin" />;
  }

  return <Navigate to="/user" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
