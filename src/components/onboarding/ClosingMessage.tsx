import BreatheDots from "@/components/BreatheDots";
import AddToCalendar from "@/components/AddToCalendar";

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

const PRACTICE_LABELS: Record<string, string> = {
  perform: "Perform",
  energize: "Energize",
  recover: "Recover",
};

const LENGTH_MINUTES: Record<string, number> = {
  under_3: 3,
  "3_to_5": 5,
  up_to_10: 10,
};

const FREQUENCY_COUNT: Record<string, number> = {
  "1x": 1,
  "2x": 2,
  "3x": 3,
};

const TIME_LABELS: Record<string, string> = {
  morning: "morning",
  midday: "midday",
  evening: "evening",
};

const TIME_MAP: Record<string, string> = {
  morning: "start_of_day",
  midday: "between_meetings",
  evening: "end_of_day",
};

const ClosingMessage = ({ data, saving, onFinish }: Props) => {
  const practiceLabel = PRACTICE_LABELS[data.scheduledPractice] || data.scheduledPractice;
  const durationMinutes = LENGTH_MINUTES[data.scheduledLength] || 5;
  // Always schedule across all 5 weekdays for a proper daily recurring event
  const frequency = 5;
  const recommendedTime = data.scheduledTimes.length > 0 ? TIME_MAP[data.scheduledTimes[0]] : "start_of_day";

  const scheduleDescription = data.scheduledEnabled
    ? `${data.scheduledFrequency?.replace("x", "x per day")}, ${data.scheduledTimes.map((t) => TIME_LABELS[t] || t).join(" and ")}`
    : null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center animate-in fade-in duration-500">
      <h1 className="text-white font-body font-semibold text-[28px] leading-tight mb-6">
        āera is ready for you.
      </h1>

      <div className="max-w-[360px] space-y-4">
        {scheduleDescription && (
          <p className="text-white/60 font-body text-[15px] leading-relaxed">
            Your scheduled sessions are set to {scheduleDescription}.
          </p>
        )}

        {data.scheduledEnabled && (
          <div className="pt-2 pb-2">
            <AddToCalendar
              sessionTitle={`${practiceLabel} Breathwork`}
              sessionSubtitle={`Scheduled ${practiceLabel} session`}
              sessionCategory={practiceLabel}
              durationMinutes={durationMinutes}
              recommendedFrequency={frequency}
              recommendedTime={recommendedTime}
              trigger={
                <button className="w-full max-w-[320px] py-3.5 rounded-xl text-white font-body font-semibold text-[14px] tracking-wide flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  Add Scheduled Sessions to Calendar
                </button>
              }
            />
          </div>
        )}

        <p className="text-white/40 font-body text-[13px] leading-relaxed">
          Next: set up the Chrome extension for calendar-triggered sessions.
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
          "Get the Chrome Extension →"
        )}
      </button>
    </div>
  );
};

export default ClosingMessage;
