/**
 * Screen 2 of 3: Breathwork Session — Recover
 * Route: /breathwork-session-recover
 *
 * This is the "Recover" breathwork session screen from the Āera app.
 * Cool blue/purple gradient background. Session: "Evening Decompression".
 * Reuses the same layout structure as the Activate screen.
 */

import recoverGradientBg from "@/assets/recover-gradient-v2.png";
import playButton from "@/assets/play-button.svg";
import homeIndicator from "@/assets/home-indicator.png";
import waveform from "@/assets/waveform.png";
import recoverIcon from "@/assets/recover-icon.svg";
import BottomNavBar from "@/components/BottomNavBar";

/**
 * BreathworkSessionRecover — Main screen component
 * Route: /breathwork-session-recover
 * Screen 2 of 3 in the breathwork session flow.
 */
const BreathworkSessionRecover = () => {
  return (
    <div className="relative max-w-[430px] mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Background — full-bleed cool gradient image */}
      <img
        src={recoverGradientBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top section — badge, title, subtitle */}
        <div className="pt-20 px-6 flex flex-col items-start text-left">
          {/* "Recover" pill badge with recover icon */}
          <div className="inline-flex items-center gap-2 px-2.5 h-[25px] border border-white rounded-full mb-5">
            <img src={recoverIcon} alt="" className="h-4 shrink-0" />
            <span className="font-display font-normal text-white text-[16px]">Recover</span>
          </div>

          {/* Session title — Neue Haas Grotesk Display Pro 65 Medium, 34px, -1% tracking, 100% line-height */}
          {/* TODO: Swap font-family to 'Neue Haas Grotesk Display Pro' once font files are uploaded */}
          <h1
            className="text-white font-body font-medium mb-3"
            style={{ fontSize: "34px", lineHeight: "100%", letterSpacing: "-0.01em" }}
          >
            Evening Decompression
          </h1>

          {/* Session subtitle */}
          <p className="text-white/60 text-[15px] leading-snug font-body font-normal">
            Forced shutdown for deep restoration.
          </p>
        </div>

        {/* Center — audio waveform image asset (full width, vertically centered) */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-0">
          <img src={waveform} alt="Audio waveform" className="w-full h-auto object-cover" />
        </div>

        {/* Bottom section — speaker info + play button */}
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
            <span className="text-white font-body font-medium text-xl block mb-1">Jamie</span>
            <div className="flex items-center justify-between text-white/50 text-sm">
              <span className="font-body font-normal">Speaking...</span>
              <span className="font-display font-light tabular-nums">00:07:00</span>
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

export default BreathworkSessionRecover;
