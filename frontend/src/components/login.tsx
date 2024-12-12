import React, { useState, useEffect } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

// Color Theme Configuration
const colorThemes = {
  light: {
    primary: {
      base: '#3B82F6',      // Blue
      hover: '#2563EB',
      text: 'white',
      background: 'bg-blue-500',
      hoverBackground: 'bg-blue-600',
    },
    background: {
      body: 'bg-gradient-to-br from-gray-100 to-gray-200',
      card: 'bg-gradient-to-br from-white to-gray-50',
      border: 'border-gray-200',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
    },
    input: {
      background: 'bg-white',
      border: 'border-gray-300',
      text: 'text-gray-900',
      focus: 'focus:ring-blue-500',
    },
    error: {
      text: 'text-red-600',
      background: 'bg-red-100',
    },
  },
  dark: {
    primary: {
      base: '#60A5FA',      // Lighter Blue
      hover: '#3B82F6',
      text: 'white',
      background: 'bg-blue-600',
      hoverBackground: 'bg-blue-700',
    },
    background: {
      body: 'bg-gradient-to-br from-gray-900 to-gray-800',
      card: 'bg-gradient-to-br from-gray-800 to-gray-700',
      border: 'border-gray-700',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
    },
    input: {
      background: 'bg-gray-700',
      border: 'border-gray-600',
      text: 'text-white',
      focus: 'focus:ring-blue-500',
    },
    error: {
      text: 'text-red-400',
      background: 'bg-red-900 bg-opacity-30',
    },
  }
};

const Login: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  // Select current theme based on dark mode
  const theme = darkMode ? colorThemes.dark : colorThemes.light;

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save token in local storage or handle it as needed
      localStorage.setItem("token", response.data.token);

      window.location.href = "/";
    } catch (error) {
      let errorMessage = "Failed to do something exceptional";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
      setError(errorMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/googleurl";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme.background.body} ${theme.text.primary}`}
    >
      <div className={`absolute top-4 left-4 text-4xl font-bold text-center mb-6 animate-fade-in ${theme.text.primary}`}>
        InsightConvo
      </div>

      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full focus:outline-none transition transform hover:rotate-180 duration-300"
      >
        {darkMode ? (
          <IoMoon className={theme.text.primary} size={24} />
        ) : (
          <IoSunny className={theme.text.primary} size={24} />
        )}
      </button>

      <div
        className={`relative p-8 rounded-2xl shadow-2xl w-full max-w-sm transition-all duration-300 transform hover:scale-105 ${theme.background.card} ${theme.background.border} border ${error ? 'animate-shake' : ''}`}
      >
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className={`${theme.error.text} ${theme.error.background} p-3 rounded-md text-center animate-pulse`}>
              {error}
            </div>
          )}
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium transition-colors duration-300 ${
                isFocused.email ? 'text-blue-500' : theme.text.secondary
              }`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onFocus={() => setIsFocused({...isFocused, email: true})}
              onBlur={() => setIsFocused({...isFocused, email: false})}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 
                ${theme.input.background} 
                ${theme.input.border} 
                ${theme.input.text}
                ${theme.input.focus}
                ${isFocused.email ? 'ring-2 ring-blue-300' : ''}`}
              required
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className={`block text-sm font-medium transition-colors duration-300 ${
                isFocused.password ? 'text-blue-500' : theme.text.secondary
              }`}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onFocus={() => setIsFocused({...isFocused, password: true})}
              onBlur={() => setIsFocused({...isFocused, password: false})}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 
                ${theme.input.background} 
                ${theme.input.border} 
                ${theme.input.text}
                ${theme.input.focus}
                ${isFocused.password ? 'ring-2 ring-blue-300' : ''}`}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 ${theme.primary.background} ${theme.primary.text} rounded-md hover:${theme.primary.hoverBackground} focus:outline-none focus:ring-2 focus:ring-blue-500 transition transform hover:scale-[1.02] active:scale-95 duration-200`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className={`absolute inset-0 flex items-center`}>
            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-500'}`}>
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition transform hover:scale-[1.02] active:scale-95 duration-200 
              ${darkMode
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-100"
              }`}
          >
            <FcGoogle className="w-6 h-6 mr-2" />
            <span className="text-sm">Sign in with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className={`text-sm ${theme.text.secondary}`}>
            Don't have an account?{" "}
            <a
              href="/signup"
              className={`font-medium transition-colors duration-300 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Sign Up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;