import { useState, useEffect, useRef } from "react";
import waveBgLogo from "@/assets/wave-bg-logo.png";
import waveBgIntro from "@/assets/wave-bg-intro.png";
import waveBgDescription from "@/assets/wave-bg-description.png";
import waveBgInhale from "@/assets/wave-bg-inhale.png";
import waveBgHold from "@/assets/wave-bg-hold.png";
import waveBgExhale from "@/assets/wave-bg-exhale.png";
import lightbulbIcon from "@/assets/lightbulb-icon.svg";
import breathProgressBar from "@/assets/breath-progress-bar.svg";

/* ── Timing ── */
const TOTAL_ROUNDS = 3;
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

type Screen = "loading" | "logo" | "intro" | "description" | "breathing" | "done";
type Phase = "INHALE" | "HOLD" | "EXHALE" | "";

const ALL_IMAGES = [
  waveBgLogo, waveBgIntro, waveBgDescription,
  waveBgInhale, waveBgHold, waveBgExhale,
];

const SCREEN_DELAYS: Partial<Record<Screen, number>> = {
  logo: 2200,
  intro: 3000,
  description: 4000,
};

const PHASE_BG: Record<string, string> = {
  INHALE: waveBgInhale,
  HOLD: waveBgHold,
  EXHALE: waveBgExhale,
};

/* ── Preload all images before showing anything ── */
function preloadImages(srcs: string[]): Promise<void> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // don't block on error
          img.src = src;
        })
    )
  ).then(() => {});
}

const WavePreview = () => {
  const [screen, setScreen] = useState<Screen>("loading");
  const [phase, setPhase] = useState<Phase>("");
  const [fadeIn, setFadeIn] = useState(true);
  const [sessionStart, setSessionStart] = useState(0);
  const [round, setRound] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);

  /* ── Preload all backgrounds before first screen ── */
  useEffect(() => {
    preloadImages(ALL_IMAGES).then(() => {
      setScreen("logo");
    });
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

  /* ── Breathing phase tracker ── */
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
      if (cycleElapsed < INHALE_MS) {
        setPhase("INHALE");
        // Inhale: bar travels UP → progress 1 → 0
        setPhaseProgress(1 - cycleElapsed / INHALE_MS);
      } else if (cycleElapsed < INHALE_MS + HOLD_MS) {
        setPhase("HOLD");
        // Hold: bar stays at top → 0
        setPhaseProgress(0);
      } else {
        setPhase("EXHALE");
        // Exhale: bar travels DOWN → progress 0 → 1
        setPhaseProgress((cycleElapsed - INHALE_MS - HOLD_MS) / EXHALE_MS);
      }

      rafId = requestAnimationFrame(tick);
    };

    let rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [screen, sessionStart]);

  const restart = () => {
    setFadeIn(false);
    setTimeout(() => {
      setScreen("logo");
      setFadeIn(true);
    }, 300);
  };

  const fadeClass = fadeIn ? "opacity-100" : "opacity-0";
  const contentBase = `absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 transition-opacity duration-[400ms] ${fadeClass}`;

  /* ── Background logic ── */
  const getStaticBg = () => {
    if (screen === "logo") return waveBgLogo;
    if (screen === "intro") return waveBgIntro;
    if (screen === "description") return waveBgDescription;
    if (screen === "done") return waveBgLogo;
    return undefined;
  };

  const isBreathing = screen === "breathing";
  const staticBg = getStaticBg();

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
          {/* Static background for non-breathing screens */}
          {!isBreathing && staticBg && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${staticBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          {/* Animated breathing backgrounds - all 3 layered, opacity-controlled */}
          {isBreathing && (["INHALE", "HOLD", "EXHALE"] as const).map((p) => (
            <div
              key={p}
              className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
              style={{
                backgroundImage: `url(${PHASE_BG[p]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: phase === p ? 1 : 0,
              }}
            />
          ))}

          {/* Screen overlays */}
          {screen === "logo" && (
            <div className={contentBase}>
              <span
                className="text-white/90 tracking-[0.2em] font-light"
                style={{ fontSize: 26, fontWeight: 300 }}
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
                style={{ fontSize: 40, letterSpacing: "-0.01em" }}
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
              {/* Traveling progress bar: top=10% to bottom=85% range */}
              <div
                className="absolute left-6 right-6"
                style={{
                  top: `${10 + phaseProgress * 75}%`,
                  transition: "top 0.15s linear",
                }}
              >
                <img src={breathProgressBar} alt="" className="w-full opacity-60" />
              </div>
              <div className="pb-7 flex flex-col items-center">
                <span
                  className="tracking-[0.25em] font-medium"
                  style={{ fontSize: 14, color: "rgba(80,80,80,0.6)" }}
                >
                  {phase}
                </span>
              </div>
            </div>
          )}

          {screen === "done" && (
            <div className={contentBase}>
              <span
                className="text-white/90 tracking-[0.2em] font-light"
                style={{ fontSize: 26 }}
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
