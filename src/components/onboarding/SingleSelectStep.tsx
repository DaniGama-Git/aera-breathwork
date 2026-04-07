interface Option {
  label: string;
  value: string;
}

interface Props {
  question: string;
  note?: string;
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
  autoAdvance?: boolean;
}

const SingleSelectStep = ({ question, note, options, selected, onChange }: Props) => (
  <div className="flex flex-col">
    <h1 className="text-white font-body font-semibold text-[22px] leading-tight mb-3">
      {question}
    </h1>
    {note && (
      <p className="text-white/40 font-body text-[14px] leading-relaxed mb-8">
        {note}
      </p>
    )}
    {!note && <div className="mb-7" />}

    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
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
  </div>
);

export default SingleSelectStep;
