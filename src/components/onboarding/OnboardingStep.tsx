import { ReactNode } from "react";

interface Props {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

const OnboardingStep = ({ title, subtitle, children }: Props) => (
  <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
    {title && (
      <p className="text-white/30 font-body text-[12px] uppercase tracking-widest mb-4">
        {title}
      </p>
    )}
    {subtitle && (
      <p className="text-white/40 font-body text-[14px] leading-relaxed mb-6">
        {subtitle}
      </p>
    )}
    {children}
  </div>
);

export default OnboardingStep;
