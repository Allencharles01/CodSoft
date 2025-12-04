// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBrandClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <button
          onClick={handleBrandClick}
          className="navbar-brand-link"
          style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
        >
          <span className="navbar-brand-main">codsoft jobboard</span>
          <span className="navbar-brand-sub">developed by allen charles</span>
        </button>

        {/* Links */}
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "nav-link-active" : "")
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              "nav-link " + (isActive ? "nav-link-active" : "")
            }
          >
            Jobs
          </NavLink>

          {user && user.role === "candidate" && (
            <NavLink
              to="/candidate"
              className={({ isActive }) =>
                "nav-link " + (isActive ? "nav-link-active" : "")
              }
            >
              Candidate
            </NavLink>
          )}

          {user && user.role === "employer" && (
            <NavLink
              to="/employer"
              className={({ isActive }) =>
                "nav-link " + (isActive ? "nav-link-active" : "")
              }
            >
              Employer
            </NavLink>
          )}

          {!user && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                "nav-link " + (isActive ? "nav-link-active" : "")
              }
            >
              Log in
            </NavLink>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="nav-link"
              style={{ border: "none", background: "transparent" }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
