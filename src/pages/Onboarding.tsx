import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import areaLogo from "@/assets/aera-logo.svg";
import homeBg from "@/assets/home-bg.webp";
import BreatheDots from "@/components/BreatheDots";
import OnboardingStep from "@/components/onboarding/OnboardingStep";
import MultiSelectStep from "@/components/onboarding/MultiSelectStep";
import KeywordStep from "@/components/onboarding/KeywordStep";
import SingleSelectStep from "@/components/onboarding/SingleSelectStep";
import ClosingMessage from "@/components/onboarding/ClosingMessage";

interface OnboardingData {
  goals: string[];
  moments: string[];
  calendarKeywords: string[];
  scheduledEnabled: boolean;
  scheduledPractice: string;
  scheduledLength: string;
  scheduledTimes: string[];
  scheduledFrequency: string;
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

const PRACTICE_OPTIONS = [
  { label: "Perform", value: "perform" },
  { label: "Energize", value: "energize" },
  { label: "Recover", value: "recover" },
];

const LENGTH_OPTIONS = [
  { label: "Under 3 min", value: "under_3" },
  { label: "3–5 min", value: "3_to_5" },
  { label: "Up to 10 min", value: "up_to_10" },
];

const TIME_OPTIONS = [
  { label: "Morning", value: "morning" },
  { label: "Midday", value: "midday" },
  { label: "Evening", value: "evening" },
];

const FREQUENCY_OPTIONS = [
  { label: "1x per day", value: "1x" },
  { label: "2x per day", value: "2x" },
  { label: "3x per day", value: "3x" },
];

type Step = "goals" | "moments" | "keywords" | "scheduled_ask" | "scheduled_practice" | "scheduled_length" | "scheduled_times" | "scheduled_frequency" | "closing";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("goals");
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    moments: [],
    calendarKeywords: [],
    scheduledEnabled: false,
    scheduledPractice: "",
    scheduledLength: "",
    scheduledTimes: [],
    scheduledFrequency: "",
  });

  const stepOrder: Step[] = [
    "goals", "moments", "keywords", "scheduled_ask",
    "scheduled_practice", "scheduled_length", "scheduled_times", "scheduled_frequency",
    "closing",
  ];

  const currentIndex = stepOrder.indexOf(step);
  const totalVisualSteps = data.scheduledEnabled ? 8 : 4;
  const visualIndex = (() => {
    const map: Record<Step, number> = {
      goals: 1, moments: 2, keywords: 3, scheduled_ask: 4,
      scheduled_practice: 5, scheduled_length: 6, scheduled_times: 7, scheduled_frequency: 8,
      closing: totalVisualSteps,
    };
    return map[step] || 1;
  })();

  const goBack = () => {
    if (step === "closing" && !data.scheduledEnabled) {
      setStep("scheduled_ask");
    } else if (currentIndex > 0) {
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
          scheduled_enabled: data.scheduledEnabled,
          scheduled_practice: data.scheduledPractice || null,
          scheduled_length: data.scheduledLength || null,
          scheduled_times: data.scheduledTimes,
          scheduled_frequency: data.scheduledFrequency || null,
        }, { onConflict: "user_id" });

      if (prefError) throw prefError;

      // Mark onboarding complete
      const { data: existing } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", user.id);
      } else {
        await supabase.from("profiles").insert({ user_id: user.id, onboarding_completed: true });
      }

      navigate("/menu", { replace: true });
    } catch (err) {
      console.error("Failed to save onboarding:", err);
      setSaving(false);
    }
  };

  const canGoBack = step !== "goals" && step !== "closing";

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      <img src={homeBg} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[560px] mx-auto w-full">
        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center justify-between">
          <img src={areaLogo} alt="Aera" className="h-6" />
          {step !== "closing" && (
            <span className="text-white/30 font-body text-xs">
              {visualIndex} / {totalVisualSteps}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {step !== "closing" && (
          <div className="px-6 mb-8">
            <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(visualIndex / totalVisualSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

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
                onContinue={() => setStep("scheduled_ask")}
              />
            </OnboardingStep>
          )}

          {step === "scheduled_ask" && (
            <OnboardingStep
              title="Part 2 — Scheduled Sessions"
              subtitle="This is optional. āera is moment-based by design — scheduled sessions are not the core experience. The default is off."
            >
              <SingleSelectStep
                question="Would you like scheduled sessions throughout your day as well?"
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No — moment-based only", value: "no" },
                ]}
                selected={data.scheduledEnabled ? "yes" : "no"}
                onChange={(val) => {
                  const enabled = val === "yes";
                  setData({ ...data, scheduledEnabled: enabled });
                  setTimeout(() => {
                    setStep(enabled ? "scheduled_practice" : "closing");
                  }, 300);
                }}
                autoAdvance
              />
            </OnboardingStep>
          )}

          {step === "scheduled_practice" && (
            <OnboardingStep>
              <SingleSelectStep
                question="Which practice would you like for your scheduled sessions?"
                note="Ground sessions are available in the āera app only and are not part of the scheduled extension experience."
                options={PRACTICE_OPTIONS}
                selected={data.scheduledPractice}
                onChange={(val) => {
                  setData({ ...data, scheduledPractice: val });
                  setTimeout(() => setStep("scheduled_length"), 300);
                }}
                autoAdvance
              />
            </OnboardingStep>
          )}

          {step === "scheduled_length" && (
            <OnboardingStep>
              <SingleSelectStep
                question="What's your preferred session length?"
                options={LENGTH_OPTIONS}
                selected={data.scheduledLength}
                onChange={(val) => {
                  setData({ ...data, scheduledLength: val });
                  setTimeout(() => setStep("scheduled_times"), 300);
                }}
                autoAdvance
              />
            </OnboardingStep>
          )}

          {step === "scheduled_times" && (
            <OnboardingStep>
              <MultiSelectStep
                question="When would you like them?"
                options={TIME_OPTIONS}
                selected={data.scheduledTimes}
                onChange={(times) => setData({ ...data, scheduledTimes: times })}
                onContinue={() => setStep("scheduled_frequency")}
              />
            </OnboardingStep>
          )}

          {step === "scheduled_frequency" && (
            <OnboardingStep>
              <SingleSelectStep
                question="How often?"
                options={FREQUENCY_OPTIONS}
                selected={data.scheduledFrequency}
                onChange={(val) => {
                  setData({ ...data, scheduledFrequency: val });
                  setTimeout(() => setStep("closing"), 300);
                }}
                autoAdvance
              />
            </OnboardingStep>
          )}

          {step === "closing" && (
            <ClosingMessage
              data={data}
              saving={saving}
              onFinish={saveAndFinish}
            />
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
