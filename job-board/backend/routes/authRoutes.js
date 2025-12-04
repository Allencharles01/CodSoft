// backend/routes/authRoutes.js
import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// In-memory OTP store: { email: { otp, role, expiresAt } }
const otpStore = new Map();

/**
 * POST /api/auth/send-otp
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res
        .status(400)
        .json({ message: "Email and role are required." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(email.toLowerCase(), { otp, role, expiresAt });

    try {
      await sendEmail(
        email,
        "Your Job Board login OTP",
        `Hi,

Your one-time password (OTP) for logging into the CodSoft JobBoard is:

${otp}

This code is valid for 10 minutes. If you did not request this, you can ignore this email.

Best regards,
CodSoft JobBoard`
      );
    } catch (err) {
      console.error("Error sending OTP email:", err);
      return res
        .status(500)
        .json({ message: "Failed to send OTP email." });
    }

    res.json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("send-otp error:", err);
    res.status(500).json({ message: "Server error sending OTP." });
  }
});

/**
 * POST /api/auth/verify-otp
 */
router.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required." });
    }

    const record = otpStore.get(email.toLowerCase());

    if (!record) {
      return res
        .status(400)
        .json({ message: "No OTP requested for this email." });
    }

    const { otp: storedOtp, role, expiresAt } = record;

    if (Date.now() > expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (otp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    otpStore.delete(email.toLowerCase());

    res.json({
      message: "OTP verified successfully.",
      email: email.toLowerCase(),
      role,
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    res.status(500).json({ message: "Server error verifying OTP." });
  }
});

export default router;
