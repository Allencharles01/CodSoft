// src/pages/CandidateDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../App.jsx";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      if (!user?.email) {
        setError("No candidate email found.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/applications/candidate", {
          params: { email: user.email },
        });
        setApplications(res.data || []);
      } catch (err) {
        console.error("Candidate dashboard error:", err);
        setError("Unable to load your applications right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [user]);

  if (loading) {
    return (
      <main className="app-page app-page-center">
        <p>Loading your applications…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-page app-page-center">
        <p>{error}</p>
      </main>
    );
  }

  if (applications.length === 0) {
    return (
      <main className="app-page app-page-center">
        <h2 className="section-title">Your applications</h2>
        <p className="section-subtitle">
          You haven&apos;t applied for any roles yet.
        </p>
      </main>
    );
  }

  return (
    <main className="app-page">
      <header className="section-header section-header-center">
        <h2 className="section-title">Your applications</h2>
        <p className="section-subtitle">
          Showing all jobs you&apos;ve applied for as {user.email}
        </p>
      </header>

      <div className="candidate-app-grid">
        {applications.map((app) => {
          const appliedDate = app.createdAt
            ? new Date(app.createdAt).toLocaleDateString()
            : "Unknown";

          return (
            <div
              key={app._id}
              className="candidate-app-card"
              onClick={() =>
                navigate(`/candidate/applications/${app._id}`)
              }
              style={{ cursor: "pointer" }}
            >
              <p className="candidate-app-meta">APPLIED TO</p>
              <h3 className="candidate-app-title">{app.jobTitle}</h3>
              <p className="candidate-app-company">{app.company}</p>

              <p className="candidate-app-status">
                Status:{" "}
                <strong
                  style={{
                    color:
                      app.status === "accepted"
                        ? "#4ade80"
                        : app.status === "rejected"
                        ? "#fca5a5"
                        : "#eab308",
                  }}
                >
                  {app.status}
                </strong>
              </p>
              <p className="candidate-app-date">
                Applied on {appliedDate}
              </p>

              {app.resumePath && (
                <a
                  href={`http://localhost:5000${app.resumePath}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  View uploaded resume
                </a>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
