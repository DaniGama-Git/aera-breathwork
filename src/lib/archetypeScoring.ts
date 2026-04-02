/**
 * Stress Archetype Scoring System
 *
 * Categories: perform, recover, focus, activate, ground
 */

type Scores = { perform: number; recover: number; focus: number; activate: number; ground: number };

const SCORE_MAPS: Record<string, Record<string, Partial<Scores>>> = {
  role_context: {
    run_company:            { activate: 2, recover: 1 },
    lead_teams:             { activate: 1, perform: 1 },
    manage_up_down:         { perform: 1, focus: 1 },
    execute_independently:  { focus: 2 },
  },
  pressure_pattern: {
    back_to_back:      { activate: 3, recover: 1 },
    high_stakes:       { perform: 3, focus: 1 },
    context_switching:  { recover: 3, focus: 1 },
    long_days:         { ground: 3 },
  },
  stress_response: {
    mind_races:    { focus: 3, perform: 1 },
    energy_drops:  { activate: 3, recover: 1 },
    carry_tension: { ground: 3 },
    push_through:  { recover: 3 },
  },
  performance_timing: {
    start_of_day:       { activate: 1, focus: 1 },
    before_key_moments: { perform: 1, focus: 1 },
    between_meetings:   { recover: 1, ground: 1 },
    end_of_day:         { ground: 2 },
  },
  outcome_anchor: {
    walk_in_ready:    { perform: 1, focus: 1 },
    stay_sharp:       { activate: 1, focus: 1 },
    switch_off:       { ground: 2 },
    stay_in_control:  { perform: 2 },
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
  perform: "deep_worker",
  recover: "sprinter",
  focus: "anticipator",
  activate: "pack_animal",
  ground: "sprinter",
};

export interface ArchetypeResult {
  archetype: string;
  recommendedSession: string;
  recommendedFrequency: number;
  recommendedTime: string;
}

export function deriveArchetype(answers: Record<string, string>): ArchetypeResult {
  const scores: Scores = { perform: 0, recover: 0, focus: 0, activate: 0, ground: 0 };

  for (const [questionKey, answerValue] of Object.entries(answers)) {
    const questionMap = SCORE_MAPS[questionKey];
    if (!questionMap) continue;
    const points = questionMap[answerValue];
    if (!points) continue;
    for (const [cat, pts] of Object.entries(points)) {
      scores[cat as keyof Scores] += pts as number;
    }
  }

  const tiebreakOrder: (keyof Scores)[] = ["perform", "focus", "activate", "recover", "ground"];
  let winner: keyof Scores = "perform";
  let maxScore = -1;
  for (const cat of tiebreakOrder) {
    if (scores[cat] > maxScore) {
      maxScore = scores[cat];
      winner = cat;
    }
  }

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
