/**
 * BreathworkMenu — Main browsing/home screen
 * Route: /menu
 * Shows greeting, category cards, favorites, and recommendations.
 */

import { Link } from "react-router-dom";
import categoryActivate from "@/assets/category-activate.png";
import categoryReset from "@/assets/category-reset.png";
import categoryFocus from "@/assets/category-focus.png";
import categoryRecover from "@/assets/category-recover.jpg";
import BottomNavBar from "@/components/BottomNavBar";
import homeIndicator from "@/assets/home-indicator.png";
import playIconSmall from "@/assets/play-icon-small.svg";
import playIconLarge from "@/assets/play-icon-large.svg";

const categories = [
  { label: "Activate", image: categoryActivate, to: "/breathwork-session-activate" },
  { label: "Reset", image: categoryReset, to: "/breathwork-session-reset" },
  { label: "Focus", image: categoryFocus, to: "/breathwork-session-focus" },
  { label: "Recover", image: categoryRecover, to: "/breathwork-session-recover" },
];

const favorites = [
  { title: "Performance Reset", duration: "5 mins", to: "/breathwork-session-reset", image: categoryReset },
  { title: "Focus Activation", duration: "5 mins", to: "/breathwork-session-focus", image: categoryFocus },
];

const recommendations = [
  { title: "Deep Decompression", duration: "10 mins", to: "/breathwork-session-recover", image: categoryActivate },
  { title: "Context Switching", duration: "5 mins", to: "/breathwork-session-reset", image: categoryReset },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const BreathworkMenu = () => {
  return (
    <div className="relative max-w-[430px] mx-auto min-h-screen flex flex-col bg-[#F7F6F5]">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div className="px-5 pt-16 pb-4 flex items-start justify-between">
          <div>
            <p className="font-body font-normal text-[16px] text-[#BDBDBD]">{getGreeting()}</p>
            <h1 className="font-body font-semibold text-[32px] leading-[100%] text-[#1D1D1C] mt-1">Chrissy</h1>
          </div>
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-[#C8B8A8] overflow-hidden mt-1 flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-[#C8B8A8] to-[#A89888]" />
          </div>
        </div>

        {/* Categories */}
        <div className="px-5 mt-2">
          <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className="relative overflow-hidden no-underline group"
                style={{ width: 166, height: 136, borderRadius: 18.11 }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center font-body font-medium text-[18px] text-white">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Favorites */}
        <div className="px-5 mt-8">
          <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Favorites</h2>
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((fav) => (
              <Link
                key={fav.title}
                to={fav.to}
                className="flex items-center gap-3 no-underline"
              >
                {/* Blurred image thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={fav.image}
                    alt={fav.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "blur(29px)" }}
                  />
                  <div className="absolute inset-0 bg-[#111111]/[0.01]" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <img src={playIconSmall} alt="Play" width="16" height="17" />
                   </div>
                </div>
                <div className="min-w-0">
                  <p className="font-body font-medium text-[14px] text-[#1D1D1C] leading-tight truncate">{fav.title}</p>
                  <p className="font-body font-normal text-[12px] text-[#BDBDBD] mt-0.5">{fav.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="px-5 mt-8">
          <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Recommendations</h2>
          <div className="grid grid-cols-2 gap-3 justify-items-center">
            {recommendations.map((rec) => (
              <Link
                key={rec.title}
                to={rec.to}
                className="relative overflow-hidden no-underline group"
                style={{ width: 168, height: 102, borderRadius: 12 }}
              >
                <img
                  src={rec.image}
                  alt={rec.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#111111]/[0.01] backdrop-blur-[29px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                {/* Play icon */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <polygon points="8,5 20,12 8,19" />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="font-body font-semibold text-[14px] text-white leading-tight">{rec.title}</p>
                  <p className="font-body font-normal text-[12px] text-white/70 mt-0.5">{rec.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-20">
        <BottomNavBar activeTab="Home" />
        <div className="flex justify-center pb-2 pt-1 bg-[#F7F6F5]">
          <img src={homeIndicator} alt="" className="h-[5px] w-36 opacity-40" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default BreathworkMenu;
