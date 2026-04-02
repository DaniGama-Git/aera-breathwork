import categoryActivate from "@/assets/category-activate.webp";
import categoryRecover from "@/assets/category-recover.webp";
import categoryFocus from "@/assets/category-focus.webp";
import categoryReset from "@/assets/category-reset.webp";

// Visual config per category (gradient bg, icon, category card image)
import activateGradient from "@/assets/activate-gradient-v2.webp";
import focusGradient from "@/assets/focus-gradient-v2.webp";
import resetGradient from "@/assets/reset-gradient-v2.webp";
import recoverGradient from "@/assets/recover-gradient-v2.webp";
import activateIcon from "@/assets/activate-icon.svg";
import focusIcon from "@/assets/focus-icon.svg";
import resetIcon from "@/assets/reset-icon.svg";
import recoverIcon from "@/assets/recover-icon.svg";

export interface SessionItem {
  title: string;
  description: string;
  duration: string;
  slug: string;
  audioSrc?: string;
}

export interface CategoryConfig {
  label: string;
  image: string;
  gradient: string;
  icon: string;
  sessions: SessionItem[];
}

export const categoryConfig: Record<string, CategoryConfig> = {
  perform: {
    label: "Perform",
    image: categoryFocus,
    gradient: focusGradient,
    icon: focusIcon,
    sessions: [
      { title: "Pre-Pitch", description: "Ground yourself before the big moment.", slug: "pre-pitch", audioSrc: "/audio/pre-pitch-grounding.mp3" },
      { title: "Pre-Negotiation", description: "Settle your nerves before a tough conversation.", slug: "pre-negotiation", audioSrc: "/audio/pre-negotiation.mp3" },
      { title: "Decision Clarity", description: "Cut through the noise to decide clearly.", slug: "decision-clarity", audioSrc: "/audio/decision-clarity.mp3" },
      { title: "Pre-Meeting", description: "Arrive centered and fully present.", slug: "pre-meeting", audioSrc: "/audio/pre-meeting.mp3" },
      { title: "Pre-Creative Work", description: "Open up before creative deep work.", slug: "pre-creative-work" },
    ],
  },
  recover: {
    label: "Recover",
    image: categoryRecover,
    gradient: recoverGradient,
    icon: recoverIcon,
    sessions: [
      { title: "Back-To-Back Recharge", description: "Reset between consecutive meetings.", slug: "back-to-back-recharge", audioSrc: "/audio/back-to-back-recharge.mp3" },
      { title: "Post-Setback Recovery", description: "Process and bounce back emotionally.", slug: "post-setback-recovery", audioSrc: "/audio/post-setback-recovery.mp3" },
      { title: "Context Switch", description: "Smoothly transition between work modes.", slug: "context-switch" },
      { title: "Post-Meeting Reset", description: "Decompress after an intense meeting.", slug: "post-meeting-reset" },
      { title: "Stress/Anxiety SOS", description: "Rapid relief when stress peaks.", slug: "stress-anxiety-sos" },
      { title: "Conflict De-escalation", description: "Calm down after a heated exchange.", slug: "conflict-de-escalation", audioSrc: "/audio/conflict-de-escalation.mp3" },
    ],
  },
  focus: {
    label: "Focus",
    image: categoryFocus,
    gradient: focusGradient,
    icon: focusIcon,
    sessions: [
      { title: "Focus Activation", description: "Drop into deep concentration.", slug: "focus-activation", audioSrc: "/audio/focus-activation.mp3" },
    ],
  },
  activate: {
    label: "Activate",
    image: categoryActivate,
    gradient: activateGradient,
    icon: activateIcon,
    sessions: [
      { title: "Morning Activation", description: "Kickstart your day with energy.", slug: "morning-activation", audioSrc: "/audio/morning-activation.mp3" },
      { title: "Mid-Day Energy Boost", description: "Counter the afternoon energy dip.", slug: "mid-day-energy-boost" },
    ],
  },
  ground: {
    label: "Ground",
    image: categoryReset,
    gradient: resetGradient,
    icon: resetIcon,
    sessions: [
      { title: "Evening Decompression", description: "Wind down after an intense day.", slug: "evening-decompression" },
      { title: "Travel Reset", description: "Recalibrate after long commutes or flights.", slug: "travel-reset" },
      { title: "Deep Decompression", description: "Deep nervous system restoration.", slug: "deep-decompression" },
    ],
  },
};

/** Flat lookup: slug → { session, category key, category config } */
export function findSessionBySlug(slug: string) {
  for (const [categoryKey, config] of Object.entries(categoryConfig)) {
    const session = config.sessions.find((s) => s.slug === slug);
    if (session) return { session, categoryKey, config };
  }
  return null;
}
