import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Chrome, Monitor, Puzzle } from "lucide-react";
import areaExtIcon from "@/assets/aera-ext-icon.png";

const STEPS = [
  {
    icon: Download,
    title: "Download",
    description: "Click the button below to download the āera extension.",
  },
  {
    icon: Monitor,
    title: "Unzip",
    description: "Unzip the downloaded file to a folder on your computer.",
  },
  {
    icon: Chrome,
    title: "Open Extensions",
    description:
      'Go to chrome://extensions in Chrome, Edge, Brave, or Arc and enable "Developer mode" (top-right toggle).',
  },
  {
    icon: Puzzle,
    title: "Load Unpacked",
    description:
      'Click "Load unpacked" and select the unzipped folder. The āera icon will appear in your toolbar.',
  },
];

const Extension = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-5 py-8 pb-32">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition mb-10 text-sm tracking-wide"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-12">
          <img
            src={areaExtIcon}
            alt="āera extension icon"
            width={80}
            height={80}
            className="rounded-2xl mb-6"
          />
          <h1 className="text-2xl font-light tracking-wide mb-2">
            āera for Chrome
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Calendar-triggered breathwork. Get a gentle prompt before key
            meetings so you show up sharp.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50">
                <step.icon size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80 mb-0.5">
                  {step.title}
                </p>
                <p className="text-xs text-white/30 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Download CTA */}
        <button
          onClick={handleDownload}
          className="w-full py-3 border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition text-xs tracking-[2px] uppercase rounded-sm flex items-center justify-center gap-2"
        >
          <Download size={14} />
          Download Extension
        </button>

        <p className="text-center text-[10px] text-white/20 mt-4 tracking-wide">
          Works in Chrome, Edge, Brave, and Arc
        </p>
      </div>
    </div>
  );
};

export default Extension;
