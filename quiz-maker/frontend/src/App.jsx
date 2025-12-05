import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import QuizList from "./pages/QuizList.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/results/:attemptId" element={<ResultsPage />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
