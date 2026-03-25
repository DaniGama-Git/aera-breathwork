import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import homeBg from "@/assets/home-bg.webp";
import areaLogo from "@/assets/aera-logo.svg";
import loadingIcon from "@/assets/loading-icon.png";
import AddToCalendar from "@/components/AddToCalendar";
import {
  ARCHETYPE_DISPLAY,
  CATEGORY_DISPLAY,
  CATEGORY_IMAGES,
  TIME_DISPLAY,
  SESSION_ROUTES,
} from "@/lib/recommendationMaps";

interface ProfileData {
  stress_archetype: string | null;
  recommended_session: string | null;
  recommended_frequency: number | null;
  recommended_time: string | null;
}

const Recommendation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("stress_archetype, recommended_session, recommended_frequency, recommended_time")
        .eq("user_id", user.id)
        .maybeSingle();
      setProfile(data);
      setLoading(false);
    };
    void fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <img src={loadingIcon} alt="" className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  const archetype = profile?.stress_archetype || "";
  const session = profile?.recommended_session || "activate";
  const frequency = profile?.recommended_frequency || 3;
  const time = profile?.recommended_time || "start_of_day";

  const archetypeName = ARCHETYPE_DISPLAY[archetype] || archetype;
  const categoryName = CATEGORY_DISPLAY[session] || session;
  const categoryImage = CATEGORY_IMAGES[session];
  const timeName = TIME_DISPLAY[time] || time;
  const sessionRoute = SESSION_ROUTES[session] || "/breathwork-session-activate";

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      <img src={homeBg} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[560px] mx-auto w-full">
        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center justify-between">
          <img src={areaLogo} alt="Aera" className="h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 px-6 flex flex-col items-center justify-center text-center">
          {/* Category image */}
          {categoryImage && (
            <div className="w-28 h-28 rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img src={categoryImage} alt={categoryName} className="w-full h-full object-cover" />
            </div>
          )}

          <p className="text-white/50 font-body text-[13px] uppercase tracking-widest mb-2">
            Your Archetype
          </p>
          <h1 className="text-white font-body font-semibold text-[32px] leading-tight mb-3">
            {archetypeName}
          </h1>

          <p className="text-white/70 font-body text-[16px] leading-relaxed max-w-[320px] mb-2">
            We recommend <span className="text-white font-semibold">{frequency}x {categoryName}</span> sessions per week
          </p>
          <p className="text-white/40 font-body text-[14px]">
            Best time: {timeName}
          </p>
        </div>

        {/* CTAs */}
        <div className="px-6 pb-12 flex flex-col items-center gap-4">
          <AddToCalendar
            sessionTitle={`${categoryName} Session`}
            sessionSubtitle={`Recommended: ${frequency}x per week`}
            sessionCategory={session}
            durationMinutes={5}
            recommendedFrequency={frequency}
            recommendedTime={time}
            trigger={
              <button className="w-full max-w-[320px] py-4 rounded-2xl bg-white text-[#1D1D1C] font-body font-semibold text-[15px] transition-all duration-200 hover:bg-white/90 active:scale-[0.98]">
                Schedule Sessions
              </button>
            }
          />

          <button
            onClick={() => navigate("/menu", { replace: true })}
            className="text-white/50 font-body text-[14px] underline underline-offset-4 decoration-white/30 transition-all duration-300 hover:text-white/90 hover:decoration-white/60"
          >
            Go to menu →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
