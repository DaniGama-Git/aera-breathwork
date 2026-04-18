import { useNavigate, useSearchParams } from "react-router-dom";
import { Copy, Check, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import areaLogo from "@/assets/aera-logo.svg";
import BreatheDots from "@/components/BreatheDots";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const INSTALL_STEPS = [
  "Download & unzip the extension",
  "Enable Developer mode at chrome://extensions, click Load unpacked",
  "Open the extension & connect your calendar",
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
  const [openSection, setOpenSection] = useState<"install" | "calendar" | null>(null);

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

      let finalBlob = blob;
      const pendingData = sessionStorage.getItem("aera_onboarding_data");
      let triggers: string[] = [];
      if (pendingData) {
        try {
          const parsed = JSON.parse(pendingData);
          if (parsed.moments?.length) triggers = parsed.moments;
        } catch {}
      }
      if (triggers.length === 0 && user) {
        const { data: prefs } = await supabase
          .from("onboarding_preferences")
          .select("moments")
          .eq("user_id", user.id)
          .maybeSingle();
        if (prefs?.moments?.length) triggers = prefs.moments;
      }
      if (keywords.length > 0 || triggers.length > 0) {
        const zip = await JSZip.loadAsync(blob);
        zip.file("defaults.json", JSON.stringify({ keywords, triggers, leadMinutes: 5 }));
        finalBlob = await zip.generateAsync({ type: "blob" });
      }

      const a = document.createElement("a");
      a.href = URL.createObjectURL(finalBlob);
      a.download = "aera-extension.zip";
      a.click();
      URL.revokeObjectURL(a.href);
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

  const toggleSection = (section: "install" | "calendar") => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-white">
      {downloading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <BreatheDots className="w-14 h-14" />
        </div>
      )}

      {/* Header — matches onboarding */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
        <img src={areaLogo} alt="Aera" className="h-5 brightness-0" />
        <p className="text-gray-900 font-body text-[11px] leading-tight text-right">
          Breathe. Recover. Perform.
          <br />
          <span className="text-gray-500">In under 5 minutes.</span>
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 px-5 pt-6 pb-10 space-y-4">
        {/* Hero card */}
        <div className="bg-[#F5F5F7] rounded-[40px] p-6">
          <div className="inline-flex px-4 py-1.5 rounded-full border border-[#1a1a1a] bg-transparent mb-5">
            <span className="font-body text-[11px] text-gray-900">
              Performance Breathwork · Built for work
            </span>
          </div>

          <h1 className="text-gray-900 font-body font-semibold text-[26px] leading-tight mb-2">
            Chrome Extension
          </h1>
          <p className="font-body text-[13px] mb-5" style={{ color: "#6A6A6B" }}>
            Breathwork prompts before your key meetings.
          </p>

          {/* Reserved space for product mockup image (desktop + phone) — pass image later */}
          <div
            className="w-full rounded-[20px] bg-white border border-gray-200 mb-5 flex items-center justify-center"
            style={{ aspectRatio: "16 / 10" }}
          >
            <span className="font-body text-[11px] text-gray-400">
              Mockup image goes here
            </span>
          </div>

          {/* Trigger keywords */}
          {keywords.length > 0 && (
            <div className="rounded-[20px] bg-white border border-gray-200 p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-[10px] text-gray-500 tracking-widest uppercase">
                  Your trigger words
                </p>
                <button
                  onClick={handleCopyKeywords}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition font-body text-[11px]"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-gray-900 font-body font-semibold text-[14px] uppercase mb-2">
                {keywords.join(", ")}
              </p>
              <p className="text-gray-500 font-body text-[11px] leading-relaxed">
                Paste these into the extension after connecting your calendar.
              </p>
            </div>
          )}

          {/* Download CTA */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 rounded-[80px] bg-[#1a1a1a] text-white font-body font-semibold text-[14px] flex items-center justify-center gap-2 transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            Download Extension
          </button>
          <p className="text-center text-[11px] text-gray-500 mt-3 font-body">
            Works in Chrome, Edge, Brave, and Arc
          </p>
        </div>

        {/* Accordion: Install instructions */}
        <div className="bg-[#F5F5F7] rounded-[20px] overflow-hidden">
          <button
            onClick={() => toggleSection("install")}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="font-body font-semibold text-[14px] text-gray-900">
              How to install extension (Manually)
            </span>
            <ChevronDown
              size={18}
              className={`text-gray-700 transition-transform ${openSection === "install" ? "rotate-180" : ""}`}
            />
          </button>
          {openSection === "install" && (
            <div className="px-5 pb-5 space-y-2">
              {INSTALL_STEPS.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-body text-[13px] text-gray-400 shrink-0">
                    {i + 1}.
                  </span>
                  <p className="font-body text-[13px] text-gray-700 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accordion: Calendar Settings */}
        <div className="bg-[#F5F5F7] rounded-[20px] overflow-hidden">
          <button
            onClick={() => toggleSection("calendar")}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="font-body font-semibold text-[14px] text-gray-900">
              Calendar Settings
            </span>
            <ChevronDown
              size={18}
              className={`text-gray-700 transition-transform ${openSection === "calendar" ? "rotate-180" : ""}`}
            />
          </button>
          {openSection === "calendar" && (
            <div className="px-5 pb-5">
              <p className="font-body text-[13px] text-gray-700 leading-relaxed mb-3">
                Connect your Google Calendar so āera can detect your key meetings and trigger sessions automatically.
              </p>
              <button
                onClick={() => navigate("/calendar-setup")}
                className="font-body text-[13px] text-gray-900 underline underline-offset-4"
              >
                Open calendar setup →
              </button>
            </div>
          )}
        </div>

        {/* Chrome flow: create account CTA */}
        {isChromeFlow && !user && downloaded && (
          <button
            onClick={() => navigate("/auth?flow=chrome")}
            className="w-full py-4 rounded-[80px] bg-[#1a1a1a] text-white font-body font-semibold text-[14px] flex items-center justify-center gap-2 transition-all hover:bg-black active:scale-[0.98]"
          >
            Create your account →
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="px-5 py-5 border-t border-gray-100 text-center">
        <p className="font-body text-[11px] text-gray-500">
          © 2026 āera. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Extension;
