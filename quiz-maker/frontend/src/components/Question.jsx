export default function Question({ q, selectedIndex, onSelect }) {
  return (
    <div style={{ marginBottom: "35px" }}>
      {/* Question text */}
      <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>
        {q.text}
      </p>

      {/* 2-column options grid */}
      <div
        className="option-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {q.options.map((opt, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            style={{
              padding: "12px",
              background:
                selectedIndex === index
                  ? "rgba(0, 150, 255, 0.25)"
                  : "rgba(255,255,255,0.06)",
              color: "white",
              border:
                selectedIndex === index
                  ? "1.5px solid #4da6ff"
                  : "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              backdropFilter: "blur(12px)",
              cursor: "pointer",
              transition: "0.25s",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
