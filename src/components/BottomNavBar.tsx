/**
 * BottomNavBar — shared dark pill-shaped navigation bar
 * Fixed at the bottom of the viewport.
 */

import { useNavigate, useLocation } from "react-router-dom";
import breatheIcon from "@/assets/breathe-nav-icon.svg";
import scienceIcon from "@/assets/science-nav-icon.svg";
import homeIcon from "@/assets/home-nav-icon.svg";
import searchIcon from "@/assets/search-nav-icon.svg";

const tabConfig = [
  { label: "Home", icon: homeIcon, paths: ["/"] },
  { label: "Breathe", icon: breatheIcon, paths: ["/menu", "/breathwork-session"] },
  { label: "Search", icon: searchIcon, paths: [] },
  { label: "Science", icon: scienceIcon, paths: ["/hrv"] },
];

const BottomNavBar = ({ activeTab }: { activeTab?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (label: string) => {
    if (label === "Home" || label === "Search") navigate("/");
    else if (label === "Breathe") navigate("/menu");
    else if (label === "Science") navigate("/hrv");
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] px-4 pb-2 pointer-events-none">
      <div
        className="max-w-[430px] w-full mx-4 rounded-[32px] px-4 py-3 flex items-center justify-around pointer-events-auto"
        style={{ backgroundColor: "rgba(26, 26, 26, 0.92)" }}
      >
        {tabConfig.map((tab) => {
          const isActive =
            activeTab === tab.label ||
            (!activeTab && tab.paths.some((p) =>
              p === "/" ? location.pathname === "/" : location.pathname.startsWith(p)
            ));

          return (
            <button
              key={tab.label}
              onClick={() => navigateTo(tab.label)}
              className={`flex flex-col items-center gap-1.5 transition-colors ${
                isActive ? "text-white" : "text-white/40"
              }`}
            >
              <img src={tab.icon} alt={tab.label} className={`w-[18px] h-[18px] ${isActive ? "opacity-100" : "opacity-40"}`} />
              <span className="text-[10px] font-body font-normal">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
