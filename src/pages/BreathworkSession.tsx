/**
 * Breathwork Session — Activate
 */

import activateGradientBg from "@/assets/activate-gradient-v2.webp";
import playButton from "@/assets/play-button.svg";
import AnimatedWaveform from "@/components/AnimatedWaveform";
import activateIcon from "@/assets/activate-icon.svg";
import BottomNavBar from "@/components/BottomNavBar";
import AddToCalendar from "@/components/AddToCalendar";
import SessionList from "@/components/SessionList";
import { categoryConfig } from "@/data/sessionData";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Pause } from "lucide-react";

const BreathworkSession = () => {
  const { isPlaying, toggle, timeDisplay, getFrequencyData } = useAudioPlayer("/audio/morning-reset-micro-practice.mp3");
  const config = categoryConfig.activate;

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      <img src={activateGradientBg} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[800px] mx-auto w-full overflow-y-auto">
        <div className="pt-20 px-6 flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-flex items-center gap-2 px-2.5 h-[25px] border border-white rounded-full">
              <img src={activateIcon} alt="" className="h-4 shrink-0" />
              <span className="font-display font-normal text-white text-[16px]">Activate</span>
            </div>
            <AddToCalendar sessionTitle="Mid-Day Energy Boost" sessionSubtitle="Counter the afternoon energy dip." sessionCategory="Activate" durationMinutes={3} />
          </div>
          <h1 className="text-white font-body font-semibold mb-3" style={{ fontSize: "34px", lineHeight: "100%", letterSpacing: "-0.01em" }}>
            Mid-Day Energy Boost
          </h1>
          <p className="text-white text-[20px] leading-[100%] tracking-[0em] font-display font-medium">
            Counter the afternoon energy dip.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden px-0 min-h-[200px]">
          <AnimatedWaveform isPlaying={isPlaying} getFrequencyData={getFrequencyData} />
        </div>

        <div className="px-6 pb-3">
          <div className="flex justify-end mb-4">
            <button className="transition-transform hover:scale-105 active:scale-95" aria-label={isPlaying ? "Pause" : "Play breathwork session"} onClick={toggle}>
              {isPlaying ? (
                <div className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center">
                  <Pause className="w-8 h-8 text-black fill-black" />
                </div>
              ) : (
                <img src={playButton} alt="Play" className="w-[72px] h-[72px]" />
              )}
            </button>
          </div>
          <div className="mb-5">
            <span className="text-white font-body font-semibold text-xl block mb-1">Jamie</span>
            <div className="flex items-center justify-between text-white/50 text-sm">
              <span className="font-body font-normal">{isPlaying ? "Speaking..." : "Tap play to begin"}</span>
              <span className="font-display font-light tabular-nums">{timeDisplay}</span>
            </div>
          </div>
        </div>

        {/* More sessions */}
        <SessionList
          sessions={config.sessions}
          categoryImage={config.image}
          categoryLabel={config.label}
          sessionRoute={config.sessionRoute}
          currentTitle="Mid-Day Energy Boost"
        />

        <BottomNavBar />
        <div className="h-24" />
      </div>
    </div>
  );
};

export default BreathworkSession;
