// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

export default function Home() {
  const [latestJobs, setLatestJobs] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [errorLatest, setErrorLatest] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoadingLatest(true);
        setErrorLatest("");

        const res = await api.get("/api/jobs");
        const allJobs = res.data || [];
        // first 3 jobs
        setLatestJobs(allJobs.slice(0, 3));
      } catch (err) {
        console.error("Error loading latest jobs:", err);
        setErrorLatest("Unable to load latest openings.");
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchLatest();
  }, []);

  const handleCardClick = (id) => {
    // clicking again closes it
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="home-page">
      {/* HERO CARD (no buttons now) */}
      <section className="home-hero">
        <h1 className="home-hero-title">
          Welcome to the Job Board <span>🚀</span>
        </h1>
        <p className="home-hero-text">
          Discover opportunities from great companies or post roles and find
          your next hire. This is your mini job platform in the making.
        </p>
      </section>

      {/* LATEST OPENINGS */}
      <section className="home-latest">
        <div className="home-latest-divider" />
        <h2 className="home-latest-heading">Latest openings</h2>

        {loadingLatest ? (
          <p className="home-latest-sub">Loading latest jobs…</p>
        ) : errorLatest ? (
          <p className="home-latest-sub">{errorLatest}</p>
        ) : latestJobs.length === 0 ? (
          <p className="home-latest-sub">
            No openings yet. Check back soon.
          </p>
        ) : (
          <>
            <p className="home-latest-sub">
              Here are a few spotlight roles. Tap a card to see more, or browse all jobs to see everything.
            </p>

            <div className="jobs-grid home-latest-grid">
              {latestJobs.map((job) => {
                const isExpanded = expandedId === job._id;

                return (
                  <div
                    key={job._id}
                    className="job-card"
                    onClick={() => handleCardClick(job._id)}
                    style={{ cursor: "pointer", position: "relative" }}
                  >
                    <h3 className="job-card-title">{job.title}</h3>
                    <p className="job-card-company">{job.company}</p>
                    <p className="job-card-location">📍 {job.location}</p>
                    {job.salary && (
                      <p className="job-card-meta">{job.salary}</p>
                    )}

                    {/* only the selected tile shows description + link */}
                    {isExpanded && (
                      <>
                        <hr
                          style={{
                            border: "none",
                            borderTop:
                              "1px solid rgba(148, 163, 184, 0.35)",
                            margin: "10px 0 8px",
                          }}
                        />

                        <p className="home-job-description">
                          {job.description ||
                            "No detailed description provided."}
                        </p>

                        <Link
                          to={`/jobs/${job._id}`}
                          className="home-job-view-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View full job →
                        </Link>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Browse jobs button under the tiles */}
        <div className="home-browse-wrapper">
          <Link to="/jobs" className="home-browse-btn">
            Browse jobs
          </Link>
        </div>
      </section>
    </main>
  );
}
