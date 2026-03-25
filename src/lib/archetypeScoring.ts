/**
 * Stress Archetype Scoring System
 *
 * All 5 onboarding questions contribute weighted points toward four categories:
 * Activate, Focus, Reset, Recover. The highest-scoring category determines
 * the user's archetype and recommended breathwork session.
 *
 * Q1 (Role Context)      – Sets base frequency + baseline intensity points
 * Q2 (Pressure Pattern)   – Primary category driver (weight: 3)
 * Q3 (Stress Response)    – Physiological reinforcement (weight: 3)
 * Q4 (Performance Timing) – Sets recommended_time + minor category lean
 * Q5 (Outcome Anchor)     – Tiebreaker / goal alignment (weight: 1–2)
 */

type Scores = { activate: number; focus: number; reset: number; recover: number };

const SCORE_MAPS: Record<string, Record<string, Partial<Scores>>> = {
  role_context: {
    run_company:            { activate: 2, recover: 1 },
    lead_teams:             { activate: 1, reset: 1 },
    manage_up_down:         { focus: 1, reset: 1 },
    execute_independently:  { focus: 2 },
  },
  pressure_pattern: {
    back_to_back:     { activate: 3, reset: 1 },
    high_stakes:      { focus: 1, reset: 3 },
    context_switching: { focus: 3, recover: 1 },
    long_days:        { recover: 3 },
  },
  stress_response: {
    mind_races:    { focus: 3, reset: 1 },
    energy_drops:  { activate: 3, recover: 1 },
    carry_tension: { reset: 3 },
    push_through:  { recover: 3 },
  },
  performance_timing: {
    start_of_day:      { activate: 1, focus: 1 },
    before_key_moments: { focus: 1, reset: 1 },
    between_meetings:  { reset: 1, recover: 1 },
    end_of_day:        { recover: 2 },
  },
  outcome_anchor: {
    walk_in_ready:    { activate: 1, focus: 1 },
    stay_sharp:       { activate: 1, focus: 1 },
    switch_off:       { recover: 2 },
    stay_in_control:  { reset: 2 },
  },
};

const BASE_FREQUENCY: Record<string, number> = {
  run_company: 5,
  lead_teams: 4,
  manage_up_down: 4,
  execute_independently: 3,
};

const FREQUENCY_BOOST_PATTERNS = new Set(["back_to_back", "long_days"]);

const ARCHETYPE_MAP: Record<string, string> = {
  activate: "pack_animal",
  focus: "deep_worker",
  reset: "anticipator",
  recover: "sprinter",
};

export interface ArchetypeResult {
  archetype: string;          // e.g. "pack_animal"
  recommendedSession: string; // e.g. "activate"
  recommendedFrequency: number;
  recommendedTime: string;
}

export function deriveArchetype(answers: Record<string, string>): ArchetypeResult {
  const scores: Scores = { activate: 0, focus: 0, reset: 0, recover: 0 };

  // Tally points from all 5 questions
  for (const [questionKey, answerValue] of Object.entries(answers)) {
    const questionMap = SCORE_MAPS[questionKey];
    if (!questionMap) continue;
    const points = questionMap[answerValue];
    if (!points) continue;
    for (const [cat, pts] of Object.entries(points)) {
      scores[cat as keyof Scores] += pts as number;
    }
  }

  // Determine winning category (tiebreak order: reset > focus > activate > recover)
  const tiebreakOrder: (keyof Scores)[] = ["reset", "focus", "activate", "recover"];
  let winner: keyof Scores = "activate";
  let maxScore = -1;
  for (const cat of tiebreakOrder) {
    if (scores[cat] > maxScore) {
      maxScore = scores[cat];
      winner = cat;
    }
  }

  // Compute frequency
  const base = BASE_FREQUENCY[answers.role_context] ?? 3;
  const boost = FREQUENCY_BOOST_PATTERNS.has(answers.pressure_pattern) ? 1 : 0;
  const recommendedFrequency = Math.min(base + boost, 7);

  return {
    archetype: ARCHETYPE_MAP[winner],
    recommendedSession: winner,
    recommendedFrequency,
    recommendedTime: answers.performance_timing || "start_of_day",
  };
}
