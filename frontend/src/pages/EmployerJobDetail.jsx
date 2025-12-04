// src/pages/EmployerJobDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";

export default function EmployerJobDetail() {
  const { companyName, jobId } = useParams();
  const navigate = useNavigate();
  const decodedCompany = decodeURIComponent(companyName);

  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/api/jobs/${jobId}`),
          api.get("/api/applications/by-job", { params: { jobId } }),
        ]);
        setJob(jobRes.data);
        setApps(appsRes.data || []);
      } catch (err) {
        console.error("Error loading employer job detail:", err);
        setError("Unable to load this job right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const goBack = () => {
    navigate(`/employer/company/${encodeURIComponent(decodedCompany)}`);
  };

  const handleDecision = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      await api.post("/api/applications/decision", {
        applicationId,
        status,
      });

      // update local state
      setApps((prev) =>
        prev.map((a) =>
          a._id === applicationId ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.error("Error updating application decision:", err);
      alert("Failed to update application status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="app-page app-page-center">
        <p>Loading job and applications…</p>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="app-page app-page-center">
        <button className="btn btn-outline" onClick={goBack}>
          ⬅ Back
        </button>
        <p style={{ marginTop: 16 }}>{error || "Job not found."}</p>
      </main>
    );
  }

  return (
    <main className="app-page">
      <header className="section-header">
        <div>
          <h2 className="section-title">{job.title}</h2>
          <p className="section-subtitle">
            {decodedCompany} • {job.location} • {job.type} • {job.workMode}
          </p>
        </div>

        <button className="btn btn-outline" onClick={goBack}>
          ⬅ Back to {decodedCompany}
        </button>
      </header>

      <section className="job-detail">
        <div className="job-detail-meta">
          {job.salary && <span>💰 {job.salary}</span>}
          {job.type && <span>💼 {job.type}</span>}
          {job.workMode && <span>🏠 {job.workMode}</span>}
        </div>

        <h3 className="job-section-title">Role details</h3>
        <p className="job-detail-description">
          {job.description || "No detailed description provided."}
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3 className="section-title">
          Applications ({apps.length})
        </h3>
        <p className="section-subtitle">
          Click a candidate card to view their resume and update status.
        </p>

        {apps.length === 0 ? (
          <p>No candidates have applied for this job yet.</p>
        ) : (
          <div className="candidate-app-grid">
            {apps.map((a) => (
              <div key={a._id} className="candidate-app-card">
                <h4 className="candidate-app-title">{a.candidateName}</h4>
                <p className="candidate-app-company">{a.candidateEmail}</p>

                <p className="candidate-app-status">
                  Status:{" "}
                  <span
                    style={{
                      textTransform: "capitalize",
                      color:
                        a.status === "accepted"
                          ? "#4ade80"
                          : a.status === "rejected"
                          ? "#f87171"
                          : "#e5e7eb",
                    }}
                  >
                    {a.status}
                  </span>
                </p>

                <p className="candidate-app-date">
                  Applied on{" "}
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : "-"}
                </p>

                {a.resumePath && (
                  <a
                    className="home-job-view-link"
                    href={`http://localhost:5000${a.resumePath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View uploaded resume
                  </a>
                )}

                <div className="employer-app-actions">
                  <button
                    className="btn btn-success"
                    disabled={updatingId === a._id}
                    onClick={() =>
                      handleDecision(a._id, "accepted")
                    }
                  >
                    {updatingId === a._id && a.status !== "accepted"
                      ? "Updating…"
                      : "Accept"}
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={updatingId === a._id}
                    onClick={() =>
                      handleDecision(a._id, "rejected")
                    }
                  >
                    {updatingId === a._id && a.status !== "rejected"
                      ? "Updating…"
                      : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
