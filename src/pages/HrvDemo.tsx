/**
 * HrvDemo — Static demo page for HRV data visualization
 * Route: /hrv
 * Shows stress score gauge, HRV trend chart, and health metrics.
 * All data is hardcoded for demo purposes.
 */

import { useNavigate } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";
import homeIndicator from "@/assets/home-indicator.png";

/* ─── Stress Score Gauge ─── */
const StressScoreGauge = () => {
  const score = 32;
  const radius = 54;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270° arc
  const progress = (score / 100) * arcLength;

  return (
    <div className="bg-card rounded-2xl p-5 flex items-center gap-5">
      {/* Gauge */}
      <div className="relative w-[130px] h-[130px] shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(25, 60%, 35%)" />
              <stop offset="100%" stopColor="hsl(18, 78%, 55%)" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none" stroke="url(#gaugeGrad)" strokeWidth={stroke}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[36px] font-light text-foreground leading-none">{score}</span>
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="hsl(18, 78%, 55%)" strokeWidth="1.5" fill="none" />
            <path d="M9 5v4l2.5 1.5" stroke="hsl(18, 78%, 55%)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-body text-[14px] text-muted-foreground">Stress Score</span>
        </div>
        <span className="font-body text-[13px] font-medium" style={{ color: "hsl(18, 78%, 55%)" }}>
          Pay Attention
        </span>
      </div>
    </div>
  );
};

/* ─── HRV Trend Chart ─── */
const HrvTrendCard = () => {
  const timePills = ["Days", "Month", "6 Months", "Year"];
  const activePill = "Days";

  // Data points for the smooth wave
  const dataPoints = [30, 45, 38, 65, 55, 72, 48, 78, 60, 50, 68, 55, 80, 65, 48, 70, 58, 42, 75, 82, 60, 50, 70, 62, 45, 58, 72, 68, 55, 78];
  const chartW = 340;
  const chartH = 110;
  const barCount = dataPoints.length;
  const barW = 3;
  const totalGap = chartW - barW * barCount;
  const gap = totalGap / (barCount - 1);

  // Generate smooth curve using catmull-rom to bezier
  const points = dataPoints.map((h, i) => {
    const x = i * (barW + gap) + barW / 2;
    const y = chartH - (h / 90) * chartH + 6;
    return { x, y };
  });

  let curvePath = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    curvePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return (
    <div className="bg-card rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 15.5s-5.5-3.5-5.5-7.5c0-2.2 1.8-4 4-4 1.2 0 2.3.6 3 1.5a3.96 3.96 0 013-1.5c2.2 0 4 1.8 4 4 0 4-5.5 7.5-5.5 7.5z"
              fill="hsl(0, 70%, 55%)" stroke="hsl(0, 70%, 55%)" strokeWidth="0.5"
            />
          </svg>
          <span className="font-body text-[16px] font-medium text-foreground">HRV</span>
        </div>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-body font-medium"
          style={{ backgroundColor: "hsl(145, 55%, 92%)", color: "hsl(145, 60%, 36%)" }}
        >
          +5.6%
        </span>
      </div>

      {/* Values */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-body text-[13px] text-muted-foreground">Post Session HRV</span>
          <span
            className="font-body text-[12px] font-medium"
            style={{ color: "hsl(145, 60%, 36%)" }}
          >
            +12 ms
          </span>
        </div>
        <span className="font-display text-[42px] font-light text-foreground leading-tight">74 ms</span>
      </div>

      {/* Chart */}
      <div className="overflow-hidden">
        <svg viewBox={`0 0 ${chartW} ${chartH + 10}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="barFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(225, 45%, 60%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(225, 45%, 60%)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Bars with fade */}
          {dataPoints.map((h, i) => {
            const x = i * (barW + gap);
            const barH = (h / 90) * chartH;
            return (
              <rect
                key={i}
                x={x}
                y={chartH - barH + 6}
                width={barW}
                height={barH + 4}
                rx={1.5}
                fill="url(#barFade)"
              />
            );
          })}
          {/* Smooth curve line */}
          <path
            d={curvePath}
            fill="none"
            stroke="hsl(225, 45%, 45%)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Time pills */}
      <div className="flex gap-2">
        {timePills.map((pill) => (
          <button
            key={pill}
            className={`px-3 py-1 rounded-full text-[12px] font-body font-medium transition-colors ${
              pill === activePill
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {pill}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─── Metric Card ─── */
const MetricCard = ({
  label,
  value,
  change,
  changeColor,
}: {
  label: string;
  value: string;
  change?: string;
  changeColor?: string;
}) => (
  <div className="bg-card rounded-2xl p-4 flex flex-col gap-1 flex-1 min-w-0">
    <span className="font-body text-[11px] text-muted-foreground leading-tight">{label}</span>
    <span className="font-display text-[20px] font-light text-foreground leading-none mt-1">{value}</span>
    {change && (
      <span className="font-body text-[11px] font-medium mt-0.5" style={{ color: changeColor }}>
        {change}
      </span>
    )}
  </div>
);

/* ─── Main Page ─── */
const HrvDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="relative max-w-[430px] mx-auto min-h-screen flex flex-col" style={{ backgroundColor: "hsl(30, 15%, 95%)" }}>
      {/* Header */}
      <div className="flex items-center px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center font-body text-[17px] font-medium text-foreground -ml-6">Your HRV</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3 px-4 pb-4 overflow-y-auto">
        <StressScoreGauge />
        <HrvTrendCard />

        {/* Metrics row */}
        <div className="flex gap-3">
          <MetricCard
            label="Resting Heart Rate"
            value="74 ms"
            change="+12 ms"
            changeColor="hsl(18, 78%, 55%)"
          />
          <MetricCard
            label="Heart Rate Variability"
            value="36 ms"
          />
          <MetricCard
            label="Respiratory Rate"
            value="17.4 ms"
            change="+2.6%"
            changeColor="hsl(145, 60%, 36%)"
          />
        </div>
      </div>

      {/* Nav */}
      <BottomNavBar activeTab="Science" />

      {/* iOS indicator */}
      <div className="flex justify-center pb-2">
        <img src={homeIndicator} alt="" className="h-[5px] w-36 opacity-70" aria-hidden="true" />
      </div>
    </div>
  );
};

export default HrvDemo;
