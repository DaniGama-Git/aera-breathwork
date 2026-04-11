interface Option {
  label: string;
  value: string;
}

interface Props {
  question: string;
  hint?: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onContinue: () => void;
}

const MultiSelectStep = ({ question, hint, options, selected, onChange, onContinue }: Props) => {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-gray-900 font-body font-semibold text-[22px] leading-tight mb-3">
        {question}
      </h1>
      {hint && (
        <p className="text-gray-600 font-body text-[14px] leading-relaxed mb-8">
          {hint}
        </p>
      )}
      {!hint && <div className="mb-7" />}

      <div className="flex flex-col gap-3">
        {options.map((option, i) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => toggle(option.value)}
              className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 font-body text-[15px] ${
                isSelected
                  ? "border-gray-900 bg-gray-900/10 text-gray-900"
                  : "border-gray-400/40 bg-white/40 text-gray-700 hover:border-gray-500 hover:bg-white/60"
              }`}
            >
              <span className="text-gray-400 mr-3">{i + 1}.</span>
              {option.label}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <button
          onClick={onContinue}
          className="mt-8 self-center text-gray-600 font-body text-[14px] underline underline-offset-4 decoration-gray-400 transition-all duration-300 hover:text-gray-900 hover:decoration-gray-600"
        >
          Continue →
        </button>
      )}
    </div>
  );
};

export default MultiSelectStep;
