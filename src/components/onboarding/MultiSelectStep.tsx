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
      <h1 className="text-white font-body font-semibold text-[22px] leading-tight mb-3">
        {question}
      </h1>
      {hint && (
        <p className="text-white/40 font-body text-[14px] leading-relaxed mb-8">
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
                  ? "border-white bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-white/30 mr-3">{i + 1}.</span>
              {option.label}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <button
          onClick={onContinue}
          className="mt-8 self-center text-white/60 font-body text-[14px] underline underline-offset-4 decoration-white/30 transition-all duration-300 hover:text-white/90 hover:decoration-white/60"
        >
          Continue →
        </button>
      )}
    </div>
  );
};

export default MultiSelectStep;
