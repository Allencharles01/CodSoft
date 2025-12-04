// backend/models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    // optional extra fields – safe even if seed doesn’t use all of them
    description: {
      type: String,
      default: "",
    },
    salary: {
      type: String,
      default: "",
    },
    experienceLevel: {
      type: String,
      default: "",
    },
    jobType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
