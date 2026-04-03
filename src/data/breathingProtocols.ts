/* ── Breathing Protocol Engine ── */

export type PhaseType = "INHALE" | "HOLD" | "EXHALE" | "HOLD_EMPTY";

export interface BreathPhase {
  type: PhaseType;
  duration: number; // ms
  label?: string; // custom display label override
}

export interface ProtocolStage {
  name: string;
  method: "nose" | "mouth";
  transition?: string; // text shown before this stage starts
  science?: string; // science note shown with lightbulb before this stage
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
  type: PhaseType | "TRANSITION" | "SCIENCE";
  duration: number; // ms
  startMs: number;
  endMs: number;
  displayLabel: string;
  stageIndex: number;
  transitionText?: string;
  scienceText?: string;
}

const TRANSITION_DURATION = 3500;
const SCIENCE_DURATION = 4500;

export function buildTimeline(protocol: Protocol): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  let cursor = 0;

  protocol.stages.forEach((stage, stageIdx) => {
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

    if (stage.science) {
      entries.push({
        type: "SCIENCE",
        duration: SCIENCE_DURATION,
        startMs: cursor,
        endMs: cursor + SCIENCE_DURATION,
        displayLabel: "",
        stageIndex: stageIdx,
        scienceText: stage.science,
      });
      cursor += SCIENCE_DURATION;
    }

    for (let c = 0; c < stage.cycles; c++) {
      if (stage.midSetHold && c === stage.midSetHold.afterCycle) {
        const hp = stage.midSetHold.phase;
        entries.push({
          type: hp.type,
          duration: hp.duration,
          startMs: cursor,
          endMs: cursor + hp.duration,
          displayLabel: hp.label || "HOLD",
          stageIndex: stageIdx,
        });
        cursor += hp.duration;
      }

      for (const phase of stage.cycle) {
        const label =
          phase.label ? phase.label :
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

  if (protocol.finalSequence) {
    for (const phase of protocol.finalSequence) {
      const label =
        phase.label ? phase.label :
        phase.type === "HOLD_EMPTY" ? "HOLD" : phase.type;
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
  type: PhaseType | "TRANSITION" | "SCIENCE",
  progress: number,
  prevType?: PhaseType | "TRANSITION" | "SCIENCE"
): number {
  switch (type) {
    case "INHALE":
      return BAR_BOTTOM - progress * (BAR_BOTTOM - BAR_TOP);
    case "EXHALE":
      return BAR_TOP + progress * (BAR_BOTTOM - BAR_TOP);
    case "HOLD":
      return BAR_TOP;
    case "HOLD_EMPTY":
      return BAR_BOTTOM;
    case "TRANSITION":
    case "SCIENCE":
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

export const preNegotiationProtocol: Protocol = {
  id: "pre-negotiation",
  title: "Pre-Negotiation",
  subtitle: "~3.5 mins",
  duration: "~3.5 mins",
  introText: "Time to lock in.\nLet's sharpen your edge.",
  descriptionPrimary: "Coherence breathing to stabilize your nervous system.",
  descriptionSecondary: "Activation inhales to prime alertness before you step in.",
  stages: [
    {
      name: "Coherence Breathing",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 7,
    },
    {
      name: "Extended Exhale",
      method: "mouth",
      transition:
        "Let's continue with extended exhales to deepen your parasympathetic state.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 7000 },
      ],
      cycles: 6,
    },
    {
      name: "Activation",
      method: "nose",
      transition:
        "Now, three slow deep inhales to activate your system. Exhale naturally after each.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 3000, label: "NATURALLY EXHALE" },
      ],
      cycles: 3,
    },
  ],
  finalSequence: [
    { type: "HOLD_EMPTY", duration: 8000 },
  ],
  finalMethod: "nose",
};

export const creativeFlowProtocol: Protocol = {
  id: "creative-flow",
  title: "Creative Flow",
  subtitle: "~3.5 mins",
  duration: "~3.5 mins",
  introText: "Let go of control.\nLet your mind open up.",
  descriptionPrimary: "Longer exhales to release prefrontal control and reduce cognitive rigidity.",
  descriptionSecondary: "Variable breathing to increase cognitive flexibility for divergent thinking.",
  stages: [
    {
      name: "Release Control",
      method: "nose",
      science: "Downregulates prefrontal control and reduces cognitive rigidity.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 7,
    },
    {
      name: "Add Variability",
      method: "nose",
      transition:
        "Now let your breathing become less rigid. Allow natural variation in your exhales.",
      science: "Breaks rigid attentional rhythm and increases cognitive flexibility for divergent thinking.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 4500 },
      ],
      cycles: 12,
    },
    {
      name: "Expand",
      method: "nose",
      transition:
        "Take a few slightly deeper breaths. Relaxed, not controlled. Open up your mental space.",
      science: "Opens mental space without re-introducing control.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 3000, label: "NATURALLY EXHALE" },
      ],
      cycles: 3,
    },
  ],
};

export const deepFocusProtocol: Protocol = {
  id: "deep-focus",
  title: "Deep Focus",
  subtitle: "~3.5 mins",
  duration: "~3.5 mins",
  introText: "Settle in.\nLet's lock your attention.",
  descriptionPrimary: "Longer exhales to reduce surface noise and prepare for sustained attention.",
  descriptionSecondary: "Coherence breathing to build HRV and attentional stability.",
  stages: [
    {
      name: "Settle",
      method: "nose",
      science: "Reduces surface noise and prepares the nervous system for sustained attention.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 7,
    },
    {
      name: "Lock-in",
      method: "nose",
      transition:
        "Now settle into a steady rhythm. Same pace, no variation. Let your attention lock in.",
      science: "Builds HRV and attentional stability through consistent internal rhythm.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 12,
    },
    {
      name: "Transition Breath",
      method: "nose",
      transition:
        "One final breath. Inhale deeply, exhale slowly, then begin.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 1,
    },
  ],
};

export const wakeMeUpProtocol: Protocol = {
  id: "wake-me-up",
  title: "Wake Me Up",
  subtitle: "~4 mins",
  duration: "~4 mins",
  introText: "Time to wake up.\nLet's build some clean energy.",
  descriptionPrimary: "Cyclic breathing to trigger sympathetic activation for clean alertness.",
  descriptionSecondary: "Coherence breathing to stabilize and prevent an energy crash.",
  stages: [
    {
      name: "Activate",
      method: "nose",
      science: "Light cyclic breathing increases oxygen uptake and triggers sympathetic activation for clean alertness.",
      cycle: [
        { type: "INHALE", duration: 2000 },
        { type: "EXHALE", duration: 2000 },
      ],
      cycles: 25,
    },
    {
      name: "Peak Inhale",
      method: "nose",
      transition:
        "Now take one deep inhale and hold. Let the alertness build.",
      science: "Controlled breath hold after activation creates an alertness spike without overstimulation.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "HOLD", duration: 10000 },
      ],
      cycles: 1,
    },
    {
      name: "Stabilise",
      method: "nose",
      transition:
        "Let's stabilize with coherence breathing. Steady rhythm to lock in your energy.",
      science: "Coherence breathing stabilises HRV and sharpens cognition after activation — prevents energy crash.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 9,
    },
    {
      name: "Final Lift",
      method: "nose",
      transition:
        "A few deeper breaths to fully expand and oxygenate before you start your day.",
      science: "Expands lung capacity and restores full oxygenation before starting the day.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 3000, label: "NATURALLY EXHALE" },
      ],
      cycles: 3,
    },
  ],
};
