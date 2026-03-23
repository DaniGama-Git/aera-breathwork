import { useRef, useEffect, useCallback } from "react";

interface AnimatedWaveformProps {
  isPlaying: boolean;
  getFrequencyData: () => Uint8Array | null;
  barCount?: number;
}

const AnimatedWaveform = ({ isPlaying, getFrequencyData, barCount = 120 }: AnimatedWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const barsRef = useRef<number[]>(new Array(barCount).fill(0));
  const timeRef = useRef<number>(0);

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

    timeRef.current += 0.02;

    const freqData = getFrequencyData();
    const bars = barsRef.current;
    const totalWidth = w;
    const gap = 0.6;
    const barWidth = Math.max(1, (totalWidth - gap * (barCount - 1)) / barCount);
    const minH = 3;

    for (let i = 0; i < barCount; i++) {
      let target = minH;
      if (freqData && isPlaying) {
        const binIndex = Math.floor((i / barCount) * freqData.length);
        target = minH + (freqData[binIndex] / 255) * (h * 0.95 - minH);
      }
      bars[i] += (target - bars[i]) * 0.22;

      const barH = bars[i];
      const x = i * (barWidth + gap);
      const y = (h - barH) / 2;

      // Glossy shimmer gradient with faded tips
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      const shimmer = 0.35 + 0.15 * Math.sin(timeRef.current * 3 + i * 0.12);
      const highlightPos = 0.15 + 0.1 * Math.sin(timeRef.current * 2 + i * 0.08);
      grad.addColorStop(0, `rgba(255, 255, 255, ${shimmer * 0.15})`);
      grad.addColorStop(0.08, `rgba(255, 255, 255, ${shimmer * 0.6})`);
      grad.addColorStop(Math.max(0.1, Math.min(0.9, highlightPos)), `rgba(255, 255, 255, ${shimmer + 0.2})`);
      grad.addColorStop(0.5, `rgba(255, 255, 255, ${shimmer * 0.75})`);
      grad.addColorStop(0.92, `rgba(255, 255, 255, ${shimmer * 0.6})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${shimmer * 0.15})`);

      // Sharp pointed tips (minimal rounding)
      const radius = barWidth * 0.15;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, radius);
      ctx.fillStyle = grad;
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
      className="w-full h-48"
      style={{ display: "block" }}
    />
  );
};

export default AnimatedWaveform;
