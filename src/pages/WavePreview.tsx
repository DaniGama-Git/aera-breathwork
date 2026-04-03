import { useRef, useEffect, useCallback, useState } from "react";

/* ── Timing ── */
const TOTAL_ROUNDS = 3;
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/* ── Screens ── */
type Screen = "logo" | "intro" | "description" | "breathing" | "done";

const SCREEN_DELAYS: Partial<Record<Screen, number>> = {
  logo: 2200,
  intro: 3000,
  description: 4000,
};

const WavePreview = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const waveLevelRef = useRef(0.55);
  const targetLevelRef = useRef(0.55);
  const sessionStartRef = useRef(0);

  const [screen, setScreen] = useState<Screen>("logo");
  const [phase, setPhase] = useState("");
  const [fadeIn, setFadeIn] = useState(true);

  /* ── Canvas resize ── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = card.clientWidth * dpr;
    canvas.height = card.clientHeight * dpr;
    canvas.style.width = card.clientWidth + "px";
    canvas.style.height = card.clientHeight + "px";
  }, []);

  /* ── Draw gradient wave ── */
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

    /* full-card gradient background: soft teal-to-mint */
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#5a7a7a");
    bg.addColorStop(0.45, "#8aa8a4");
    bg.addColorStop(0.7, "#c4d8d2");
    bg.addColorStop(1, "#e8efec");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    /* smoothly approach target */
    waveLevelRef.current += (targetLevelRef.current - waveLevelRef.current) * 0.035;
    const baseY = h * (1 - waveLevelRef.current);

    /* wave path */
    const amplitude = 8 + 4 * Math.sin(time * 0.0006);
    const freq = 0.014;
    const speed = time * 0.001;

    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += 2) {
      const y =
        baseY +
        Math.sin(x * freq + speed) * amplitude +
        Math.sin(x * freq * 2.2 + speed * 1.4) * (amplitude * 0.3);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    /* light fill below wave */
    const waveFill = ctx.createLinearGradient(0, baseY, 0, h);
    waveFill.addColorStop(0, "rgba(232,239,236,0.85)");
    waveFill.addColorStop(0.3, "rgba(240,245,242,0.95)");
    waveFill.addColorStop(1, "#f0f5f2");
    ctx.fillStyle = waveFill;
    ctx.fill();

    /* thin bright line along wave crest */
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += 2) {
      const y =
        baseY +
        Math.sin(x * freq + speed) * amplitude +
        Math.sin(x * freq * 2.2 + speed * 1.4) * (amplitude * 0.3);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, []);

  /* ── Screen auto-advance (logo → intro → description) ── */
  useEffect(() => {
    const delay = SCREEN_DELAYS[screen];
    if (!delay) return;

    const transition = () => {
      setFadeIn(false);
      setTimeout(() => {
        if (screen === "logo") setScreen("intro");
        else if (screen === "intro") setScreen("description");
        else if (screen === "description") {
          setScreen("breathing");
          sessionStartRef.current = Date.now();
          waveLevelRef.current = 0.55;
          targetLevelRef.current = 0.55;
          setPhase("INHALE");
        }
        setFadeIn(true);
      }, 400);
    };

    const timer = setTimeout(transition, delay);
    return () => clearTimeout(timer);
  }, [screen]);

  /* ── Breathing animation ── */
  useEffect(() => {
    if (screen !== "breathing") return;

    const animate = (time: number) => {
      const elapsed = Date.now() - sessionStartRef.current;
      const totalDuration = CYCLE_MS * TOTAL_ROUNDS;

      if (elapsed >= totalDuration) {
        targetLevelRef.current = 0.55;
        setPhase("");
        setFadeIn(false);
        setTimeout(() => {
          setScreen("done");
          setFadeIn(true);
        }, 400);
        drawWave(time);
        return;
      }

      const cycleElapsed = elapsed % CYCLE_MS;
      if (cycleElapsed < INHALE_MS) {
        setPhase("INHALE");
        const t = cycleElapsed / INHALE_MS;
        targetLevelRef.current = 0.3 + 0.45 * easeInOut(t);
      } else if (cycleElapsed < INHALE_MS + HOLD_MS) {
        setPhase("HOLD");
        targetLevelRef.current = 0.75;
      } else {
        setPhase("EXHALE");
        const t = (cycleElapsed - INHALE_MS - HOLD_MS) / EXHALE_MS;
        targetLevelRef.current = 0.75 - 0.45 * easeInOut(t);
      }

      drawWave(time);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [screen, drawWave]);

  /* ── Idle wave (all non-breathing screens) ── */
  useEffect(() => {
    if (screen === "breathing") return;

    const idleAnimate = (time: number) => {
      targetLevelRef.current = 0.55 + 0.04 * Math.sin(time * 0.0008);
      drawWave(time);
      rafRef.current = requestAnimationFrame(idleAnimate);
    };

    rafRef.current = requestAnimationFrame(idleAnimate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [screen, drawWave]);

  /* ── Resize ── */
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const restart = () => {
    setFadeIn(false);
    setTimeout(() => {
      setScreen("logo");
      waveLevelRef.current = 0.55;
      targetLevelRef.current = 0.55;
      setFadeIn(true);
    }, 300);
  };

  /* ── Overlay content per screen ── */
  const overlayContent = () => {
    const fadeClass = fadeIn ? "opacity-100" : "opacity-0";
    const base = `absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 transition-opacity duration-[400ms] ${fadeClass}`;

    switch (screen) {
      case "logo":
        return (
          <div className={base}>
            <span
              className="text-white/90 tracking-[0.25em] font-light"
              style={{ fontSize: 22 }}
            >
              āera
            </span>
          </div>
        );

      case "intro":
        return (
          <div className={base}>
            {/* pill */}
            <div
              className="px-4 py-1.5 rounded-full mb-5"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-white/80 text-[11px] tracking-[0.15em] font-medium">
                Pre-Pitch
              </span>
              <span className="block text-white/40 text-[9px] tracking-[0.1em] mt-0.5">
                4 mins
              </span>
            </div>
            <p
              className="text-white/85 font-medium leading-snug"
              style={{ fontSize: 20, letterSpacing: "-0.01em" }}
            >
              You're about to step in,
              <br />
              let's get you sharp
            </p>
          </div>
        );

      case "description":
        return (
          <div className={base}>
            <div className="flex items-start gap-3 text-left max-w-[240px]">
              <span className="text-2xl mt-0.5 opacity-70">💡</span>
              <div>
                <p className="text-white/75 text-[13px] leading-relaxed font-medium">
                  Two rounds of box breathing to clear mental noise.
                </p>
                <p className="text-white/50 text-[13px] leading-relaxed font-medium mt-3">
                  One round of extended exhale to drop cortisol
                </p>
              </div>
            </div>
          </div>
        );

      case "breathing":
        return (
          <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center pointer-events-none">
            <span
              className="tracking-[0.25em] font-medium"
              style={{ fontSize: 14, color: "rgba(60,60,60,0.7)" }}
            >
              {phase}
            </span>
            <div
              className="mt-2 rounded-full"
              style={{
                width: 20,
                height: 2,
                background: "rgba(60,60,60,0.25)",
              }}
            />
          </div>
        );

      case "done":
        return (
          <div className={base}>
            <span
              className="text-white/90 tracking-[0.25em] font-light"
              style={{ fontSize: 22 }}
            >
              āera
            </span>
            <p className="text-white/50 text-[13px] tracking-wide mt-3 font-medium">
              You're ready.
            </p>
            <button
              onClick={restart}
              className="mt-8 px-7 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium cursor-pointer transition-all hover:brightness-110"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center font-body">
      <div style={{ width: 320, padding: 16 }}>
        <div
          ref={cardRef}
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "1 / 1.1", borderRadius: 22 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
          {overlayContent()}
        </div>
      </div>
    </div>
  );
};

export default WavePreview;
