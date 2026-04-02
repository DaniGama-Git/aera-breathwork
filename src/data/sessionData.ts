import categoryActivate from "@/assets/category-activate.webp";
import categoryRecover from "@/assets/category-recover.webp";
import categoryFocus from "@/assets/category-focus.webp";
import categoryReset from "@/assets/category-reset.webp";

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
      { title: "Pre-Pitch", description: "Ground yourself before the big moment.", duration: "5 mins", slug: "pre-pitch", audioSrc: "/audio/pre-pitch-grounding.mp3" },
      { title: "Pre-Negotiation", description: "Settle your nerves before a tough conversation.", duration: "5 mins", slug: "pre-negotiation", audioSrc: "/audio/pre-negotiation.mp3" },
      { title: "Decision Clarity", description: "Cut through the noise to decide clearly.", duration: "5 mins", slug: "decision-clarity", audioSrc: "/audio/decision-clarity.mp3" },
      { title: "Pre-Meeting", description: "Arrive centered and fully present.", duration: "5 mins", slug: "pre-meeting", audioSrc: "/audio/pre-meeting.mp3" },
      { title: "Pre-Creative Work", description: "Open up before creative deep work.", duration: "5 mins", slug: "pre-creative-work" },
    ],
  },
  recover: {
    label: "Recover",
    image: categoryRecover,
    gradient: recoverGradient,
    icon: recoverIcon,
    sessions: [
      { title: "Back-To-Back Recharge", description: "Reset between consecutive meetings.", duration: "5 mins", slug: "back-to-back-recharge", audioSrc: "/audio/back-to-back-recharge.mp3" },
      { title: "Post-Setback Recovery", description: "Process and bounce back emotionally.", duration: "5 mins", slug: "post-setback-recovery", audioSrc: "/audio/post-setback-recovery.mp3" },
      { title: "Context Switch", description: "Smoothly transition between work modes.", duration: "5 mins", slug: "context-switch", audioSrc: "/audio/context-switching.mp3" },
      { title: "Post-Meeting Reset", description: "Decompress after an intense meeting.", duration: "5 mins", slug: "post-meeting-reset", audioSrc: "/audio/post-meeting-reset.mp3" },
      { title: "Stress/Anxiety SOS", description: "Rapid relief when stress peaks.", duration: "3 mins", slug: "stress-anxiety-sos", audioSrc: "/audio/stress-anxiety-sos.mp3" },
      { title: "Conflict De-escalation", description: "Calm down after a heated exchange.", duration: "5 mins", slug: "conflict-de-escalation", audioSrc: "/audio/conflict-de-escalation.mp3" },
    ],
  },
  focus: {
    label: "Focus",
    image: categoryFocus,
    gradient: focusGradient,
    icon: focusIcon,
    sessions: [
      { title: "Focus Activation", description: "Drop into deep concentration.", duration: "5 mins", slug: "focus-activation", audioSrc: "/audio/focus-activation.mp3" },
    ],
  },
  activate: {
    label: "Activate",
    image: categoryActivate,
    gradient: activateGradient,
    icon: activateIcon,
    sessions: [
      { title: "Morning Activation", description: "Kickstart your day with energy.", duration: "5 mins", slug: "morning-activation", audioSrc: "/audio/morning-activation.mp3" },
      { title: "Mid-Day Energy Boost", description: "Counter the afternoon energy dip.", duration: "5 mins", slug: "mid-day-energy-boost", audioSrc: "/audio/mid-day-energy-boost.mp3" },
    ],
  },
  ground: {
    label: "Ground",
    image: categoryReset,
    gradient: resetGradient,
    icon: resetIcon,
    sessions: [
      { title: "Evening Decompression", description: "Wind down after an intense day.", duration: "10 mins", slug: "evening-decompression" },
      { title: "Travel Reset", description: "Recalibrate after long commutes or flights.", duration: "7 mins", slug: "travel-reset" },
      { title: "Deep Decompression", description: "Deep nervous system restoration.", duration: "12 mins", slug: "deep-decompression" },
    ],
  },
};

export function findSessionBySlug(slug: string) {
  for (const [categoryKey, config] of Object.entries(categoryConfig)) {
    const session = config.sessions.find((s) => s.slug === slug);
    if (session) return { session, categoryKey, config };
  }
  return null;
}
