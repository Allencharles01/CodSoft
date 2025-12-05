// models/Question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2,
        message: "At least two options are required",
      },
      required: true,
    },
    correctOptionIndex: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
