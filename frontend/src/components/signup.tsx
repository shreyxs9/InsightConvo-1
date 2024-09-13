import React, { useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Signup: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      window.location.href = "/home";
    } catch (error) {
      setError(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/googleurl";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="absolute top-4 left-4 text-4xl font-bold text-center mb-6">
        InsightConvo
      </div>

      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full focus:outline-none"
      >
        {darkMode ? (
          <IoMoon className="text-white" size={24} />
        ) : (
          <IoSunny className="text-black" size={24} />
        )}
      </button>

      <div
        className={`relative p-8 rounded-lg shadow-lg w-full max-w-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Sign-Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 flex flex-col space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignup}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
              darkMode
                ? "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500"
                : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
            }`}
          >
            <FcGoogle className="w-6 h-6 mr-2" />
            <span className="text-sm">Sign up with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className={`font-medium ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Log In
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
