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
      { title: "Pre-Negotiation", description: "Settle your nerves before a tough conversation.", duration: "5 mins", slug: "pre-negotiation", audioSrc: "/audio/pre-negotiation-voiced.mp3" },
      { title: "Decision Clarity", description: "Cut through the noise to decide clearly.", duration: "5 mins", slug: "decision-clarity", audioSrc: "/audio/decision-clarity-voiced.mp3" },
      { title: "Pre-Meeting", description: "Arrive centered and fully present.", duration: "5 mins", slug: "pre-meeting", audioSrc: "/audio/pre-meeting-voiced.mp3" },
      { title: "Creative Flow", description: "Open up before creative deep work.", duration: "5 mins", slug: "creative-flow" },
      { title: "Deep Focus", description: "Drop into deep concentration.", duration: "5 mins", slug: "deep-focus", audioSrc: "/audio/focus-activation.mp3" },
    ],
  },
  activate: {
    label: "Activate",
    image: categoryActivate,
    gradient: activateGradient,
    icon: activateIcon,
    sessions: [
      { title: "Wake Me Up", description: "Kickstart your day with energy.", duration: "5 mins", slug: "wake-me-up", audioSrc: "/audio/morning-activation.mp3" },
      { title: "Energy Reset", description: "Counter the afternoon energy dip.", duration: "5 mins", slug: "energy-reset", audioSrc: "/audio/mid-day-energy-boost.mp3" },
    ],
  },
  recover: {
    label: "Recover",
    image: categoryRecover,
    gradient: recoverGradient,
    icon: recoverIcon,
    sessions: [
      { title: "Back-to-Back", description: "Reset between consecutive meetings.", duration: "5 mins", slug: "back-to-back", audioSrc: "/audio/back-to-back-recharge.mp3" },
      { title: "Rebound", description: "Process and bounce back emotionally.", duration: "5 mins", slug: "rebound", audioSrc: "/audio/post-setback-recovery.mp3" },
      { title: "Context Switch", description: "Smoothly transition between work modes.", duration: "5 mins", slug: "context-switch", audioSrc: "/audio/context-switching.mp3" },
      { title: "Quick Recovery", description: "Decompress after an intense meeting.", duration: "5 mins", slug: "quick-recovery", audioSrc: "/audio/post-meeting-reset.mp3" },
      { title: "Anxiety Reset", description: "Rapid relief when stress peaks.", duration: "3 mins", slug: "anxiety-reset", audioSrc: "/audio/stress-anxiety-sos.mp3" },
      { title: "Conflict Reset", description: "Calm down after a heated exchange.", duration: "5 mins", slug: "conflict-reset", audioSrc: "/audio/conflict-de-escalation.mp3" },
    ],
  },
  ground: {
    label: "Ground",
    image: categoryReset,
    gradient: resetGradient,
    icon: resetIcon,
    sessions: [
      { title: "Wind Down", description: "Wind down after an intense day.", duration: "10 mins", slug: "wind-down", audioSrc: "/audio/wind-down.mp3" },
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
