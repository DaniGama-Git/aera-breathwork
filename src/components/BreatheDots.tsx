/**
 * BreatheDots — Loading animation based on the breathe nav icon.
 * Dots light up one-by-one in sequence, creating a radial pulse effect.
 */

const DOT_COUNT = 24; // 12 outer (stroked circles) + 12 inner (filled circles)
const CYCLE_MS = 2400;

// Outer ring: 12 stroked circles (clock positions, starting top-center going clockwise)
// Inner ring: 12 filled circles (same order)
// Paired: outer[i] lights up with inner[i]

const BreatheDots = ({ className = "w-12 h-12" }: { className?: string }) => {
  // Each pair index 0–11 maps to a clock position
  const pairDelay = (i: number) => `${(i * (CYCLE_MS / 12))}ms`;

  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.15; }
          25%, 50% { opacity: 1; }
        }
        .bd { animation: dotPulse ${CYCLE_MS}ms ease-in-out infinite; }
      `}</style>

      {/* Top center - 12 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(0) }} cx="9" cy="1.6875" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(0) }} cx="9" cy="3.6529" r="0.28125" fill="#f7f6f5" />

      {/* 1 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(1) }} cx="12.6562" cy="2.6738" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(1) }} cx="11.6737" cy="4.376" r="0.28125" fill="#f7f6f5" />

      {/* 2 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(2) }} cx="15.3374" cy="5.3508" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(2) }} cx="13.6353" cy="6.3335" r="0.28125" fill="#f7f6f5" />

      {/* 3 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(3) }} cx="16.3125" cy="9.0071" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(3) }} cx="14.347" cy="9.007" r="0.28125" fill="#f7f6f5" />

      {/* 4 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(4) }} cx="15.333" cy="12.6633" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(4) }} cx="13.6309" cy="11.6804" r="0.28125" fill="#f7f6f5" />

      {/* 5 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(5) }} cx="12.6562" cy="15.3396" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(5) }} cx="11.6737" cy="13.6377" r="0.28125" fill="#f7f6f5" />

      {/* 6 o'clock - bottom center */}
      <circle className="bd" style={{ animationDelay: pairDelay(6) }} cx="9" cy="16.3125" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(6) }} cx="9" cy="14.347" r="0.28125" fill="#f7f6f5" />

      {/* 7 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(7) }} cx="5.34375" cy="15.3396" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(7) }} cx="6.32629" cy="13.6377" r="0.28125" fill="#f7f6f5" />

      {/* 8 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(8) }} cx="2.66699" cy="12.6633" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(8) }} cx="4.36914" cy="11.6804" r="0.28125" fill="#f7f6f5" />

      {/* 9 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(9) }} cx="1.6875" cy="9.0071" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(9) }} cx="3.65295" cy="9.007" r="0.28125" fill="#f7f6f5" />

      {/* 10 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(10) }} cx="2.66699" cy="5.3508" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(10) }} cx="4.36914" cy="6.3335" r="0.28125" fill="#f7f6f5" />

      {/* 11 o'clock */}
      <circle className="bd" style={{ animationDelay: pairDelay(11) }} cx="5.34375" cy="2.6738" r="0.75" stroke="#f7f6f5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="bd" style={{ animationDelay: pairDelay(11) }} cx="6.32629" cy="4.376" r="0.28125" fill="#f7f6f5" />
    </svg>
  );
};

export default BreatheDots;
