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
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// So cookies & secure headers work correctly behind Render's proxy
app.set("trust proxy", 1);

// ----------------------------
// Basic Middleware
// ----------------------------
app.use(express.json());
app.use(cookieParser());

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",               // Local dev
  "https://allenjobboard.netlify.app",   // Netlify deployment
];

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / health checks with no Origin header
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Block anything else
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Render health check
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// ----------------------------
// Uploads folder setup
// ----------------------------
const uploadPath = path.join(process.cwd(), "uploads/resumes");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use("/uploads", express.static("uploads"));

// Auth + application routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// ----------------------------
// Multer config (resume upload)
// ----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// ----------------------------
// Root route
// ----------------------------
app.get("/", (req, res) => {
  res.send("🚀 API is running with MongoDB!");
});

// ----------------------------
// JOB ROUTES
// ----------------------------
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.get("/api/jobs/by-company", async (req, res) => {
  const { company } = req.query;
  if (!company) return res.status(400).json({ message: "Company required" });

  try {
    const jobs = await Job.find({
      company: { $regex: new RegExp(`^${company}$`, "i") },
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs by company" });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job" });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: "Error creating job" });
  }
});

app.put("/api/jobs/:id", async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Job not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating job" });
  }
});

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job" });
  }
});

// ----------------------------
// APPLICATION ROUTES
// ----------------------------
app.post("/api/applications", upload.single("resume"), async (req, res) => {
  try {
    const { fullName, name, email, jobId, jobTitle, company } = req.body;
    const candidateName = fullName || name;

    if (!candidateName || !email || !jobId || !jobTitle || !company)
      return res.status(400).json({ message: "Missing required fields" });

    if (!req.file)
      return res.status(400).json({ message: "Resume is required" });

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

    try {
      await sendEmail(
        newApp.candidateEmail,
        "We received your application",
        `Hi ${newApp.candidateName},

Thanks for applying for ${newApp.jobTitle} at ${newApp.company}.
We received your application successfully.

Best regards,
CodSoft JobBoard`
      );
    } catch (err) {
      console.error("Email error:", err);
    }

    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ message: "Server error creating application" });
  }
});

app.get("/api/applications/candidate", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const list = await Application.find({
      candidateEmail: email.toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/applications/employer", async (req, res) => {
  const { company } = req.query;
  if (!company) return res.status(400).json({ message: "Company is required" });

  try {
    const list = await Application.find({
      company: { $regex: new RegExp(`^${company}$`, "i") },
    }).sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/applications/by-job", async (req, res) => {
  const { jobId } = req.query;
  if (!jobId) return res.status(400).json({ message: "jobId is required" });

  try {
    const list = await Application.find({ jobId }).sort({
      createdAt: -1,
    });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/applications/decision", async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!applicationId || !status)
      return res.status(400).json({ message: "Missing fields" });

    const appDoc = await Application.findById(applicationId);
    if (!appDoc)
      return res.status(404).json({ message: "Application not found" });

    appDoc.status = status;
    appDoc.updatedAt = new Date();
    await appDoc.save();

    res.json({ message: `Application marked as ${status}`, appDoc });
  } catch (err) {
    res.status(500).json({ message: "Error updating application" });
  }
});

// ----------------------------
// Start Server
// ----------------------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🔥 Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
