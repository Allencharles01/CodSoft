// src/pages/QuizList.jsx
import { useEffect, useState } from "react";
import QuizCard from "../components/QuizCard";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/quizzes").then((res) => {
      setQuizzes(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Available Quizzes</h2>

      {quizzes.map((q) => (
        <QuizCard
          key={q._id}
          quiz={q}
          onClick={() => navigate(`/quiz/${q._id}`)}
        />
      ))}
    </div>
  );
}
