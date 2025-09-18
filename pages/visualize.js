import { useEffect, useState } from "react";

export default function Visualize() {
  const [playing, setPlaying] = useState(null);
  const [ritualWords, setRitualWords] = useState([]);
  const audioRef = useState({})[0];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quodx.words");
      if (stored) {
        setRitualWords(stored.split(/\s+/).slice(0, 10)); // limit to 10 words
      }
    }
  }, []);

  function togglePlay(name, url) {
    if (playing === name) {
      audioRef[name].pause();
      setPlaying(null);
    } else {
      if (!audioRef[name]) {
        audioRef[name] = new Audio(url);
        audioRef[name].loop = true;
      }
      audioRef[name].play();
      setPlaying(name);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>🌌 Soundscape Loop</h1>
      </header>

      <section className="panel">
        <div
          style={{
            width: "100%",
            height: "250px",
            background: "linear-gradient(135deg, #f8f6f2, #e7dfd5, #d4cbb8)",
            borderRadius: "12px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Floating Orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="orb"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 80}%`,
                animationDuration: `${8 + i * 2}s`
              }}
            ></div>
          ))}

          {/* Floating Words */}
          {ritualWords.map((word, idx) => (
            <span
              key={idx}
              className="floatingWord"
              style={{
                top: `${Math.random() * 80}%`,
                animationDuration: `${10 + idx * 3}s`
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>🎛️ Play with Stems</h2>
        <div className="row" style={{ marginBottom: "8px" }}>
          <button
            onClick={() => togglePlay("drums", "/assets/drums.wav")}
            className="secondary"
            style={{ width: "60px" }}
          >
            {playing === "drums" ? "⏸️" : "▶️"}
          </button>
          <span style={{ marginLeft: "10px" }}>Drums</span>
        </div>
        <div className="row" style={{ marginBottom: "8px" }}>
          <button
            onClick={() => togglePlay("keys", "/assets/keys.wav")}
            className="secondary"
            style={{ width: "60px" }}
          >
            {playing === "keys" ? "⏸️" : "▶️"}
          </button>
          <span style={{ marginLeft: "10px" }}>Keys</span>
        </div>
      </section>

      {/* Back/Next */}
      <div className="row" style={{ marginTop: "20px", justifyContent: "space-between" }}>
        <a className="button" href="/">⬅️ Back</a>
        <a className="button" href="/export">➡️ Next</a>
      </div>
    </div>
  );
}
