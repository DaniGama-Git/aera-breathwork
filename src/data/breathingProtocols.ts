/* ── Breathing Protocol Engine ── */

export type PhaseType = "INHALE" | "HOLD" | "EXHALE" | "HOLD_EMPTY";

export interface BreathPhase {
  type: PhaseType;
  duration: number; // ms
}

export interface ProtocolStage {
  name: string;
  method: "nose" | "mouth";
  transition?: string; // text shown before this stage starts
  cycle: BreathPhase[];
  cycles: number;
  midSetHold?: {
    afterCycle: number; // insert hold after this many cycles
    phase: BreathPhase;
  };
}

export interface Protocol {
  id: string;
  title: string;
  subtitle: string;
  duration: string; // e.g. "~3 mins"
  introText: string;
  descriptionPrimary: string;
  descriptionSecondary: string;
  stages: ProtocolStage[];
  finalSequence?: BreathPhase[]; // optional final sequence (e.g. final exhale + hold)
  finalMethod?: "nose" | "mouth";
}

export interface TimelineEntry {
  type: PhaseType | "TRANSITION";
  duration: number; // ms
  startMs: number;
  endMs: number;
  displayLabel: string;
  stageIndex: number;
  transitionText?: string;
}

const TRANSITION_DURATION = 3500;

export function buildTimeline(protocol: Protocol): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  let cursor = 0;

  protocol.stages.forEach((stage, stageIdx) => {
    // Show transition text before stages (skip first stage)
    if (stage.transition) {
      entries.push({
        type: "TRANSITION",
        duration: TRANSITION_DURATION,
        startMs: cursor,
        endMs: cursor + TRANSITION_DURATION,
        displayLabel: "",
        stageIndex: stageIdx,
        transitionText: stage.transition,
      });
      cursor += TRANSITION_DURATION;
    }

    // Build cycles, inserting mid-set hold if configured
    for (let c = 0; c < stage.cycles; c++) {
      // Insert mid-set hold after specified cycle
      if (stage.midSetHold && c === stage.midSetHold.afterCycle) {
        const hp = stage.midSetHold.phase;
        entries.push({
          type: hp.type,
          duration: hp.duration,
          startMs: cursor,
          endMs: cursor + hp.duration,
          displayLabel: "HOLD",
          stageIndex: stageIdx,
        });
        cursor += hp.duration;
      }

      for (const phase of stage.cycle) {
        const label =
          phase.type === "HOLD_EMPTY" ? "HOLD" :
          phase.type === "HOLD" ? "HOLD" :
          phase.type;

        entries.push({
          type: phase.type,
          duration: phase.duration,
          startMs: cursor,
          endMs: cursor + phase.duration,
          displayLabel: label,
          stageIndex: stageIdx,
        });
        cursor += phase.duration;
      }
    }
  });

  // Final sequence (e.g. final exhale + hold)
  if (protocol.finalSequence) {
    // Show transition if there's a stage with transition text for it
    // The final sequence transition is embedded in the last stage's transition
    for (const phase of protocol.finalSequence) {
      const label = phase.type === "HOLD_EMPTY" ? "HOLD" : phase.type;
      entries.push({
        type: phase.type,
        duration: phase.duration,
        startMs: cursor,
        endMs: cursor + phase.duration,
        displayLabel: label,
        stageIndex: protocol.stages.length,
      });
      cursor += phase.duration;
    }
  }

  return entries;
}

/* ── Bar position for a given phase type and progress (0→1) ── */
const BAR_TOP = 10;
const BAR_BOTTOM = 92;

export function getBarPosition(
  type: PhaseType | "TRANSITION",
  progress: number,
  prevType?: PhaseType | "TRANSITION"
): number {
  switch (type) {
    case "INHALE":
      // bottom → top
      return BAR_BOTTOM - progress * (BAR_BOTTOM - BAR_TOP);
    case "EXHALE":
      // top → bottom
      return BAR_TOP + progress * (BAR_BOTTOM - BAR_TOP);
    case "HOLD":
      // stay at top (after inhale)
      return BAR_TOP;
    case "HOLD_EMPTY":
      // stay at bottom (after exhale)
      return BAR_BOTTOM;
    case "TRANSITION":
      // keep at last position — default to bottom
      return prevType === "INHALE" || prevType === "HOLD" ? BAR_TOP : BAR_BOTTOM;
    default:
      return BAR_BOTTOM;
  }
}

/* ══════════════════════════════════════════
   PROTOCOLS
   ══════════════════════════════════════════ */

export const prePitchProtocol: Protocol = {
  id: "pre-pitch",
  title: "Pre-Pitch",
  subtitle: "~3 mins",
  duration: "~3 mins",
  introText: "You're about to step in,\nlet's get you sharp",
  descriptionPrimary: "Coherence breathing to sync your nervous system.",
  descriptionSecondary: "Extended exhales to lower cortisol and sharpen focus.",
  stages: [
    {
      name: "Coherence Breathing",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 6,
      midSetHold: {
        afterCycle: 3,
        phase: { type: "HOLD_EMPTY", duration: 6000 },
      },
    },
    {
      name: "Extended Exhale",
      method: "mouth",
      transition:
        "Let's continue with extended exhales through your mouth to deepen your parasympathetic state.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "HOLD", duration: 2000 },
        { type: "EXHALE", duration: 8000 },
      ],
      cycles: 6,
    },
    {
      name: "Final Breath Hold",
      method: "mouth",
      transition:
        "Let's go for one extended breath hold. Exhale fully, then hold to lower your heart rate.",
      cycle: [],
      cycles: 0,
    },
  ],
  finalSequence: [
    { type: "EXHALE", duration: 4000 },
    { type: "HOLD_EMPTY", duration: 8000 },
  ],
  finalMethod: "mouth",
};
