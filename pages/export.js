import { useEffect, useState } from "react";

export default function ExportPack() {
  const [ritual, setRitual] = useState(null);
  const [remix, setRemix] = useState(null);
  const [pack, setPack] = useState(null);
  const [showDaw, setShowDaw] = useState(false);

  useEffect(() => {
    const r =
      typeof window !== "undefined"
        ? localStorage.getItem("quodx.ritual")
        : null;
    const m =
      typeof window !== "undefined"
        ? localStorage.getItem("quodx.remix")
        : null;
    const ritualObj = r ? JSON.parse(r) : null;
    const remixObj = m ? JSON.parse(m) : null;
    setRitual(ritualObj);
    setRemix(remixObj);

    const packObj = {
      pack_id: "pack_" + Math.random().toString(36).slice(2, 10),
      pack_name: "QuodX Spaces — Signature Pack Demo",
      version: "1.0-demo",
      created_at: new Date().toISOString(),
      ritual: ritualObj || {},
      remix: remixObj || {},
      stems: {
        drums: "/assets/drums.wav",
        keys: "/assets/keys.wav",
      },
      licensing: {
        license: "Demo / Non-commercial",
        attribution_embedded: true,
        lineage_id: "demo-lineage-0001",
      },
    };
    setPack(packObj);
  }, []);

  function copy() {
    navigator.clipboard.writeText(JSON.stringify(pack, null, 2));
    alert("Copied JSON");
  }

  function download() {
    const blob = new Blob([JSON.stringify(pack, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signature-pack.json";
    a.click();
  }

  if (!pack) {
    return (
      <div className="container export-page">
        <p>Loading pack...</p>
      </div>
    );
  }

  return (
    <div className="container export-page">
      <header>
        <h1>Signature Pack</h1>
        <p>
          A personalized creative bundle generated from your input — ready to
          remix, share, and explore.
        </p>
      </header>

      <section className="panel">
        <h2>📦 What’s Inside</h2>
        <ul style={{ lineHeight: "1.8", marginTop: "12px" }}>
          <li>
            <strong>Prompts:</strong>{" "}
            {ritual?.prompt || "Captured from your words on page 1"}
          </li>
          <li>
            <strong>Instructions:</strong> Load stems in DAW, tempo{" "}
            {remix?.tempo_bpm ?? 95} BPM
          </li>
          <li>
            <strong>AI Tools:</strong> Human Loop, Remix Engine, Motif Distiller
          </li>
          <li>
            <strong>Stems:</strong> 🎵 Drums + 🎹 Keys
          </li>
          <li>
            <strong>Remix Logic:</strong> Pitch shift{" "}
            {remix?.pitch_semitones ?? 0}, active modules{" "}
            {remix?.modules
              ? Object.keys(remix.modules).join(", ")
              : "N/A"}
          </li>
          <li>
            <strong>License:</strong>{" "}
            {pack?.licensing?.license || "Demo / Non-commercial"}
          </li>
        </ul>

        <div className="row" style={{ marginTop: 20, gap: 12 }}>
          <button onClick={copy}>📋 Copy JSON</button>
          <button onClick={download}>⬇️ Download JSON</button>
          <button onClick={() => setShowDaw(true)}>🎚️ Export to DAW (mock)</button>
        </div>
      </section>

      {showDaw && (
        <div className="modal">
          <div className="modal-content">
            <h2>DAW Plugin (Mock)</h2>
            <p>This is how the pack could load into a DAW.</p>
            <img
              src="/assets/daw-mock.png"
              alt="daw mock"
              style={{
                width: "100%",
                border: "1px solid #444",
                borderRadius: 8,
              }}
            />
            <div className="row" style={{ marginTop: 12 }}>
              <a
                className="button"
                href="/assets/quodx-demo.vst3"
                download
              >
                Download Plugin (mock)
              </a>
              <button
                className="secondary"
                onClick={() => setShowDaw(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
