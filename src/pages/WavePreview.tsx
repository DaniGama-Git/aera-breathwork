import { useState, useEffect, useRef } from "react";
import waveBgLogo from "@/assets/wave-bg-logo.png";
import waveBgIntro from "@/assets/wave-bg-intro.png";
import waveBgDescription from "@/assets/wave-bg-description.png";
import waveBgInhale from "@/assets/wave-bg-inhale.png";
import waveBgHold from "@/assets/wave-bg-hold.png";
import waveBgExhale from "@/assets/wave-bg-exhale.png";
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
  const barRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const phaseLabelRef = useRef<HTMLSpanElement>(null);

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
        gradientRef.current.style.top = `${barTop - 30}%`;
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

  /* ── Background logic ── */
  const staticBgMap: Partial<Record<Screen, string>> = {
    logo: waveBgLogo,
    intro: waveBgIntro,
    description: waveBgDescription,
    done: waveBgLogo,
  };

  const isBreathing = screen === "breathing";
  const allStaticBgs = [
    { key: "logo", src: waveBgLogo, screens: ["logo", "done"] },
    { key: "intro", src: waveBgIntro, screens: ["intro"] },
    { key: "desc", src: waveBgDescription, screens: ["description"] },
  ];

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
          {/* All static backgrounds layered with crossfade */}
          {allStaticBgs.map((bg) => (
            <div
              key={bg.key}
              className="absolute inset-0 transition-opacity duration-[600ms] ease-in-out"
              style={{
                backgroundImage: `url(${bg.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: !isBreathing && bg.screens.includes(screen) ? 1 : 0,
              }}
            />
          ))}

          {/* Base breathing background */}
          <div
            className="absolute inset-0 transition-opacity duration-[600ms] ease-in-out"
            style={{
              backgroundImage: `url(${waveBgInhale})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: isBreathing ? 1 : 0,
            }}
          />

          {/* Traveling gradient overlay — follows the bar */}
          <div
            ref={gradientRef}
            className="absolute left-0 right-0 pointer-events-none transition-none"
            style={{
              height: "60%",
              top: "55%",
              opacity: isBreathing ? 1 : 0,
              background: "radial-gradient(ellipse 100% 50% at 50% 50%, rgba(200,210,220,0.45) 0%, rgba(200,210,220,0.15) 35%, transparent 70%)",
              transition: "opacity 600ms ease-in-out",
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
