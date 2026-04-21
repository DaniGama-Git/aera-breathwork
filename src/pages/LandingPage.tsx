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
import mockupExtension from "@/assets/mockup-extension-breathe.svg";
import step1Img from "@/assets/howitworks-step1-calendar.png";
import step2Img from "@/assets/howitworks-step2-focus-ready.png";
import step3Img from "@/assets/howitworks-step3-reset-complete.png";

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
            onClick={() => navigate("/auth")}
            className="relative mt-7 md:mt-8 px-8 md:px-10 py-3 md:py-3.5 rounded-full bg-white text-[#1a1a1a] font-body text-[13px] md:text-[14px] hover:opacity-90 transition"
          >
            Breath
          </button>

          <ChevronDown
            className="relative mt-4 text-white/70 animate-bounce"
            size={22}
            strokeWidth={1.5}
          />
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
                    className="max-h-[320px] md:max-h-[420px] w-auto object-contain"
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
                <div className="flex items-center gap-3 mb-4 flex-wrap justify-center">
                  <button
                    onClick={() => navigate("/onboarding?flow=chrome")}
                    className="px-5 py-3 rounded-full bg-[#1a1a1a] text-white font-body text-[12px] md:text-[13px] hover:bg-black transition flex items-center gap-2"
                  >
                    <span className="inline-block w-4 h-4 rounded-full bg-white" />
                    Add to Chrome — It's free
                  </button>
                  <button
                    onClick={() => navigate("/wave")}
                    className="px-5 py-3 rounded-full bg-white border border-gray-300 text-[#1a1a1a] font-body text-[12px] md:text-[13px] hover:bg-gray-50 transition flex items-center gap-1.5"
                  >
                    ▶ Watch Demo
                  </button>
                </div>
                <p className="font-body text-[10px] md:text-[11px] text-gray-500 flex items-center gap-2 flex-wrap justify-center">
                  <span>⊘ No credit card</span>
                  <span className="text-gray-300">·</span>
                  <span>◷ Works with Google & Outlook</span>
                  <span className="text-gray-300">·</span>
                  <span>◷ 2 min setup</span>
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <ChevronDown className="text-gray-400" size={24} strokeWidth={1.5} />
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
            <div className="rounded-[28px] bg-[#F5F5F7] p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
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
          </div>
        </section>

        {/* ——— 4. HOW IT WORKS ——— */}
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
                {/* Inline calendar mockup */}
                <div className="flex items-center justify-center">
                  <div className="relative w-full max-w-[420px]">
                    <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
                      {/* browser chrome */}
                      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100">
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                        <span className="ml-3 font-body text-[10px] text-gray-400">
                          calendar.google.com
                        </span>
                      </div>
                      {/* events */}
                      <div className="p-4 space-y-2">
                        {[
                          { t: "9:00", l: "Board meeting", c: "bg-[#E8F0FE] text-[#1A73E8]" },
                          { t: "11:30", l: "Pitch prep", c: "bg-[#FCE8E6] text-[#C5221F]" },
                          { t: "14:00", l: "Deep work", c: "bg-[#E6F4EA] text-[#137333]" },
                        ].map((e) => (
                          <div
                            key={e.l}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 ${e.c}`}
                          >
                            <span className="font-body text-[11px] font-semibold w-10">{e.t}</span>
                            <span className="font-body text-[12px]">{e.l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* syncing pill */}
                    <div className="absolute -right-2 -bottom-3 md:-right-4 md:-bottom-4 bg-white rounded-full shadow-md px-3 py-1.5 flex items-center gap-2 border border-gray-100">
                      <span className="block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-body text-[10px] md:text-[11px] text-gray-700">
                        āera syncing
                      </span>
                    </div>
                  </div>
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
