import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function HomePage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (overrideCode) => {
    const codeToUse = (overrideCode ?? code).trim();
    setError("");

    if (!codeToUse) {
      setError("Please enter a code");
      return;
    }

    navigate(`/code/${codeToUse}`);
  };

  return (
    <div className="App">
      {/* HERO HEADER */}
      <header className="hero">
        <div className="hero-icon-wrap">
          <div className="hero-icon-circle">
            <span className="hero-icon">🚗</span>
          </div>
          <span className="hero-pill">Smart OBD-II Assistant</span>
        </div>

        <h1 className="hero-title">Smart Check Engine Lite</h1>
        <p className="hero-subtitle">
          Understand your check engine codes in plain English. No mechanic jargon
          required.
        </p>

        <div className="hero-buttons">
          <button
            className="hero-button hero-button-primary"
            onClick={() => inputRef.current && inputRef.current.focus()}
          >
            <span className="hero-button-icon">🔍</span>
            Enter Your Code
          </button>

          <Link to="/codes" className="hero-button hero-button-secondary">
            View Saved Codes
          </Link>
        </div>

        <div className="hero-features">
          <span>40+ Common Codes</span>
          <span>Severity Ratings</span>
          <span>CAD Pricing</span>
        </div>
      </header>

      {/* SEARCH BAR */}
      <div className="home-search-shell">
        <div className="home-search-bar">
          <span className="home-search-icon">🔎</span>
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the code from your dash or scanner, e.g. P0420"
          />
          <button
            className="home-search-button"
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>
        {error && <p className="home-error">{error}</p>}
      </div>
    </div>
  );
}

export default HomePage;
