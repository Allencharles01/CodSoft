// backend/routes/authRoutes.js
import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// In-memory OTP store: { email: { otp, role, expiresAt } }
const otpStore = new Map();

/**
 * POST /api/auth/send-otp
 * Body: { email, role? }
 * role is optional so it works for both candidate & employer.
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const lowerEmail = email.toLowerCase();
    const finalRole = role || "unknown";

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(lowerEmail, { otp, role: finalRole, expiresAt });

    console.log(`🔐 OTP for ${lowerEmail}: ${otp} (role: ${finalRole})`);

    // Fire-and-forget email (login must not break even if email fails)
    sendEmail(
      email,
      "Your Job Board login OTP",
      `Hi,

Your one-time password (OTP) for logging into the CodSoft JobBoard is:

${otp}

This code is valid for 10 minutes. If you did not request this, you can ignore this email.

Best regards,
CodSoft JobBoard`
    ).catch((err) => {
      console.error("sendEmail error (ignored for login flow):", err);
    });

    return res.json({
      message: "OTP created successfully.",
      otp, // helpful for dev; remove later if you want
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return res
      .status(500)
      .json({ message: "Server error while creating OTP." });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { email, otp }
 */
router.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required." });
    }

    const lowerEmail = email.toLowerCase();
    const record = otpStore.get(lowerEmail);

    if (!record) {
      return res
        .status(400)
        .json({ message: "No OTP requested for this email." });
    }

    const { otp: storedOtp, role, expiresAt } = record;

    if (Date.now() > expiresAt) {
      otpStore.delete(lowerEmail);
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (otp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    otpStore.delete(lowerEmail);

    return res.json({
      message: "OTP verified successfully.",
      email: lowerEmail,
      role,
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res
      .status(500)
      .json({ message: "Server error verifying OTP." });
  }
});

export default router;
