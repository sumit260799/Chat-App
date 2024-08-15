import React, { useState, useEffect } from "react";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

const Switch = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDarkMode ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
    return () => {
      document.documentElement.classList.remove(theme);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="w-full transition-colors duration-500">
      <button
        onClick={toggleTheme}
        className="relative w-12 h-6 flex items-center bg-gray-700 rounded-full p-1 overflow-hidden shadow-inner transition-colors duration-500"
      >
        <div
          className={`absolute w-5 h-5 rounded-full shadow-md transform transition-transform duration-500 ${
            theme === "dark" ? "translate-x-5 bg-gray-900" : "bg-white"
          }`}
        ></div>
        <MdOutlineWbSunny
          className={`w-3 h-3 text-yellow-500 absolute left-2 ${
            theme === "dark" ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
        />
        <FaMoon
          className={`w-3 h-3 text-yellow-300 absolute right-2 ${
            theme === "dark" ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
        />
      </button>
    </div>
  );
};

export default Switch;
