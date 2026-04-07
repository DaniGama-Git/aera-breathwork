/**
 * BottomNavBar — shared dark pill-shaped navigation bar
 */

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SESSION_ROUTES } from "@/lib/recommendationMaps";
import breatheIcon from "@/assets/breathe-nav-icon.svg";

import homeIcon from "@/assets/home-nav-icon.svg";
import searchIcon from "@/assets/search-nav-icon.svg";

const getTimeBasedRoute = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return SESSION_ROUTES.activate;
  if (h >= 11 && h < 17) return SESSION_ROUTES.perform;
  if (h >= 17 && h < 21) return SESSION_ROUTES.recover;
  return SESSION_ROUTES.ground;
};

const tabConfig = [
  { label: "Home", icon: homeIcon, paths: ["/menu"] },
  { label: "Breathe", icon: breatheIcon, paths: ["/session"] },
  { label: "Search", icon: searchIcon, paths: ["/search"] },
];

const BottomNavBar = ({ activeTab }: { activeTab?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [recommendedRoute, setRecommendedRoute] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("recommended_session")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.recommended_session && SESSION_ROUTES[data.recommended_session]) {
          setRecommendedRoute(SESSION_ROUTES[data.recommended_session]);
        }
      });
  }, [user]);

  const navigateTo = (label: string) => {
    if (label === "Home") navigate("/menu");
    else if (label === "Breathe") navigate(recommendedRoute || getTimeBasedRoute());
    else if (label === "Search") navigate("/search");
    
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] md:max-w-[600px] px-4 pb-2 pointer-events-none">
      <div
        className="w-full rounded-[32px] px-4 py-3 flex items-center justify-around pointer-events-auto"
        style={{ backgroundColor: "rgba(26, 26, 26, 0.92)" }}
      >
        {tabConfig.map((tab) => {
          const isActive =
            activeTab === tab.label ||
            (!activeTab && tab.paths.some((p) =>
              p === "/menu" ? location.pathname === "/menu" : location.pathname.startsWith(p)
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
