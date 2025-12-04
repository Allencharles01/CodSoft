// src/pages/EmployerCompanyDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";

export default function EmployerCompanyDetail() {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const decodedCompany = decodeURIComponent(companyName);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs/by-company", {
          params: { company: decodedCompany },
        });
        setJobs(res.data || []);
      } catch (err) {
        console.error("Error loading company jobs:", err);
        setError("Unable to load jobs for this company.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [decodedCompany]);

  const goBack = () => navigate("/employer");

  const goToJob = (jobId) => {
    navigate(
      `/employer/company/${encodeURIComponent(
        decodedCompany
      )}/job/${encodeURIComponent(jobId)}`
    );
  };

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
          <h2 className="section-title">{decodedCompany}</h2>
          <p className="section-subtitle">
            Jobs currently listed on the board for this company.
          </p>
        </div>

        <button className="btn btn-outline" onClick={goBack}>
          ⬅ Back to companies
        </button>
      </header>

      {jobs.length === 0 ? (
        <p>No open roles for this company right now.</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="job-card"
              onClick={() => goToJob(job._id)}
            >
              <h3 className="job-card-title">{job.title}</h3>
              <p className="job-card-company">{job.company}</p>
              <p className="job-card-location">
                {job.location} • {job.type} • {job.workMode}
              </p>
              {job.salary && (
                <p className="job-card-meta">Salary: {job.salary}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
