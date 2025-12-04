// src/components/JobCard.jsx
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  if (!job) return null;

  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      <h3 className="job-card-title">{job.title}</h3>

      <p className="job-card-company">{job.company}</p>

      <p className="job-card-location">
        <span role="img" aria-label="location">
          📍
        </span>{" "}
        {job.location}
      </p>

      {job.type && (
        <p className="job-card-meta">{job.type}</p>
      )}

      {job.salary && (
        <p className="job-card-meta">{job.salary}</p>
      )}
    </Link>
  );
}
