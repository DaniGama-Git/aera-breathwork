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
import waveform from "@/assets/waveform.png";
import scienceIcon from "@/assets/science-icon.png";
import { Home, Search } from "lucide-react";

/**
 * BottomNavBar — dark pill-shaped navigation bar
 * Matches the navbar design from the Āera app.
 * "Breathe" tab is highlighted as the active tab for this screen.
 * Active tab has a small colored dot indicator beneath the icon.
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
    { label: "Science", icon: <img src={scienceIcon} alt="Science" className="w-5 h-5" />, active: false },
  ];

  return (
    <div
      className="mx-4 mb-2 rounded-[32px] px-4 py-3 flex items-center justify-around"
      style={{ backgroundColor: "rgba(26, 26, 26, 0.92)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            tab.active ? "text-white" : "text-white/40"
          }`}
        >
          <div className="relative">
            {tab.icon}
            {/* Active indicator dot */}
            {tab.active && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: "#E8734A" }}
              />
            )}
          </div>
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
        {/* Generous top padding to clear status bar area */}
        <div className="pt-20 px-6 flex flex-col items-start text-left">
          {/* "Activate" pill badge with breathe icon */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 mb-5"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <img src={breatheIcon} alt="" className="w-4 h-4" />
            <span className="text-white text-[11px] font-semibold tracking-wider uppercase">
              Activate
            </span>
          </div>

          {/* Session title — Neue Haas Grotesk Display Pro 65 Medium, 36px, -1% tracking, 100% line-height */}
          {/* TODO: Swap font-family to 'Neue Haas Grotesk Display Pro' once font files are uploaded */}
          <h1
            className="text-white font-semibold mb-3"
            style={{ fontSize: "34px", lineHeight: "100%", letterSpacing: "-0.01em" }}
          >
            Mid-Day Energy Boost
          </h1>

          {/* Session subtitle */}
          <p className="text-white/60 text-[15px] leading-snug">
            Rapid physiological up-regulation.
          </p>
        </div>

        {/* Center — audio waveform image asset (full width, vertically centered) */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-0">
          <img src={waveform} alt="Audio waveform" className="w-full h-auto object-cover" />
        </div>

        {/* Bottom section — speaker info + play button */}
        {/* Play button floats right, speaker info bottom-left, timer far right on second row */}
        <div className="px-6 pb-3">
          {/* Play button row */}
          <div className="flex justify-end mb-4">
            <button
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              aria-label="Play breathwork session"
            >
              <img src={playIcon} alt="Play" className="w-8 h-8 ml-0.5" />
            </button>
          </div>

          {/* Speaker info row */}
          <div className="mb-5">
            <span className="text-white font-semibold text-xl block mb-1">Jamie</span>
            <div className="flex items-center justify-between text-white/50 text-sm">
              <span>Speaking...</span>
              <span className="tabular-nums">00:03:00</span>
            </div>
          </div>
        </div>

        {/* Bottom navigation bar */}
        <BottomNavBar />

        {/* iOS Home Indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <img src={homeIndicator} alt="" className="h-[5px] w-36 opacity-70" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default BreathworkSession;
