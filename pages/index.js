import { useState } from "react";
import { useRouter } from "next/router";

export default function HumanLoop() {
  const r = useRouter();
  const [feelingToday, setFeelingToday] = useState("");
  const [scene, setScene] = useState("");
  const [seeing, setSeeing] = useState("");
  const [hearing, setHearing] = useState("");
  const [smelling, setSmelling] = useState("");
  const [tasting, setTasting] = useState("");
  const [touching, setTouching] = useState("");
  const [prompt, setPrompt] = useState("");

  function saveAndNext() {
    const haiku = [
      feelingToday || "Quiet resolve",
      seeing || "City lights breathing slowly",
      prompt || "What would you say now?"
    ].join("\n");

    const ritual = {
      feelingToday, scene,
      senses: { seeing, hearing, smelling, tasting, touching },
      prompt,
      haiku,
      createdAt: new Date().toISOString()
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("quodx.ritual", JSON.stringify(ritual));
    }
    r.push("/visualize");
  }

  return (
    <div className="container">
      <header><h1>QuodX Spaces – Remix Kit Demo</h1></header>

      <section className="panel">
        <h2>Human Loop</h2>
        <div className="grid-2">
          <label>How are you feeling today?
            <textarea rows={3} value={feelingToday} onChange={e=>setFeelingToday(e.target.value)} placeholder="e.g., charged, empty, bittersweet…" />
          </label>
          <label>Scene
            <textarea rows={3} value={scene} onChange={e=>setScene(e.target.value)} placeholder="e.g., empty freeway, 1 a.m., sodium vapor lights…" />
          </label>
        </div>

        <div className="grid-2">
          <label>Seeing
            <textarea rows={4} value={seeing} onChange={e=>setSeeing(e.target.value)} placeholder="What are you seeing?" />
          </label>
          <label>Hearing
            <textarea rows={4} value={hearing} onChange={e=>setHearing(e.target.value)} placeholder="What are you hearing?" />
          </label>
          <label>Smelling
            <textarea rows={4} value={smelling} onChange={e=>setSmelling(e.target.value)} placeholder="What are you smelling?" />
          </label>
          <label>Tasting
            <textarea rows={4} value={tasting} onChange={e=>setTasting(e.target.value)} placeholder="What are you tasting?" />
          </label>
          <label>Touching
            <textarea rows={4} value={touching} onChange={e=>setTouching(e.target.value)} placeholder="What textures / temperature?" />
          </label>
        </div>

        <label>Prompt / Intent
          <textarea rows={4} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="What would you say to someone you lost? Or: What's the intent of this piece?" />
        </label>

        <div className="row">
          <button onClick={saveAndNext}>Next: Visualize & Sound</button>
        </div>
      </section>
    </div>
  );
}
