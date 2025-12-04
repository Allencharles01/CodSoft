// src/pages/AddJob.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    workMode: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setSaving(true);
      await api.post("/api/jobs", form);
      setMessage("Job created successfully!");
      setTimeout(() => navigate("/employer"), 800);
    } catch (err) {
      console.error("Error creating job:", err);
      setMessage("Failed to create job.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="app-page">
      <h2 className="section-title">Add a new job</h2>
      <p className="section-subtitle">
        Fill in the details and this role will appear on the job board.
      </p>

      <form onSubmit={handleSubmit} className="job-apply-form">
        <input
          type="text"
          className="styled-input"
          placeholder="Job title"
          value={form.title}
          onChange={handleChange("title")}
        />
        <input
          type="text"
          className="styled-input"
          placeholder="Company name"
          value={form.company}
          onChange={handleChange("company")}
        />
        <input
          type="text"
          className="styled-input"
          placeholder="Location"
          value={form.location}
          onChange={handleChange("location")}
        />
        <input
          type="text"
          className="styled-input"
          placeholder="Type (Full-Time, Internship...)"
          value={form.type}
          onChange={handleChange("type")}
        />
        <input
          type="text"
          className="styled-input"
          placeholder="Salary range"
          value={form.salary}
          onChange={handleChange("salary")}
        />
        <input
          type="text"
          className="styled-input"
          placeholder="Work mode (Onsite / Remote / Hybrid)"
          value={form.workMode}
          onChange={handleChange("workMode")}
        />
        <textarea
          className="styled-input"
          style={{ minHeight: "120px" }}
          placeholder="Job description"
          value={form.description}
          onChange={handleChange("description")}
        />

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Upload"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "8px",
              fontSize: "13px",
              color: message.includes("success") ? "#4ade80" : "#f97373",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
