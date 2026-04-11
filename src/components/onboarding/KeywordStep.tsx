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
      <h1 className="text-gray-900 font-body font-semibold text-[22px] leading-tight mb-3">
        In which specific meetings would you like to receive a quick reset?
      </h1>
      <p className="text-gray-600 font-body text-[14px] leading-relaxed mb-8">
        āera delivers a session timed to the moment. Select as many as you want — or add your own.
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
                  ? "border-gray-900 bg-gray-900/15 text-gray-900"
                  : "border-gray-400/50 bg-white/40 text-gray-600 hover:border-gray-500 hover:text-gray-800"
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
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-400/40 bg-white/40 text-gray-900 font-body text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
        />
        {custom.trim() && (
          <button
            onClick={addCustom}
            className="px-4 py-3 rounded-2xl border border-gray-400/40 bg-white/40 text-gray-600 font-body text-[14px] hover:bg-white/60 transition-colors"
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
                className="px-4 py-2 rounded-full border border-gray-900 bg-gray-900/10 text-gray-900 font-body text-[14px] transition-all duration-200"
              >
                {kw} ×
              </button>
            ))}
        </div>
      )}

      {selected.length > 0 && (
        <button
          onClick={onContinue}
          className="mt-6 self-center text-gray-600 font-body text-[14px] underline underline-offset-4 decoration-gray-400 transition-all duration-300 hover:text-gray-900 hover:decoration-gray-600"
        >
          Continue →
        </button>
      )}
    </div>
  );
};

export default KeywordStep;
