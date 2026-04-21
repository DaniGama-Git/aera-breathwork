import { useNavigate, useSearchParams } from "react-router-dom";
import { Copy, Check, ChevronDown, Download } from "lucide-react";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import areaLogo from "@/assets/aera-logo.svg";
import BreatheDots from "@/components/BreatheDots";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import mockupExtension from "@/assets/landing-moment-mockup.png";
import installNavigate from "@/assets/install-1-navigate-chrome-ext.png";
import installDevMode from "@/assets/install-2-developer-mode.png";
import installLoadUnpacked from "@/assets/install-3-load-unpacked.png";
import installAdded from "@/assets/install-4-added-to-ext.png";
import installAccess from "@/assets/install-5-access-aera.png";
import installSettingsPanel from "@/assets/install-6-settings-panel.png";
import calendarIcalUrl from "@/assets/calendar-3-ical-url.png";
import calendarSettingsImg from "@/assets/calendar-4-settings.png";

const INSTALL_STEPS = [
  "Download & unzip the extension",
  "Enable Developer mode at chrome://extensions, click Load unpacked",
  "Open the extension & connect your calendar",
];

const INSTALL_GUIDE: { title: string; image: string | null }[] = [
  { title: "Navigate to: chrome://extensions", image: installNavigate },
  { title: "Developer Mode: Toggle On", image: installDevMode },
  { title: "Load Unpacked: Unzip & select the extension folder", image: installLoadUnpacked },
  { title: "Extension added to Chrome", image: installAdded },
  { title: "Access āera from your toolbar", image: installAccess },
  { title: "Open the āera settings panel", image: installSettingsPanel },
];

const CALENDAR_GUIDE: { title: string; image: string | null }[] = [
  { title: "Open Google Calendar settings", image: null },
  { title: "Select your calendar", image: null },
  { title: "Copy the secret iCal address", image: calendarIcalUrl },
  { title: "Paste into āera settings", image: calendarSettingsImg },
];

const Extension = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isMobile = useIsMobile();
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

  // ========== MOBILE LAYOUT (unchanged) ==========
  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-white flex justify-center">
        <div className="relative w-full max-w-[430px] min-h-screen flex flex-col bg-white">
          {downloading && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
              <BreatheDots className="w-14 h-14" />
            </div>
          )}

          <header className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
            <img src={areaLogo} alt="Aera" className="h-5 brightness-0" />
            <p
              className="font-body text-right"
              style={{ fontWeight: 600, fontSize: "13px", lineHeight: "18px", color: "#1D1D1F" }}
            >
              Breathe. Recover. Perform.
              <br />
              <span style={{ color: "#1D1D1F" }}>In under 5 minutes.</span>
            </p>
          </header>

          <main className="flex-1 px-5 pt-6 pb-10 space-y-4">
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

              <div
                className="w-full rounded-[20px] bg-white border border-gray-200 mb-5 flex items-center justify-center"
                style={{ aspectRatio: "16 / 10" }}
              >
                <span className="font-body text-[11px] text-gray-400">
                  Mockup image goes here
                </span>
              </div>

              {keywords.length > 0 && (
                <div className="rounded-[20px] p-4 mb-5" style={{ background: "#E5E5E5" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body text-[10px] tracking-widest uppercase" style={{ color: "#1D1D1F" }}>
                      Your trigger words
                    </p>
                    <button
                      onClick={handleCopyKeywords}
                      className="flex items-center gap-1.5 hover:opacity-70 transition font-body text-[11px]"
                      style={{ color: "#1D1D1F" }}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="font-body font-semibold text-[14px] uppercase mb-2" style={{ color: "#1D1D1F" }}>
                    {keywords.join(", ")}
                  </p>
                  <p className="font-body text-[11px] leading-relaxed" style={{ color: "#1D1D1F" }}>
                    Paste these into the extension after connecting your calendar.
                  </p>
                </div>
              )}

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-4 rounded-[80px] flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                style={{
                  background: "#1D1D1F",
                  color: "#FFFFFF",
                  fontFamily: "inherit",
                  fontWeight: 500,
                  fontSize: "15px",
                  lineHeight: "100%",
                  letterSpacing: "0.02em",
                }}
              >
                <Download size={18} strokeWidth={2} />
                Download Extension
              </button>
              <p className="text-center text-[11px] text-gray-500 mt-3 font-body">
                Works in Chrome, Edge, Brave, and Arc
              </p>
            </div>

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
                <div className="px-5 pb-5 space-y-6">
                  {INSTALL_GUIDE.map((step, i) => (
                    <div key={i} className="space-y-3">
                      <p className="font-body font-semibold text-[15px] text-gray-900 leading-snug">{step.title}</p>
                      {step.image ? (
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full rounded-[12px]"
                        />
                      ) : (
                        <div className="w-full aspect-[16/10] rounded-[12px] border border-dashed border-gray-300 bg-white flex items-center justify-center">
                          <span className="font-body text-[11px] text-gray-400">Image coming soon</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                <div className="px-5 pb-5 space-y-6">
                  <p className="font-body text-[13px] text-gray-700 leading-relaxed">
                    Connect your Google Calendar so āera can detect your key meetings and trigger sessions automatically.
                  </p>
                  {CALENDAR_GUIDE.map((step, i) => (
                    <div key={i} className="space-y-3">
                      <p className="font-body font-semibold text-[15px] text-gray-900 leading-snug">{step.title}</p>
                      {step.image ? (
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full rounded-[12px]"
                        />
                      ) : (
                        <div className="w-full aspect-[16/10] rounded-[12px] border border-dashed border-gray-300 bg-white flex items-center justify-center">
                          <span className="font-body text-[11px] text-gray-400">Image coming soon</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/calendar-setup")}
                    className="font-body text-[13px] text-gray-900 underline underline-offset-4"
                  >
                    Open full calendar setup →
                  </button>
                </div>
              )}
            </div>

            {isChromeFlow && !user && downloaded && (
              <button
                onClick={() => navigate("/auth?flow=chrome")}
                className="w-full py-4 rounded-[80px] flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "#1D1D1F",
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontSize: "17px",
                  lineHeight: "100%",
                  letterSpacing: "0.02em",
                }}
              >
                Create your account →
              </button>
            )}
          </main>

          <footer className="px-5 py-5 border-t border-gray-100 text-center">
            <p className="font-body text-[11px] text-gray-500">
              © 2026 āera. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-white">
      {downloading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <BreatheDots className="w-14 h-14" />
        </div>
      )}

      {/* Full-width header */}
      <header className="bg-[#F5F5F7] px-10 py-6 flex items-center justify-between">
        <img src={areaLogo} alt="Aera" className="h-6 brightness-0" />
        <p
          className="font-body text-right"
          style={{ fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#1D1D1F" }}
        >
          Breathe. Recover. Perform.
          <br />
          <span style={{ color: "#1D1D1F" }}>In under 5 minutes.</span>
        </p>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-[1280px] mx-auto px-10 py-10 space-y-6">
          {/* Hero card */}
          <div className="bg-[#F5F5F7] rounded-[40px] p-16">
            <div className="grid grid-cols-2 gap-12 items-center">
              {/* Left column */}
              <div>
                <div className="inline-flex px-4 py-1.5 rounded-full border border-[#1a1a1a] bg-transparent mb-6">
                  <span className="font-body text-[12px] text-gray-900">
                    Performance Breathwork · Built for work
                  </span>
                </div>

                <h1 className="text-gray-900 font-body font-semibold text-[52px] leading-[1.05] mb-4">
                  Chrome Extension
                </h1>
                <p className="font-body text-[16px] mb-8" style={{ color: "#6A6A6B" }}>
                  Breathwork prompts before your key meetings.
                </p>

                {keywords.length > 0 && (
                  <div className="rounded-[20px] p-6 mb-6" style={{ background: "#E5E5E5" }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-body text-[11px] tracking-widest uppercase" style={{ color: "#1D1D1F" }}>
                        Your trigger words
                      </p>
                      <button
                        onClick={handleCopyKeywords}
                        className="flex items-center gap-1.5 hover:opacity-70 transition font-body text-[12px]"
                        style={{ color: "#1D1D1F" }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="font-body font-semibold text-[16px] uppercase mb-2" style={{ color: "#1D1D1F" }}>
                      {keywords.join(", ")}
                    </p>
                    <p className="font-body text-[12px] leading-relaxed" style={{ color: "#1D1D1F" }}>
                      Paste these into the extension after connecting your calendar.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full py-4 rounded-[80px] flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  style={{
                    background: "#1D1D1F",
                    color: "#FFFFFF",
                    fontFamily: "inherit",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0.02em",
                  }}
                >
                  <Download size={18} strokeWidth={2} />
                  Download Extension
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-3 font-body">
                  Works in Chrome, Edge, Brave, and Arc
                </p>
              </div>

              {/* Right column */}
              <div>
                <img
                  src={mockupExtension}
                  alt="Aera extension preview"
                  className="w-full max-h-[420px] object-contain"
                />
                <div className="mt-8 space-y-3">
                  {INSTALL_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="font-body text-[14px] text-gray-400 shrink-0">{i + 1}.</span>
                      <p className="font-body text-[14px] text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="bg-[#F5F5F7] rounded-[20px] overflow-hidden">
            <button
              onClick={() => toggleSection("install")}
              className="w-full flex items-center justify-between px-8 py-5 text-left"
            >
              <span className="font-body font-semibold text-[15px] text-gray-900">
                How to install extension (Manually)
              </span>
              <ChevronDown
                size={20}
                className={`text-gray-700 transition-transform ${openSection === "install" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "install" && (
              <div className="px-8 pb-8 grid grid-cols-2 gap-x-10 gap-y-8">
                {INSTALL_GUIDE.map((step, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex gap-3">
                      <span className="font-body font-semibold text-[14px] text-gray-900 shrink-0">{i + 1}.</span>
                      <div className="flex-1">
                        <p className="font-body font-semibold text-[14px] text-gray-900 leading-snug">{step.title}</p>
                        <p className="font-body text-[13px] text-gray-600 leading-relaxed mt-1">{step.desc}</p>
                      </div>
                    </div>
                    {step.image ? (
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full rounded-[14px] border border-gray-200 bg-white"
                      />
                    ) : (
                      <div className="w-full aspect-[16/10] rounded-[14px] border border-dashed border-gray-300 bg-white flex items-center justify-center">
                        <span className="font-body text-[12px] text-gray-400">Image coming soon</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#F5F5F7] rounded-[20px] overflow-hidden">
            <button
              onClick={() => toggleSection("calendar")}
              className="w-full flex items-center justify-between px-8 py-5 text-left"
            >
              <span className="font-body font-semibold text-[15px] text-gray-900">
                Calendar Settings
              </span>
              <ChevronDown
                size={20}
                className={`text-gray-700 transition-transform ${openSection === "calendar" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "calendar" && (
              <div className="px-8 pb-8 space-y-6">
                <p className="font-body text-[14px] text-gray-700 leading-relaxed">
                  Connect your Google Calendar so āera can detect your key meetings and trigger sessions automatically.
                </p>
                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  {CALENDAR_GUIDE.map((step, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex gap-3">
                        <span className="font-body font-semibold text-[14px] text-gray-900 shrink-0">{i + 1}.</span>
                        <div className="flex-1">
                          <p className="font-body font-semibold text-[14px] text-gray-900 leading-snug">{step.title}</p>
                          <p className="font-body text-[13px] text-gray-600 leading-relaxed mt-1">{step.desc}</p>
                        </div>
                      </div>
                      {step.image ? (
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full rounded-[14px] border border-gray-200 bg-white"
                        />
                      ) : (
                        <div className="w-full aspect-[16/10] rounded-[14px] border border-dashed border-gray-300 bg-white flex items-center justify-center">
                          <span className="font-body text-[12px] text-gray-400">Image coming soon</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/calendar-setup")}
                  className="font-body text-[14px] text-gray-900 underline underline-offset-4"
                >
                  Open full calendar setup →
                </button>
              </div>
            )}
          </div>

          {isChromeFlow && !user && downloaded && (
            <button
              onClick={() => navigate("/auth?flow=chrome")}
              className="w-full py-4 rounded-[80px] flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "#1D1D1F",
                color: "#FFFFFF",
                fontWeight: 500,
                fontSize: "17px",
                lineHeight: "100%",
                letterSpacing: "0.02em",
              }}
            >
              Create your account →
            </button>
          )}
        </div>
      </main>

      <footer className="px-10 py-5 border-t border-gray-100 text-center">
        <p className="font-body text-[12px] text-gray-500">
          © 2026 āera. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Extension;
