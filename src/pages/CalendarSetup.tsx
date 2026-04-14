import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import activateGradientBg from "@/assets/activate-gradient-v2.webp";
import areaLogo from "@/assets/aera-logo.svg";
import BottomNavBar from "@/components/BottomNavBar";

const STEPS = [
  {
    number: "01",
    title: "Open Google Calendar Settings",
    description:
      'Open Google Calendar settings and click your calendar name in the left sidebar under "Settings for my calendars".',
    action: {
      label: "Open Calendar Settings",
      url: "https://calendar.google.com/calendar/r/settings",
    },
  },
  {
    number: "02",
    title: "Make your calendar public",
    description:
      'Under "Access permissions for events", check "Make available to public". This allows āera to read your events via the iCal link.',
  },
  {
    number: "03",
    title: "Copy the public iCal address",
    description:
      'Scroll to "Integrate calendar" and copy the URL under "Public address in iCal format". Then paste it into the āera extension\'s Settings tab.',
  },
];

const CalendarSetup = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyExample = () => {
    navigator.clipboard.writeText("https://calendar.google.com/calendar/ical/YOUR_CALENDAR_ID/basic.ics");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      <img
        src={activateGradientBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[800px] mx-auto w-full overflow-y-auto">
        {/* Back */}
        <div className="pt-14 px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm font-body font-medium tracking-wide"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center text-center px-6 pt-10 pb-8">
          <img src={areaLogo} alt="āera" className="h-8 mb-6 opacity-90" />
          <h1
            className="text-white font-body font-semibold mb-3"
            style={{ fontSize: "28px", lineHeight: "120%", letterSpacing: "-0.01em" }}
          >
            Connect Your Calendar
          </h1>
          <p className="text-white/50 text-[15px] leading-[150%] font-body font-medium max-w-sm">
            āera scans your calendar for keywords like "pitch" or "negotiation" and triggers the right breathwork session before key moments.
          </p>
        </div>

        {/* Steps */}
        <div className="px-6 space-y-3 mb-8">
          {STEPS.map((step) => (
            <div key={step.number}>
              <div
                className="flex gap-4 items-start p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
              >
                <span className="text-white/20 font-body font-light text-[13px] tracking-widest mt-0.5">
                  {step.number}
                </span>
                <div className="flex-1">
                  <p className="text-white/90 text-[15px] font-body font-semibold mb-1">
                    {step.title}
                  </p>
                  <p className="text-white/40 text-[13px] leading-relaxed font-body font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
              {step.action && (
                <a
                  href={step.action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 ml-10 px-4 py-2.5 rounded-xl text-white/70 text-[13px] font-body font-medium transition-all hover:text-white/90 hover:brightness-110"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <ExternalLink size={14} />
                  {step.action.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* URL format hint */}
        <div className="px-6 mb-8">
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-white/30 text-[11px] font-body font-medium tracking-wide uppercase mb-2">
              The URL looks like this
            </p>
            <div className="flex items-center gap-2">
              <code className="text-white/50 text-[11px] font-mono flex-1 break-all">
                https://calendar.google.com/calendar/ical/...basic.ics
              </code>
              <button
                onClick={handleCopyExample}
                className="text-white/30 hover:text-white/60 transition shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-8">
          <p className="text-center text-white/30 text-[13px] font-body font-medium mb-4">
            Once you have the URL, paste it in the āera extension's settings tab.
          </p>
          <button
            onClick={() => navigate("/extension")}
            className="w-full py-4 rounded-xl text-white font-body font-semibold text-[15px] tracking-wide flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Download Extension
          </button>
        </div>

        <BottomNavBar />
        <div className="h-24" />
      </div>
    </div>
  );
};

export default CalendarSetup;
