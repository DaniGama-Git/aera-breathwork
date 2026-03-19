/**
 * BottomNavBar — shared dark pill-shaped navigation bar
 * Used across all breathwork session screens.
 * "Breathe" tab is highlighted as the active tab.
 * Active tab has a small colored dot indicator beneath the icon.
 */

import breatheIcon from "@/assets/breathe-icon.png";
import scienceIcon from "@/assets/science-icon.png";
import homeIcon from "@/assets/home-icon.png";
import { Search } from "lucide-react";

const BottomNavBar = () => {
  const tabs = [
    { label: "Home", icon: <img src={homeIcon} alt="Home" className="w-5 h-5" />, active: false },
    {
      label: "Breathe",
      icon: <img src={breatheIcon} alt="Breathe" className="w-5 h-5" />,
      active: true,
    },
    { label: "Search", icon: <Search className="w-5 h-5" />, active: false },
    { label: "Science", icon: <img src={scienceIcon} alt="Science" className="w-5 h-5" />, active: false },
  ];

  return (
    <div
      className="mx-4 mb-2 rounded-[32px] px-4 py-3 flex items-center justify-around"
      style={{ backgroundColor: "rgba(26, 26, 26, 0.92)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            tab.active ? "text-white" : "text-white/40"
          }`}
        >
          <div className="relative">
            {tab.icon}
            {tab.active && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: "#E8734A" }}
              />
            )}
          </div>
          <span className="text-[10px] font-body font-normal">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavBar;
