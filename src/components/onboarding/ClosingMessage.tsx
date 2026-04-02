import BreatheDots from "@/components/BreatheDots";

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

interface Props {
  data: OnboardingData;
  saving: boolean;
  onFinish: () => void;
}

const TIME_LABELS: Record<string, string> = {
  morning: "morning",
  midday: "midday",
  evening: "evening",
};

const ClosingMessage = ({ data, saving, onFinish }: Props) => {
  const scheduleDescription = data.scheduledEnabled
    ? `${data.scheduledFrequency?.replace("x", "x per day")}, ${data.scheduledTimes.map((t) => TIME_LABELS[t] || t).join(" and ")}`
    : null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center animate-in fade-in duration-500">
      <h1 className="text-white font-body font-semibold text-[28px] leading-tight mb-6">
        āera is ready for you.
      </h1>

      <div className="max-w-[360px] space-y-4">
        <p className="text-white/60 font-body text-[15px] leading-relaxed">
          Moment-based sessions will surface via the Chrome extension before and between the calendar moments you selected.
        </p>

        {scheduleDescription && (
          <p className="text-white/60 font-body text-[15px] leading-relaxed">
            Your scheduled sessions are set to {scheduleDescription}.
          </p>
        )}

        <p className="text-white/60 font-body text-[15px] leading-relaxed">
          Three sessions — Conflict Reset, Performance Reset, and Post-Setback Reset — are always available by clicking the āera icon, for moments your calendar can't predict.
        </p>

        <p className="text-white/60 font-body text-[15px] leading-relaxed">
          Ground sessions like Evening Decompression, Deep Decompression, and Travel Reset live in the āera app, whenever you're ready to close your day.
        </p>
      </div>

      <button
        onClick={onFinish}
        disabled={saving}
        className="mt-10 w-full max-w-[320px] py-4 rounded-2xl bg-white text-[#1D1D1C] font-body font-semibold text-[15px] transition-all duration-200 hover:bg-white/90 active:scale-[0.98] disabled:opacity-50"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <BreatheDots className="w-4 h-4" />
            Setting up…
          </span>
        ) : (
          "Enter āera →"
        )}
      </button>
    </div>
  );
};

export default ClosingMessage;
