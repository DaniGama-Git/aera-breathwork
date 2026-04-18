import { useState } from "react";

interface Props {
  selected: string[];
  suggestions: string[];
  onChange: (keywords: string[]) => void;
}

const KeywordStep = ({ selected, suggestions, onChange }: Props) => {
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

  const customKeywords = selected.filter((k) => !suggestions.includes(k));

  return (
    <div className="flex flex-col">
      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {suggestions.map((kw) => {
          const isSelected = selected.includes(kw);
          return (
            <button
              key={kw}
              onClick={() => toggle(kw)}
              className={`px-4 py-2 rounded-[80px] border transition-all duration-200 font-body text-[13px] ${
                isSelected
                  ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
              }`}
            >
              {kw}
            </button>
          );
        })}
      </div>

      {/* Custom keyword input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a custom keyword"
          className="flex-1 px-4 py-3 rounded-[80px] border border-gray-300 bg-white text-gray-900 font-body text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
        />
        {custom.trim() && (
          <button
            onClick={addCustom}
            className="px-5 py-3 rounded-[80px] border border-gray-300 bg-white text-gray-900 font-body text-[14px] hover:bg-gray-50 transition-colors"
          >
            Add
          </button>
        )}
      </div>

      {/* Custom keywords */}
      {customKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => toggle(kw)}
              className="px-4 py-2 rounded-[80px] border border-[#1a1a1a] bg-[#1a1a1a] text-white font-body text-[13px]"
            >
              {kw} ×
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordStep;
