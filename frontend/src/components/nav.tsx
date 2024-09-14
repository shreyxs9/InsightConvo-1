import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMoon, IoSunny } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";

function Nav() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Load dark mode preference from localStorage
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true"); // Save dark mode preference
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false"); // Save light mode preference
    }
  }, [darkMode]);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 transition-colors duration-500 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Insightconvo
          </span>
        </a>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen ? "true" : "false"}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <FaTimes className="w-5 h-5" />
          ) : (
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          )}
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-gray-50 md:bg-white dark:bg-gray-900 md:dark:bg-gray-900 md:dark:border-gray-700 md:static md:w-auto md:flex md:items-center md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 z-50`} // Added z-50 for dropdown to be on top
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg dark:bg-gray-800 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Services
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Logout
              </button>
            </li>
            <li>
              <button
                onClick={handleThemeChange}
                className="p-2 text-2xl rounded-full focus:outline-none"
              >
                {darkMode ? (
                  <IoSunny className="text-white" />
                ) : (
                  <IoMoon className="text-black" />
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
