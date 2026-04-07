import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import activateGradientBg from "@/assets/activate-gradient-v2.webp";
import areaLogo from "@/assets/aera-logo.svg";
import BottomNavBar from "@/components/BottomNavBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const STEPS = [
  {
    number: "01",
    title: "Download",
    description: "Click the button below to download the āera extension.",
  },
  {
    number: "02",
    title: "Unzip",
    description: "Unzip the downloaded file to a folder on your computer.",
  },
  {
    number: "03",
    title: "Open Extensions",
    description:
      'Go to chrome://extensions and enable "Developer mode" (top-right toggle).',
  },
  {
    number: "04",
    title: "Load Unpacked",
    description:
      'Click "Load unpacked" and select the unzipped folder. āera will appear in your toolbar.',
  },
  {
    number: "05",
    title: "Connect Calendar",
    description:
      "Open the āera extension, go to Settings, and ",
    linkText: "connect your Google Calendar",
    linkTo: "/calendar-setup",
    descriptionAfter: " to trigger sessions before key moments.",
  },
];

const Extension = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("onboarding_preferences")
      .select("calendar_keywords")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.calendar_keywords?.length) {
          setKeywords(data.calendar_keywords);
        }
      });
  }, [user]);

  const handleDownload = () => {
    fetch("/aera-extension.zip")
      .then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "aera-extension.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((err) => alert(err.message));
  };

  const handleCopyKeywords = () => {
    navigator.clipboard.writeText(keywords.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Same gradient background as session screens */}
      <img
        src={activateGradientBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      {/* Noise overlay */}
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
        <div className="pt-10 px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm font-body font-medium tracking-wide"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center text-center px-6 pt-6 pb-8">
          <img
            src={areaLogo}
            alt="āera"
            className="h-8 mb-6 opacity-90"
          />
          <h1
            className="text-white font-body font-semibold mb-3"
            style={{
              fontSize: "34px",
              lineHeight: "100%",
              letterSpacing: "-0.01em",
            }}
          >
            Chrome Extension
          </h1>
          <p className="text-white/50 text-[16px] leading-[140%] font-body font-medium max-w-xs">
            Calendar-triggered breathwork. Get a gentle prompt before key
            meetings so you show up sharp.
          </p>
        </div>

        {/* Steps */}
        <div className="px-6 space-y-5 mb-10">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex gap-4 items-start p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
            >
              <span className="text-white/20 font-body font-light text-[13px] tracking-widest mt-0.5">
                {step.number}
              </span>
              <div>
                <p className="text-white/90 text-[15px] font-body font-semibold mb-1">
                  {step.title}
                </p>
                <p className="text-white/40 text-[13px] leading-relaxed font-body font-medium">
                  {step.description}
                  {"linkText" in step && step.linkText && (
                    <button
                      onClick={() => navigate((step as any).linkTo)}
                      className="text-white/60 underline underline-offset-2 decoration-white/30 hover:text-white/80 transition-colors"
                    >
                      {step.linkText}
                    </button>
                  )}
                  {"descriptionAfter" in step && (step as any).descriptionAfter}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trigger keywords from onboarding — shown after steps */}
        {keywords.length > 0 && (
          <div className="px-6 mb-6">
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/30 text-[11px] font-body font-medium tracking-wide uppercase">
                  Your trigger words
                </p>
                <button
                  onClick={handleCopyKeywords}
                  className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition text-[11px] font-body font-medium tracking-wide"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white/60 text-[13px] font-body font-medium leading-relaxed">
                {keywords.join(", ")}
              </p>
              <p className="text-white/20 text-[11px] font-body font-medium mt-2">
                Paste these into the extension's Keywords field after connecting your calendar.
              </p>
            </div>
          </div>
        )}

        {/* Download CTA */}
        <div className="px-6 pb-8">
          <button
            onClick={handleDownload}
            className="w-full py-4 rounded-xl text-white font-body font-semibold text-[15px] tracking-wide flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Download size={18} />
            Download Extension
          </button>
          <p className="text-center text-[11px] text-white/25 mt-3 font-body font-medium tracking-wide">
            Works in Chrome, Edge, Brave, and Arc
          </p>
        </div>

        <BottomNavBar />
        <div className="h-24" />
      </div>
    </div>
  );
};

export default Extension;
