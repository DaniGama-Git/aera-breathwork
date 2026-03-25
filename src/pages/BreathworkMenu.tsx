/**
 * BreathworkMenu — Main browsing/home screen
 * Route: /menu
 * Shows greeting, category cards, favorites, and recommendations.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import categoryActivate from "@/assets/category-activate.webp";
import categoryReset from "@/assets/category-reset.webp";
import categoryFocus from "@/assets/category-focus.webp";
import categoryRecover from "@/assets/category-recover.webp";
import BottomNavBar from "@/components/BottomNavBar";
import AddToCalendar from "@/components/AddToCalendar";
import homeIndicator from "@/assets/home-indicator.png";
import playIconSmall from "@/assets/play-icon-small.svg";
import playIconLarge from "@/assets/play-icon-large.svg";
import {
  CATEGORY_DISPLAY,
  TIME_DISPLAY,
} from "@/lib/recommendationMaps";

const categories = [
  { label: "Activate", image: categoryActivate, to: "/category/activate" },
  { label: "Reset", image: categoryReset, to: "/category/reset" },
  { label: "Focus", image: categoryFocus, to: "/category/focus" },
  { label: "Recover", image: categoryRecover, to: "/category/recover" },
];

const favorites = [
  { title: "Performance Reset", duration: "5 mins", to: "/breathwork-session-reset", image: categoryReset },
  { title: "Focus Activation", duration: "5 mins", to: "/breathwork-session-focus", image: categoryFocus },
  { title: "Morning Ignition", duration: "5 mins", to: "/breathwork-session-activate", image: categoryActivate },
  { title: "Evening Unwind", duration: "8 mins", to: "/breathwork-session-recover", image: categoryRecover },
];

const recommendations = [
  { title: "Deep Decompression", duration: "10 mins", to: "/breathwork-session-recover", image: categoryActivate },
  { title: "Context Switching", duration: "5 mins", to: "/breathwork-session-reset", image: categoryReset },
  { title: "Pre-Call Clarity", duration: "3 mins", to: "/breathwork-session-focus", image: categoryFocus },
  { title: "Afternoon Boost", duration: "5 mins", to: "/breathwork-session-activate", image: categoryRecover },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

interface ProfileRec {
  stress_archetype: string | null;
  recommended_session: string | null;
  recommended_frequency: number | null;
  recommended_time: string | null;
  recommendation_dismissed: boolean;
}

const BreathworkMenu = () => {
  const { signOut, user } = useAuth();
  const [profileRec, setProfileRec] = useState<ProfileRec | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const displayName = user?.user_metadata?.full_name?.split(" ")[0] || user?.user_metadata?.name?.split(" ")[0] || "there";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("stress_archetype, recommended_session, recommended_frequency, recommended_time, recommendation_dismissed")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setProfileRec(data);
        setBannerDismissed(data.recommendation_dismissed);
      }
    };
    void fetchProfile();
  }, [user]);

  const dismissBanner = async () => {
    setBannerDismissed(true);
    if (user) {
      await supabase
        .from("profiles")
        .update({ recommendation_dismissed: true })
        .eq("user_id", user.id);
    }
  };

  const showBanner = profileRec?.stress_archetype && !bannerDismissed;
  const categoryName = CATEGORY_DISPLAY[profileRec?.recommended_session || ""] || profileRec?.recommended_session || "";
  const timeName = TIME_DISPLAY[profileRec?.recommended_time || ""] || profileRec?.recommended_time || "";

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col bg-[#F7F6F5]">
      <div className="flex-1 overflow-y-auto pb-28 max-w-[960px] mx-auto w-full">
        {/* Header */}
        <div className="px-5 md:px-8 pt-10 pb-4 flex items-start justify-between">
          <div>
            <p className="font-body font-normal text-[16px] text-[#BDBDBD]">{getGreeting()}</p>
            <h1 className="font-body font-semibold text-[32px] leading-[100%] text-[#1D1D1C] mt-1">{displayName}</h1>
          </div>
          <button
            onClick={signOut}
            className="w-12 h-12 rounded-full overflow-hidden mt-1 flex-shrink-0 border-0 cursor-pointer p-0"
            title="Sign out"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-[#BDBDBD] flex items-center justify-center text-white font-body font-semibold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        </div>

        {/* Recommendation Banner */}
        {showBanner && (
          <div className="px-5 md:px-8 mt-1 mb-2">
            <div className="relative bg-white rounded-xl px-5 py-4 shadow-sm border border-[#ECECEC]">
              <button
                onClick={dismissBanner}
                className="absolute top-3 right-3 p-1 text-[#BDBDBD] hover:text-[#1D1D1C] transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
              <p className="font-body font-semibold text-[15px] text-[#1D1D1C] pr-6">
                {profileRec?.recommended_frequency}x {categoryName} sessions per week
              </p>
              <p className="font-body font-normal text-[13px] text-[#BDBDBD] mt-0.5">
                Best time: {timeName}
              </p>
              <AddToCalendar
                sessionTitle={`${categoryName} Session`}
                sessionSubtitle={`Recommended: ${profileRec?.recommended_frequency}x per week`}
                sessionCategory={profileRec?.recommended_session || "activate"}
                durationMinutes={5}
                recommendedFrequency={profileRec?.recommended_frequency || undefined}
                recommendedTime={profileRec?.recommended_time || undefined}
                trigger={
                  <button className="mt-3 px-4 py-2 rounded-xl bg-[#1D1D1C] text-white font-body font-medium text-[13px] transition-all duration-200 hover:bg-[#333] active:scale-[0.98]">
                    Schedule Sessions
                  </button>
                }
              />
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="px-5 md:px-8 mt-2">
          <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link key={cat.label} to={cat.to} className="relative overflow-hidden no-underline group" style={{ height: 136, borderRadius: 18.11 }}>
                <img src={cat.image} alt={cat.label} decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center font-body font-medium text-[18px] text-white">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Favorites */}
        <div className="px-5 md:px-8 mt-8">
          <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {favorites.map((fav) => (
              <Link key={fav.title} to={fav.to} className="flex items-center gap-3 no-underline">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={fav.image} alt={fav.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(6px)", transform: "scale(1.15)" }} />
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
        <div className="px-5 md:px-8 mt-8">
          <h2 className="font-body font-semibold text-[18px] text-[#1D1D1C] mb-3">Recommendations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recommendations.map((rec) => (
              <Link key={rec.title} to={rec.to} className="relative overflow-hidden no-underline group" style={{ height: 102, borderRadius: 12 }}>
                <img src={rec.image} alt={rec.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#111111]/[0.01] backdrop-blur-[29px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center justify-center">
                  <img src={playIconLarge} alt="Play" width="21" height="21" />
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
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] md:max-w-[600px] z-20">
        <BottomNavBar activeTab="Home" />
        <div className="flex justify-center pb-2 pt-1 bg-[#F7F6F5]">
          <img src={homeIndicator} alt="" className="h-[5px] w-36 opacity-40" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default BreathworkMenu;
