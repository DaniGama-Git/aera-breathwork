import categoryActivate from "@/assets/category-activate.webp";
import categoryReset from "@/assets/category-reset.webp";
import categoryFocus from "@/assets/category-focus.webp";
import categoryRecover from "@/assets/category-recover.webp";

export const ARCHETYPE_DISPLAY: Record<string, string> = {
  pack_animal: "Pack Animal",
  deep_worker: "Deep Worker",
  anticipator: "Anticipator",
  sprinter: "Sprinter",
};

export const CATEGORY_DISPLAY: Record<string, string> = {
  activate: "Activate",
  focus: "Focus",
  reset: "Reset",
  recover: "Recover",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  activate: categoryActivate,
  focus: categoryFocus,
  reset: categoryReset,
  recover: categoryRecover,
};

export const TIME_DISPLAY: Record<string, string> = {
  start_of_day: "Start of day",
  before_key_moments: "Before key moments",
  between_meetings: "Between meetings",
  end_of_day: "End of day",
};

export const SESSION_ROUTES: Record<string, string> = {
  activate: "/breathwork-session-activate",
  focus: "/breathwork-session-focus",
  reset: "/breathwork-session-reset",
  recover: "/breathwork-session-recover",
};
