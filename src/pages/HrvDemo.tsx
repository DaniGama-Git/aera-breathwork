/**
 * HrvDemo — Static demo page for HRV data visualization
 * Route: /hrv
 */

import { useState } from "react";

import { useNavigate } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";
import homeIndicator from "@/assets/home-indicator.png";
import hrvChart from "@/assets/hrv-chart.png";

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

/* ─── Time-range data sets ─── */
const timeRangeData: Record<string, { hrv: string; change: string; changePct: string; rhr: string; rhrChange: string; hrvVal: string; resp: string; respChange: string }> = {
  Days:      { hrv: "74 ms", change: "+12 ms", changePct: "+5.6%", rhr: "74 ms", rhrChange: "+12 ms", hrvVal: "36 ms", resp: "17.4", respChange: "+2.6%" },
  Month:     { hrv: "68 ms", change: "+8 ms",  changePct: "+3.2%", rhr: "71 ms", rhrChange: "+6 ms",  hrvVal: "42 ms", resp: "16.8", respChange: "+1.4%" },
  "6 Months": { hrv: "61 ms", change: "+4 ms",  changePct: "+1.8%", rhr: "68 ms", rhrChange: "+3 ms",  hrvVal: "48 ms", resp: "15.9", respChange: "-0.8%" },
  Year:      { hrv: "55 ms", change: "+2 ms",  changePct: "+0.9%", rhr: "65 ms", rhrChange: "-2 ms",  hrvVal: "52 ms", resp: "15.2", respChange: "-1.2%" },
};

/* ─── HRV Trend Chart ─── */
const HrvTrendCard = ({ activePill, setActivePill }: { activePill: string; setActivePill: (v: string) => void }) => {
  const timePills = ["Days", "Month", "6 Months", "Year"];
  const data = timeRangeData[activePill];

  const isPositiveChange = data.changePct.startsWith("+");

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
          style={{
            backgroundColor: isPositiveChange ? "hsl(145, 55%, 92%)" : "hsl(0, 55%, 92%)",
            color: isPositiveChange ? "hsl(145, 60%, 36%)" : "hsl(0, 60%, 45%)",
          }}
        >
          {data.changePct}
        </span>
      </div>

      {/* Values */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-body text-[13px] text-muted-foreground">Post Session HRV</span>
          <span
            className="font-body text-[12px] font-medium"
            style={{ color: isPositiveChange ? "hsl(145, 60%, 36%)" : "hsl(0, 60%, 45%)" }}
          >
            {data.change}
          </span>
        </div>
        <span className="font-display text-[42px] font-light text-foreground leading-tight">{data.hrv}</span>
      </div>

      {/* Chart */}
      <div className="overflow-hidden">
        <img src={hrvChart} alt="HRV trend chart" className="w-full" />
      </div>

      {/* Time pills */}
      <div className="flex gap-2">
        {timePills.map((pill) => (
          <button
            key={pill}
            onClick={() => setActivePill(pill)}
            className={`px-3 py-1 rounded-full text-[12px] font-body font-medium transition-colors cursor-pointer ${
              pill === activePill
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
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
  unit = "ms",
  change,
  changeColor,
}: {
  label: string;
  value: string;
  unit?: string;
  change?: string;
  changeColor?: string;
}) => (
  <div className="bg-card rounded-2xl p-4 flex flex-col flex-1 min-w-0">
    <span className="font-body text-[11px] text-muted-foreground leading-tight min-h-[28px]">{label}</span>
    <div className="mt-auto pt-2">
      <span className="font-display text-[20px] font-light text-foreground leading-none block">{value} <span className="text-[13px]">{unit}</span></span>
    </div>
    <div className="h-[18px] mt-1">
      {change ? (
        <span className="font-body text-[11px] font-medium block" style={{ color: changeColor }}>
          {change}
        </span>
      ) : null}
    </div>
  </div>
);

/* ─── Main Page ─── */
const HrvDemo = () => {
  const navigate = useNavigate();
  const [activePill, setActivePill] = useState("Days");
  const data = timeRangeData[activePill];

  return (
    <div className="relative w-full mx-auto h-screen flex flex-col" style={{ backgroundColor: "hsl(30, 15%, 95%)" }}>
      {/* Header */}
      <div className="shrink-0 flex items-center px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center font-body text-[17px] font-medium text-foreground -ml-6">Your HRV</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-3 px-4 md:px-8 pb-28 max-w-[960px] mx-auto w-full">
          <StressScoreGauge />
          <HrvTrendCard activePill={activePill} setActivePill={setActivePill} />

          {/* Metrics row */}
          <div className="flex gap-3">
            <MetricCard
              label="Resting Heart Rate"
              value={data.rhr.replace(" ms", "")}
              unit="ms"
              change={data.rhrChange}
              changeColor="hsl(18, 78%, 55%)"
            />
            <MetricCard
              label="Heart Rate Variability"
              value={data.hrvVal.replace(" ms", "")}
              unit="ms"
            />
            <MetricCard
              label="Respiratory Rate"
              value={data.resp}
              unit="bpm"
              change={data.respChange}
              changeColor={data.respChange.startsWith("+") ? "hsl(145, 60%, 36%)" : "hsl(0, 60%, 45%)"}
            />
          </div>
        </div>
      </div>

      {/* Nav */}
      <BottomNavBar activeTab="Science" />

      {/* iOS indicator */}
      <div className="shrink-0 flex justify-center pb-2">
        <img src={homeIndicator} alt="" className="h-[5px] w-36 opacity-70" aria-hidden="true" />
      </div>
    </div>
  );
};

export default HrvDemo;
