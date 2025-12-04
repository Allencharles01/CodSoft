// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import applicationRoutes from "./routes/applications.js";
import connectDB from "./config/db.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";
import sendEmail from "./utils/sendEmail.js";
import authRoutes from "./routes/authRoutes.js"; // OTP auth routes

dotenv.config();

const app = express();

// ----------------------------
// Basic middleware
// ----------------------------
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ----------------------------
// Uploads folder
// ----------------------------
const uploadPath = path.join(process.cwd(), "uploads/resumes");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Expose uploaded files
app.use("/uploads", express.static("uploads"));
// 🔐 Auth (OTP login)
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// ----------------------------
// Multer storage config
// ----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// ----------------------------
// ROUTES
// ----------------------------

// Health check
app.get("/", (req, res) => {
  res.send("🚀 API is running with MongoDB!");
});

// ---------- AUTH (OTP) ----------
app.use("/api/auth", authRoutes);

// ---------- JOBS ----------

// GET /api/jobs  -> all jobs from Mongo
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error fetching jobs" });
  }
});

// GET /api/jobs/by-company?company=...
app.get("/api/jobs/by-company", async (req, res) => {
  const { company } = req.query;
  if (!company) {
    return res.status(400).json({ message: "Company is required" });
  }

  try {
    const jobs = await Job.find({
      company: { $regex: new RegExp(`^${company}$`, "i") },
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs by company:", err);
    res
      .status(500)
      .json({ message: "Server error fetching jobs by company" });
  }
});

// GET /api/jobs/:id -> single job
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ message: "Server error fetching job" });
  }
});

// POST /api/jobs -> create a new job (used by Employer Add Job page)
app.post("/api/jobs", async (req, res) => {
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ message: "Failed to create job" });
  }
});

// PUT /api/jobs/:id -> update existing job
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ message: "Failed to update job" });
  }
});

// DELETE /api/jobs/:id -> delete a job
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Failed to delete job" });
  }
});

// ---------- APPLICATIONS ----------

/**
 * POST /api/applications
 * form-data:
 *  - fullName OR name
 *  - email
 *  - jobId
 *  - jobTitle
 *  - company
 *  - resume (file)
 */
app.post("/api/applications", upload.single("resume"), async (req, res) => {
  try {
    console.log("🔹 New application request");
    console.log("body:", req.body);
    console.log("file:", req.file);

    const { fullName, name, email, jobId, jobTitle, company } = req.body;
    const candidateName = fullName || name;

    if (!candidateName || !email || !jobId || !jobTitle || !company) {
      return res
        .status(400)
        .json({ message: "Missing required fields to create application." });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Resume file is required." });
    }

    const resumePath = `/uploads/resumes/${req.file.filename}`;

    const newApp = await Application.create({
      candidateName,
      candidateEmail: email.toLowerCase(),
      resumePath,
      jobId,
      jobTitle,
      company,
      status: "pending",
    });

    // "We got your application" mail (non-blocking)
    try {
      await sendEmail(
        newApp.candidateEmail,
        "We received your application",
        `Hi ${newApp.candidateName},

Thanks for applying for ${newApp.jobTitle} at ${newApp.company}.
Your application has been received and is currently under review.

Best regards,
CodSoft JobBoard`
      );
    } catch (mailErr) {
      console.error("Error sending confirmation email:", mailErr);
      // don't fail the API just because email failed
    }

    res.status(201).json(newApp);
  } catch (err) {
    console.error("❌ Error creating application:", err);
    res.status(500).json({
      message: "Server error creating application",
      error: err.message,
    });
  }
});

/**
 * GET /api/applications/candidate?email=...
 * Used in Candidate Dashboard
 */
app.get("/api/applications/candidate", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const list = await Application.find({
      candidateEmail: email.toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error("Error fetching candidate applications:", err);
    res.status(500).json({ message: "Server error fetching applications" });
  }
});

/**
 * GET /api/applications/employer?company=...
 * Used in Employer Dashboard (for the blue numbers)
 */
app.get("/api/applications/employer", async (req, res) => {
  const { company } = req.query;

  if (!company) {
    return res.status(400).json({ message: "Company is required" });
  }

  try {
    const list = await Application.find({
      company: { $regex: new RegExp(`^${company}$`, "i") },
    }).sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error("Error fetching employer applications:", err);
    res.status(500).json({ message: "Server error fetching applications" });
  }
});

/**
 * GET /api/applications/by-job?jobId=...
 * Used on the employer job detail page to list candidates for 1 job
 */
app.get("/api/applications/by-job", async (req, res) => {
  const { jobId } = req.query;
  if (!jobId) {
    return res.status(400).json({ message: "jobId is required" });
  }

  try {
    const list = await Application.find({ jobId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error fetching applications by job:", err);
    res
      .status(500)
      .json({ message: "Server error fetching applications by job" });
  }
});

/**
 * POST /api/applications/decision
 * { applicationId, status } // "accepted" | "rejected"
 */
app.post("/api/applications/decision", async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!applicationId || !status) {
      return res
        .status(400)
        .json({ message: "applicationId and status are required" });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be accepted or rejected" });
    }

    const appDoc = await Application.findById(applicationId);
    if (!appDoc) {
      return res.status(404).json({ message: "Application not found" });
    }

    appDoc.status = status;
    appDoc.updatedAt = new Date();
    await appDoc.save();

    const subject =
      status === "accepted"
        ? "Your application has been accepted 🎉"
        : "Update on your job application";

    const text =
      status === "accepted"
        ? `Hi ${appDoc.candidateName},

Great news! Your application for ${appDoc.jobTitle} at ${appDoc.company} has been accepted.

The team will contact you with next steps.

Best regards,
CodSoft JobBoard`
        : `Hi ${appDoc.candidateName},

Thank you for applying for ${appDoc.jobTitle} at ${appDoc.company}.

After review, your application wasn't selected this time.
Please don't be discouraged — we'd be happy to see you apply again.

Best wishes,
CodSoft JobBoard`;

    try {
      await sendEmail(appDoc.candidateEmail, subject, text);
    } catch (mailErr) {
      console.error("Error sending decision email:", mailErr);
    }

    res.json({
      message: `Application marked as ${status}`,
      application: appDoc,
    });
  } catch (err) {
    console.error("Error in decision route:", err);
    res.status(500).json({ message: "Server error updating application" });
  }
});

// ----------------------------
// Start server AFTER DB connect
// ----------------------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🔥 API running with MongoDB on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
