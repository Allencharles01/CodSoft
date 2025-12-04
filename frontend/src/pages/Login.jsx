// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../App.jsx";

export default function Login() {
  const [role, setRole] = useState("candidate"); // "candidate" | "employer"
  const [step, setStep] = useState("request");   // "request" | "verify"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "error"

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessageType("error");
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await api.post("/api/auth/send-otp", {
        email: email.trim(),
        role,
      });

      setMessageType("info");
      setMessage("OTP sent successfully.");
      setStep("verify");
      setOtp("");
    } catch (err) {
      console.error("Send OTP error:", err);
      setMessageType("error");
      setMessage("Unable to send OTP right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setMessageType("error");
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/api/auth/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });

      // backend returns { email, role }
      const { email: verifiedEmail, role: verifiedRole } = res.data;

      // save in AuthContext
      login(verifiedRole, verifiedEmail);

      // redirect based on role
      navigate(verifiedRole === "employer" ? "/employer" : "/candidate");
    } catch (err) {
      console.error("Verify OTP error:", err);
      const msg =
        err?.response?.data?.message || "Invalid OTP. Please try again.";
      setMessageType("error");
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep("request");
    setOtp("");
    setMessage("");
  };

  return (
    <main className="app-page app-page-center">
      <div className="login-card">
        <h1 className="login-title">Log in</h1>
        <p className="login-subtitle">
          Enter your email, get an OTP, and sign in securely.
        </p>

        {/* Role toggle */}
        <div className="login-role-toggle">
          <button
            type="button"
            className={
              "login-role-btn " + (role === "candidate" ? "is-active" : "")
            }
            onClick={() => setRole("candidate")}
            disabled={loading}
          >
            Candidate
          </button>
          <button
            type="button"
            className={
              "login-role-btn " + (role === "employer" ? "is-active" : "")
            }
            onClick={() => setRole("employer")}
            disabled={loading}
          >
            Employer
          </button>
        </div>

        {/* Info / error message */}
        {message && (
          <div
            className={
              "login-message " +
              (messageType === "error"
                ? "login-message-error"
                : "login-message-info")
            }
          >
            {message}
          </div>
        )}

        {/* STEP 1: request OTP */}
        {step === "request" && (
          <form onSubmit={handleSendOtp} className="login-form">
            <label className="login-label">
              Email address
              <input
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              className="login-primary-btn"
              disabled={loading}
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: verify OTP */}
        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              We&apos;ve sent a 6-digit OTP to{" "}
              <strong style={{ color: "#e5e7eb" }}>{email}</strong>. Enter it
              below to finish logging in.
            </p>

            <label className="login-label">
              OTP
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="login-input"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              className="login-primary-btn"
              disabled={loading}
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>

            <button
              type="button"
              className="login-secondary-btn"
              onClick={handleChangeEmail}
              disabled={loading}
            >
              ← Change email / resend OTP
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
