import { useState } from "react";

interface Props {
  selected: string[];
  suggestions: string[];
  onChange: (keywords: string[]) => void;
  onContinue: () => void;
}

const KeywordStep = ({ selected, suggestions, onChange, onContinue }: Props) => {
  const [custom, setCustom] = useState("");

  const toggle = (keyword: string) => {
    onChange(
      selected.includes(keyword)
        ? selected.filter((k) => k !== keyword)
        : [...selected, keyword]
    );
  };

  const addCustom = () => {
    const trimmed = custom.trim().toLowerCase();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustom("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-white font-body font-semibold text-[22px] leading-tight mb-3">
        What words typically appear in your most important calendar events?
      </h1>
      <p className="text-white font-body text-[14px] leading-relaxed mb-8">
        This is the precision layer — āera will watch for these exact words in your calendar. Select as many as feel right, or add your own.
      </p>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {suggestions.map((kw) => {
          const isSelected = selected.includes(kw);
          return (
            <button
              key={kw}
              onClick={() => toggle(kw)}
              className={`px-4 py-2 rounded-full border transition-all duration-200 font-body text-[14px] ${
                isSelected
                  ? "border-white bg-white/10 text-white"
                  : "border-white/15 bg-white/[0.05] text-white/60 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {kw}
            </button>
          );
        })}
      </div>

      {/* Custom keyword input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a custom keyword"
          className="flex-1 px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-body text-[14px] placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
        />
        {custom.trim() && (
          <button
            onClick={addCustom}
            className="px-4 py-3 rounded-2xl border border-white/20 bg-white/[0.06] text-white/70 font-body text-[14px] hover:bg-white/10 transition-colors"
          >
            Add
          </button>
        )}
      </div>

      {/* Custom keywords display */}
      {selected.filter((k) => !suggestions.includes(k)).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected
            .filter((k) => !suggestions.includes(k))
            .map((kw) => (
              <button
                key={kw}
                onClick={() => toggle(kw)}
                className="px-4 py-2 rounded-full border border-white bg-white/10 text-white font-body text-[14px] transition-all duration-200"
              >
                {kw} ×
              </button>
            ))}
        </div>
      )}

      {selected.length > 0 && (
        <button
          onClick={onContinue}
          className="mt-6 self-center text-white/60 font-body text-[14px] underline underline-offset-4 decoration-white/30 transition-all duration-300 hover:text-white/90 hover:decoration-white/60"
        >
          Continue →
        </button>
      )}
    </div>
  );
};

export default KeywordStep;
