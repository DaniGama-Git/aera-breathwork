/**
 * LandingPage — Public marketing page for āera
 * Route: /
 * Desktop-first redesign (max-w 1280px). Hero remains responsive.
 */

import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import aeraLogo from "@/assets/aera-logo.svg";
import heroDunes from "@/assets/landing-hero-dunes.png";
import mockupApp from "@/assets/landing-app-mockup.png";
import mockupExtension from "@/assets/landing-moment-mockup.png";
import step1Img from "@/assets/howitworks-step1-calendar.svg";
import step2Img from "@/assets/howitworks-step2-focus-ready.svg";
import step3Img from "@/assets/howitworks-step3-reset-complete.svg";
import chromeLogo from "@/assets/chrome-logo.svg";
import iconNoCard from "@/assets/icon-no-card.svg";
import iconMail from "@/assets/icon-mail.svg";
import iconSetup from "@/assets/icon-setup.svg";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col bg-black">
      {/* ——— HERO ——— */}
      <section className="relative w-full">
        <div
          className="relative w-full flex flex-col items-center justify-center text-white bg-cover bg-center bg-black aspect-[9/14] md:aspect-auto md:h-screen"
          style={{ backgroundImage: `url(${heroDunes})`, marginBottom: "-1px" }}
        >
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          <img
            src={aeraLogo}
            alt="āera"
            className="relative w-[88px] md:w-[120px] mb-6 md:mb-7"
          />

          <p
            className="relative font-body text-[10px] md:text-[12px] uppercase tracking-[0.18em] text-center leading-[1.7] px-6"
            style={{ color: "#ECE9E4" }}
          >
            Every athlete has a recovery coach.
            <br />
            High performers don't.
          </p>
          <p
            className="relative font-body text-[11px] md:text-[13px] uppercase tracking-[0.18em] mt-3"
            style={{ color: "#FFFFFF", fontWeight: 700 }}
          >
            Until now.
          </p>

          <button
            onClick={() => {
              const next = document.getElementById("body-start");
              next?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative mt-7 md:mt-8 px-8 md:px-10 py-3 md:py-3.5 rounded-full bg-white text-[#1a1a1a] font-body text-[13px] md:text-[14px] hover:opacity-90 transition"
          >
            Breathe
          </button>

          <button
            type="button"
            aria-label="Scroll to next section"
            onClick={() => {
              const next = document.getElementById("body-start");
              next?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative mt-4 text-white/70 animate-bounce hover:text-white transition"
          >
            <ChevronDown size={22} strokeWidth={1.5} />
          </button>
        </div>
      </section>

      {/* ——— BODY (white background, centered, max 1280px) ——— */}
      <div className="w-full bg-white">
        {/* ——— 1. THE APP + THE MOMENT (combined row) ——— */}
        <section className="bg-[#F5F5F7]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* The App */}
              <div className="flex flex-col items-center text-center">
                <h2 className="font-body font-semibold text-[28px] md:text-[36px] text-gray-900 mb-2">
                  The App
                </h2>
                <p className="font-body text-[13px] md:text-[15px] text-gray-600 mb-8">
                  Breathe wherever you are.
                </p>
                <div className="w-full flex items-center justify-center mb-8 min-h-[280px] md:min-h-[360px]">
                  <img
                    src={mockupApp}
                    alt="āera app screens"
                    className="max-h-[260px] md:max-h-[340px] w-auto object-contain"
                  />
                </div>
                <p className="font-body text-[13px] md:text-[15px] text-gray-700 leading-relaxed mb-6 max-w-[360px]">
                  Your full session library. Includes longer on-demand sessions across all four
                  categories. Built for the space between meetings and on-the-go.
                </p>
                <button
                  onClick={() => navigate("/auth")}
                  className="px-7 py-3 rounded-full bg-[#1a1a1a] text-white font-body text-[13px] md:text-[14px] hover:bg-black transition"
                >
                  Open App →
                </button>
              </div>

              {/* The Moment */}
              <div className="flex flex-col items-center text-center">
                <h2 className="font-body font-semibold text-[28px] md:text-[36px] text-gray-900 mb-2">
                  The Moment
                </h2>
                <p className="font-body text-[13px] md:text-[15px] text-gray-600 mb-8">
                  Reset your performance in under 5 minutes.
                </p>
                <div className="w-full flex items-center justify-center mb-8 min-h-[280px] md:min-h-[360px]">
                  <img
                    src={mockupExtension}
                    alt="āera Chrome extension"
                    className="max-h-[320px] md:max-h-[420px] w-auto object-contain"
                  />
                </div>
                <p className="font-body text-[13px] md:text-[15px] text-gray-700 leading-relaxed mb-6 max-w-[360px]">
                  āera reads your calendar and delivers a targeted breathwork session before every
                  high-stakes moment — automatically.
                </p>
                <div className="flex items-center gap-3 mb-5 flex-wrap justify-center">
                  <button
                    onClick={() => navigate("/onboarding?flow=chrome")}
                    className="pl-1.5 pr-5 py-1.5 rounded-full bg-[#1a1a1a] text-white font-body text-[12px] md:text-[13px] hover:bg-black transition flex items-center gap-2"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white">
                      <img src={chromeLogo} alt="" className="w-4 h-4" />
                    </span>
                    Add to Chrome — It's free
                  </button>
                  <button
                    onClick={() => navigate("/wave")}
                    className="px-5 py-3 rounded-full bg-white border border-gray-300 text-[#1a1a1a] font-body text-[12px] md:text-[13px] hover:bg-gray-50 transition flex items-center gap-1.5"
                  >
                    ▶ Watch Demo
                  </button>
                </div>
                <div className="font-body text-[11px] md:text-[12px] text-[#6A6A6B] flex items-center gap-4 flex-wrap justify-center">
                  <span className="flex items-center gap-1.5">
                    <img src={iconNoCard} alt="" className="w-4 h-4" />
                    No credit card
                  </span>
                  <span className="flex items-center gap-1.5">
                    <img src={iconMail} alt="" className="w-[18px] h-[18px]" />
                    Works with Google &amp; Outlook
                  </span>
                  <span className="flex items-center gap-1.5">
                    <img src={iconSetup} alt="" className="w-4 h-4" />
                    2 min setup
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <ChevronDown className="text-gray-900" size={24} strokeWidth={1.5} />
            </div>
          </div>
        </section>

        {/* ——— 2. THE APP — DEEP DIVE ——— */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <div className="rounded-[28px] bg-[#F5F5F7] p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="block w-10 h-[2px] bg-gray-900" />
                  <span className="block w-10 h-[2px] bg-gray-300" />
                </div>
                <h2 className="font-body font-semibold text-[32px] md:text-[44px] text-gray-900 mb-2 leading-tight">
                  The App
                </h2>
                <p className="font-body font-semibold text-[14px] md:text-[16px] text-gray-700 mb-4">
                  Breathe wherever you are.
                </p>
                <p className="font-body text-[14px] md:text-[15px] text-gray-600 leading-relaxed mb-8 max-w-[440px]">
                  Your full session library. Includes longer on-demand sessions across all four
                  categories — Perform, Activate, Ground, and Recover. Built for the space between
                  meetings and on-the-go.
                </p>
                <button
                  onClick={() => navigate("/auth")}
                  className="px-7 py-3 rounded-full bg-[#1a1a1a] text-white font-body text-[13px] md:text-[14px] hover:bg-black transition"
                >
                  Open App →
                </button>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src={mockupApp}
                  alt="āera app screens"
                  className="max-h-[420px] md:max-h-[520px] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ——— 3. THE MOMENT — DEEP DIVE ——— */}
        <section className="bg-white pb-12 md:pb-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <div className="rounded-[28px] bg-[#F5F5F7] p-8 md:p-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="md:order-2">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="block w-10 h-[2px] bg-gray-300" />
                    <span className="block w-10 h-[2px] bg-gray-900" />
                  </div>
                  <h2 className="font-body font-semibold text-[32px] md:text-[44px] text-gray-900 mb-2 leading-tight">
                    The Moment
                  </h2>
                  <p className="font-body font-semibold text-[14px] md:text-[16px] text-gray-700 mb-4">
                    Breathe in the moments that matter most.
                  </p>
                  <p className="font-body text-[14px] md:text-[15px] text-gray-600 leading-relaxed mb-8 max-w-[440px]">
                    Reads your calendar. Pulls the right āera session. Pops up before your pitch,
                    your board meeting, or your creative block. You just breathe.
                  </p>
                  <button
                    onClick={() => navigate("/onboarding?flow=chrome")}
                    className="px-7 py-3 rounded-full bg-[#1a1a1a] text-white font-body text-[13px] md:text-[14px] hover:bg-black transition"
                  >
                    Add to Chrome →
                  </button>
                </div>
                <div className="flex items-center justify-center md:order-1">
                  <img
                    src={mockupExtension}
                    alt="āera Chrome extension"
                    className="max-h-[420px] md:max-h-[520px] w-auto object-contain"
                  />
                </div>
              </div>
              <div className="flex justify-center mt-10 md:mt-12">
                <ChevronDown className="text-gray-900" size={24} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white pb-12 md:pb-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <div className="rounded-[28px] bg-[#F5F5F7] p-8 md:p-16">
              {/* Header */}
              <div className="text-center mb-12 md:mb-16">
                <p className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-gray-500 mb-3">
                  How it works
                </p>
                <h2 className="font-body font-semibold text-[32px] md:text-[48px] text-gray-900 mb-3 leading-tight">
                  Breathe. Recover. Perform.
                </h2>
                <p className="font-body text-[14px] md:text-[16px] text-gray-600 max-w-[520px] mx-auto">
                  Three simple steps to peak performance every single day.
                </p>
              </div>

              {/* Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-24">
                <div>
                  <p className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-gray-500 mb-3">
                    Step 1
                  </p>
                  <h3 className="font-body font-semibold text-[22px] md:text-[28px] text-gray-900 mb-3 leading-tight">
                    Reads your calendar
                  </h3>
                  <p className="font-body text-[14px] md:text-[15px] text-gray-600 leading-relaxed max-w-[420px]">
                    Connects to your Google Calendar. Sniffs out the events that matter, so āera
                    knows when you'll need a quick reset.
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={step1Img}
                    alt="āera syncing with your calendar"
                    className="max-h-[280px] md:max-h-[340px] w-auto object-contain"
                  />
                </div>
              </div>

              {/* Step 2 — image left, text right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-24">
                <div className="flex items-center justify-center md:order-1 order-2">
                  <img
                    src={step2Img}
                    alt="Focus breath ready notification"
                    className="max-h-[300px] md:max-h-[360px] w-auto object-contain"
                  />
                </div>
                <div className="md:order-2 order-1">
                  <p className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-gray-500 mb-3">
                    Step 2
                  </p>
                  <h3 className="font-body font-semibold text-[22px] md:text-[28px] text-gray-900 mb-3 leading-tight">
                    Matches events to breathwork
                  </h3>
                  <p className="font-body text-[14px] md:text-[15px] text-gray-600 leading-relaxed max-w-[420px]">
                    Each meeting type maps to one of four protocols — Perform, Activate, Ground,
                    or Recover — so the right session is ready when you need it.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div>
                  <p className="font-body text-[10px] md:text-[11px] uppercase tracking-widest text-gray-500 mb-3">
                    Step 3
                  </p>
                  <h3 className="font-body font-semibold text-[22px] md:text-[28px] text-gray-900 mb-3 leading-tight">
                    Pops up at the right moment
                  </h3>
                  <p className="font-body text-[14px] md:text-[15px] text-gray-600 leading-relaxed max-w-[420px]">
                    A few minutes before your meeting, āera triggers a breathing session — right in
                    your browser. No app to open. Just breathe.
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={step3Img}
                    alt="Reset complete confirmation"
                    className="max-h-[300px] md:max-h-[360px] w-auto object-contain"
                  />
                </div>
              </div>

              {/* Footer line */}
              <p className="text-center font-body text-[13px] md:text-[15px] text-gray-600 mt-16 md:mt-20 max-w-[560px] mx-auto">
                No setup. No friction. Just better performance, one breath at a time.
              </p>
            </div>
          </div>
        </section>

        {/* ——— FOOTER ——— */}
        <footer className="px-5 py-8 border-t border-gray-100 bg-white text-center">
          <p className="font-body text-[11px] md:text-[12px] text-gray-500">
            © 2026 āera. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
