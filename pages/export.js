export default function Export() {
  return (
    <div className="container">
      <header>
        <h1>🎁 Signature Pack</h1>
        <h2 style={{ fontWeight: "normal", color: "#666" }}>
          Everything you get from your Human Loop
        </h2>
      </header>

      <section className="panel">
        <ul style={{ lineHeight: "1.8em", fontSize: "1.1em" }}>
          <li>📝 Prompts that inspired the music</li>
          <li>🎶 Preview clips of the soundscape</li>
          <li>🥁 Stems (drums, keys, pads, vocals, etc.)</li>
          <li>📖 Remix instructions & creative logic</li>
          <li>🎛️ Suggestions for layering new instruments</li>
        </ul>
      </section>

      {/* Back/Home */}
      <div className="row" style={{ marginTop: "20px", justifyContent: "space-between" }}>
        <a className="button" href="/visualize">⬅️ Back</a>
        <a className="button" href="/">🏠 Home</a>
      </div>
    </div>
  );
}
