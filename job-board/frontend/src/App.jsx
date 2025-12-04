// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createContext, useContext, useState } from "react";
import CandidateApplicationDetail from "./pages/CandidateApplicationDetail.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Jobs from "./pages/JobsList.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import CandidateDashboard from "./pages/CandidateDashboard.jsx";
import EmployerDashboard from "./pages/EmployerDashboard.jsx";
import EmployerCompanyDetail from "./pages/EmployerCompanyDetail.jsx";
import EmployerJobDetail from "./pages/EmployerJobDetail.jsx";
import EmployerManageJobs from "./pages/EmployerManageJobs.jsx";
import AddJob from "./pages/AddJob.jsx";
import Login from "./pages/Login.jsx";

// ---------- Auth Context ----------
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("jobboardUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (role, email) => {
    const u = { role, email };
    setUser(u);
    localStorage.setItem("jobboardUser", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jobboardUser");
  };

  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      <Router>
        <div className="app-root">
          <Navbar />

          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />

            {/* Candidate protected */}
            <Route
              path="/candidate"
              element={
                user && user.role === "candidate" ? (
                  <CandidateDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Candidate application detail */}
            <Route
              path="/candidate/applications/:id"
              element={
                user && user.role === "candidate" ? (
                  <CandidateApplicationDetail />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Employer protected */}
            <Route
              path="/employer"
              element={
                user && user.role === "employer" ? (
                  <EmployerDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/employer/add-job"
              element={
                user && user.role === "employer" ? (
                  <AddJob />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/employer/company/:companyName"
              element={
                user && user.role === "employer" ? (
                  <EmployerCompanyDetail />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/employer/company/:companyName/job/:jobId"
              element={
                user && user.role === "employer" ? (
                  <EmployerJobDetail />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/employer/manage-jobs"
              element={
                user && user.role === "employer" ? (
                  <EmployerManageJobs />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
