interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelectStep = ({ options, selected, onChange }: Props) => {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option, i) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => toggle(option.value)}
            className={`w-full text-left px-5 py-4 rounded-[80px] border transition-all duration-200 font-body text-[14px] ${
              isSelected
                ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
            }`}
          >
            <span className={`mr-2 ${isSelected ? "text-white" : "text-gray-900"}`}>
              {i + 1}.
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default MultiSelectStep;
