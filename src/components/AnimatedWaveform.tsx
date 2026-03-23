import { useMemo } from "react";

interface AnimatedWaveformProps {
  isPlaying: boolean;
  barCount?: number;
}

const AnimatedWaveform = ({ isPlaying, barCount = 60 }: AnimatedWaveformProps) => {
  const bars = useMemo(
    () =>
      Array.from({ length: barCount }, (_, i) => ({
        height: 20 + Math.random() * 60,
        delay: Math.random() * 1.5,
        duration: 0.8 + Math.random() * 0.8,
      })),
    [barCount]
  );

  return (
    <div className="w-full flex items-center justify-center gap-[2px] h-32 px-4">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="rounded-full bg-white/40 transition-all duration-300"
          style={{
            width: "3px",
            height: isPlaying ? `${bar.height}%` : "8%",
            animation: isPlaying
              ? `waveformPulse ${bar.duration}s ease-in-out ${bar.delay}s infinite alternate`
              : "none",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedWaveform;
