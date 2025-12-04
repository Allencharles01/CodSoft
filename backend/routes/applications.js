// backend/routes/applications.js
import express from "express";
import Application from "../models/Application.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

/**
 * POST /api/applications
 * Create a new application with resume upload
 */
router.post(
  "/",
  uploadMiddleware.single("resume"),
  async (req, res) => {
    try {
      const { jobId, fullName, email, jobTitle, company } = req.body;

      if (!jobId || !fullName || !email || !req.file) {
        return res.status(400).json({
          message: "jobId, fullName, email and resume are required.",
        });
      }

      const app = new Application({
        jobId,
        candidateName: fullName,
        candidateEmail: email,
        resumePath: `/uploads/resumes/${req.file.filename}`,
        jobTitle: jobTitle || "Unknown role",
        company: company || "Unknown company",
        status: "pending",
      });

      await app.save();

      // (Optional) you can also send a "we received your application" email here

      res.status(201).json(app);
    } catch (err) {
      console.error("Error creating application:", err);
      res.status(500).json({ message: "Failed to create application." });
    }
  }
);

/**
 * GET /api/applications/candidate?email=...
 * All applications for a candidate (candidate dashboard)
 */
router.get("/candidate", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Candidate email is required." });
    }

    const apps = await Application.find({
      candidateEmail: email,
    }).sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error("Error loading candidate applications:", err);
    res
      .status(500)
      .json({ message: "Failed to load candidate applications." });
  }
});

/**
 * GET /api/applications/employer?company=...
 * All applications for a company (used for the blue numbers + company view)
 */
router.get("/employer", async (req, res) => {
  try {
    const { company } = req.query;
    if (!company) {
      return res
        .status(400)
        .json({ message: "Company is required." });
    }

    const apps = await Application.find({
      company: { $regex: new RegExp(`^${company}$`, "i") },
    }).sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error("Error loading employer applications:", err);
    res
      .status(500)
      .json({ message: "Failed to load applications for this company." });
  }
});

/**
 * GET /api/applications/by-job?jobId=...
 * All applications for a specific job (employer job detail page)
 */
router.get("/by-job", async (req, res) => {
  try {
    const { jobId } = req.query;
    if (!jobId) {
      return res
        .status(400)
        .json({ message: "jobId is required." });
    }

    const apps = await Application.find({ jobId }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error("Error loading applications by job:", err);
    res
      .status(500)
      .json({ message: "Failed to load applications for this job." });
  }
});

/**
 * POST /api/applications/decision
 * Body: { applicationId, status }  // "accepted" | "rejected" | "pending"
 * Used on employer job detail page for Accept / Reject.
 * 👉 Also sends an email to the candidate.
 */
router.post("/decision", async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!applicationId || !status) {
      return res
        .status(400)
        .json({ message: "applicationId and status are required." });
    }

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const app = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found." });
    }

    // 🔔 Send email to candidate about the decision
    try {
      const niceStatus =
        status === "accepted"
          ? "ACCEPTED"
          : status === "rejected"
          ? "REJECTED"
          : "UPDATED";

      const subject = `Update on your application for ${app.jobTitle} at ${app.company}`;
      const body = `Hi ${app.candidateName || ""},

Your application for the role "${app.jobTitle}" at ${app.company} has been ${niceStatus.toLowerCase()}.

Current status: ${niceStatus}

If you have any questions, you can reply to this email.

Best regards,
${app.company} via CodSoft JobBoard`;

      await sendEmail(app.candidateEmail, subject, body);
    } catch (emailErr) {
      // Don't break the API just because email failed
      console.error("Error sending status update email:", emailErr);
    }

    res.json(app);
  } catch (err) {
    console.error("Error updating application status:", err);
    res
      .status(500)
      .json({ message: "Failed to update application status." });
  }
});

/**
 * GET /api/applications/:id
 * Single application (candidate detail page)
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const app = await Application.findById(id);

    if (!app) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json(app);
  } catch (err) {
    console.error("Error loading single application:", err);
    res
      .status(500)
      .json({ message: "Failed to load this application." });
  }
});

/**
 * DELETE /api/applications/:id
 * Candidate withdraws an application
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const app = await Application.findByIdAndDelete(id);

    if (!app) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json({ message: "Application withdrawn successfully." });
  } catch (err) {
    console.error("Error deleting application:", err);
    res
      .status(500)
      .json({ message: "Failed to withdraw application." });
  }
});

export default router;
