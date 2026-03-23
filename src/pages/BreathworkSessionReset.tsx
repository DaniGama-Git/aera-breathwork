/**
 * Screen 4: Breathwork Session — Reset
 * Route: /breathwork-session-reset
 *
 * This is the "Reset" breathwork session screen from the Āera app.
 * Dark muted gradient background. Session: "Context Switch".
 */

import resetGradientBg from "@/assets/reset-gradient-v2.png";
import playButton from "@/assets/play-button.svg";
import homeIndicator from "@/assets/home-indicator.png";
import waveform from "@/assets/waveform.png";
import resetIcon from "@/assets/reset-icon.svg";
import BottomNavBar from "@/components/BottomNavBar";
import AddToCalendar from "@/components/AddToCalendar";

/**
 * BreathworkSessionReset — Main screen component
 * Route: /breathwork-session-reset
 */
const BreathworkSessionReset = () => {
  return (
    <div className="relative max-w-[430px] mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Background — full-bleed dark muted gradient */}
      <img
        src={resetGradientBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top section — badge, title, subtitle */}
        <div className="pt-20 px-6 flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-flex items-center gap-2 px-2.5 h-[25px] border border-white rounded-full">
              <img src={resetIcon} alt="" className="h-4 shrink-0" />
              <span className="font-display font-normal text-white text-[16px]">Reset</span>
            </div>
            <AddToCalendar
              sessionTitle="Context Switch"
              sessionSubtitle="Clear mental residue between tasks."
              sessionCategory="Reset"
              durationMinutes={3}
            />
          </div>

          {/* Session title — Neue Haas Grotesk Display Round 65 Medium */}
          <h1
            className="text-white font-body font-semibold mb-3"
            style={{ fontSize: "34px", lineHeight: "100%", letterSpacing: "-0.01em" }}
          >
            Context Switch
          </h1>

          {/* Session subtitle */}
          <p className="text-white text-[20px] leading-[100%] tracking-[0em] font-display font-medium">
            Clear mental residue between tasks.
          </p>
        </div>

        {/* Center — audio waveform */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-0">
          <img src={waveform} alt="Audio waveform" className="w-full h-auto object-cover" />
        </div>

        {/* Bottom section — speaker info + play button */}
        <div className="px-6 pb-3">
          <div className="flex justify-end mb-4">
            <button
              className="transition-transform hover:scale-105 active:scale-95"
              aria-label="Play breathwork session"
            >
              <img src={playButton} alt="Play" className="w-[72px] h-[72px]" />
            </button>
          </div>

          <div className="mb-5">
            <span className="text-white font-body font-semibold text-xl block mb-1">Jamie</span>
            <div className="flex items-center justify-between text-white/50 text-sm">
              <span className="font-body font-normal">Speaking...</span>
              <span className="font-display font-light tabular-nums">00:03:00</span>
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

export default BreathworkSessionReset;
