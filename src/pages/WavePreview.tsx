import { useRef, useEffect, useCallback, useState } from "react";

const TOTAL_ROUNDS = 3;
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const WavePreview = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const waveLevelRef = useRef(0.45);
  const targetLevelRef = useRef(0.45);
  const sessionStartRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("READY");
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    const dpr = window.devicePixelRatio || 1;
    const w = card.clientWidth;
    const h = card.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  }, []);

  const drawWave = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = card.clientWidth;
    const h = card.clientHeight;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    waveLevelRef.current += (targetLevelRef.current - waveLevelRef.current) * 0.04;
    const baseY = h * (1 - waveLevelRef.current);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, baseY);

    const amplitude = 12 + 6 * Math.sin(time * 0.0008);
    const freq = 0.012;
    const speed = time * 0.0012;

    for (let x = w; x >= 0; x -= 2) {
      const y = baseY
        + Math.sin(x * freq + speed) * amplitude
        + Math.sin(x * freq * 1.8 + speed * 1.3) * (amplitude * 0.4);
      ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fillStyle = "#3a3a3c";
    ctx.fill();
  }, []);

  // Session animation loop
  useEffect(() => {
    if (!running) return;

    const animate = (time: number) => {
      const elapsed = Date.now() - sessionStartRef.current;
      const totalDuration = CYCLE_MS * TOTAL_ROUNDS;

      if (elapsed >= totalDuration) {
        setRunning(false);
        setDone(true);
        targetLevelRef.current = 0.45;
        setPhase("");
        drawWave(time);
        return;
      }

      const cycleElapsed = elapsed % CYCLE_MS;
      const currentRound = Math.min(Math.floor(elapsed / CYCLE_MS), TOTAL_ROUNDS - 1);
      let currentPhase: string;

      if (cycleElapsed < INHALE_MS) {
        currentPhase = "INHALE";
        const t = cycleElapsed / INHALE_MS;
        targetLevelRef.current = 0.35 + 0.5 * easeInOut(t);
      } else if (cycleElapsed < INHALE_MS + HOLD_MS) {
        currentPhase = "HOLD";
        targetLevelRef.current = 0.85;
      } else {
        currentPhase = "EXHALE";
        const t = (cycleElapsed - INHALE_MS - HOLD_MS) / EXHALE_MS;
        targetLevelRef.current = 0.85 - 0.5 * easeInOut(t);
      }

      setPhase(currentPhase);
      setRound(currentRound);
      setProgress((elapsed / totalDuration) * 100);

      drawWave(time);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, drawWave]);

  // Idle animation
  useEffect(() => {
    if (running) return;

    const idleAnimate = (time: number) => {
      targetLevelRef.current = 0.45 + 0.05 * Math.sin(time * 0.001);
      drawWave(time);
      rafRef.current = requestAnimationFrame(idleAnimate);
    };

    rafRef.current = requestAnimationFrame(idleAnimate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, drawWave]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const startSession = () => {
    sessionStartRef.current = Date.now();
    waveLevelRef.current = 0.35;
    targetLevelRef.current = 0.35;
    setRunning(true);
    setDone(false);
    setPhase("INHALE");
    setRound(0);
    setProgress(0);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif",
    }}>
      <div style={{ width: 320, padding: 16 }}>
        <div
          ref={cardRef}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1.15",
            borderRadius: 20,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />

          {/* Title */}
          <div style={{
            position: "absolute", top: 24, left: 0, right: 0, textAlign: "center", zIndex: 2,
            pointerEvents: "none",
          }}>
            <h2 style={{
              fontSize: 13, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.85)", margin: 0,
            }}>PRE-PITCH</h2>
            <div style={{
              fontSize: 10, letterSpacing: 1.2, color: "rgba(255,255,255,0.4)", marginTop: 4,
            }}>4 MINS</div>
          </div>

          {/* Phase labels (bottom) */}
          {running && (
            <div style={{
              position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", zIndex: 2,
              pointerEvents: "none",
            }}>
              <div style={{
                fontSize: 14, letterSpacing: 2, textTransform: "uppercase" as const,
                color: "#2a2a2a", fontWeight: 500,
              }}>{phase}</div>
              <div style={{
                fontSize: 10, letterSpacing: 1, color: "rgba(0,0,0,0.3)", marginTop: 6,
              }}>ROUND {round + 1}/{TOTAL_ROUNDS}</div>
              <div style={{
                width: 60, height: 2, margin: "8px auto 0", background: "rgba(0,0,0,0.08)",
                borderRadius: 1, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", background: "rgba(0,0,0,0.25)", borderRadius: 1,
                  width: `${progress}%`, transition: "width 0.4s ease",
                }} />
              </div>
            </div>
          )}

          {/* Start overlay */}
          {!running && !done && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 5,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "rgba(42,42,42,0.92)", borderRadius: 20,
            }}>
              <span style={{ fontSize: 15, letterSpacing: 3, fontWeight: 300, color: "rgba(255,255,255,0.85)" }}>āera</span>
              <span style={{ fontSize: 11, letterSpacing: 1.5, color: "rgba(255,255,255,0.35)", marginTop: 6, textTransform: "uppercase" as const }}>Pre-Pitch</span>
              <button
                onClick={startSession}
                style={{
                  marginTop: 32, padding: "11px 36px", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 500, letterSpacing: 1.8,
                  textTransform: "uppercase" as const, cursor: "pointer",
                }}
              >Begin</button>
            </div>
          )}

          {/* Done overlay */}
          {done && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 5,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "rgba(42,42,42,0.92)", borderRadius: 20,
            }}>
              <span style={{ fontSize: 15, letterSpacing: 3, fontWeight: 300, color: "rgba(255,255,255,0.85)" }}>āera</span>
              <span style={{ fontSize: 12, letterSpacing: 1.2, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>You're ready.</span>
              <button
                onClick={() => { setDone(false); }}
                style={{
                  marginTop: 24, padding: "9px 28px", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 500, letterSpacing: 1.5,
                  textTransform: "uppercase" as const, cursor: "pointer",
                }}
              >Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WavePreview;