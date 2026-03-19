import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./App.css";

function CodeDetailPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setError("");
        setResult(null);
        const res = await fetch(`http://127.0.0.1:5000/api/codes/${code}`);
        console.log("detail fetch status", res.status);
        const data = await res.json();
        if (!res.ok || data.error) {
          setError("Code not found");
          return;
        }
        setResult(data);
      } catch (e) {
        console.error(e);
        setError("Something went wrong loading this code.");
      }
    };
    fetchCode();
  }, [code]);

  if (!result && !error) {
    return (
      <div className="App">
        <p>Loading…</p>
      </div>
    );
  }

  const isDriveable = result?.severity === "check_later";

  return (
    <div className="code-detail-page">
      <div className="code-detail-shell">
        <header className="code-detail-header">
          <button className="codes-back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="code-detail-top-row">
            <span className="result-chip-code">{code}</span>
            {result && (
              <span
                className={
                  "result-chip-severity " +
                  (isDriveable ? "chip--green" : "chip--yellow")
                }
              >
                <span className="badge-icon">
                  {isDriveable ? "✅" : "⚠️"}
                </span>
                {isDriveable ? "Driveable" : "Check Soon"}
              </span>
            )}
          </div>

          {result && <h1 className="code-detail-title">{result.title}</h1>}
        </header>

        <main className="code-detail-main">
          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}

          {result && (
            <>
              <div
                className={
                  "result-alert " +
                  (isDriveable ? "result-alert--green" : "result-alert--yellow")
                }
              >
                <div className="result-alert-icon">
                  {isDriveable ? "✅" : "⚠️"}
                </div>
                <div>
                  <div className="result-alert-title">
                    {isDriveable ? "Driveable" : "Check Soon"}
                  </div>
                  <div className="result-alert-text">
                    {isDriveable
                      ? "First, check if your gas cap is tight. If that doesn't fix it, get it checked when convenient."
                      : "You can usually drive safely for a short time, but book a service soon to prevent engine damage."}
                  </div>
                </div>
              </div>

              <div className="result-section-card">
                <div className="result-section-header">
                  <span className="result-section-icon">💡</span>
                  <span className="result-section-title">What It Means</span>
                </div>
                <p className="result-section-body">{result.description}</p>
              </div>

              <div className="result-section-card">
                <div className="result-section-header">
                  <span className="result-section-icon">🧰</span>
                  <span className="result-section-title">
                    Common Parts Involved
                  </span>
                </div>
                <ul className="result-parts-list">
                  {result.parts
                    ? result.parts.split(",").map((part) => (
                        <li key={part.trim()}>{part.trim()}</li>
                      ))
                    : null}
                </ul>
              </div>

              <div className="result-section-card result-cost-card">
                <div className="result-section-header">
                  <span className="result-section-icon">💵</span>
                  <span className="result-section-title">
                    Estimated Repair Cost
                  </span>
                </div>
                <div className="result-cost-main">
                  <span className="result-cost-range">
                    ${result.cost_min} - ${result.cost_max}
                  </span>
                  <span className="result-cost-currency">CAD</span>
                </div>
                <p className="result-cost-note">
                  This is a typical range including parts and labor. Actual
                  costs may vary based on your vehicle and local labor rates.
                </p>
              </div>

              <div className="home-actions">
                <button
                  className="primary-button"
                  onClick={() => navigate("/")}
                >
                  Search Another Code
                </button>
                <Link to="/codes" className="secondary-button">
                  View All Saved Codes
                </Link>
              </div>

              <div className="detail-disclaimer">
                <strong>Disclaimer:</strong> This information is for
                educational purposes only. Always consult with a qualified
                mechanic for accurate diagnosis and repair. Costs and severity
                can vary based on your specific vehicle and situation.
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default CodeDetailPage;
