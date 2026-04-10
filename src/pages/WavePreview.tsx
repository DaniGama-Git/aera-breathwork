import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { BreathAudio } from "@/lib/breathAudio";
import { useNavigate } from "react-router-dom";
import waveBgLogo from "@/assets/wave-bg-logo.png";
import waveBgIntro from "@/assets/wave-bg-intro.png";
import waveBgDescription from "@/assets/wave-bg-description.png";
import waveBgInhale from "@/assets/wave-bg-inhale.png";
import lightbulbIcon from "@/assets/lightbulb-icon.svg";
import BreatheDots from "@/components/BreatheDots";
import {
  backToBackProtocol,
  buildTimeline,
  getBarPosition,
  type TimelineEntry,
} from "@/data/breathingProtocols";

type Screen = "loading" | "logo" | "intro" | "breathing" | "done";

const SCREEN_DELAYS: Partial<Record<Screen, number>> = {
  logo: 2200,
  intro: 3000,
};

const ALL_IMAGES = [waveBgLogo, waveBgIntro, waveBgDescription, waveBgInhale, lightbulbIcon];

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
    rgba(255,255,255,0) ${Math.max(0, barTop - 12)}%,
    rgba(255,255,255,0.15) ${Math.max(0, barTop - 4)}%,
    rgba(255,255,255,0.35) ${barTop}%,
    rgba(255,255,255,0.55) ${Math.min(100, barTop + 6)}%,
    rgba(255,255,255,0.75) ${Math.min(100, barTop + 14)}%,
    rgba(255,255,255,0.9) 100%)`;
}

const protocol = backToBackProtocol;

const WavePreview = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("loading");
  const [phase, setPhase] = useState("");
  const [fadeIn, setFadeIn] = useState(true);
  const [sessionStart, setSessionStart] = useState(0);
  const [transitionText, setTransitionText] = useState("");
  const [scienceText, setScienceText] = useState("");
  const [paused, setPaused] = useState(false);
  const [showPausedOverlay, setShowPausedOverlay] = useState(false);
  const pausedElapsedRef = useRef(0);
  const transitionTextRef = useRef("");
  const scienceTextRef = useRef("");
  const gradientRef = useRef<HTMLDivElement>(null);
  const phaseLabelRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const breathAudioRef = useRef(new BreathAudio());
  const currentAudioPhaseRef = useRef<string | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const timeline = useMemo(() => buildTimeline(protocol), []);
  const totalDuration = timeline.length > 0 ? timeline[timeline.length - 1].endMs : 0;
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
          setPaused(false);
          setShowPausedOverlay(false);
          pausedElapsedRef.current = 0;

          // Start background audio
          if (protocol.audioSrc) {
            if (bgAudioRef.current) { bgAudioRef.current.pause(); }
            const audio = new Audio(protocol.audioSrc);
            audio.loop = true;
            audio.volume = 0.5;
            audio.play().catch(() => {});
            bgAudioRef.current = audio;
          }
        }
        setFadeIn(true);
      }, 600);
    }, delay);
    return () => clearTimeout(timer);
  }, [screen]);

  /* ── Timeline-driven breathing engine ── */
  useEffect(() => {
    if (screen !== "breathing" || paused) return;

    let prevEntryType: TimelineEntry["type"] | undefined;

    const tick = () => {
      const elapsed = Date.now() - sessionStart;

      if (elapsed >= totalDuration) {
        breathAudioRef.current.stop();
        currentAudioPhaseRef.current = null;
        if (bgAudioRef.current) { bgAudioRef.current.pause(); bgAudioRef.current = null; }
        setFadeIn(false);
        setTimeout(() => {
          setScreen("done");
          setPhase("");
          setTransitionText("");
          setFadeIn(true);
        }, 400);
        return;
      }

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
        if (phaseLabelRef.current)
          phaseLabelRef.current.textContent = entry.displayLabel;
        setPhase(entry.displayLabel);

        // Trigger breath audio on phase change
        const phaseKey = `${entry.startMs}_${entry.type}`;
        if (phaseKey !== currentAudioPhaseRef.current) {
          currentAudioPhaseRef.current = phaseKey;
          const audio = breathAudioRef.current;
          if (entry.type === "INHALE") {
            audio.playInhale(entry.duration);
          } else if (entry.type === "EXHALE") {
            audio.playExhale(entry.duration);
          } else if (entry.type === "SNIFF") {
            audio.playSniff(entry.duration);
          } else {
            audio.stop();
          }
        }
      }

      const barTop = getBarPosition(entry.type, progress, prevEntryType);
      if (gradientRef.current)
        gradientRef.current.style.background = buildBreathingMask(barTop);

      if (progressBarRef.current) {
        const pct = Math.min(100, (elapsed / totalDuration) * 100);
        progressBarRef.current.style.width = `${pct.toFixed(1)}%`;
      }

      prevEntryType = entry.type;
      rafId = requestAnimationFrame(tick);
    };

    let rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [screen, sessionStart, timeline, totalDuration, paused, hasStartedBreathing]);

  const togglePause = useCallback(() => {
    if (paused) {
      setSessionStart(Date.now() - pausedElapsedRef.current);
      setPaused(false);
      setShowPausedOverlay(false);
      bgAudioRef.current?.play().catch(() => {});
    } else {
      pausedElapsedRef.current = Date.now() - sessionStart;
      breathAudioRef.current.stop();
      currentAudioPhaseRef.current = null;
      bgAudioRef.current?.pause();
      setPaused(true);
      setShowPausedOverlay(true);
    }
  }, [paused, sessionStart]);

  const restart = () => {
    setFadeIn(false);
    setTimeout(() => {
      setScreen("intro");
      setTransitionText("");
      setScienceText("");
      setHasStartedBreathing(false);
      setPaused(false);
      setShowPausedOverlay(false);
      pausedElapsedRef.current = 0;
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
            <BreatheDots className="w-12 h-12" />
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

          <div
            className="absolute inset-0 transition-opacity duration-[600ms] ease-in-out"
            style={{
              backgroundImage: `url(${waveBgDescription})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: isBreathing ? 1 : 0,
            }}
          />

          <div
            ref={gradientRef}
            className="absolute inset-0"
            style={{
              opacity: isBreathing && !showOverlay ? 1 : 0,
              transition: "opacity 600ms ease-in-out",
              background: buildBreathingMask(92),
            }}
          />

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
            <>
              <div
                className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center"
                style={{ opacity: 1, transition: "opacity 400ms ease" }}
              >
                <button
                  onClick={togglePause}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
                  style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.7)" }}
                  title={paused ? "Resume" : "Pause"}
                >
                  {paused ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
                  style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.7)" }}
                  title="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 transition-opacity duration-500"
                style={{
                  opacity: showPausedOverlay ? 1 : 0,
                  pointerEvents: showPausedOverlay ? "auto" : "none",
                  background: showPausedOverlay ? "rgba(0,0,0,0.55)" : "transparent",
                  backdropFilter: showPausedOverlay ? "blur(6px)" : "none",
                }}
              >
                <span
                  className="tracking-[0.25em] font-medium uppercase"
                  style={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}
                >
                  Paused
                </span>
                <button
                  onClick={togglePause}
                  className="px-5 py-2 rounded-full text-xs font-medium tracking-[0.15em] uppercase transition-all"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Continue
                </button>
              </div>

              <div className={`absolute inset-0 z-10 flex flex-col items-center justify-between pointer-events-none transition-opacity duration-[400ms] ${fadeClass}`}>
                <div className="flex-1" />

                <div
                  className="absolute inset-0 flex items-center justify-center px-8 transition-opacity duration-700"
                  style={{ opacity: showTransition ? 1 : 0 }}
                >
                  <p className="text-white/80 text-[14px] leading-relaxed font-medium text-center max-w-[230px]"
                     style={{ textShadow: "0 1px 8px rgba(0,0,0,0.15)" }}>
                    {transitionText}
                  </p>
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center px-8 transition-opacity duration-700"
                  style={{ opacity: showScience ? 1 : 0, pointerEvents: "none" }}
                >
                  <div className="flex items-start gap-4 text-left max-w-[250px]">
                    <img src={lightbulbIcon} alt="" style={{ width: 28, height: 38 }} className="mt-0.5 opacity-90 shrink-0" />
                    <p className="text-white/70 text-[12px] leading-relaxed font-medium"
                       style={{ textShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>
                      {scienceText || "\u00A0"}
                    </p>
                  </div>
                </div>

                <div
                  className="pb-7 flex flex-col items-center gap-3"
                  style={{
                    opacity: showPausedOverlay || (!hasStartedBreathing && startsWithOverlay) || showOverlay ? 0 : 1,
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
                  <div style={{ width: 80, height: 3, background: "rgba(0,0,0,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div
                      ref={progressBarRef}
                      style={{ height: "100%", width: "0%", background: "rgba(60,60,60,0.45)", borderRadius: 2, transition: "width 0.4s ease" }}
                    />
                  </div>
                </div>
              </div>
            </>
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
