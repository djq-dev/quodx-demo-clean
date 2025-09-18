import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const TRACKS = {
  drums: "/assets/drums.wav",
  keys:  "/assets/keys.wav"
};
const PALETTE = ["vocals","bass","guitar","synth","pads","strings"];

export default function Visualize() {
  const r = useRouter();
  const [ritual, setRitual] = useState(null);
  const [haiku, setHaiku] = useState("…");
  const canvasRef = useRef(null);

  // audio
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const buffersRef = useRef({});
  const sourcesRef = useRef({});
  const gainsRef = useRef({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(100);
  const [semitones, setSemitones] = useState(0);
  const [vol, setVol] = useState({ drums: 0.9, keys: 0.9 });
  const [mute, setMute] = useState({ drums: false, keys: false });

  // drag/drop
  const [rack, setRack] = useState([]);

  const rate = () => (tempo / 100) * Math.pow(2, semitones/12);

  useEffect(() => {
    // load ritual from storage
    const raw = typeof window !== "undefined" ? localStorage.getItem("quodx.ritual") : null;
    if (raw) {
      const obj = JSON.parse(raw);
      setRitual(obj);
      setHaiku(obj.haiku || "…");
    }
    // load remix settings
    const remixRaw = typeof window !== "undefined" ? localStorage.getItem("quodx.remix") : null;
    if (remixRaw) {
      const m = JSON.parse(remixRaw);
      if (m.tempo_bpm) setTempo(m.tempo_bpm);
      if (typeof m.pitch_semitones === "number") setSemitones(m.pitch_semitones);
      if (m.modules) {
        setVol({ drums: m.modules.drums?.volume ?? 0.9, keys: m.modules.keys?.volume ?? 0.9 });
        setMute({ drums: !!m.modules.drums?.muted, keys: !!m.modules.keys?.muted });
      }
      if (m.instruments) setRack(m.instruments);
    }
  }, []);

  useEffect(() => {
    // simple animated abstract on canvas
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let t = 0, raf;
    const loop = () => {
      const { width, height } = canvasRef.current;
      ctx.clearRect(0,0,width,height);
      // gradient background
      const g = ctx.createLinearGradient(0,0,width,height);
      g.addColorStop(0, "#101028");
      g.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = g; ctx.fillRect(0,0,width,height);

      // moving circles influenced by tempo
      const speed = tempo/100;
      for (let i=0;i<8;i++) {
        const x = (width/2) + Math.sin(t*0.01*(i+1)*speed) * (80 + i*15);
        const y = (height/2) + Math.cos(t*0.012*(i+1)*speed) * (50 + i*12);
        const radius = 12 + (i*2);
        ctx.globalAlpha = 0.12 + (i*0.05);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2);
        ctx.fillStyle = i%2 ? "#4cc9f0" : "#a66cff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Haiku overlay
      ctx.fillStyle = "#eaeaea";
      ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      const lines = (haiku || "").split("\n");
      lines.forEach((line, idx) => ctx.fillText(line, 20, 30 + idx*20));
      t += 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tempo, haiku]);

  async function initAudio() {
    if (audioCtxRef.current) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    audioCtxRef.current = ctx; masterGainRef.current = master;
    // load buffers
    const load = async (url) => {
      const ab = await (await fetch(url)).arrayBuffer();
      return await new Promise((res, rej)=> ctx.decodeAudioData(ab, res, rej));
    };
    const drums = await load(TRACKS.drums).catch(()=>null);
    const keys  = await load(TRACKS.keys).catch(()=>null);
    buffersRef.current = { drums, keys };
  }

  function createSource(name) {
    const ctx = audioCtxRef.current;
    const src = ctx.createBufferSource();
    src.buffer = buffersRef.current[name];
    src.loop = true;
    src.playbackRate.value = rate();
    const g = ctx.createGain();
    g.gain.value = mute[name] ? 0 : vol[name];
    src.connect(g).connect(masterGainRef.current);
    sourcesRef.current[name] = src;
    gainsRef.current[name] = g;
  }

  function start() {
    if (!audioCtxRef.current || isPlaying) return;
    ["drums","keys"].forEach(n => buffersRef.current[n] && createSource(n));
    const t = Math.ceil(audioCtxRef.current.currentTime + 0.05);
    Object.values(sourcesRef.current).forEach(s => s.start(t));
    setIsPlaying(true);
  }

  function stop() {
    Object.values(sourcesRef.current).forEach(s => { try{s.stop(0)}catch(e){} s.disconnect(); });
    sourcesRef.current = {};
    setIsPlaying(false);
  }

  // react to tempo/pitch while playing
  useEffect(() => {
    const s = sourcesRef.current;
    Object.values(s).forEach(node => { if (node?.playbackRate) node.playbackRate.value = rate(); });
  }, [tempo, semitones]);

  function updateVol(name, value) {
    setVol(v => ({ ...v, [name]: value }));
    const g = gainsRef.current[name]; if (g) g.gain.value = mute[name] ? 0 : value;
    persist();
  }
  function toggleMute(name, checked) {
    setMute(m => ({ ...m, [name]: checked }));
    const g = gainsRef.current[name]; if (g) g.gain.value = checked ? 0 : vol[name];
    persist();
  }

  function onDragStart(e, inst){ e.dataTransfer.setData("text/plain", inst); }
  function onDrop(e) {
    const inst = e.dataTransfer.getData("text/plain");
    if (inst && !rack.includes(inst)) setRack([...rack, inst]);
    e.preventDefault(); persist([...rack, inst]);
  }
  function onDragOver(e){ e.preventDefault(); }

  function persist(instruments) {
    const modules = {
      drums: { volume: vol.drums, muted: mute.drums },
      keys:  { volume: vol.keys,  muted: mute.keys }
    };
    const data = {
      tempo_bpm: tempo,
      pitch_semitones: semitones,
      modules,
      instruments: instruments ?? rack
    };
    if (typeof window !== "undefined") localStorage.setItem("quodx.remix", JSON.stringify(data));
  }

  async function handlePlay() {
    await initAudio();
    start();
  }
  function handleStop(){ stop(); }

  function next() {
    persist();
    r.push("/export");
  }

  return (
    <div className="container">
      <header><h1>Visualize & Sound</h1></header>

      <section className="panel">
        <canvas ref={canvasRef} width={700} height={220} style={{width:"100%", height:"220px", borderRadius:8, background:"#141414"}} />
        <p className="muted" style={{marginTop:8}}>Abstract visualization + haiku overlay</p>
      </section>

      <section className="panel">
        <h2>Transport</h2>
        <div className="row">
          <button onClick={handlePlay} disabled={isPlaying}>Play</button>
          <button onClick={handleStop} disabled={!isPlaying}>Stop</button>
          <label style={{marginLeft:"auto"}}>Tempo <strong>{tempo}</strong>
            <input type="range" min="80" max="140" value={tempo} onChange={e=>{ setTempo(+e.target.value); persist(); }} />
          </label>
          <label>Pitch <strong>{semitones}</strong>
            <input type="range" min="-5" max="5" value={semitones} onChange={e=>{ setSemitones(+e.target.value); persist(); }} />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Stems</h2>
        <div className="modules">
          {["drums","keys"].map(name => (
            <div className="module" key={name}>
              <h3 style={{textTransform:"capitalize"}}>{name}</h3>
              <label>Vol
                <input type="range" min="0" max="1" step="0.01"
                  value={vol[name]} onChange={e=>updateVol(name, +e.target.value)} />
              </label>
              <label>
                <input type="checkbox" checked={mute[name]} onChange={e=>toggleMute(name, e.target.checked)} /> Mute
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Add Instruments (drag to rack)</h2>
        <div className="drag-grid">
          {PALETTE.map(inst => (
            <div key={inst} className="chip" draggable onDragStart={e=>onDragStart(e, inst)}>{inst}</div>
          ))}
        </div>
        <div className="rack" onDrop={onDrop} onDragOver={onDragOver}>
          {rack.length === 0 ? <span className="muted">Drag instruments here…</span> :
            rack.map(i => <span className="pill" key={i}>{i}</span>)}
        </div>
        <div className="row"><button onClick={next}>Next: Signature Pack</button></div>
      </section>
    </div>
  );
}
