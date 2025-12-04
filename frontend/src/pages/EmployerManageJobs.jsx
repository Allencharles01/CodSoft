// src/pages/EmployerManageJobs.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api.js";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function EmployerManageJobs() {
  const query = useQuery();
  const mode = query.get("mode") || "edit"; // "edit" or "delete"
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs");
        setJobs(res.data || []);
      } catch (err) {
        console.error("Error loading jobs:", err);
        setError("Unable to load jobs right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const startEdit = (job) => {
    setEditingJob({ ...job });
  };

  const handleEditChange = (field, value) => {
    setEditingJob((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    if (!editingJob) return;
    try {
      setSaving(true);
      const { _id, ...body } = editingJob;
      const res = await api.put(`/api/jobs/${_id}`, body);

      setJobs((prev) =>
        prev.map((j) => (j._id === _id ? res.data : j))
      );
      setEditingJob(null);
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job from the board?")) return;
    try {
      setDeletingId(jobId);
      await api.delete(`/api/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      if (editingJob && editingJob._id === jobId) {
        setEditingJob(null);
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const goBack = () => navigate("/employer");

  if (loading) {
    return (
      <main className="app-page app-page-center">
        <p>Loading jobs…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-page app-page-center">
        <button className="btn btn-outline" onClick={goBack}>
          ⬅ Back
        </button>
        <p style={{ marginTop: 16 }}>{error}</p>
      </main>
    );
  }

  return (
    <main className="app-page">
      <header className="section-header">
        <div>
          <h2 className="section-title">
            {mode === "delete" ? "Delete jobs" : "Edit jobs"}
          </h2>
          <p className="section-subtitle">
            Select a job from the grid. You can{" "}
            {mode === "delete"
              ? "remove it from the job board."
              : "update its details and save."}
          </p>
        </div>

        <button className="btn btn-outline" onClick={goBack}>
          ⬅ Back to dashboard
        </button>
      </header>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3 className="job-card-title">{job.title}</h3>
              <p className="job-card-company">{job.company}</p>
              <p className="job-card-location">
                {job.location} • {job.type} • {job.workMode}
              </p>
              {job.salary && (
                <p className="job-card-meta">Salary: {job.salary}</p>
              )}

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn btn-outline"
                  onClick={() => startEdit(job)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  disabled={deletingId === job._id}
                  onClick={() => deleteJob(job._id)}
                >
                  {deletingId === job._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingJob && (
        <section
          style={{
            marginTop: 28,
            padding: 20,
            borderRadius: 18,
            border: "1px solid rgba(148,163,184,0.35)",
            background: "rgba(15,23,42,0.96)",
          }}
        >
          <h3 className="section-title">Edit job</h3>
          <p className="section-subtitle">
            Update the fields and click “Save changes”.
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              marginTop: 12,
              maxWidth: 600,
            }}
          >
            <input
              className="styled-input"
              placeholder="Job title"
              value={editingJob.title || ""}
              onChange={(e) => handleEditChange("title", e.target.value)}
            />
            <input
              className="styled-input"
              placeholder="Company"
              value={editingJob.company || ""}
              onChange={(e) => handleEditChange("company", e.target.value)}
            />
            <input
              className="styled-input"
              placeholder="Location"
              value={editingJob.location || ""}
              onChange={(e) => handleEditChange("location", e.target.value)}
            />
            <input
              className="styled-input"
              placeholder="Type (Full time, Internship…)"
              value={editingJob.type || ""}
              onChange={(e) => handleEditChange("type", e.target.value)}
            />
            <input
              className="styled-input"
              placeholder="Work mode (Remote, Hybrid…)"
              value={editingJob.workMode || ""}
              onChange={(e) => handleEditChange("workMode", e.target.value)}
            />
            <input
              className="styled-input"
              placeholder="Salary range"
              value={editingJob.salary || ""}
              onChange={(e) => handleEditChange("salary", e.target.value)}
            />
            <textarea
              className="styled-input"
              style={{ minHeight: 120, resize: "vertical" }}
              placeholder="Job description"
              value={editingJob.description || ""}
              onChange={(e) =>
                handleEditChange("description", e.target.value)
              }
            />
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button
              className="btn btn-primary"
              disabled={saving}
              onClick={saveEdit}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setEditingJob(null)}
            >
              Cancel
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
