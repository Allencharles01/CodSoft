export default function QuizCard({ quiz, onClick }) {
  return (
    <div className="glass-card" onClick={onClick}>
      <h3>{quiz.title}</h3>
      <p>{quiz.description}</p>
    </div>
  );
}
