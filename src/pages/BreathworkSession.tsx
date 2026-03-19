/**
 * Screen 1 of 3: Breathwork Session — Activate
 * Route: /breathwork-session-activate
 *
 * This is the "Activate" breathwork session screen from the Āera app.
 * It displays the session title, audio waveform visualization,
 * speaker info with timer, play controls, and a bottom navigation bar.
 */

import rectangleBg from "@/assets/rectangle-bg.png";
import playIcon from "@/assets/play-icon.png";
import breatheIcon from "@/assets/breathe-icon.png";
import homeIndicator from "@/assets/home-indicator.png";
import { Home, Search, FlaskConical } from "lucide-react";

/**
 * AudioWaveform — decorative animated waveform bars
 * Represents audio visualization in the center of the screen.
 */
const AudioWaveform = () => {
  // Heights for each bar in the waveform (px values to create a natural wave shape)
  const barHeights = [
    12, 20, 32, 24, 40, 56, 44, 60, 48, 72, 56, 80, 64, 88, 72, 96,
    80, 72, 88, 64, 80, 56, 72, 48, 60, 44, 56, 40, 24, 32, 20, 12,
    16, 28, 20, 36, 48, 40, 52, 44, 64, 52, 76, 60, 84, 68, 92, 76,
    68, 84, 60, 76, 52, 64, 44, 52, 40, 48, 36, 20, 28, 16,
  ];

  return (
    <div className="flex items-center justify-center gap-[2px] w-full">
      {barHeights.map((height, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full opacity-60"
          style={{
            height: `${height}px`,
            background: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%)",
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * BottomNavBar — dark pill-shaped navigation bar
 * Matches the navbar design from the Āera app.
 * "Breathe" tab is highlighted as the active tab for this screen.
 */
const BottomNavBar = () => {
  const tabs = [
    { label: "Home", icon: <Home className="w-5 h-5" />, active: false },
    {
      label: "Breathe",
      icon: <img src={breatheIcon} alt="Breathe" className="w-5 h-5" />,
      active: true,
    },
    { label: "Search", icon: <Search className="w-5 h-5" />, active: false },
    { label: "Science", icon: <FlaskConical className="w-5 h-5" />, active: false },
  ];

  return (
    <div className="mx-4 mb-2 rounded-[32px] px-6 py-3 flex items-center justify-around"
      style={{ backgroundColor: "rgba(26, 26, 26, 0.9)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`flex flex-col items-center gap-1 transition-colors ${
            tab.active ? "text-amber-400" : "text-white/50"
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * BreathworkSession — Main screen component
 * Route: /breathwork-session-activate
 * Screen 1 of 3 in the breathwork session flow.
 */
const BreathworkSession = () => {
  return (
    <div className="relative max-w-[430px] mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Background — full-bleed gradient image from Rectangle.png */}
      <img
        src={rectangleBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top section — badge, title, subtitle */}
        <div className="pt-16 px-6 flex flex-col items-start text-left">
          {/* "Activate" pill badge with breathe icon */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 mb-6"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <img src={breatheIcon} alt="" className="w-4 h-4" />
            <span className="text-white text-xs font-semibold tracking-wider uppercase">
              Activate
            </span>
          </div>

          {/* Session title */}
          {/* Session title — Neue Haas Grotesk Display Pro 65 Medium, 36px, -1% tracking, 100% line-height */}
          {/* TODO: Swap font-family to 'Neue Haas Grotesk Display Pro' once font files are uploaded */}
          <h1
            className="text-white font-semibold"
            style={{ fontSize: "36px", lineHeight: "100%", letterSpacing: "-0.01em" }}
          >
            Mid-Day Energy Boost
          </h1>

          {/* Session subtitle */}
          <p className="text-white/70 text-sm">
            Rapid physiological up-regulation.
          </p>
        </div>

        {/* Center — audio waveform visualization (full width, no padding) */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <AudioWaveform />
        </div>

        {/* Bottom section — speaker info, play button */}
        <div className="px-6 pb-4 flex flex-col items-center gap-6">
          {/* Speaker row: name · status · timer */}
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <span className="text-white font-medium">Jamie</span>
            <span>·</span>
            <span>Speaking...</span>
            <span>·</span>
            <span className="tabular-nums">00:03:00</span>
          </div>

          {/* Large circular play button */}
          <button
            className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            aria-label="Play breathwork session"
          >
            <img src={playIcon} alt="Play" className="w-7 h-7 ml-0.5" />
          </button>
        </div>

        {/* Bottom navigation bar */}
        <BottomNavBar />

        {/* iOS Home Indicator */}
        <div className="flex justify-center pb-2">
          <img src={homeIndicator} alt="" className="h-1 w-32 opacity-60" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default BreathworkSession;
