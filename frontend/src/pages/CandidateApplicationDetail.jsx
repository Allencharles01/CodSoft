// src/pages/CandidateApplicationDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";

export default function CandidateApplicationDetail() {
  const { id } = useParams();              // application id
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) get application
        const appRes = await api.get(`/api/applications/${id}`);
        const app = appRes.data;
        setApplication(app);

        // 2) get related job for description
        if (app.jobId) {
          try {
            const jobRes = await api.get(`/api/jobs/${app.jobId}`);
            setJob(jobRes.data);
          } catch (err) {
            console.error("Error fetching job for application:", err);
          }
        }
      } catch (err) {
        console.error("Error loading application:", err);
        setError("Unable to load this application right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleWithdraw = async () => {
    if (!window.confirm("Are you sure you want to withdraw?")) return;
    try {
      setWithdrawing(true);
      await api.delete(`/api/applications/${id}`);   // delete from DB
      navigate("/candidate");                       // back to dashboard
    } catch (err) {
      console.error("Withdraw error:", err);
      alert("Failed to withdraw application. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <main className="app-page app-page-center">
        <p>Loading application…</p>
      </main>
    );
  }

  if (error || !application) {
    return (
      <main className="app-page app-page-center">
        <p>{error || "Application not found."}</p>
      </main>
    );
  }

  const status = application.status || "pending";
  let statusMessage = "Your application is being reviewed.";
  if (status === "accepted") {
    statusMessage =
      "Congratulations! The employer has accepted your application. Expect them to reach out with the next steps soon.";
  } else if (status === "rejected") {
    statusMessage =
      "This application was not selected. It’s okay—keep applying and improving.";
  }

  return (
    <main className="app-page">
      <button
        className="btn btn-outline"
        type="button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "16px" }}
      >
        ⬅ Back to your applications
      </button>

      {/* JOB INFO */}
      {job && (
        <section className="job-detail" style={{ marginBottom: "20px" }}>
          <h1 className="job-detail-title">{job.title}</h1>
          <p className="job-detail-company">{job.company}</p>

          <div className="job-detail-meta">
            {job.location && <span>📍 {job.location}</span>}
            {job.type && <span>💼 {job.type}</span>}
            {job.salary && <span>💰 {job.salary}</span>}
            {job.workMode && <span>🏠 {job.workMode}</span>}
          </div>

          <h2 className="job-section-title">Role details</h2>
          <p className="job-detail-description">
            {job.description || "No detailed description provided."}
          </p>
        </section>
      )}

      {/* APPLICATION STATUS */}
      <section className="job-detail">
        <h2 className="job-section-title">Your application status</h2>

        <p className="candidate-app-status">
          Status:{" "}
          <strong
            style={{
              color:
                status === "accepted"
                  ? "#4ade80"
                  : status === "rejected"
                  ? "#fca5a5"
                  : "#eab308",
            }}
          >
            {status}
          </strong>
        </p>

        <p className="job-detail-description">{statusMessage}</p>

        {application.resumePath && (
          <p style={{ marginTop: "8px" }}>
            <a
              href={`http://localhost:5000${application.resumePath}`}
              target="_blank"
              rel="noreferrer"
            >
              View uploaded resume
            </a>
          </p>
        )}

        <button
          className="btn btn-danger"
          type="button"
          onClick={handleWithdraw}
          disabled={withdrawing}
          style={{ marginTop: "16px" }}
        >
          {withdrawing ? "Withdrawing…" : "Withdraw application"}
        </button>
      </section>
    </main>
  );
}
