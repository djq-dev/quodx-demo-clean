import { useEffect, useState } from "react";

export default function ExportPack() {
  const [ritual, setRitual] = useState(null);
  const [remix, setRemix] = useState(null);
  const [pack, setPack] = useState(null);
  const [showDaw, setShowDaw] = useState(false);

  useEffect(() => {
    const r = typeof window !== "undefined" ? localStorage.getItem("quodx.ritual") : null;
    const m = typeof window !== "undefined" ? localStorage.getItem("quodx.remix") : null;
    const ritualObj = r ? JSON.parse(r) : null;
    const remixObj  = m ? JSON.parse(m) : null;
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
    navigator.clipboard.writeText(JSON.stringify(pack, null, 2));
    alert("Copied JSON");
  }
  function download() {
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signature-pack.json";
    a.click();
  }

  return (
    <div className="container">
      <header><h1>Signature Pack</h1></header>

      <section className="panel">
        <pre>{JSON.stringify(pack, null, 2)}</pre>
        <div className="row">
          <button onClick={copy}>Copy JSON</button>
          <button onClick={download}>Download JSON</button>
          <button onClick={()=>setShowDaw(true)}>Export to DAW (mock)</button>
        </div>
      </section>

      {showDaw && (
        <div className="modal">
          <div className="modal-content">
            <h2>DAW Plugin (Mock)</h2>
            <p>This is how the pack could load into a DAW.</p>
            <img src="/assets/daw-mock.png" alt="daw mock" style={{width:"100%", border:"1px solid #444", borderRadius:8}} />
            <div className="row" style={{marginTop:12}}>
              <a className="button" href="/assets/quodx-demo.vst3" download>Download Plugin (mock)</a>
              <button className="secondary" onClick={()=>setShowDaw(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
