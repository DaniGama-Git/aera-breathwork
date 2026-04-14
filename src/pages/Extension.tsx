import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import activateGradientBg from "@/assets/activate-gradient-v2.webp";
import areaLogo from "@/assets/aera-logo.svg";
import mockupExtension from "@/assets/mockup-extension-breathe.svg";
import BottomNavBar from "@/components/BottomNavBar";
import BreatheDots from "@/components/BreatheDots";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const STEPS = [
  { number: "01", text: "Download & unzip the extension" },
  { number: "02", text: "Enable Developer mode at chrome://extensions, click Load unpacked" },
  { number: "03", text: "Open the extension & connect your calendar" },
];

const Extension = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isChromeFlow = searchParams.get("flow") === "chrome" || sessionStorage.getItem("aera_flow") === "chrome";
  const [keywords, setKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const pendingData = sessionStorage.getItem("aera_onboarding_data");
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        if (parsed.calendarKeywords?.length) {
          setKeywords(parsed.calendarKeywords);
          return;
        }
      } catch {}
    }
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

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch("/aera-extension.zip");
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();

      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = "aera-extension.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setDownloaded(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyKeywords = () => {
    navigator.clipboard.writeText(keywords.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      {downloading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <BreatheDots className="w-14 h-14" />
        </div>
      )}
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

      <div className="relative z-10 flex flex-col min-h-screen max-w-[430px] mx-auto w-full overflow-y-auto">
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
        <div className="flex flex-col items-center text-center px-6 pt-6 pb-4">
          <img src={areaLogo} alt="āera" className="h-8 mb-5 opacity-90" />
          <h1
            className="text-white font-body font-semibold mb-2"
            style={{ fontSize: "24px", lineHeight: "110%", letterSpacing: "-0.01em" }}
          >
            Chrome Extension
          </h1>
          <p className="text-white/50 text-[14px] leading-[140%] font-body font-medium max-w-[260px]">
            Breathwork prompts before your key meetings.
          </p>
        </div>

        {/* Product mockup */}
        <div className="px-6 flex justify-center pb-6" style={{ minHeight: "224px" }}>
          <img
            src={mockupExtension}
            alt="āera Chrome extension preview"
            className="max-h-[200px] w-auto rounded-xl"
            loading="eager"
            style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))" }}
          />
        </div>

        {/* 3 compact steps */}
        <div className="px-6 space-y-3 mb-8">
          {STEPS.map((step) => (
            <div key={step.number} className="flex items-center gap-3">
              <span className="text-white/20 font-body font-light text-[12px] tracking-widest shrink-0">
                {step.number}
              </span>
              <p className="text-white/50 text-[13px] font-body font-medium leading-snug">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Trigger keywords */}
        {keywords.length > 0 && (
          <div className="px-6 mb-5">
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
                Paste these into the extension after connecting your calendar.
              </p>
            </div>
          </div>
        )}

        {/* Download CTA */}
        <div className="px-6 pb-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 rounded-xl text-white font-body font-semibold text-[15px] tracking-wide flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
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

        {/* Chrome flow: prompt to create account after download */}
        {isChromeFlow && !user && downloaded && (
          <div className="px-6 pb-8">
            <button
              onClick={() => navigate("/auth?flow=chrome")}
              className="w-full py-4 rounded-xl text-white font-body font-semibold text-[15px] tracking-wide flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.20)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              Create your account →
            </button>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
};

export default Extension;
