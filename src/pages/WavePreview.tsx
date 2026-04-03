import { useState, useEffect } from "react";
import waveBgLogo from "@/assets/wave-bg-logo.png";
import waveBgIntro from "@/assets/wave-bg-intro.png";
import waveBgDescription from "@/assets/wave-bg-description.png";
import waveBgInhale from "@/assets/wave-bg-inhale.png";
import waveBgHold from "@/assets/wave-bg-hold.png";
import waveBgExhale from "@/assets/wave-bg-exhale.png";
import lightbulbIcon from "@/assets/lightbulb-icon.svg";

/* ── Timing ── */
const TOTAL_ROUNDS = 3;
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

type Screen = "logo" | "intro" | "description" | "breathing" | "done";
type Phase = "INHALE" | "HOLD" | "EXHALE" | "";

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

const WavePreview = () => {
  const [screen, setScreen] = useState<Screen>("logo");
  const [phase, setPhase] = useState<Phase>("");
  const [fadeIn, setFadeIn] = useState(true);
  const [sessionStart, setSessionStart] = useState(0);
  const [round, setRound] = useState(0);

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
      if (cycleElapsed < INHALE_MS) setPhase("INHALE");
      else if (cycleElapsed < INHALE_MS + HOLD_MS) setPhase("HOLD");
      else setPhase("EXHALE");

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

  const progress = screen === "breathing" && sessionStart
    ? Math.min(((Date.now() - sessionStart) / (CYCLE_MS * TOTAL_ROUNDS)) * 100, 100)
    : 0;

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
                className="px-5 py-2 rounded-full mb-2"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span className="text-white/80 text-[13px] tracking-[0.08em] font-medium">
                  Pre-Pitch
                </span>
              </div>
              <span className="text-white/40 text-[11px] tracking-[0.08em] font-medium mb-6">
                4 mins
              </span>
              <p
                className="text-white font-semibold leading-[1.25]"
                style={{ fontSize: 24, letterSpacing: "-0.01em" }}
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
                <img src={lightbulbIcon} alt="" className="w-5 h-5 mt-0.5 opacity-70" />
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
            <div className={`absolute bottom-7 left-0 right-0 z-10 flex flex-col items-center pointer-events-none transition-opacity duration-[400ms] ${fadeClass}`}>
              <span
                className="tracking-[0.25em] font-medium"
                style={{ fontSize: 14, color: "rgba(80,80,80,0.6)" }}
              >
                {phase}
              </span>
              {/* Progress bar */}
              <div className="mt-3 flex items-center gap-0">
                <div
                  className="rounded-full"
                  style={{
                    width: `${Math.max(4, progress * 0.38)}px`,
                    height: phase ? 4 : 2,
                    background: "#595959",
                    transition: "width 0.3s ease",
                  }}
                />
                <div
                  className="rounded-full"
                  style={{
                    width: `${Math.max(4, (100 - progress) * 0.38)}px`,
                    height: 2,
                    background: "#d9d9d9",
                    transition: "width 0.3s ease",
                  }}
                />
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
