import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import areaLogo from "@/assets/aera-logo.svg";

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

const STEP_CONFIG: Record<Step, { question: string; hint: string }> = {
  goals: {
    question: "What does performing at your best look like?",
    hint: "Select everything that applies.",
  },
  moments: {
    question: "When do you need a quick reset the most?",
    hint: "Select everything that applies.",
  },
  keywords: {
    question: "In which specific meetings would you like a quick reset?",
    hint: "Pick from the suggestions or add your own.",
  },
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isMobile = useIsMobile();
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
  const totalSteps = stepOrder.length;
  const config = STEP_CONFIG[step];

  const goBack = () => {
    if (currentIndex > 0) setStep(stepOrder[currentIndex - 1]);
  };

  const goNext = () => {
    if (currentIndex < totalSteps - 1) {
      setStep(stepOrder[currentIndex + 1]);
    } else {
      saveAndFinish();
    }
  };

  const currentSelectionCount = (() => {
    if (step === "goals") return data.goals.length;
    if (step === "moments") return data.moments.length;
    return data.calendarKeywords.length;
  })();

  const canContinue = currentSelectionCount > 0;

  const saveAndFinish = async () => {
    if (saving) return;
    setSaving(true);

    try {
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
        sessionStorage.setItem("aera_onboarding_data", JSON.stringify(data));
        sessionStorage.setItem("aera_flow", "chrome");
        navigate("/extension?flow=chrome", { replace: true });
      }
    } catch (err) {
      console.error("Failed to save onboarding:", err);
      sessionStorage.setItem("aera_onboarding_data", JSON.stringify(data));
      sessionStorage.setItem("aera_flow", "chrome");
      navigate("/extension?flow=chrome", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  // ========== MOBILE LAYOUT (unchanged from current design) ==========
  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-white flex justify-center">
        <div className="relative w-full max-w-[430px] min-h-screen flex flex-col bg-white">
          {/* Header */}
          <header className="bg-[#F5F5F7] px-5 pt-6 pb-4 flex items-center justify-between">
            <img src={areaLogo} alt="Aera" className="h-5 brightness-0" />
            <p
              className="font-body text-right"
              style={{ fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#1D1D1F" }}
            >
              Breathe. Recover. Perform.
              <br />
              <span style={{ color: "#1D1D1F" }}>In under 5 minutes.</span>
            </p>
          </header>

          {/* Progress + step indicator */}
          <div className="px-5 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-[11px] text-gray-500">
                Step {currentIndex + 1} of {totalSteps}
              </span>
              <button
                onClick={() => saveAndFinish()}
                disabled={saving}
                className="font-body text-[11px] text-gray-500 hover:text-gray-900 transition-colors"
              >
                Skip
              </button>
            </div>
            <div className="h-[2px] bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <main className="flex-1 px-5 pt-6 pb-32">
            <div className="bg-[#F5F5F7] rounded-[40px] p-5 sm:p-6">
              <h1 className="text-gray-900 font-body font-semibold text-[18px] leading-snug mb-1.5">
                {config.question}
              </h1>
              <p className="text-gray-600 font-body text-[13px] leading-relaxed mb-5">
                {config.hint}
              </p>

              {step === "goals" && (
                <MultiSelectStep
                  options={GOAL_OPTIONS}
                  selected={data.goals}
                  onChange={(goals) => setData({ ...data, goals })}
                />
              )}

              {step === "moments" && (
                <MultiSelectStep
                  options={MOMENT_OPTIONS}
                  selected={data.moments}
                  onChange={(moments) => setData({ ...data, moments })}
                />
              )}

              {step === "keywords" && (
                <KeywordStep
                  selected={data.calendarKeywords}
                  suggestions={SUGGESTED_KEYWORDS}
                  onChange={(kw) => setData({ ...data, calendarKeywords: kw })}
                />
              )}
            </div>
          </main>

          {/* Bottom action bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#F5F5F7] border-t border-gray-100 px-5 py-4 flex items-center justify-between">
            {currentIndex > 0 ? (
              <button
                onClick={goBack}
                disabled={saving}
                className="font-body text-[13px] text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-30"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            <button
              onClick={goNext}
              disabled={!canContinue || saving}
              className={`px-6 py-3 rounded-full font-body text-[14px] transition-all duration-200 ${
                canContinue && !saving
                  ? "bg-[#1a1a1a] text-white hover:bg-black"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-white">
      {/* Full-width header strip */}
      <header className="bg-[#F5F5F7] px-10 py-6 flex items-center justify-between">
        <img src={areaLogo} alt="Aera" className="h-6 brightness-0" />
        <p
          className="font-body text-right"
          style={{ fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#1D1D1F" }}
        >
          Breathe. Recover. Perform.
          <br />
          <span style={{ color: "#1D1D1F" }}>In under 5 minutes.</span>
        </p>
      </header>

      {/* Body */}
      <main className="flex-1 w-full">
        <div className="max-w-[1280px] mx-auto px-10 pt-20 pb-32">
          <div className="bg-[#F5F5F7] rounded-[40px] p-16">
            <div className="flex items-start justify-between gap-8 mb-3">
              <h1 className="text-gray-900 font-body font-semibold text-[26px] leading-snug max-w-[820px]">
                {config.question}
              </h1>
              <div className="flex items-center gap-4 shrink-0 pt-2">
                <span className="font-body text-[12px] text-gray-500">
                  Step {currentIndex + 1} of {totalSteps}
                </span>
                <span className="text-gray-300">·</span>
                <button
                  onClick={() => saveAndFinish()}
                  disabled={saving}
                  className="font-body text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
            <p className="text-gray-600 font-body text-[15px] leading-relaxed mb-8">
              {config.hint}
            </p>

            {step === "goals" && (
              <MultiSelectStep
                options={GOAL_OPTIONS}
                selected={data.goals}
                onChange={(goals) => setData({ ...data, goals })}
              />
            )}

            {step === "moments" && (
              <MultiSelectStep
                options={MOMENT_OPTIONS}
                selected={data.moments}
                onChange={(moments) => setData({ ...data, moments })}
              />
            )}

            {step === "keywords" && (
              <KeywordStep
                selected={data.calendarKeywords}
                suggestions={SUGGESTED_KEYWORDS}
                onChange={(kw) => setData({ ...data, calendarKeywords: kw })}
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom action bar — full width */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F5F5F7] border-t border-gray-100 px-10 py-5 flex items-center justify-between">
        {currentIndex > 0 ? (
          <button
            onClick={goBack}
            disabled={saving}
            className="font-body text-[14px] text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-30 border border-gray-300 rounded-full px-6 py-3 bg-white"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        <button
          onClick={goNext}
          disabled={!canContinue || saving}
          className={`px-7 py-3 rounded-full font-body text-[14px] transition-all duration-200 ${
            canContinue && !saving
              ? "bg-[#1a1a1a] text-white hover:bg-black"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
