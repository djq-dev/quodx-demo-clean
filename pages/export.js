import { useEffect, useState } from "react";

export default function ExportPack() {
  const [ritual, setRitual] = useState(null);
  const [remix, setRemix] = useState(null);
  const [pack, setPack] = useState(null);
  const [showDaw, setShowDaw] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [promptText, setPromptText] = useState("");

  useEffect(() => {
    const r = typeof window !== "undefined" ? localStorage.getItem("quodx.ritual") : null;
    const m = typeof window !== "undefined" ? localStorage.getItem("quodx.remix") : null;
    const words = typeof window !== "undefined" ? localStorage.getItem("quodx.words") : null;

    const ritualObj = r ? JSON.parse(r) : null;
    const remixObj  = m ? JSON.parse(m) : null;

    setRitual(ritualObj);
    setRemix(remixObj);
    setPromptText(
      (ritualObj?.feelingToday ||
       ritualObj?.prompt ||
       words ||
       "Captured from your Human Loop on page 1").toString()
    );

    const packObj = {
      pack_id: "pack_" + Math.random().toString(36).slice(2, 10),
      pack_name: "QuodX Spaces — Signature Pack Demo",
      version: "1.0-demo",
      created_at: new Date().toISOString(),
      ritual: ritualObj || {},
      remix: remixObj || {},
      stems: {
        drums: "/assets/drums.wav",
        keys: "/assets/keys.wav"
      },
      licensing: {
        license: "Demo / Non-commercial",
        attribution_embedded: true,
        lineage_id: "demo-lineage-0001"
      }
    };
    setPack(packObj);
  }, []);

  function copy() {
    if (!pack) return;
    navigator.clipboard.writeText(JSON.stringify(pack, null, 2));
    alert("Copied JSON");
  }

  function download() {
    if (!pack) return;
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signature-pack.json";
    a.click();
  }

  const tempo = remix?.tempo_bpm ?? 95;
  const pitch = remix?.pitch_semitones ?? 0;

  return (
    <div className="container">
      <header>
        <h1>🎁 QuodX Spaces — Signature Pack</h1>
      </header>

      {/* Pack contents */}
      <section className="panel grid">
        <div className="card">
          <img src="/assets/icon-prompts.png" alt="prompts" className="icon" />
          <h3>Prompts</h3>
          <p>{promptText.length > 240 ? promptText.slice(0, 240) + "…" : promptText}</p>
        </div>

        <div className="card">
          <img src="/assets/icon-instructions.png" alt="instructions" className="icon" />
          <h3>Instructions</h3>
          <ul>
            <li>Load stems into your DAW</li>
            <li>Start at <strong>{tempo} BPM</strong>, pitch <strong>{pitch} st</strong></li>
            <li>Arrange Keys as bed, Drums at bar 5</li>
            <li>Layer vocals guided by prompts</li>
          </ul>
        </div>

        <div className="card">
          <img src="/assets/icon-ai.png" alt="AI tools" className="icon" />
          <h3>AI Tools Used</h3>
          <ul>
            <li>Human Loop → intent from words</li>
            <li>Remix Engine → tempo/pitch</li>
            <li>Motif Distiller → text motifs</li>
          </ul>
        </div>

        <div className="card">
          <img src="/assets/icon-stems.png" alt="stems" className="icon" />
          <h3>Stems</h3>
          <div className="stem">
            <strong>Drums</strong>
            <audio controls src="/assets/drums.wav" />
          </div>
          <div className="stem">
            <strong>Keys</strong>
            <audio controls src="/assets/keys.wav" />
          </div>
        </div>

        <div className="card">
          <img src="/assets/icon-remix.png" alt="remix" className="icon" />
          <h3>Remix Logic</h3>
          <div className="tags">
            <span>Tempo: {tempo} BPM</span>
            <span>Pitch: {pitch} st</span>
            <span>
              Modules: {remix?.modules ? Object.keys(remix.modules).join(", ") : "Drums, Keys"}
            </span>
          </div>
        </div>

        <div className="card">
          <img src="/assets/icon-license.png" alt="license" className="icon" />
          <h3>Licensing</h3>
          <p>{pack?.licensing?.license || "Demo / Non-commercial"}</p>
        </div>
      </section>

      {/* Actions */}
      <section className="panel">
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => setShowDaw(true)}>🎚️ Export to DAW (mock)</button>
          <button onClick={copy}>📋 Copy JSON</button>
          <button onClick={download}>⬇️ Download JSON</button>
          <button className="secondary" onClick={() => setShowRaw((s) => !s)}>
            {showRaw ? "Hide JSON" : "Show JSON"}
          </button>
        </div>

        {showRaw && (
          <pre className="raw">{JSON.stringify(pack, null, 2)}</pre>
        )}
      </section>

      {/* Back/Home */}
      <div className="row" style={{ marginTop: 20, justifyContent: "space-between" }}>
        <a className="button" href="/visualize">⬅️ Back</a>
        <a className="button" href="/">🏠 Home</a>
      </div>

      {/* DAW modal (mock) */}
      {showDaw && (
        <div className="modal">
          <div className="modal-content">
            <h2>DAW Plugin (Mock)</h2>
            <p>This is how the pack could load into a DAW.</p>
            <img
              src="/assets/daw-mock.png"
              alt="daw mock"
              style={{ width: "100%", border: "1px solid #444", borderRadius: 8 }}
            />
            <div className="row" style={{ marginTop: 12 }}>
              <a className="button" href="/assets/quodx-demo.vst3" download>
                Download Plugin (mock)
              </a>
              <button className="secondary" onClick={() => setShowDaw(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .card {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 16px;
          text-align: left;
        }
        .card h3 {
          margin-top: 10px;
        }
        .card ul {
          margin-top: 8px;
          padding-left: 20px;
          line-height: 1.7;
        }
        .icon {
          width: 40px;
          height: 40px;
        }
        .stem {
          margin-top: 8px;
        }
        .stem audio {
          width: 100%;
          margin-top: 4px;
        }
        .tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .tags span {
          background: #f2efe8;
          border: 1px solid #e3dccf;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.95em;
        }
        .raw {
          margin-top: 16px;
          background: #f7f7f7;
          padding: 12px;
          border-radius: 8px;
          overflow: auto;
        }
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          max-width: 720px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
