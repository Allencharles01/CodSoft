import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Question from "../components/Question";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/quizzes/${id}`).then((res) => {
      setQuiz(res.data.quiz);
      setQuestions(res.data.questions);
      setLoading(false);
    });
  }, [id]);

  const handleSelect = (questionId, index) => {
    setAnswers({ ...answers, [questionId]: index });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      })
    );

    const res = await api.post(`/api/quizzes/${id}/attempt`, {
      answers: formattedAnswers,
    });

    navigate(`/results/${res.data.attemptId}`);
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  return (
    <div>
      <h2>{quiz.title}</h2>

      {questions.map((q) => (
        <Question
          key={q._id}
          q={q}
          selectedIndex={answers[q._id]}
          onSelect={(index) => handleSelect(q._id, index)}
        />
      ))}

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "25px",
          padding: "12px 25px",
          fontSize: "16px",
          background: "linear-gradient(to right, #005bea, #00c6fb)",
          border: "none",
          borderRadius: "12px",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 0 20px rgba(0, 150, 255, 0.4)",
          transition: "0.3s",
        }}
      >
        Submit Quiz
      </button>
    </div>
  );
}
