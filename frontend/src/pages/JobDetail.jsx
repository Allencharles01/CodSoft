// src/pages/JobDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [fileName, setFileName] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  // hidden file input ref
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error loading job:", err);
        setError("Unable to load this job. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setResume(file || null);
    setFileName(file ? file.name : "");
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyMessage("");

    if (!fullName || !email || !resume) {
      setApplyMessage("❌ Please fill all fields and upload your resume.");
      return;
    }

    try {
      setApplying(true);

      const formData = new FormData();
      formData.append("jobId", job._id);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("resume", resume); // key must be "resume"
      formData.append("jobTitle", job.title);
      formData.append("company", job.company);

      await api.post("/api/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplyMessage("✅ Application submitted successfully!");
      setFullName("");
      setEmail("");
      setResume(null);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error applying:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to apply. Please try again.";

      // keep the red cross prefix for styling check
      setApplyMessage(`❌ ${msg}`);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <main className="app-page">Loading job…</main>;
  }

  if (error || !job) {
    return <main className="app-page">{error || "Job not found."}</main>;
  }

  return (
    <main className="app-page">
      {/* Top row: Back + Title */}
      <div className="job-detail-header">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate("/jobs")}
        >
          ⬅ Back to jobs
        </button>
      </div>

      <section className="job-detail">
        <header className="job-detail-top">
          <div>
            <h1 className="job-detail-title">{job.title}</h1>
            <p className="job-detail-company">{job.company}</p>

            <div className="job-detail-meta">
              {job.location && <span>📍 {job.location}</span>}
              {job.type && <span>💼 {job.type}</span>}
              {job.salary && <span>💰 {job.salary}</span>}
              {job.workMode && <span>🏠 {job.workMode}</span>}
            </div>
          </div>
        </header>

        {/* Description */}
        <div className="job-detail-body">
          <h2 className="job-section-title">Role details</h2>
          <p className="job-detail-description">
            {job.description || "No detailed description provided."}
          </p>
        </div>

        {/* Apply form */}
        <div className="job-detail-apply">
          <h2 className="job-section-title">Apply for this job</h2>

          <form onSubmit={handleApply} className="job-apply-form">
            <input
              type="text"
              placeholder="Your full name"
              className="styled-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Your email"
              className="styled-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Resume row: button + truncated filename */}
            <div className="apply-resume-row">
              <button
                type="button"
                className="apply-resume-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Attach resume
              </button>

              <span className="apply-resume-filename">
                {fileName || "No file selected"}
              </span>

              <input
                ref={fileInputRef}
                type="file"
                className="file-input-hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>

            {/* Apply button */}
            <button
              type="submit"
              className="job-apply-btn"
              disabled={applying}
            >
              {applying ? "Applying…" : "Apply"}
            </button>

            {applyMessage && (
              <p
                className={
                  "job-apply-message " +
                  (applyMessage.startsWith("✅") ? "success" : "error")
                }
              >
                {applyMessage}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
