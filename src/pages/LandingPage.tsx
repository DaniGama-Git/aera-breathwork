/**
 * LandingPage — Public marketing page for āera
 * Route: /
 * Two sections: immersive hero + product overview with two cards
 */

import aeraLogo from "@/assets/aera-logo.svg";
import landingBg from "@/assets/landing-bg.svg";
import mockupApp from "@/assets/mockup-app.png";
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
          </svg>
        </div>
      </section>

      {/* ——— SECTION 2: Product Overview ——— */}
      <section
        id="products"
        className="relative w-full min-h-screen flex flex-col items-center overflow-hidden"
      >
        {/* Atmospheric BG — darker continuation */}
        <img
          src={landingBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          aria-hidden="true"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-[1100px] px-6 md:px-12 py-20 md:py-28 flex flex-col items-center">
          {/* Logo + tagline */}
          <img src={aeraLogo} alt="āera" className="w-[80px] mb-4 opacity-80" loading="lazy" />
          <p
            className="font-body font-normal text-[#F7F6F5]/80 text-center mb-16 md:mb-20"
            style={{ fontSize: "clamp(15px, 3.5vw, 18px)" }}
          >
            Breathe. Recover. Perform. In under 5 minutes.
          </p>

          {/* Product cards */}
          <div className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-0">
            {/* Card 1 — The App */}
            <div className="flex-1 max-w-[480px] w-full rounded-2xl border border-[#F7F6F5]/10 bg-[#F7F6F5]/[0.04] backdrop-blur-md p-8 md:p-10 flex flex-col">
              <h2 className="font-body font-semibold text-[24px] tracking-[-0.01em] mb-1">
                The App
              </h2>
              <p className="font-body font-normal text-[#F7F6F5]/60 text-[15px] mb-6">
                Breathe wherever you are.
              </p>

              <div className="flex justify-center mb-6">
                <img
                  src={mockupApp}
                  alt="āera app on mobile"
                  className="w-[200px] md:w-[220px] h-auto"
                  loading="lazy"
                />
              </div>

              <p className="font-body font-normal text-[#F7F6F5]/75 text-[14px] leading-[1.55] mb-8 flex-1">
                Your full session library. On-demand sessions across all four categories.
                Built for the space between meetings and on-the-go.
              </p>

              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/auth";
                }}
                className="flex items-center justify-center h-[46px] rounded-full bg-[#F7F6F5] text-[#1D1D1C] font-body font-medium text-[15px] hover:opacity-90 transition-opacity"
              >
                Open App
              </a>
            </div>

            {/* Plus symbol */}
            <div className="flex items-center justify-center px-4 md:px-6">
              <span
                className="font-body font-light text-[#F7F6F5]/30"
                style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
              >
                +
              </span>
            </div>

            {/* Card 2 — The Moment */}
            <div className="flex-1 max-w-[480px] w-full rounded-2xl border border-[#F7F6F5]/10 bg-[#F7F6F5]/[0.04] backdrop-blur-md p-8 md:p-10 flex flex-col">
              <h2 className="font-body font-semibold text-[24px] tracking-[-0.01em] mb-1">
                The Moment
              </h2>
              <p className="font-body font-normal text-[#F7F6F5]/60 text-[15px] mb-6">
                Breathe in the moments that matter most.
              </p>

              <div className="flex justify-center mb-6">
                <img
                  src={mockupExtension}
                  alt="āera Chrome extension with calendar integration"
                  className="w-[260px] md:w-[280px] h-auto"
                  loading="lazy"
                />
              </div>

              <p className="font-body font-normal text-[#F7F6F5]/75 text-[14px] leading-[1.55] mb-8 flex-1">
                Reads your calendar. Pulls the right āera session. Pops up before your pitch,
                your board meeting, your creative block. You just breathe.
              </p>

              <a
                href="https://chromewebstore.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-[46px] rounded-full bg-[#F7F6F5] text-[#1D1D1C] font-body font-medium text-[15px] hover:opacity-90 transition-opacity"
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
