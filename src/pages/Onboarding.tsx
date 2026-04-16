import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import areaLogo from "@/assets/aera-logo.svg";
import onboardingBg from "@/assets/onboarding-bg.jpg";
import OnboardingStep from "@/components/onboarding/OnboardingStep";
import MultiSelectStep from "@/components/onboarding/MultiSelectStep";
import KeywordStep from "@/components/onboarding/KeywordStep";

interface OnboardingData {
  goals: string[];
  moments: string[];
  calendarKeywords: string[];
}

const GOAL_OPTIONS = [
  { label: "Staying sharp before critical moments", value: "sharp_before_critical" },
  { label: "Recovering fast between meetings", value: "recovering_fast" },
  { label: "Sustaining energy through the day", value: "sustaining_energy" },
  { label: "Maintaining focus during deep work", value: "focus_deep_work" },
];

const MOMENT_OPTIONS = [
  { label: "Before important meetings & key moments", value: "before_critical" },
  { label: "Between back-to-back meetings", value: "back_to_back" },
  { label: "During high-intensity days", value: "high_density" },
  { label: "After a long day to decompress", value: "end_of_day" },
  { label: "When energy drops (morning / midday)", value: "energy_boost" },
];

const SUGGESTED_KEYWORDS = [
  "pitch", "board", "all hands",
  "decision", "strategy", "creative", "focus block", "deep work",
  "1:1", "standup",
];

type Step = "goals" | "moments" | "keywords";

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isChromeFlow = searchParams.get("flow") === "chrome" || sessionStorage.getItem("aera_flow") === "chrome";
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
    if (saving) return;
    setSaving(true);

    try {
      // If user is logged in, save to DB directly
      if (user) {
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

        sessionStorage.removeItem("aera_flow");
        navigate("/extension", { replace: true });
      } else {
        // Not logged in (chrome flow before auth) — store locally, move to extension
        sessionStorage.setItem("aera_onboarding_data", JSON.stringify(data));
        sessionStorage.setItem("aera_flow", "chrome");
        navigate("/extension?flow=chrome", { replace: true });
      }
    } catch (err) {
      console.error("Failed to save onboarding:", err);
      // Fallback: store locally and continue
      sessionStorage.setItem("aera_onboarding_data", JSON.stringify(data));
      sessionStorage.setItem("aera_flow", "chrome");
      navigate("/extension?flow=chrome", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  const canGoBack = step !== "goals";

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden bg-white">

      <div className="relative z-10 flex flex-col min-h-screen max-w-[560px] mx-auto w-full">
        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center justify-between">
          <img src={areaLogo} alt="Aera" className="h-6 brightness-0" />
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-body text-xs">
              {currentIndex + 1} / {totalVisualSteps}
            </span>
            <button
              onClick={() => saveAndFinish()}
              disabled={saving}
              className="text-gray-500 font-body text-xs hover:text-gray-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 mb-8">
          <div className="h-[2px] bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-700 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / totalVisualSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 flex flex-col">
          {step === "goals" && (
            <OnboardingStep>
              <MultiSelectStep
                question="What does performing at your best look like?"
                hint="Select everything that applies."
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
                question="When do you need a quick reset the most?"
                hint="Select everything that applies."
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
                className="min-h-10 px-4 text-gray-500 text-sm font-body hover:text-gray-700 transition-colors disabled:opacity-30"
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
