import React, { useState, useEffect } from 'react';
import CarList from './components/CarList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  useEffect(() => {
    document.body.className = isDarkMode ? "bg-dark text-light" : "bg-light text-dark";
  }, [isDarkMode]);

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center mb-0">🚗 Car Finder</h1>
        <button className="btn btn-outline-secondary" onClick={toggleDarkMode}>
          {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <CarList isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;
