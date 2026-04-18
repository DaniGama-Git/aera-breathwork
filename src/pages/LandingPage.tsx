/**
 * LandingPage — Public marketing page for āera (mobile-first phone view)
 * Route: /
 */

import { useNavigate } from "react-router-dom";
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

            <img src={aeraLogo} alt="āera" className="w-[88px] mb-6" />

            <p className="font-body text-[10px] uppercase tracking-[0.18em] text-white/80 text-center leading-[1.7] px-6">
              Every athlete has a recovery coach.
              <br />
              High performers don't.
            </p>
            <p className="font-body font-semibold text-[11px] uppercase tracking-[0.18em] text-white mt-3">
              Until now.
            </p>

            <button
              onClick={() => navigate("/auth")}
              className="mt-7 px-8 py-3 rounded-full bg-white text-[#1a1a1a] font-body text-[13px] hover:opacity-90 transition"
            >
              Breathe
            </button>
          </div>
        </section>

        {/* ——— THE APP + THE MOMENT (combined card) ——— */}
        <section className="px-5 pt-10 pb-6 bg-white">
          <div className="bg-[#F5F5F7] rounded-[40px] p-6">
            {/* The App */}
            <h2 className="font-body font-semibold text-[24px] text-gray-900 mb-1">
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

            <p className="font-body text-[13px] text-gray-700 leading-relaxed mb-5">
              Your full session library. Includes longer on-demand sessions across all four
              categories. Built for the space between meetings and on-the-go.
            </p>

            <button
              onClick={() => navigate("/auth")}
              className="px-6 py-3 rounded-full bg-[#1a1a1a] text-white font-body text-[13px] hover:bg-black transition mb-10"
            >
              Open App
            </button>

            {/* The Moment */}
            <h2 className="font-body font-semibold text-[24px] text-gray-900 mb-1">
              The Moment
            </h2>
            <p className="font-body text-[13px] text-gray-600 mb-5">
              Breathe in the moments that matter most.
            </p>

            <div
              className="w-full rounded-[20px] bg-white border border-gray-200 mb-5 flex items-center justify-center"
              style={{ aspectRatio: "4 / 3" }}
            >
              <span className="font-body text-[11px] text-gray-400">
                Extension mockup goes here
              </span>
            </div>

            <p className="font-body text-[13px] text-gray-700 leading-relaxed mb-5">
              Reads your calendar. Pulls the right āera session. Pops up before your pitch,
              your board meeting, or your creative block. You just breathe.
            </p>

            <button
              onClick={() => navigate("/onboarding?flow=chrome")}
              className="px-6 py-3 rounded-full bg-[#1a1a1a] text-white font-body text-[13px] hover:bg-black transition"
            >
              Add to Chrome
            </button>
          </div>
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
