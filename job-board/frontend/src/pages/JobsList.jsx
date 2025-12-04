// src/pages/JobsList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

const JOBS_PER_PAGE = 6;

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/jobs");
        setJobs(res.data || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE));
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const pageJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <main className="jobs-page">Loading jobs…</main>;
  }

  if (error) {
    return (
      <main className="jobs-page">
        <p>{error}</p>
      </main>
    );
  }

  if (jobs.length === 0) {
    return (
      <main className="jobs-page">
        <p>No jobs available right now.</p>
      </main>
    );
  }

  return (
    <main className="jobs-page">
      <h2 className="jobs-heading">Job Listings</h2>
      <p className="jobs-subtitle">
        Browse roles and click a tile to see full details and apply.
      </p>

      {/* 6 jobs per page */}
      <div className="jobs-grid">
        {pageJobs.map((job) => (
          <Link
            key={job._id}
            to={`/jobs/${job._id}`}
            className="job-card job-card-link"
          >
            <h3 className="job-card-title">{job.title}</h3>
            <p className="job-card-company">{job.company}</p>
            {job.location && (
              <p className="job-card-location">📍 {job.location}</p>
            )}
            {job.salary && <p className="job-card-meta">{job.salary}</p>}
          </Link>
        ))}
      </div>

      {/* numbered pagination */}
      {totalPages > 1 && (
        <div className="jobs-pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                className={
                  "page-number" + (page === currentPage ? " active" : "")
                }
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </main>
  );
}
