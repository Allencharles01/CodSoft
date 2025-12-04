// src/components/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSearch === "function") {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="jobs-search">
      <input
        type="text"
        placeholder="Search by title, company, or location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="jobs-search-input"
      />
    </form>
  );
}
