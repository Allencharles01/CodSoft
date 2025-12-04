// backend/routes/jobs.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET /api/jobs – return all jobs (you can add pagination later)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
});

module.exports = router;
