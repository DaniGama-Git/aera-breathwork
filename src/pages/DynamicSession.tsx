/**
 * DynamicSession — Plays any session by category + slug
 * Route: /session/:category/:slug
 */

import { useParams, useNavigate } from "react-router-dom";
import playButton from "@/assets/play-button.svg";

import BottomNavBar from "@/components/BottomNavBar";
import AddToCalendar from "@/components/AddToCalendar";
import { categoryConfig, findSessionBySlug } from "@/data/sessionData";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useFavorites } from "@/hooks/useFavorites";
import { Pause, Heart } from "lucide-react";

const DynamicSession = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();

  const config = categoryConfig[category || ""];
  const sessionMatch = slug ? findSessionBySlug(slug) : null;
  const session = sessionMatch?.session;

  const audioSrc = session?.audioSrc || "";
  const { isPlaying, toggle, timeDisplay, progress, getFrequencyData } = useAudioPlayer(audioSrc);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!config || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-body text-muted-foreground mb-4">Session not found.</p>
          <button onClick={() => navigate("/menu")} className="font-body text-primary underline">
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  const durationNum = parseInt(session.duration) || 5;

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      <img src={config.gradient} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[800px] mx-auto w-full overflow-y-auto">
        {/* Top content */}
        <div className="pt-20 px-6 flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-flex items-center gap-2 px-2.5 h-[25px] border border-white rounded-full">
              <img src={config.icon} alt="" className="h-4 shrink-0" />
              <span className="font-display font-normal text-white text-[16px]">{config.label}</span>
            </div>
            <AddToCalendar
              sessionTitle={session.title}
              sessionSubtitle={session.description}
              sessionCategory={config.label}
              durationMinutes={durationNum}
            />
            <button
              onClick={() => toggleFavorite(slug!, category!)}
              className="w-[25px] h-[25px] rounded-full border border-white flex items-center justify-center transition-colors"
              aria-label={isFavorite(slug!) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-3 h-3 ${isFavorite(slug!) ? "fill-white text-white" : "text-white"}`}
              />
            </button>
          </div>
          <h1
            className="text-white font-body font-semibold mb-3"
            style={{ fontSize: "34px", lineHeight: "100%", letterSpacing: "-0.01em" }}
          >
            {session.title}
          </h1>
          <p className="text-white text-[20px] leading-[100%] tracking-[0em] font-display font-medium mb-2">
            {session.description}
          </p>
          <div>
            <span className="text-white font-body font-semibold text-lg">Jamie</span>
            <span className="text-white/50 text-sm font-body font-normal ml-2">
              {!session.audioSrc ? "Coming soon" : isPlaying ? "Guiding..." : "Tap play to begin"}
            </span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Bottom: progress bar + play button */}
        <div className="px-6 pb-6">
          {/* Progress bar with time */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-[6px] rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress * 100}%`,
                  background: "rgba(0,0,0,0.6)",
                }}
              />
            </div>
            <span className="text-white/50 text-xs font-display font-light tabular-nums shrink-0">
              {timeDisplay}
            </span>
          </div>

          {/* Play button centered */}
          <div className="flex justify-center">
            {session.audioSrc ? (
              <button
                className="transition-transform hover:scale-105 active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play breathwork session"}
                onClick={toggle}
              >
                {isPlaying ? (
                  <div className="w-[56px] h-[56px] rounded-full bg-white flex items-center justify-center">
                    <Pause className="w-6 h-6 text-black fill-black" />
                  </div>
                ) : (
                  <img src={playButton} alt="Play" className="w-[56px] h-[56px]" />
                )}
              </button>
            ) : (
              <div className="w-[56px] h-[56px] rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white/60 text-[10px] font-body font-medium">Soon</span>
              </div>
            )}
          </div>
        </div>

        <BottomNavBar />
        <div className="h-24" />
      </div>
    </div>
  );
};

export default DynamicSession;
