/* ── Breathing Protocol Engine ── */

export type PhaseType = "INHALE" | "HOLD" | "EXHALE" | "HOLD_EMPTY" | "SNIFF";

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
  audioSrc?: string; // background audio URL
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

const TRANSITION_DURATION = 4500;
const SCIENCE_DURATION = 5000;

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
    case "SNIFF": {
      const sniffRange = (BAR_BOTTOM - BAR_TOP) * 0.08;
      return BAR_TOP - progress * sniffRange;
    }
    case "TRANSITION":
    case "SCIENCE":
      return prevType === "INHALE" || prevType === "HOLD" || prevType === "SNIFF" ? BAR_TOP : BAR_BOTTOM;
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
  audioSrc: "/audio/pre-pitch.mp3",
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
  audioSrc: "/audio/pre-negotiation.mp3",
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
        { type: "EXHALE", duration: 3000 },
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
  audioSrc: "/audio/decision-clarity.mp3",
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
        { type: "EXHALE", duration: 3000 },
      ],
      cycles: 3,
    },
  ],
};

export const deepFocusProtocol: Protocol = {
  id: "deep-focus",
  title: "Deep Focus",
  audioSrc: "/audio/deep-focus.mp3",
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
  audioSrc: "/audio/wake-me-up.mp3",
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
        { type: "EXHALE", duration: 3000 },
      ],
      cycles: 3,
    },
  ],
};

export const energyResetProtocol: Protocol = {
  id: "energy-reset",
  title: "Energy Reset",
  audioSrc: "/audio/energy-reset.mp3",
  subtitle: "~3.5 mins",
  duration: "~3.5 mins",
  introText: "Feeling the dip?\nLet's bring you back online.",
  descriptionPrimary: "Cyclic activation to boost oxygen uptake and trigger clean alertness.",
  descriptionSecondary: "Coherence breathing to stabilize and lock in focused energy.",
  stages: [
    {
      name: "Activate",
      method: "nose",
      science: "Light cyclic breathing increases oxygen uptake and triggers sympathetic nervous system activation.",
      cycle: [
        { type: "INHALE", duration: 2000 },
        { type: "EXHALE", duration: 2000 },
      ],
      cycles: 22,
    },
    {
      name: "Peak Breath",
      method: "nose",
      transition:
        "Now take one deep inhale and hold. Let the alertness spike.",
      science: "Controlled breath hold after activation creates an alertness spike without overstimulation.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "HOLD", duration: 10000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 1,
    },
    {
      name: "Stabilise",
      method: "nose",
      transition:
        "Let's stabilize with coherence breathing. Steady rhythm to prevent a crash.",
      science: "Coherence breathing stabilises HRV and prevents energy crash after activation.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 9,
    },
    {
      name: "Focus Lock",
      method: "nose",
      transition:
        "Now a slight exhale extension to bring cognitive clarity online.",
      science: "Slight exhale extension lowers residual arousal and brings cognitive clarity online.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 4,
    },
  ],
};

export const reboundProtocol: Protocol = {
  id: "rebound",
  title: "Rebound",
  audioSrc: "/audio/rebound.mp3",
  subtitle: "~3 mins",
  duration: "~3 mins",
  introText: "That was tough.\nLet's reset your system.",
  descriptionPrimary: "Physiological sighs to break the acute stress spike.",
  descriptionSecondary: "Extended exhales to discharge adrenaline, then re-entry inhales to restore alertness.",
  stages: [
    {
      name: "Discharge",
      method: "nose",
      science: "Breaks the acute stress spike and rapidly lowers cortisol.",
      cycle: [
        { type: "INHALE", duration: 3000 },
        { type: "INHALE", duration: 1000, label: "TOP UP" },
        { type: "EXHALE", duration: 3000 },
      ],
      cycles: 3,
    },
    {
      name: "Regulate",
      method: "nose",
      transition:
        "Now let's regulate with extended exhales. Let the tension leave your body.",
      science: "Extended exhales activate the vagus nerve and discharge residual adrenaline.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 8000 },
      ],
      cycles: 8,
    },
    {
      name: "Re-entry",
      method: "nose",
      transition:
        "Three slow deep inhales to bring you back. Exhale naturally after each.",
      science: "Restores alertness and prevents flat post-regulation state.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 3000 },
      ],
      cycles: 3,
    },
  ],
};

export const contextSwitchProtocol: Protocol = {
  id: "context-switch",
  title: "Context Switch",
  audioSrc: "/audio/context-switch.mp3",
  subtitle: "~3.5 mins",
  duration: "~3.5 mins",
  introText: "New task, new state.\nLet's clear the slate.",
  descriptionPrimary: "Physiological sighs to interrupt cognitive carryover.",
  descriptionSecondary: "Coherence breathing to re-establish a neutral baseline for the next task.",
  stages: [
    {
      name: "Interrupt",
      method: "nose",
      science: "Immediately breaks the previous mental loop and interrupts cognitive carryover.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "INHALE", duration: 1500, label: "TOP UP" },
        { type: "EXHALE", duration: 3500 },
      ],
      cycles: 2,
    },
    {
      name: "Clear",
      method: "nose",
      transition:
        "Now let's clear residual activation with extended exhales.",
      science: "Extended exhale clears residual cognitive activation and reduces attentional fragmentation.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 13,
    },
    {
      name: "Re-align",
      method: "nose",
      transition:
        "Settle into coherence breathing. Equal pace to reset your baseline.",
      science: "Coherence breathing re-establishes neutral autonomic baseline and cognitive flexibility.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 8,
    },
  ],
};

export const preMeetingProtocol: Protocol = {
  id: "pre-meeting",
  title: "Pre-Meeting",
  audioSrc: "/audio/pre-meeting.mp3",
  subtitle: "~2 mins",
  duration: "~2 mins",
  introText: "Meeting coming up.\nLet's get you centered.",
  descriptionPrimary: "Physiological sighs to discharge stress and clear mental noise.",
  descriptionSecondary: "Reset breathing to stabilize, then one transition breath to step in sharp.",
  stages: [
    {
      name: "Physiological Sigh",
      method: "nose",
      science: "Double inhale activates alveolar sacs and rapidly lowers CO₂, breaking the stress loop in seconds.",
      cycle: [
        { type: "INHALE", duration: 3000 },
        { type: "SNIFF", duration: 1000, label: "SNIFF" },
        { type: "EXHALE", duration: 3000 },
      ],
      cycles: 2,
    },
    {
      name: "Reset Breathing",
      method: "nose",
      transition: "Now settle into a smooth, continuous rhythm. No holds, just flow.",
      science: "Balanced nasal breathing at a slow cadence maximises HRV and resets the autonomic baseline.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 6,
    },
    {
      name: "Transition Breath",
      method: "nose",
      transition: "One final breath. Inhale deeply through your nose, then exhale fully through your mouth.",
      cycle: [],
      cycles: 0,
    },
  ],
  finalSequence: [
    { type: "INHALE", duration: 5000 },
    { type: "EXHALE", duration: 7000, label: "FULL EXHALE" },
  ],
  finalMethod: "mouth",
};

export const backToBackProtocol: Protocol = {
  id: "back-to-back",
  title: "Back-to-Back",
  audioSrc: "/audio/evening-decompression.mp3",
  subtitle: "~3 mins",
  duration: "~3 mins",
  introText: "Let go of what just happened.\nReset before what's next.",
  descriptionPrimary: "Extended exhales to flush residual stress and lower sympathetic tone.",
  descriptionSecondary: "Coherence breathing to restore autonomic balance between demands.",
  stages: [
    {
      name: "Flush",
      method: "nose",
      science: "Extended exhales activate the vagus nerve, clearing residual cortisol and adrenaline from the previous demand.",
      cycle: [
        { type: "INHALE", duration: 3000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 5,
    },
    {
      name: "Reset",
      method: "nose",
      transition: "Good. Now even out the breath.\nSmooth and steady.",
      science: "Equal-ratio breathing at ~6 breaths/min maximises HRV and resets the autonomic baseline.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 8,
    },
    {
      name: "Ready",
      method: "nose",
      transition: "One final breath. Deep inhale, long full exhale. You're ready.",
      cycle: [],
      cycles: 0,
    },
  ],
  finalSequence: [
    { type: "INHALE", duration: 5000 },
    { type: "EXHALE", duration: 7000, label: "FULL EXHALE" },
  ],
  finalMethod: "mouth",
};
