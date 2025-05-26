import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["light", "dark", "nature", "ocean"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-button"
      style={{
        display: 'none'
      }}
    >
      {theme === "light" && "🌞"}
      {theme === "dark" && "🌙"}
      {theme === "nature" && "🌿"}
      {theme === "ocean" && "🌊"}
    </button>
  );
};

export default ThemeToggle; 