import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const CATEGORY_MAP = {
  all: null,
  powertrain: "powertrain",
  body: "body",
  chassis: "chassis",
  network: "network",
};

function FindCodePage() {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch from backend whenever category changes
  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      try {
        const category = CATEGORY_MAP[selectedCategory];
        const baseUrl = "http://127.0.0.1:5000/api/codes";
        const url = category ? `${baseUrl}?category=${category}` : baseUrl;

        const res = await fetch(url);
        const data = await res.json();
        setCodes(data);
      } catch (err) {
        console.error("Error fetching codes", err);
        setCodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [selectedCategory]);

  // Simple client-side search filter
  const filteredCodes = codes.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      item.code.toLowerCase().includes(term) ||
      item.title.toLowerCase().includes(term) ||
      (item.description || "").toLowerCase().includes(term)
    );
  });

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="codes-page">
      {/* Header */}
      <header className="codes-header">
        <button className="codes-back-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="codes-header-top">
          <div>
            <h1>Find Your Code</h1>
            <p>Enter or browse engine codes</p>
          </div>

          <button className="codes-info-button">ⓘ</button>
        </div>

        {/* Search bar */}
        <div className="codes-search">
          <span className="codes-search-icon">🔍</span>
          <input
            type="text"
            placeholder="e.g. P0301, P0420, misfire…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Filter pills */}
      <section className="codes-filters">
        <div className="codes-filters-row">
          <button
            className={
              "codes-filter-button" +
              (selectedCategory === "all" ? " codes-filter-button--active" : "")
            }
            onClick={() => setSelectedCategory("all")}
          >
            All Codes
          </button>
          <button
            className={
              "codes-filter-button" +
              (selectedCategory === "powertrain"
                ? " codes-filter-button--active"
                : "")
            }
            onClick={() => setSelectedCategory("powertrain")}
          >
            Engine / Powertrain
          </button>
          <button
            className={
              "codes-filter-button" +
              (selectedCategory === "body"
                ? " codes-filter-button--active"
                : "")
            }
            onClick={() => setSelectedCategory("body")}
          >
            Body
          </button>
          <button
            className={
              "codes-filter-button" +
              (selectedCategory === "chassis"
                ? " codes-filter-button--active"
                : "")
            }
            onClick={() => setSelectedCategory("chassis")}
          >
            Chassis
          </button>
          <button
            className={
              "codes-filter-button" +
              (selectedCategory === "network"
                ? " codes-filter-button--active"
                : "")
            }
            onClick={() => setSelectedCategory("network")}
          >
            Network
          </button>
        </div>
      </section>

      {/* List of code cards */}
      <main className="codes-list">
        {loading && <p>Loading codes…</p>}

        {!loading && filteredCodes.length === 0 && (
          <p>No codes found for this filter/search.</p>
        )}

        {!loading &&
          filteredCodes.map((item) => (
<div
  key={item.code}
  className={
    "code-card " +
    (item.severity === "check_later"
      ? "code-card--green"
      : "code-card--yellow")
  }
  onClick={() => navigate(`/code/${item.code}`)}
>


              <div className="code-card-left">
                <div className="code-card-code-row">
                  <span className="code-card-code">{item.code}</span>
                  <span
  className={
    "code-card-badge " +
    (item.severity === "check_later"
      ? "code-card-badge--green"
      : "code-card-badge--yellow")
  }
>
  <span>{item.severity === "check_later" ? "✅" : "⚠️"}</span>
  <span>{item.severity === "check_later" ? "Driveable" : "Check Soon"}</span>
</span>

                </div>
                <h2 className="code-card-title">{item.title}</h2>
                <p className="code-card-meaning">{item.description}</p>
              </div>

              <div className="code-card-cost">
                {item.cost_min && item.cost_max
                  ? `$${item.cost_min}–$${item.cost_max} CAD`
                  : "Cost varies"}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}

export default FindCodePage;
