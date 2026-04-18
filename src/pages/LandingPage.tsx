/**
 * LandingPage — Public marketing page for āera (mobile-first phone view)
 * Route: /
 */

import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import aeraLogo from "@/assets/aera-logo.svg";
import heroDunes from "@/assets/landing-hero-dunes.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[430px] bg-white flex flex-col">
        {/* ——— HERO ——— */}
        <section className="relative">
          {/* Hero with desert dunes background */}
          <div
            className="relative w-full flex flex-col items-center justify-center text-white bg-cover bg-center"
            style={{ aspectRatio: "9 / 14", backgroundImage: `url(${heroDunes})` }}
          >
            {/* 30% black overlay for text legibility */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            <img src={aeraLogo} alt="āera" className="relative w-[88px] mb-6" />

            <p
              className="relative font-body text-[10px] uppercase tracking-[0.18em] text-center leading-[1.7] px-6"
              style={{ color: "#ECE9E4" }}
            >
              Every athlete has a recovery coach.
              <br />
              High performers don't.
            </p>
            <p
              className="relative font-body text-[11px] uppercase tracking-[0.18em] mt-3"
              style={{ color: "#FFFFFF", fontWeight: 700 }}
            >
              Until now.
            </p>

            <button
              onClick={() => navigate("/auth")}
              className="relative mt-7 px-8 py-3 rounded-full bg-white text-[#1a1a1a] font-body text-[13px] hover:opacity-90 transition"
            >
              Breathe
            </button>

            <ChevronDown
              className="relative mt-4 text-white/70 animate-bounce"
              size={22}
              strokeWidth={1.5}
            />
          </div>
        </section>

        {/* ——— THE APP + THE MOMENT (shared grey background, centered) ——— */}
        <section className="px-5 pt-10 pb-12 bg-[#F5F5F7] flex flex-col items-center text-center">
          {/* The App */}
          <h2 className="font-body font-semibold text-[28px] text-gray-900 mb-1">
            The App
          </h2>
          <p className="font-body text-[13px] text-gray-600 mb-5">
            Breathe wherever you are.
          </p>

          <div
            className="w-full rounded-[20px] bg-white border border-gray-200 mb-5 flex items-center justify-center"
            style={{ aspectRatio: "4 / 3" }}
          >
            <span className="font-body text-[11px] text-gray-400">
              App mockup goes here
            </span>
          </div>

          <p className="font-body text-[13px] text-gray-700 leading-relaxed mb-5 max-w-[340px]">
            Your full session library. Includes longer on-demand sessions across all four
            categories. Built for the space between meetings and on-the-go.
          </p>

          <button
            onClick={() => navigate("/auth")}
            className="px-6 py-3 rounded-full bg-[#1a1a1a] text-white font-body text-[13px] hover:bg-black transition mb-12"
          >
            Open App →
          </button>

          {/* The Moment */}
          <h2 className="font-body font-semibold text-[28px] text-gray-900 mb-1">
            The Moment
          </h2>
          <p className="font-body text-[13px] text-gray-600 mb-5">
            Reset your performance in under 5 minutes
          </p>

          <div
            className="w-full rounded-[20px] bg-white border border-gray-200 mb-5 flex items-center justify-center"
            style={{ aspectRatio: "4 / 3" }}
          >
            <span className="font-body text-[11px] text-gray-400">
              Extension mockup goes here
            </span>
          </div>

          <p className="font-body text-[13px] text-gray-700 leading-relaxed mb-5 max-w-[340px]">
            āera reads your calendar and delivers a targeted breathwork session before every
            high-stakes moment — automatically.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate("/onboarding?flow=chrome")}
              className="px-5 py-3 rounded-full bg-[#1a1a1a] text-white font-body text-[12px] hover:bg-black transition flex items-center gap-2"
            >
              <span className="inline-block w-4 h-4 rounded-full bg-white" />
              Add to Chrome — It's free
            </button>
            <button
              onClick={() => navigate("/wave")}
              className="px-4 py-3 rounded-full bg-white border border-gray-300 text-[#1a1a1a] font-body text-[12px] hover:bg-gray-50 transition flex items-center gap-1.5"
            >
              ▶ Watch Demo
            </button>
          </div>

          <p className="font-body text-[10px] text-gray-500 flex items-center gap-2 flex-wrap justify-center">
            <span>⊘ No credit card</span>
            <span className="text-gray-300">·</span>
            <span>◷ Works with Google & Outlook</span>
            <span className="text-gray-300">·</span>
            <span>◷ 2 min setup</span>
          </p>

          <ChevronDown
            className="mt-8 text-gray-400"
            size={22}
            strokeWidth={1.5}
          />
        </section>

        {/* ——— HOW IT WORKS ——— */}
        <section className="px-5 pb-10 bg-white">
          <div className="bg-[#F5F5F7] rounded-[40px] p-6">
            <p className="font-body text-[10px] uppercase tracking-widest text-gray-500 text-center mb-3">
              How it works
            </p>
            <h2 className="font-body font-semibold text-[22px] text-gray-900 text-center mb-2 leading-tight">
              Breathe. Recover. Perform.
            </h2>
            <p className="font-body text-[12px] text-gray-600 text-center mb-6">
              Three steps to peak performance throughout your day.
            </p>

            {/* Step 1 */}
            <div className="bg-white rounded-[20px] border border-gray-200 p-4 mb-3">
              <p className="font-body text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                Step 1
              </p>
              <p className="font-body font-semibold text-[14px] text-gray-900 mb-2">
                Reads your calendar
              </p>
              <p className="font-body text-[12px] text-gray-600 leading-relaxed mb-3">
                Connects to your Google Calendar. Sniffs out the events that matter,
                so āera knows when you'll need a quick reset.
              </p>
              <div
                className="w-full rounded-[14px] bg-[#F5F5F7] flex items-center justify-center"
                style={{ aspectRatio: "16 / 9" }}
              >
                <span className="font-body text-[10px] text-gray-400">
                  Calendar visual goes here
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-[20px] border border-gray-200 p-4 mb-3">
              <p className="font-body text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                Step 2
              </p>
              <p className="font-body font-semibold text-[14px] text-gray-900 mb-2">
                Matches events to breathwork
              </p>
              <p className="font-body text-[12px] text-gray-600 leading-relaxed mb-3">
                Each meeting type maps to one of four protocols: Focus, Calm, Energy, or Recover.
              </p>
              <div
                className="w-full rounded-[14px] bg-[#F5F5F7] flex items-center justify-center"
                style={{ aspectRatio: "16 / 9" }}
              >
                <span className="font-body text-[10px] text-gray-400">
                  Protocol visual goes here
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-[20px] border border-gray-200 p-4">
              <p className="font-body text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                Step 3
              </p>
              <p className="font-body font-semibold text-[14px] text-gray-900 mb-2">
                Pops up at the right moment
              </p>
              <p className="font-body text-[12px] text-gray-600 leading-relaxed mb-3">
                A few minutes before your meeting, āera triggers a breathing session — right
                in your browser. No app to open. Just breathe.
              </p>
              <div
                className="w-full rounded-[14px] bg-[#F5F5F7] flex items-center justify-center"
                style={{ aspectRatio: "16 / 9" }}
              >
                <span className="font-body text-[10px] text-gray-400">
                  Trigger visual goes here
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ——— FOOTER ——— */}
        <footer className="px-5 py-6 border-t border-gray-100 bg-white text-center">
          <p className="font-body text-[11px] text-gray-500">
            © 2026 āera. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
