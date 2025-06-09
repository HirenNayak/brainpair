import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setIsDark(savedTheme);
    if (savedTheme) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("darkMode", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex items-center ml-4">
      <label htmlFor="darkModeToggle" className="relative inline-block w-12 h-6">
        <input
          type="checkbox"
          id="darkModeToggle"
          className="sr-only peer"
          checked={isDark}
          onChange={toggleDarkMode}
        />
        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-gray-700 transition-colors"></div>
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-6 transform transition-transform"></div>
      </label>
    </div>
  );
};

export default DarkModeToggle;
