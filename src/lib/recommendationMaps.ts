import categoryActivate from "@/assets/category-activate.webp";
import categoryRecover from "@/assets/category-recover.webp";
import categoryFocus from "@/assets/category-focus.webp";
import categoryReset from "@/assets/category-reset.webp";

export const ARCHETYPE_DISPLAY: Record<string, string> = {
  pack_animal: "Pack Animal",
  deep_worker: "Deep Worker",
  anticipator: "Anticipator",
  sprinter: "Sprinter",
};

export const CATEGORY_DISPLAY: Record<string, string> = {
  perform: "Perform",
  activate: "Activate",
  focus: "Focus",
  recover: "Recover",
  ground: "Ground",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  perform: categoryFocus,
  activate: categoryActivate,
  focus: categoryFocus,
  recover: categoryRecover,
  ground: categoryReset,
};

export const TIME_DISPLAY: Record<string, string> = {
  start_of_day: "Start of day",
  before_key_moments: "Before key moments",
  between_meetings: "Between meetings",
  end_of_day: "End of day",
};

export const SESSION_ROUTES: Record<string, string> = {
  perform: "/session/perform/pre-pitch",
  activate: "/session/activate/morning-activation",
  focus: "/session/focus/focus-activation",
  recover: "/session/recover/back-to-back-recharge",
  ground: "/session/ground/evening-decompression",
};
