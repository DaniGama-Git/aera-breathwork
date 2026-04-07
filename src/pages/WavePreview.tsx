import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import waveBgLogo from "@/assets/wave-bg-logo.png";
import waveBgIntro from "@/assets/wave-bg-intro.png";
import waveBgDescription from "@/assets/wave-bg-description.png";
import waveBgInhale from "@/assets/wave-bg-inhale.png";
import lightbulbIcon from "@/assets/lightbulb-icon.svg";
import {
  creativeFlowProtocol,
  buildTimeline,
  getBarPosition,
  type TimelineEntry,
} from "@/data/breathingProtocols";

type Screen = "loading" | "logo" | "intro" | "breathing" | "done";

const SCREEN_DELAYS: Partial<Record<Screen, number>> = {
  logo: 2200,
  intro: 3000,
};

const ALL_IMAGES = [waveBgLogo, waveBgIntro, waveBgDescription, waveBgInhale];

const SCREEN_BG: Partial<Record<Screen, string>> = {
  logo: waveBgLogo,
  intro: waveBgIntro,
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

function buildBreathingMask(barTop: number): string {
  return `linear-gradient(180deg,
    rgba(255,255,255,0) ${Math.max(0, barTop - 8)}%,
    rgba(255,255,255,0.5) ${barTop}%,
    rgba(255,255,255,0.85) ${Math.min(100, barTop + 10)}%,
    rgba(255,255,255,0.95) 100%)`;
}

const protocol = creativeFlowProtocol;

const WavePreview = () => {
  const [screen, setScreen] = useState<Screen>("loading");
  const [phase, setPhase] = useState("");
  const [fadeIn, setFadeIn] = useState(true);
  const [sessionStart, setSessionStart] = useState(0);
  const [transitionText, setTransitionText] = useState("");
  const [scienceText, setScienceText] = useState("");
  const transitionTextRef = useRef("");
  const scienceTextRef = useRef("");
  const barRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const phaseLabelRef = useRef<HTMLSpanElement>(null);

  const timeline = useMemo(() => buildTimeline(protocol), []);
  const totalDuration = timeline.length > 0 ? timeline[timeline.length - 1].endMs : 0;
  // Check if session starts with an overlay (science/transition) — hide bar until first real breath phase
  const startsWithOverlay = timeline.length > 0 && (timeline[0].type === "SCIENCE" || timeline[0].type === "TRANSITION");
  const [hasStartedBreathing, setHasStartedBreathing] = useState(false);

  /* ── Preload ── */
  useEffect(() => {
    preloadImages(ALL_IMAGES).then(() => setScreen("logo"));
  }, []);

  /* ── Screen auto-advance ── */
  useEffect(() => {
    const delay = SCREEN_DELAYS[screen];
    if (!delay) return;

    const timer = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        if (screen === "logo") setScreen("intro");
        else if (screen === "intro") {
          setScreen("breathing");
          setSessionStart(Date.now());
          setPhase("INHALE");
          setTransitionText("");
        }
        setFadeIn(true);
      }, 600);
    }, delay);
    return () => clearTimeout(timer);
  }, [screen]);

  /* ── Timeline-driven breathing engine ── */
  useEffect(() => {
    if (screen !== "breathing") return;

    let prevEntryType: TimelineEntry["type"] | undefined;

    const tick = () => {
      const elapsed = Date.now() - sessionStart;

      if (elapsed >= totalDuration) {
        setFadeIn(false);
        setTimeout(() => {
          setScreen("done");
          setPhase("");
          setTransitionText("");
          setFadeIn(true);
        }, 400);
        return;
      }

      // Find current timeline entry
      const entry = timeline.find((e) => elapsed >= e.startMs && elapsed < e.endMs);
      if (!entry) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const progress = (elapsed - entry.startMs) / entry.duration;

      if (entry.type === "TRANSITION") {
        if (transitionTextRef.current !== (entry.transitionText || "")) {
          transitionTextRef.current = entry.transitionText || "";
          setTransitionText(transitionTextRef.current);
        }
        if (scienceTextRef.current !== "") {
          scienceTextRef.current = "";
          setScienceText("");
        }
        const barTop = getBarPosition("TRANSITION", 0, prevEntryType);
        if (barRef.current) barRef.current.style.top = `${barTop}%`;
        if (gradientRef.current)
          gradientRef.current.style.background = buildBreathingMask(barTop);
        if (phaseLabelRef.current) phaseLabelRef.current.textContent = "";
        setPhase("");
      } else if (entry.type === "SCIENCE") {
        if (scienceTextRef.current !== (entry.scienceText || "")) {
          scienceTextRef.current = entry.scienceText || "";
          setScienceText(scienceTextRef.current);
        }
        if (transitionTextRef.current !== "") {
          transitionTextRef.current = "";
          setTransitionText("");
        }
        const barTop = getBarPosition("SCIENCE", 0, prevEntryType);
        if (barRef.current) barRef.current.style.top = `${barTop}%`;
        if (gradientRef.current)
          gradientRef.current.style.background = buildBreathingMask(barTop);
        if (phaseLabelRef.current) phaseLabelRef.current.textContent = "";
        setPhase("");
      } else {
        if (!hasStartedBreathing) setHasStartedBreathing(true);
        if (transitionTextRef.current !== "") {
          transitionTextRef.current = "";
          setTransitionText("");
        }
        if (scienceTextRef.current !== "") {
          scienceTextRef.current = "";
          setScienceText("");
        }
        const barTop = getBarPosition(entry.type, progress, prevEntryType);

        if (barRef.current) barRef.current.style.top = `${barTop}%`;
        if (gradientRef.current)
          gradientRef.current.style.background = buildBreathingMask(barTop);
        if (phaseLabelRef.current)
          phaseLabelRef.current.textContent = entry.displayLabel;
        setPhase(entry.displayLabel);
      }

      prevEntryType = entry.type;
      rafId = requestAnimationFrame(tick);
    };

    let rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [screen, sessionStart, timeline, totalDuration]);

  const restart = () => {
    setFadeIn(false);
    setTimeout(() => {
      setScreen("intro");
      setTransitionText("");
      setScienceText("");
      setHasStartedBreathing(false);
      setFadeIn(true);
    }, 300);
  };

  const fadeClass = fadeIn ? "opacity-100" : "opacity-0";
  const contentBase = `absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 transition-opacity duration-[600ms] ease-in-out ${fadeClass}`;
  const isBreathing = screen === "breathing";
  const showTransition = isBreathing && !!transitionText;
  const showScience = isBreathing && !!scienceText;
  const showOverlay = showTransition || showScience;

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
          style={{ aspectRatio: "1 / 1.1", borderRadius: 22 }}
        >
          {/* Static backgrounds — crossfade */}
          {(Object.entries(SCREEN_BG) as [Screen, string][]).map(([key, src]) => (
            <div
              key={key}
              className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: !isBreathing && (screen === key || (screen === "done" && key === "logo")) ? 1 : 0,
              }}
            />
          ))}

          {/* Breathing background image */}
          <div
            className="absolute inset-0 transition-opacity duration-[600ms] ease-in-out"
            style={{
              backgroundImage: `url(${waveBgDescription})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: isBreathing ? 1 : 0,
            }}
          />

          {/* White mask overlay */}
          <div
            ref={gradientRef}
            className="absolute inset-0"
            style={{
              opacity: isBreathing && !showOverlay ? 1 : 0,
              transition: "opacity 600ms ease-in-out",
              background: buildBreathingMask(92),
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
                  {protocol.title}
                </span>
              </div>
              <span className="text-white/35 text-[10px] tracking-[0.08em] font-medium mb-5">
                {protocol.subtitle}
              </span>
              <p
                className="text-white font-medium leading-[1.15] whitespace-pre-line"
                style={{ fontSize: 18, letterSpacing: "-0.01em" }}
              >
                {protocol.introText}
              </p>
            </div>
          )}


          {screen === "breathing" && (
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-between pointer-events-none transition-opacity duration-[400ms] ${fadeClass}`}>
              <div className="flex-1" />

              {/* Transition text overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center px-8 transition-opacity duration-700"
                style={{ opacity: showTransition ? 1 : 0 }}
              >
                <p className="text-white/80 text-[14px] leading-relaxed font-medium text-center max-w-[230px]"
                   style={{ textShadow: "0 1px 8px rgba(0,0,0,0.15)" }}>
                  {transitionText}
                </p>
              </div>

              {/* Science overlay with lightbulb — only render when there's actual text */}
              <div
                className="absolute inset-0 flex items-center justify-center px-8 transition-opacity duration-700"
                style={{ opacity: showScience ? 1 : 0, pointerEvents: "none" }}
              >
                {scienceText && (
                  <div className="flex items-start gap-3 text-left max-w-[240px]">
                    <img src={lightbulbIcon} alt="" style={{ width: 40, height: 54 }} className="mt-0.5 opacity-70 shrink-0" />
                    <p className="text-white/70 text-[12px] leading-relaxed font-medium"
                       style={{ textShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>
                      {scienceText}
                    </p>
                  </div>
                )}
              </div>

              {/* Traveling progress bar */}
              <div
                ref={barRef}
                className="absolute left-0 right-0"
                style={{
                  top: "92%",
                  opacity: (!hasStartedBreathing && startsWithOverlay) || showOverlay ? 0 : 1,
                  transition: showOverlay ? "opacity 400ms ease-out" : "opacity 400ms ease-in 300ms",
                }}
              >
                <div style={{ height: 1.5, background: "hsla(0, 0%, 100%, 0.62)", width: "100%", boxShadow: "0 0 4px 1px hsla(0, 0%, 100%, 0.08)" }} />
              </div>

              <div
                className="pb-7 flex flex-col items-center gap-2"
                style={{
                  opacity: (!hasStartedBreathing && startsWithOverlay) || showOverlay ? 0 : 1,
                  transition: showOverlay ? "opacity 400ms ease-out" : "opacity 400ms ease-in 300ms",
                }}
              >
                <span
                  ref={phaseLabelRef}
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
                style={{ fontSize: 26, filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}
              >
                āera
              </span>
              <p className="text-white/50 text-[13px] tracking-wide mt-3 font-medium">
                You're ready.
              </p>
              <div className="flex flex-col items-center gap-3 mt-8">
                <button
                  onClick={restart}
                  className="px-7 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium cursor-pointer transition-all hover:brightness-110"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Again
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-7 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium cursor-pointer transition-all hover:brightness-110"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WavePreview;
