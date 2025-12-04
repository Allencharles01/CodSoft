// backend/models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    candidateEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    resumePath: {
      type: String,
    },
    jobId: {
      type: String, // can be ObjectId string from Jobs collection or plain string
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // gives createdAt / updatedAt (your UI already uses createdAt)
  }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
