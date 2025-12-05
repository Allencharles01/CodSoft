import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        flexWrap: "wrap",

        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Logo / Title */}
      <h2 style={{ margin: 0, color: "white", fontSize: "22px" }}>
        Quiz Maker
      </h2>

      {/* Links */}
      <div
        className="links"
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "10px",
        }}
      >
        <Link style={linkStyle} to="/">Home</Link>
        <Link style={linkStyle} to="/quizzes">Quizzes</Link>
        <Link style={linkStyle} to="/create-quiz">Create Quiz</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  transition: "0.2s",
};
