/**
 * LandingPage — Public marketing page for āera
 * Route: /
 * Two sections: immersive hero + product overview with two cards
 */

import aeraLogo from "@/assets/aera-logo.svg";
import landingBg from "@/assets/landing-bg.svg";
import mockupApp from "@/assets/mockup-iphone.png";
import mockupAppScreens from "@/assets/mockup-app-screens.svg";
import mockupExtension from "@/assets/mockup-extension.png";

const LandingPage = () => {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-[#0e0e0d] text-[#F7F6F5] font-body">
      {/* ——— SECTION 1: Hero ——— */}
      <section className="relative w-full h-screen flex flex-col items-end overflow-hidden">
        {/* BG */}
        <img
          src={landingBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />

        {/* Content — anchored to bottom center */}
        <div className="relative z-10 w-full mt-auto flex flex-col items-center text-center px-6 pb-16 md:pb-20">
          <img src={aeraLogo} alt="āera" className="w-[90px] md:w-[110px] mb-8" />

          <p
            className="font-body font-normal text-[#F7F6F5]/85 uppercase tracking-[0.15em] leading-[1.6]"
            style={{ fontSize: "clamp(11px, 2.2vw, 14px)" }}
          >
            Every athlete has a recovery coach.
            <br />
            High performers don't.
          </p>

          <p
            className="font-body font-semibold text-[#F7F6F5] uppercase tracking-[0.15em] mt-4"
            style={{ fontSize: "clamp(13px, 2.5vw, 16px)" }}
          >
            Until now.
          </p>

          <button
            onClick={scrollToProducts}
            className="mt-8 inline-flex items-center justify-center px-8 h-[44px] rounded-full bg-[#F7F6F5] text-[#1D1D1C] font-body font-medium text-[15px] hover:opacity-90 transition-opacity"
          >
            Breathe
          </button>
        </div>
      </section>

      {/* ——— SECTION 2: Product Overview ——— */}
      <section
        id="products"
        className="relative w-full min-h-screen flex flex-col items-center bg-[#F0EEEB]"
      >
        <div className="w-full max-w-[1100px] px-6 md:px-12 py-20 md:py-28 flex flex-col items-center">
          {/* Logo + tagline */}
          <img src={aeraLogo} alt="āera" className="w-[80px] mb-4 opacity-80 invert" loading="lazy" />
          <p
            className="font-body font-semibold text-[#1D1D1C] text-center mb-16 md:mb-20"
            style={{ fontSize: "clamp(15px, 3.5vw, 18px)" }}
          >
            Breathe. Recover. Perform.
            <br />
            In under 5 minutes.
          </p>

          {/* Product cards */}
          <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-0">
            {/* Card 1 — The App */}
            <div className="flex-1 max-w-[480px] w-full flex flex-col items-center text-center">
              <h2 className="font-body font-semibold text-[#1D1D1C] text-[24px] tracking-[-0.01em] mb-2">
                The App
              </h2>
              <p className="font-body font-semibold text-[#1D1D1C]/80 text-[15px] mb-6">
                Breathe wherever you are.
              </p>

              <div className="flex flex-col items-center gap-6 mb-6">
                <img
                  src={mockupApp}
                  alt="āera app on mobile"
                  className="w-[200px] md:w-[240px] h-auto"
                  loading="lazy"
                />
                <img
                  src={mockupAppScreens}
                  alt="āera app screens overview"
                  className="w-full max-w-[400px] h-auto mix-blend-multiply"
                  loading="lazy"
                />
              </div>

              <p className="font-body font-normal text-[#1D1D1C]/70 text-[14px] leading-[1.55] mb-8 max-w-[360px]">
                Your full session library. Includes longer on-demand sessions across all four categories.
                Built for the space between meetings and on-the-go.
              </p>

              <a
                href="/auth"
                className="inline-flex items-center justify-center h-[44px] px-8 rounded-full bg-[#E8A88C] text-white font-body font-medium text-[15px] hover:opacity-90 transition-opacity"
              >
                Open App
              </a>
            </div>

            {/* Plus symbol */}
            <div className="flex items-center justify-center px-4 md:px-6 md:mt-[200px]">
              <span
                className="font-body font-light text-[#1D1D1C]/25"
                style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
              >
                +
              </span>
            </div>

            {/* Card 2 — The Moment */}
            <div className="flex-1 max-w-[480px] w-full flex flex-col items-center text-center">
              <h2 className="font-body font-semibold text-[#1D1D1C] text-[24px] tracking-[-0.01em] mb-2">
                The Moment
              </h2>
              <p className="font-body font-semibold text-[#1D1D1C]/80 text-[15px] mb-6">
                Breathe in the moments that matter most.
              </p>

              <div className="flex justify-center mb-6">
                <img
                  src={mockupExtension}
                  alt="āera Chrome extension with calendar integration"
                  className="w-[280px] md:w-[320px] h-auto"
                  loading="lazy"
                />
              </div>

              <p className="font-body font-normal text-[#1D1D1C]/70 text-[14px] leading-[1.55] mb-8 max-w-[360px]">
                Reads your calendar. Pulls the right āera session. Pops up before your pitch,
                your board meeting, or your creative block. You just breathe.
              </p>

              <a
                href="https://chromewebstore.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[44px] px-8 rounded-full bg-[#E8A88C] text-white font-body font-medium text-[15px] hover:opacity-90 transition-opacity"
              >
                Add to Chrome
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
