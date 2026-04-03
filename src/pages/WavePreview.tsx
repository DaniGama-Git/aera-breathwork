import { useState, useEffect, useRef } from "react";
import waveBgLogo from "@/assets/wave-bg-logo.png";
import waveBgIntro from "@/assets/wave-bg-intro.png";
import waveBgDescription from "@/assets/wave-bg-description.png";
import waveBgInhale from "@/assets/wave-bg-inhale.png";
import lightbulbIcon from "@/assets/lightbulb-icon.svg";
import breathProgressBar from "@/assets/breath-progress-bar.svg";
import breathingIconTop from "@/assets/breathing-icon-top.svg";
import breathingIconBottom from "@/assets/breathing-icon-bottom.svg";

/* ── Timing ── */
const TOTAL_ROUNDS = 3;
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

type Screen = "loading" | "logo" | "intro" | "description" | "breathing" | "done";
type Phase = "INHALE" | "HOLD" | "EXHALE" | "";

const SCREEN_DELAYS: Partial<Record<Screen, number>> = {
  logo: 2200,
  intro: 3000,
  description: 4000,
};

/* ── All background images to preload ── */
const ALL_IMAGES = [waveBgLogo, waveBgIntro, waveBgDescription, waveBgInhale];

/* ── Static screen → background image mapping ── */
const SCREEN_BG: Partial<Record<Screen, string>> = {
  logo: waveBgLogo,
  intro: waveBgIntro,
  description: waveBgDescription,
  done: waveBgLogo,
};

function preloadImages(srcs: string[]): Promise<void> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  ).then(() => {});
}

function buildBreathingGradient(barTop: number): string {
  return `linear-gradient(180deg, 
    hsl(195, 15%, 35%) 0%, 
    hsl(195, 18%, 45%) ${Math.max(0, barTop - 20)}%, 
    hsl(190, 15%, 60%) ${Math.max(0, barTop - 8)}%, 
    hsl(200, 15%, 78%) ${barTop}%, 
    hsl(210, 15%, 90%) ${Math.min(100, barTop + 8)}%, 
    hsl(220, 10%, 96%) ${Math.min(100, barTop + 20)}%, 
    hsl(0, 0%, 100%) 100%)`;
}

const WavePreview = () => {
  const [screen, setScreen] = useState<Screen>("loading");
  const [phase, setPhase] = useState<Phase>("");
  const [fadeIn, setFadeIn] = useState(true);
  const [sessionStart, setSessionStart] = useState(0);
  const [round, setRound] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const phaseLabelRef = useRef<HTMLSpanElement>(null);

  /* ── No preloading needed — pure CSS gradients ── */
  useEffect(() => {
    setScreen("logo");
  }, []);

  /* ── Screen auto-advance ── */
  useEffect(() => {
    const delay = SCREEN_DELAYS[screen];
    if (!delay) return;

    const timer = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        if (screen === "logo") setScreen("intro");
        else if (screen === "intro") setScreen("description");
        else if (screen === "description") {
          setScreen("breathing");
          setSessionStart(Date.now());
          setPhase("INHALE");
          setRound(0);
        }
        setFadeIn(true);
      }, 400);
    }, delay);
    return () => clearTimeout(timer);
  }, [screen]);

  /* ── Breathing phase tracker (ref-based to avoid flicker) ── */
  useEffect(() => {
    if (screen !== "breathing") return;

    const tick = () => {
      const elapsed = Date.now() - sessionStart;
      const totalDuration = CYCLE_MS * TOTAL_ROUNDS;

      if (elapsed >= totalDuration) {
        setFadeIn(false);
        setTimeout(() => {
          setScreen("done");
          setPhase("");
          setFadeIn(true);
        }, 400);
        return;
      }

      const currentRound = Math.min(Math.floor(elapsed / CYCLE_MS), TOTAL_ROUNDS - 1);
      setRound(currentRound);

      const cycleElapsed = elapsed % CYCLE_MS;
      let progress: number;
      let currentPhase: Phase;

      if (cycleElapsed < INHALE_MS) {
        currentPhase = "INHALE";
        progress = 1 - cycleElapsed / INHALE_MS;
      } else if (cycleElapsed < INHALE_MS + HOLD_MS) {
        currentPhase = "HOLD";
        progress = 0;
      } else {
        currentPhase = "EXHALE";
        progress = (cycleElapsed - INHALE_MS - HOLD_MS) / EXHALE_MS;
      }

      // Direct DOM mutation — no React re-render
      const barTop = 10 + progress * 75;
      if (barRef.current) {
        barRef.current.style.top = `${barTop}%`;
      }
      if (gradientRef.current) {
        // The gradient transition point follows the bar
        gradientRef.current.style.background = `linear-gradient(180deg, 
          hsl(195, 15%, 35%) 0%, 
          hsl(195, 18%, 45%) ${Math.max(0, barTop - 20)}%, 
          hsl(190, 15%, 60%) ${Math.max(0, barTop - 8)}%, 
          hsl(200, 15%, 78%) ${barTop}%, 
          hsl(210, 15%, 90%) ${Math.min(100, barTop + 8)}%, 
          hsl(220, 10%, 96%) ${Math.min(100, barTop + 20)}%, 
          hsl(0, 0%, 100%) 100%)`;
      }
      if (phaseLabelRef.current) {
        phaseLabelRef.current.textContent = currentPhase;
      }
      setPhase(currentPhase);

      rafId = requestAnimationFrame(tick);
    };

    let rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [screen, sessionStart]);

  const restart = () => {
    setFadeIn(false);
    setTimeout(() => {
      setScreen("intro");
      setFadeIn(true);
    }, 300);
  };

  const fadeClass = fadeIn ? "opacity-100" : "opacity-0";
  const contentBase = `absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 transition-opacity duration-[400ms] ${fadeClass}`;

  const isBreathing = screen === "breathing";

  /* Loading state */
  if (screen === "loading") {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center font-body">
        <div style={{ width: 320, padding: 16 }}>
          <div
            className="relative w-full overflow-hidden flex items-center justify-center"
            style={{ aspectRatio: "1 / 1.1", borderRadius: 22, background: "#1a1a1a" }}
          >
            <span className="text-white/30 text-[11px] tracking-[0.15em] font-medium animate-pulse">
              loading
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center font-body">
      <div style={{ width: 320, padding: 16 }}>
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "1 / 1.1",
            borderRadius: 22,
          }}
        >
          {/* All static backgrounds layered — opacity crossfade */}
          {(Object.entries(SCREEN_BG) as [Screen, string][]).map(([key, src]) => (
            <div
              key={key}
              className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: !isBreathing && (screen === key || (screen === "done" && key === "logo")) ? 1 : 0,
              }}
            />
          ))}

          {/* Breathing gradient — transition point follows the bar */}
          <div
            ref={gradientRef}
            className="absolute inset-0"
            style={{
              opacity: isBreathing ? 1 : 0,
              transition: "opacity 600ms ease-in-out",
              background: buildBreathingGradient(85),
            }}
          />

          {/* Screen overlays */}
          {screen === "logo" && (
            <div className={contentBase}>
              <span
                className="text-white/90 tracking-[0.2em] font-light"
                style={{ fontSize: 26, fontWeight: 300, filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}
              >
                āera
              </span>
            </div>
          )}

          {screen === "intro" && (
            <div className={contentBase}>
              <div
                className="px-5 py-1.5 rounded-full mb-1.5"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span className="text-white/70 text-[11px] tracking-[0.08em] font-medium">
                  Pre-Pitch
                </span>
              </div>
              <span className="text-white/35 text-[10px] tracking-[0.08em] font-medium mb-5">
                4 mins
              </span>
              <p
                className="text-white font-medium leading-[1.15]"
                style={{ fontSize: 18, letterSpacing: "-0.01em" }}
              >
                You're about to step in,
                <br />
                let's get you sharp
              </p>
            </div>
          )}

          {screen === "description" && (
            <div className={contentBase}>
              <div className="flex items-start gap-3 text-left max-w-[240px]">
                <img src={lightbulbIcon} alt="" style={{ width: 61, height: 82 }} className="mt-0.5 opacity-70 shrink-0" />
                <div>
                  <p className="text-white/80 text-[13px] leading-relaxed font-medium">
                    Two rounds of box breathing to clear mental noise.
                  </p>
                  <p className="text-white/50 text-[13px] leading-relaxed font-medium mt-3">
                    One round of extended exhale to drop cortisol
                  </p>
                </div>
              </div>
            </div>
          )}

          {screen === "breathing" && (
             <div className={`absolute inset-0 z-10 flex flex-col items-center justify-between pointer-events-none transition-opacity duration-[400ms] ${fadeClass}`}>
               <div className="flex-1" />
               {/* Traveling progress bar — positioned via ref, no React re-renders */}
               <div
                 ref={barRef}
                 className="absolute left-0 right-0"
                 style={{ top: "85%" }}
               >
                 <div style={{ height: 3, background: "rgba(247,246,245,0.6)", width: "100%" }} />
               </div>
               <div className="pb-7 flex flex-col items-center gap-2">
                 <span
                   ref={phaseLabelRef}
                   className="tracking-[0.25em] font-medium"
                   style={{ fontSize: 14, color: "rgba(80,80,80,0.6)" }}
                 >
                   {phase}
                 </span>
                   <div className="flex items-center">
                     <img src={breathingIconTop} alt="" style={{ width: 17, height: 4 }} />
                     <img src={breathingIconBottom} alt="" style={{ width: 21, height: 2 }} />
                   </div>
                </div>
             </div>
          )}

          {screen === "done" && (
            <div className={contentBase}>
              <span
                className="text-white/90 tracking-[0.2em] font-light"
                style={{ fontSize: 26, filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default WavePreview;
