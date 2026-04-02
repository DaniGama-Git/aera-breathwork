/**
 * CategoryLibrary — Shows placeholder sessions for a given category
 * Route: /category/:slug
 */

import { useParams, useNavigate, Link } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";
import homeIndicator from "@/assets/home-indicator.png";
import playIconSmall from "@/assets/play-icon-small.svg";
import { categoryConfig } from "@/data/sessionData";

const CategoryLibrary = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const config = categoryConfig[slug || ""];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-body text-muted-foreground">Category not found.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto h-screen flex flex-col bg-[#F7F6F5]">
      {/* Hero header */}
      <div className="relative shrink-0 h-[200px] overflow-hidden">
        <img
          src={config.image}
          alt={config.label}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 p-2 rounded-full bg-black/20 backdrop-blur-sm border-0 cursor-pointer z-10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="absolute bottom-5 left-5">
          <h1 className="font-body font-semibold text-[28px] text-white leading-tight">{config.label}</h1>
          <p className="font-body text-[14px] text-white/60 mt-1">{config.sessions.length} sessions</p>
        </div>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-3 px-4 md:px-8 py-4 pb-28 max-w-[960px] mx-auto w-full">
          {config.sessions.map((session) => (
            <Link
              key={session.title}
              to={`/session/${slug}/${session.slug}`}
              className="flex items-center gap-4 no-underline bg-card rounded-2xl p-3 transition-shadow hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                <img
                  src={config.image}
                  alt={session.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "blur(4px)", transform: "scale(1.15)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={playIconSmall} alt="Play" width="16" height="17" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body font-medium text-[15px] text-foreground leading-tight truncate">{session.title}</p>
                <p className="font-body font-normal text-[12px] text-muted-foreground mt-0.5">{session.description}</p>
                <p className="font-body font-normal text-[11px] text-muted-foreground/60 mt-1">{session.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <BottomNavBar activeTab="Breathe" />

      <div className="shrink-0 flex justify-center pb-2">
        <img src={homeIndicator} alt="" className="h-[5px] w-36 opacity-70" aria-hidden="true" />
      </div>
    </div>
  );
};

export default CategoryLibrary;
