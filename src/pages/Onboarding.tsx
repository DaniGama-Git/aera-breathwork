import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import areaLogo from "@/assets/aera-logo.svg";
import homeBg from "@/assets/home-bg.png";

const steps = [
  {
    title: "What best describes you?",
    subtitle: "Role Context",
    key: "role_context",
    options: [
      { label: "I run a company", value: "run_company" },
      { label: "I lead teams", value: "lead_teams" },
      { label: "I manage up and down", value: "manage_up_down" },
      { label: "I execute independently", value: "execute_independently" },
    ],
  },
  {
    title: "Where does stress show up most?",
    subtitle: "Pressure Pattern",
    key: "pressure_pattern",
    options: [
      { label: "Back-to-back meetings", value: "back_to_back" },
      { label: "High-stakes moments", value: "high_stakes" },
      { label: "Constant context switching", value: "context_switching" },
      { label: "Long, draining days", value: "long_days" },
    ],
  },
  {
    title: "When stress hits, what happens?",
    subtitle: "Stress Response",
    key: "stress_response",
    options: [
      { label: "Mind races, can't focus", value: "mind_races" },
      { label: "Energy drops, lose sharpness", value: "energy_drops" },
      { label: "Carry tension between meetings", value: "carry_tension" },
      { label: "Push through, then crash", value: "push_through" },
    ],
  },
  {
    title: "When do you need to be at your best?",
    subtitle: "Performance Timing",
    key: "performance_timing",
    options: [
      { label: "Start of day", value: "start_of_day" },
      { label: "Before key moments", value: "before_key_moments" },
      { label: "Between meetings", value: "between_meetings" },
      { label: "End of day", value: "end_of_day" },
    ],
  },
  {
    title: "What does success look like?",
    subtitle: "Outcome Anchor",
    key: "outcome_anchor",
    options: [
      { label: "Walk into every room ready", value: "walk_in_ready" },
      { label: "Stay sharp all day", value: "stay_sharp" },
      { label: "Switch off after work", value: "switch_off" },
      { label: "Stay in control under pressure", value: "stay_in_control" },
    ],
  },
];

// Step 3 maps stress response → recommended session route
const sessionMap: Record<string, string> = {
  mind_races: "focus",
  energy_drops: "activate",
  carry_tension: "reset",
  push_through: "recover",
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const step = steps[currentStep];

  const selectOption = async (value: string) => {
    const newAnswers = { ...answers, [step.key]: value };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      // Final step — save and navigate
      setSaving(true);
      const recommendedSession = sessionMap[newAnswers.stress_response] || "activate";
      const recommendedTime = newAnswers.performance_timing || "start_of_day";

      if (user) {
        await supabase.from("onboarding_answers").upsert({
          user_id: user.id,
          role_context: newAnswers.role_context,
          pressure_pattern: newAnswers.pressure_pattern,
          stress_response: newAnswers.stress_response,
          performance_timing: newAnswers.performance_timing,
          outcome_anchor: newAnswers.outcome_anchor,
        }, { onConflict: "user_id" });

        await supabase.from("profiles").update({
          onboarding_completed: true,
          recommended_session: recommendedSession,
          recommended_time: recommendedTime,
        }).eq("user_id", user.id);
      }

      navigate(`/breathwork-session-${recommendedSession}`);
    }
  };

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Background from home screen */}
      <img src={homeBg} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center justify-between">
          <img src={areaLogo} alt="Aera" className="h-6" />
          <span className="text-white/30 font-display text-xs">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="px-6 mb-10">
          <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 flex flex-col">
          <h1 className="text-white font-body font-semibold text-[28px] leading-tight mb-10">
            {step.title}
          </h1>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {step.options.map((option) => {
            const isSelected = answers[step.key] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => selectOption(option.value)}
                disabled={saving}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 font-body text-[15px] ${
                  isSelected
                    ? "border-white bg-white/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Back button */}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-auto mb-10 text-white/30 text-sm font-body hover:text-white/50 transition-colors self-center"
          >
            Go back
          </button>
        )}
      </div>
      </div>
    </div>
  );
};

export default Onboarding;
