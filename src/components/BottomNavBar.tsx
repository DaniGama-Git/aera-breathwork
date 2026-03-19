/**
 * BottomNavBar — shared dark pill-shaped navigation bar
 * Used across all breathwork session screens.
 * "Breathe" tab is highlighted as the active tab.
 * Active tab has a small colored dot indicator beneath the icon.
 */

import breatheIcon from "@/assets/breathe-nav-icon.svg";
import scienceIcon from "@/assets/science-nav-icon.svg";
import homeIcon from "@/assets/home-nav-icon.svg";
import searchIcon from "@/assets/search-nav-icon.svg";

const BottomNavBar = ({ activeTab = "Breathe" }: { activeTab?: string }) => {
  const tabs = [
    { label: "Home", icon: <img src={homeIcon} alt="Home" className="w-[18px] h-[18px]" />, active: activeTab === "Home" },
    { label: "Breathe", icon: <img src={breatheIcon} alt="Breathe" className="w-[18px] h-[18px]" />, active: activeTab === "Breathe" },
    { label: "Search", icon: <img src={searchIcon} alt="Search" className="w-[18px] h-[18px]" />, active: activeTab === "Search" },
    { label: "Science", icon: <img src={scienceIcon} alt="Science" className="w-[18px] h-[18px]" />, active: activeTab === "Science" },
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
          </div>
          <span className="text-[10px] font-body font-normal">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavBar;
