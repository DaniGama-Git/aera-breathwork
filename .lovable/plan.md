

## Stress Archetype Scoring System (Implemented)

All 5 onboarding questions now contribute weighted points to determine the user's archetype, recommended session, and weekly frequency.

### Scoring logic: `src/lib/archetypeScoring.ts`

| Question | Answer | Activate | Focus | Reset | Recover |
|---|---|:---:|:---:|:---:|:---:|
| **Q1: Role** | run_company | +2 | 0 | 0 | +1 |
| | lead_teams | +1 | 0 | +1 | 0 |
| | manage_up_down | 0 | +1 | +1 | 0 |
| | execute_independently | 0 | +2 | 0 | 0 |
| **Q2: Pressure** | back_to_back | +3 | 0 | +1 | 0 |
| | high_stakes | 0 | +1 | +3 | 0 |
| | context_switching | 0 | +3 | 0 | +1 |
| | long_days | 0 | 0 | 0 | +3 |
| **Q3: Stress Response** | mind_races | 0 | +3 | +1 | 0 |
| | energy_drops | +3 | 0 | 0 | +1 |
| | carry_tension | 0 | 0 | +3 | 0 |
| | push_through | 0 | 0 | 0 | +3 |
| **Q4: Timing** | start_of_day | +1 | +1 | 0 | 0 |
| | before_key_moments | 0 | +1 | +1 | 0 |
| | between_meetings | 0 | 0 | +1 | +1 |
| | end_of_day | 0 | 0 | 0 | +2 |
| **Q5: Outcome** | walk_in_ready | +1 | +1 | 0 | 0 |
| | stay_sharp | +1 | +1 | 0 | 0 |
| | switch_off | 0 | 0 | 0 | +2 |
| | stay_in_control | 0 | 0 | +2 | 0 |

### Archetypes

| Winner | Archetype | Session |
|---|---|---|
| Activate | Pack Animal | activate |
| Focus | Deep Worker | focus |
| Reset | Anticipator | reset |
| Recover | Sprinter | recover |

### Frequency

Base from Q1: run_company=5, lead_teams=4, manage_up_down=4, execute_independently=3. +1 if Q2 is back_to_back or long_days. Capped at 7.

### Database columns added to `profiles`

- `stress_archetype` (text, nullable)
- `recommended_frequency` (integer, nullable)
