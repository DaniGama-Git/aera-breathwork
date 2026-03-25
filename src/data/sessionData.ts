import categoryActivate from "@/assets/category-activate.webp";
import categoryReset from "@/assets/category-reset.webp";
import categoryFocus from "@/assets/category-focus.webp";
import categoryRecover from "@/assets/category-recover.webp";

export interface SessionItem {
  title: string;
  description: string;
  duration: string;
}

export interface CategoryConfig {
  label: string;
  image: string;
  sessionRoute: string;
  sessions: SessionItem[];
}

export const categoryConfig: Record<string, CategoryConfig> = {
  activate: {
    label: "Activate",
    image: categoryActivate,
    sessionRoute: "/breathwork-session-activate",
    sessions: [
      { title: "Morning Ignition", description: "Kickstart your day with energy.", duration: "5 mins" },
      { title: "Afternoon Boost", description: "Counter the afternoon energy dip.", duration: "5 mins" },
      { title: "Pre-Workout Primer", description: "Activate your nervous system before training.", duration: "3 mins" },
      { title: "Cold Exposure Prep", description: "Build heat before cold immersion.", duration: "4 mins" },
      { title: "Presentation Power-Up", description: "Energize before a big moment.", duration: "3 mins" },
      { title: "Creative Spark", description: "Break through mental blocks.", duration: "6 mins" },
    ],
  },
  reset: {
    label: "Reset",
    image: categoryReset,
    sessionRoute: "/breathwork-session-reset",
    sessions: [
      { title: "Performance Reset", description: "Clear your head between tasks.", duration: "5 mins" },
      { title: "Meeting Recovery", description: "Reset after back-to-back meetings.", duration: "3 mins" },
      { title: "Midday Reboot", description: "Hit the reset button on your nervous system.", duration: "5 mins" },
      { title: "Context Switching", description: "Smoothly transition between work modes.", duration: "4 mins" },
      { title: "Stress Flush", description: "Rapidly clear accumulated tension.", duration: "3 mins" },
      { title: "Travel Reset", description: "Recalibrate after long commutes or flights.", duration: "7 mins" },
      { title: "Weekend Transition", description: "Shift from work mode to rest mode.", duration: "5 mins" },
    ],
  },
  focus: {
    label: "Focus",
    image: categoryFocus,
    sessionRoute: "/breathwork-session-focus",
    sessions: [
      { title: "Focus Activation", description: "Calm down before you walk in.", duration: "5 mins" },
      { title: "Deep Work Entry", description: "Drop into sustained concentration.", duration: "4 mins" },
      { title: "Pre-Call Clarity", description: "Sharpen your mind before an important call.", duration: "3 mins" },
      { title: "Study Session", description: "Optimize your brain for learning.", duration: "5 mins" },
      { title: "Decision Making", description: "Clear the noise for better judgment.", duration: "4 mins" },
      { title: "Flow State Primer", description: "Set the conditions for peak flow.", duration: "6 mins" },
    ],
  },
  recover: {
    label: "Recover",
    image: categoryRecover,
    sessionRoute: "/breathwork-session-recover",
    sessions: [
      { title: "Deep Decompression", description: "Wind down after an intense day.", duration: "10 mins" },
      { title: "Evening Unwind", description: "Transition into a restful evening.", duration: "8 mins" },
      { title: "Post-Workout Recovery", description: "Accelerate your body's recovery.", duration: "6 mins" },
      { title: "Sleep Preparation", description: "Prime your nervous system for deep sleep.", duration: "10 mins" },
      { title: "Burnout Prevention", description: "Restore when you're running on empty.", duration: "12 mins" },
      { title: "Weekend Recharge", description: "Deep nervous system restoration.", duration: "15 mins" },
    ],
  },
};
