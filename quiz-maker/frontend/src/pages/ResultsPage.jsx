import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function ResultsPage() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/api/quizzes/attempts/${attemptId}`).then((res) => {
      setResult(res.data);
    });
  }, [attemptId]);

  if (!result) return <p>Loading results...</p>;

  return (
    <div>
      <h2>Your Score</h2>
      <h3>
        {result.score} / {result.totalQuestions}
      </h3>

      <h4 style={{ marginTop: "18px" }}>Review Answers:</h4>

      {result.questions.map((q, index) => {
        const userAnswer = result.answers[index].selectedIndex;
        const correct = result.answers[index].isCorrect;

        return (
          <div key={index} className="result-card">
            <p>
              <strong>{q.text}</strong>
            </p>

            <p>
              Your Answer: {q.options[userAnswer]}
              <span
                style={{
                  marginLeft: "8px",
                  color: correct ? "#4ade80" : "#f97373",
                  fontWeight: 600,
                }}
              >
                {correct ? "✓ Correct" : "✗ Wrong"}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
