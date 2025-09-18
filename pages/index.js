import { useState } from "react";

export default function Home() {
  const [ritual, setRitual] = useState("");

  function handleNext() {
    if (ritual.trim()) {
      localStorage.setItem("quodx.words", ritual);
    }
    window.location.href = "/visualize";
  }

  return (
    <div className="container">
      <header>
        <h1>Quodx Spaces</h1>
        <h2 style={{ fontWeight: "normal", color: "#666" }}>Human Loop</h2>
      </header>

      <section className="panel">
        <h2>🌱 Enter Your Words</h2>
        <textarea
          rows="5"
          value={ritual}
          onChange={(e) => setRitual(e.target.value)}
          placeholder="Describe your mood, moment, or vibe..."
          style={{ width: "100%", padding: "10px", fontSize: "1.1em" }}
        />
      </section>

      <section className="panel">
        <button className="button" onClick={handleNext}>
          ➡️ Next
        </button>
      </section>
    </div>
  );
}
