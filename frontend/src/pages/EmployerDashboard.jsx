// src/pages/EmployerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../App.jsx";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJobsMenu, setShowJobsMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await api.get("/api/jobs");
        const jobs = jobsRes.data || [];

        // group jobs by company
        const byCompany = new Map();
        jobs.forEach((job) => {
          if (!byCompany.has(job.company)) {
            byCompany.set(job.company, {
              company: job.company,
              jobs: [],
            });
          }
          byCompany.get(job.company).jobs.push(job);
        });

        const groupedCompanies = Array.from(byCompany.values());

        // fetch application counts for the glowing numbers
        const companiesWithCounts = await Promise.all(
          groupedCompanies.map(async (c) => {
            try {
              const appsRes = await api.get("/api/applications/employer", {
                params: { company: c.company },
              });

              return {
                ...c,
                applicationCount: Array.isArray(appsRes.data)
                  ? appsRes.data.length
                  : 0,
              };
            } catch (err) {
              console.error(
                `Error fetching applications for ${c.company}:`,
                err
              );
              return { ...c, applicationCount: 0 };
            }
          })
        );

        setCompanies(companiesWithCounts);
      } catch (err) {
        console.error("Error loading employer dashboard:", err);
        setError("Unable to load your applications right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJobsMenuClick = (action) => {
    setShowJobsMenu(false);

    if (action === "create") {
      navigate("/employer/add-job");
    } else if (action === "edit") {
      // Edit page already has per-job Delete buttons,
      // so we don’t need a separate "Delete jobs" mode.
      navigate("/employer/manage-jobs?mode=edit");
    }
  };

  const goToCompany = (companyName) => {
    navigate(`/employer/company/${encodeURIComponent(companyName)}`);
  };

  if (loading) {
    return (
      <main className="app-page app-page-center">
        <p>Loading employer dashboard…</p>
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

  return (
    <main className="app-page">
      <div className="employer-header-row">
        <div>
          <h2 className="section-title">Employer dashboard</h2>
          <p className="section-subtitle">
            Each card shows a company and how many applications it has received.
          </p>
        </div>

        <div className="jobs-master">
          <button
            className="jobs-master-trigger"
            onClick={() => setShowJobsMenu((prev) => !prev)}
          >
            + Jobs
          </button>

          {showJobsMenu && (
            <div className="jobs-master-menu">
              <button onClick={() => handleJobsMenuClick("create")}>
                Create new job
              </button>
              <button onClick={() => handleJobsMenuClick("edit")}>
                Edit or Delete existing job
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="job-grid">
        {companies.map((c) => (
          <div
            key={c.company}
            className="job-card company-card"
            onClick={() => goToCompany(c.company)}
          >
            {c.applicationCount > 0 && (
              <span className="company-app-count">{c.applicationCount}</span>
            )}
            <h3 className="job-card-title">{c.company}</h3>
            <p className="job-card-meta">
              {c.jobs.length} open role{c.jobs.length !== 1 ? "s" : ""} on the
              job board
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
