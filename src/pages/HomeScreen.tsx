/**
 * HomeScreen — Public landing screen for the Āera app
 * Route: /
 * Shows logo, tagline, category pills, and a CTA button.
 * No auth required. CTA routes to /auth or /menu based on auth state.
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import homeBg from "@/assets/home-bg.webp";
import activateIcon from "@/assets/activate-icon.svg";
import resetIcon from "@/assets/reset-icon.svg";
import focusIcon from "@/assets/focus-icon.svg";
import recoverIcon from "@/assets/recover-icon.svg";
import aeraLogo from "@/assets/aera-logo.svg";
import homeIndicator from "@/assets/home-indicator.png";

const pills = [
  { label: "Activate", icon: activateIcon },
  { label: "Reset", icon: resetIcon },
  { label: "Focus", icon: focusIcon },
  { label: "Recover", icon: recoverIcon },
];

function Pill({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 h-[25px] border border-white rounded-full whitespace-nowrap">
      <img src={icon} alt="" className="h-4 shrink-0" />
      <span className="font-body font-normal text-white text-[16px]">{label}</span>
    </div>
  );
}

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleCta = () => {
    if (user) {
      navigate("/menu");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <img
        src={homeBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 md:px-12 lg:px-20 pt-[clamp(40px,19vh,100px)] pb-6 max-w-[800px] mx-auto w-full">
        {/* Logo */}
        <div className="pl-[clamp(0px,14vw,56px)]">
          <img src={aeraLogo} alt="āera" style={{ width: "clamp(88px, 27.5vw, 130px)", height: "auto" }} />
        </div>

        {/* Tagline */}
        <p
          className="font-body font-normal text-[#F7F6F5] mt-[clamp(32px,7.7vh,66px)]"
          style={{ fontSize: "clamp(16px, 4.3vw, 18px)", lineHeight: 1.35 }}
        >
          Resolve stress.
          <br />
          Restore performance.
        </p>

        <div className="flex-1" />

        {/* Pills section */}
        <div className="flex flex-col items-center gap-2 mb-[clamp(8px,2vh,20px)]">
          <div className="flex gap-2 pl-[30%] md:pl-[45%]">
            {pills.slice(0, 2).map((p) => (
              <Pill key={p.label} {...p} />
            ))}
          </div>
          <div className="flex gap-2 self-stretch justify-end">
            {pills.slice(2).map((p) => (
              <Pill key={p.label} {...p} />
            ))}
          </div>
          <p className="mt-1.5 self-stretch text-right whitespace-nowrap font-body font-normal text-[16px] text-[#F7F6F5] opacity-85">
            Performance resets in under 5 minutes
          </p>
        </div>

        <div className="flex-1" />

        {/* CTA Button */}
        <button
          onClick={handleCta}
          disabled={loading}
          className="flex items-center justify-center h-[clamp(48px,6.5vh,58px)] bg-[#F7F6F5] rounded-full font-body font-normal text-[#1D1D1C] border-0 cursor-pointer"
          style={{ fontSize: "clamp(15px, 4vw, 17px)", letterSpacing: "0.02em" }}
        >
          Take a breath
        </button>

        {/* Guest bypass */}
        {!user && (
          <button
            onClick={() => navigate("/wave")}
            className="mt-3 flex items-center justify-center h-10 bg-transparent border border-[#F7F6F5]/40 rounded-full font-body font-normal text-[#F7F6F5]/80 cursor-pointer transition-colors hover:bg-[#F7F6F5]/10"
            style={{ fontSize: "clamp(13px, 3.5vw, 15px)", letterSpacing: "0.02em" }}
          >
            Try without signing in
          </button>
        )}

        {/* iOS Home Indicator */}
        <div className="flex justify-center pt-3">
          <img src={homeIndicator} alt="" className="h-[5px] w-36 opacity-70" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
