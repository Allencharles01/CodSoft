import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const makeEmptyQuestion = () => ({
  text: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
});

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([makeEmptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateQuestionText = (qIndex, value) => {
    const copy = [...questions];
    copy[qIndex].text = value;
    setQuestions(copy);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const copy = [...questions];
    copy[qIndex].options[optIndex] = value;
    setQuestions(copy);
  };

  const updateCorrectIndex = (qIndex, value) => {
    const copy = [...questions];
    copy[qIndex].correctOptionIndex = Number(value);
    setQuestions(copy);
  };

  const addQuestion = () => {
    setQuestions([...questions, makeEmptyQuestion()]);
  };

  const removeQuestion = (qIndex) => {
    if (questions.length === 1) return; // keep at least one
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const cleanedQuestions = questions.filter(
      (q) => q.text.trim() && q.options.some((o) => o.trim())
    );

    if (cleanedQuestions.length === 0) {
      setError("Add at least one question with options.");
      return;
    }

    try {
      setSaving(true);

      const res = await api.post("/api/quizzes", {
        title,
        description,
        questions: cleanedQuestions,
      });

      // go directly to the quiz you just created
      navigate(`/quiz/${res.data.quizId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create quiz. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Create a New Quiz</h2>

      <form onSubmit={handleSubmit} className="form-card">
        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label>Quiz Title</label>
          <input
            type="text"
            placeholder="e.g. JavaScript Basics"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={3}
            placeholder="Short description of this quiz..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <h3 style={{ marginTop: "10px" }}>Questions</h3>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-editor">
            <div className="question-header">
              <span>Question {qIndex + 1}</span>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="link-button danger"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Question Text</label>
              <input
                type="text"
                placeholder="Enter the question..."
                value={q.text}
                onChange={(e) =>
                  updateQuestionText(qIndex, e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Options</label>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="option-row">
                  <span className="option-label">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <input
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      updateOption(qIndex, optIndex, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Correct Option</label>
              <select
                value={q.correctOptionIndex}
                onChange={(e) =>
                  updateCorrectIndex(qIndex, e.target.value)
                }
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="secondary-button"
          onClick={addQuestion}
        >
          + Add Question
        </button>

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
