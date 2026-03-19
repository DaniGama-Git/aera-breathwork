/**
 * Screen 1 of 3: Breathwork Session — Activate
 * Route: /breathwork-session-activate
 *
 * This is the "Activate" breathwork session screen from the Āera app.
 * It displays the session title, audio waveform visualization,
 * speaker info with timer, play controls, and a bottom navigation bar.
 */

import rectangleBg from "@/assets/rectangle-bg.png";
import playButton from "@/assets/play-button.svg";
import homeIndicator from "@/assets/home-indicator.png";
import waveform from "@/assets/waveform.png";
import activateIcon from "@/assets/activate-icon.png";
import BottomNavBar from "@/components/BottomNavBar";
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
            <img src={activateIcon} alt="" className="w-4 h-4" />
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
              className="transition-transform hover:scale-105 active:scale-95"
              aria-label="Play breathwork session"
            >
              <img src={playButton} alt="Play" className="w-[72px] h-[72px]" />
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
