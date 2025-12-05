// routes/quizRoutes.js
import express from "express";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

/**
 * POST /api/quizzes
 * Create a quiz with questions
 * Body example:
 * {
 *   "title": "JavaScript Basics",
 *   "description": "Simple JS quiz",
 *   "questions": [
 *     {
 *       "text": "What is 2 + 2?",
 *       "options": ["1", "2", "4", "5"],
 *       "correctOptionIndex": 2
 *     }
 *   ]
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Title and at least one question are required" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      // later: createdBy: req.user.id
    });

    const questionDocs = questions.map((q) => ({
      quizId: quiz._id,
      text: q.text,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      points: q.points ?? 1,
    }));

    await Question.insertMany(questionDocs);

    return res.status(201).json({ message: "Quiz created", quizId: quiz._id });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/quizzes
 * List all public quizzes
 */
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .select("title description createdAt");
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/quizzes/:id
 * Get quiz with its questions (for taking quiz)
 * NOTE: we do NOT send correct answers here
 */
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await Question.find({ quizId: quiz._id }).select(
      "-correctOptionIndex -createdAt -updatedAt -__v"
    );

    res.json({
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
      },
      questions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/quizzes/:id/attempt
 * Submit answers and get score
 *
 * Body example:
 * {
 *   "answers": [
 *     { "questionId": "653f...", "selectedIndex": 2 },
 *     { "questionId": "653f...", "selectedIndex": 0 }
 *   ]
 * }
 */
router.post("/:id/attempt", async (req, res) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers array is required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await Question.find({ quizId });
    if (questions.length === 0) {
      return res.status(400).json({ message: "Quiz has no questions" });
    }

    // Map questions by id for quick lookup
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    let score = 0;
    const detailedAnswers = [];

    for (const ans of answers) {
      const q = questionMap[ans.questionId];
      if (!q) {
        // ignore answers for questions that don't exist
        continue;
      }

      const isCorrect = ans.selectedIndex === q.correctOptionIndex;
      if (isCorrect) {
        score += q.points ?? 1;
      }

      detailedAnswers.push({
        questionId: q._id,
        selectedIndex: ans.selectedIndex,
        isCorrect,
      });
    }

    const totalQuestions = questions.length;

    const attempt = await QuizAttempt.create({
      quizId,
      // later we can add userId from auth
      score,
      totalQuestions,
      answers: detailedAnswers,
    });

    return res.status(201).json({
      message: "Quiz submitted",
      attemptId: attempt._id,
      score,
      totalQuestions,
      answers: detailedAnswers,
    });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// GET /api/attempts/:id - get quiz attempt details
router.get("/attempts/:id", async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    const questions = await Question.find({
      _id: { $in: attempt.answers.map(a => a.questionId) },
    });

    res.json({
      score: attempt.score,
      totalQuestions: questions.length,
      answers: attempt.answers,
      questions: questions.map(q => ({
        text: q.text,
        options: q.options,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching attempt details" });
  }
});


export default router;
