import { useRef, useEffect, useCallback } from "react";

interface AnimatedWaveformProps {
  isPlaying: boolean;
  getFrequencyData: () => Uint8Array | null;
  barCount?: number;
}

const AnimatedWaveform = ({ isPlaying, getFrequencyData, barCount = 48 }: AnimatedWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const barsRef = useRef<number[]>(new Array(barCount).fill(0));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const freqData = getFrequencyData();
    const bars = barsRef.current;
    const gap = 2;
    const barWidth = (w - gap * (barCount - 1)) / barCount;
    const minH = 4;

    for (let i = 0; i < barCount; i++) {
      let target = minH;
      if (freqData && isPlaying) {
        // Map bar index to frequency bin
        const binIndex = Math.floor((i / barCount) * freqData.length);
        target = minH + (freqData[binIndex] / 255) * (h * 0.85 - minH);
      }
      // Smooth interpolation
      bars[i] += (target - bars[i]) * 0.25;

      const barH = bars[i];
      const x = i * (barWidth + gap);
      const y = (h - barH) / 2;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, barWidth / 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [isPlaying, getFrequencyData, barCount]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32"
      style={{ display: "block" }}
    />
  );
};

export default AnimatedWaveform;
