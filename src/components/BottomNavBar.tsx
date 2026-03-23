/**
 * BottomNavBar — shared dark pill-shaped navigation bar
 * Navigates between Home, Breathe (menu), Search, and Science (HRV).
 */

import { useNavigate, useLocation } from "react-router-dom";
import breatheIcon from "@/assets/breathe-nav-icon.svg";
import scienceIcon from "@/assets/science-nav-icon.svg";
import homeIcon from "@/assets/home-nav-icon.svg";
import searchIcon from "@/assets/search-nav-icon.svg";

const tabConfig = [
  { label: "Home", icon: homeIcon, path: "/" },
  { label: "Breathe", icon: breatheIcon, path: "/menu" },
  { label: "Search", icon: searchIcon, path: "/search" },
  { label: "Science", icon: scienceIcon, path: "/hrv" },
];

const BottomNavBar = ({ activeTab }: { activeTab?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="mx-4 mb-2 rounded-[32px] px-4 py-3 flex items-center justify-around"
      style={{ backgroundColor: "rgba(26, 26, 26, 0.92)" }}
    >
      {tabConfig.map((tab) => {
        const isActive =
          activeTab === tab.label ||
          (!activeTab && (
            tab.path === "/" ? location.pathname === "/" :
            location.pathname.startsWith(tab.path)
          ));

        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
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
  );
};

export default BottomNavBar;
