import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import areaLogo from "@/assets/aera-logo.svg";
import homeBg from "@/assets/home-bg.webp";
import OnboardingStep from "@/components/onboarding/OnboardingStep";
import MultiSelectStep from "@/components/onboarding/MultiSelectStep";
import KeywordStep from "@/components/onboarding/KeywordStep";

interface OnboardingData {
  goals: string[];
  moments: string[];
  calendarKeywords: string[];
}

const GOAL_OPTIONS = [
  { label: "To focus", value: "focus" },
  { label: "To perform better", value: "performance" },
  { label: "To recover", value: "recovery" },
  { label: "To boost my energy", value: "energy" },
];

const MOMENT_OPTIONS = [
  { label: "Before important meetings", value: "before_meetings" },
  { label: "Before a pitch, board, or negotiation", value: "before_pitch" },
  { label: "Before deep work or creative blocks", value: "before_deep_work" },
  { label: "Morning activation", value: "morning_activation" },
  { label: "After back-to-back meetings", value: "after_back_to_back" },
  { label: "Afternoon energy dip", value: "afternoon_energy" },
  { label: "On travel days", value: "travel_days" },
  { label: "End of day", value: "end_of_day" },
];

const SUGGESTED_KEYWORDS = [
  "pitch", "board", "negotiation", "interview", "creative",
  "deep work", "focus block", "strategy", "1:1", "standup",
];

type Step = "goals" | "moments" | "keywords";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("goals");
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    moments: [],
    calendarKeywords: [],
  });

  const stepOrder: Step[] = ["goals", "moments", "keywords"];
  const currentIndex = stepOrder.indexOf(step);
  const totalVisualSteps = 3;

  const goBack = () => {
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const saveAndFinish = async () => {
    if (!user || saving) return;
    setSaving(true);

    try {
      const { error: prefError } = await supabase
        .from("onboarding_preferences")
        .upsert({
          user_id: user.id,
          goals: data.goals,
          moments: data.moments,
          calendar_keywords: data.calendarKeywords,
          scheduled_enabled: false,
          scheduled_practice: null,
          scheduled_length: null,
          scheduled_times: [],
          scheduled_frequency: null,
        }, { onConflict: "user_id" });
      if (prefError) console.warn("Prefs save:", prefError);

      const { data: existing } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", user.id);
        if (error) console.error("Profile update error:", error);
      } else {
        const { error } = await supabase.from("profiles").insert({ user_id: user.id, onboarding_completed: true });
        if (error) console.error("Profile insert error:", error);
      }

      navigate("/extension", { replace: true });
    } catch (err) {
      console.error("Failed to save onboarding:", err);
      navigate("/extension", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  const canGoBack = step !== "goals";

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      <img src={homeBg} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[560px] mx-auto w-full">
        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center justify-between">
          <img src={areaLogo} alt="Aera" className="h-6" />
          <div className="flex items-center gap-4">
            <span className="text-white/30 font-body text-xs">
              {currentIndex + 1} / {totalVisualSteps}
            </span>
            <button
              onClick={() => saveAndFinish()}
              disabled={saving}
              className="text-white/30 font-body text-xs hover:text-white/50 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 mb-8">
          <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / totalVisualSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 flex flex-col">
          {step === "goals" && (
            <OnboardingStep
              title="Part 1 — Your Moments"
              subtitle="This section shapes when āera shows up for you throughout your day."
            >
              <MultiSelectStep
                question="What is your primary goal when you take an intentional moment of breathwork?"
                hint="You can choose more than one."
                options={GOAL_OPTIONS}
                selected={data.goals}
                onChange={(goals) => setData({ ...data, goals })}
                onContinue={() => setStep("moments")}
              />
            </OnboardingStep>
          )}

          {step === "moments" && (
            <OnboardingStep>
              <MultiSelectStep
                question="When do you want āera to show up?"
                hint="Choose as many as feel right. If you don't select a moment, no sessions from that category will fire."
                options={MOMENT_OPTIONS}
                selected={data.moments}
                onChange={(moments) => setData({ ...data, moments })}
                onContinue={() => setStep("keywords")}
              />
            </OnboardingStep>
          )}

          {step === "keywords" && (
            <OnboardingStep>
              <KeywordStep
                selected={data.calendarKeywords}
                suggestions={SUGGESTED_KEYWORDS}
                onChange={(kw) => setData({ ...data, calendarKeywords: kw })}
                onContinue={() => saveAndFinish()}
              />
            </OnboardingStep>
          )}

          {/* Back button */}
          {canGoBack && (
            <div className="mt-auto pt-4 pb-10 flex justify-center">
              <button
                onClick={goBack}
                className="min-h-10 px-4 text-white/50 text-sm font-body hover:text-white/70 transition-colors disabled:opacity-30"
                disabled={saving}
              >
                Go back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
