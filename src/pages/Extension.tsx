import { useNavigate } from "react-router-dom";
import { Download, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import waveBgLogo from "@/assets/wave-bg-logo.png";
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
    description: "Open the āera extension, go to Settings, and ",
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
    <div className="min-h-screen bg-[#111] flex items-center justify-center font-body py-8 px-4">
      <div className="w-full max-w-[340px]">
        <div
          className="relative w-full overflow-hidden overflow-y-auto"
          style={{
            borderRadius: 22,
            backgroundImage: `url(${waveBgLogo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maxHeight: "calc(100vh - 64px)",
          }}
        >
          {/* Content */}
          <div className="relative z-10 px-5 pt-8 pb-6">
            {/* Header */}
            <div className="text-center mb-6">
              <span
                className="text-white/90 tracking-[0.2em] font-light block mb-4"
                style={{ fontSize: 22, fontWeight: 300, filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}
              >
                āera
              </span>
              <h1
                className="text-white font-semibold mb-2"
                style={{ fontSize: 20, lineHeight: "110%", letterSpacing: "-0.01em" }}
              >
                Chrome Extension
              </h1>
              <p className="text-white/45 text-[12px] leading-[150%] font-medium max-w-[260px] mx-auto">
                Calendar-triggered breathwork. Get a gentle prompt before key meetings so you show up sharp.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-2.5 mb-5">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="flex gap-3 items-start px-3.5 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-white/15 font-light text-[11px] tracking-widest mt-0.5">
                    {step.number}
                  </span>
                  <div>
                    <p className="text-white/85 text-[13px] font-semibold mb-0.5">
                      {step.title}
                    </p>
                    <p className="text-white/35 text-[11px] leading-relaxed font-medium">
                      {step.description}
                      {"linkText" in step && step.linkText && (
                        <button
                          onClick={() => navigate((step as any).linkTo)}
                          className="text-white/55 underline underline-offset-2 decoration-white/25 hover:text-white/75 transition-colors"
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

            {/* Trigger keywords */}
            {keywords.length > 0 && (
              <div className="mb-5">
                <div
                  className="px-3.5 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-white/25 text-[9px] font-medium tracking-wider uppercase">
                      Your trigger words
                    </p>
                    <button
                      onClick={handleCopyKeywords}
                      className="flex items-center gap-1 text-white/25 hover:text-white/50 transition text-[9px] font-medium tracking-wide"
                    >
                      {copied ? <Check size={10} /> : <Copy size={10} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-white/55 text-[11px] font-medium leading-relaxed">
                    {keywords.join(", ")}
                  </p>
                  <p className="text-white/15 text-[9px] font-medium mt-1.5">
                    Paste these into the extension's Keywords field after connecting your calendar.
                  </p>
                </div>
              </div>
            )}

            {/* Download CTA */}
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-full text-[10px] tracking-[0.15em] uppercase font-medium cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <Download size={13} />
              Download Extension
            </button>
            <p className="text-center text-[9px] text-white/20 mt-2 font-medium tracking-wide">
              Works in Chrome, Edge, Brave, and Arc
            </p>

            {/* Enter āera link */}
            <button
              onClick={() => navigate("/menu")}
              className="w-full mt-3 py-2.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-medium cursor-pointer transition-all hover:brightness-110"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Enter āera →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extension;
