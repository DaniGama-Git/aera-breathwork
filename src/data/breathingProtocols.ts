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
  introTexts?: { text: string; duration: number }[];
  outroText?: string;
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

  // Inject introTexts as TRANSITION entries at the very start
  if (protocol.introTexts) {
    protocol.introTexts.forEach((intro) => {
      entries.push({
        type: "TRANSITION",
        duration: intro.duration,
        startMs: cursor,
        endMs: cursor + intro.duration,
        displayLabel: "",
        stageIndex: 0,
        transitionText: intro.text,
      });
      cursor += intro.duration;
    });
  }

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
  subtitle: "~4.5 mins",
  duration: "~4.5 mins",
  introText: "You're about to step in.\nLet's get you sharp.",
  descriptionPrimary: "Box breathing to balance your nervous system.",
  descriptionSecondary: "Extended exhales to lower cortisol, then a final breath hold.",
  introTexts: [
    { text: "You're about to step in.\nLet's get you sharp.", duration: 2000 },
    { text: "We'll start with a few rounds of box breathing through your nose to balance your nervous system.", duration: 3000 },
  ],
  outroText: "LET'S GO.",
  stages: [
    {
      name: "Box Breathing",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "HOLD", duration: 4000 },
        { type: "EXHALE", duration: 4000 },
        { type: "HOLD_EMPTY", duration: 4000 },
      ],
      cycles: 9,
    },
    {
      name: "Extended Exhale",
      method: "mouth",
      transition: "Let's continue with extended exhales through your mouth to reduce your blood pressure and cortisol.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "HOLD", duration: 2000 },
        { type: "EXHALE", duration: 8000, label: "EXHALE THROUGH YOUR MOUTH" },
      ],
      cycles: 6,
    },
    {
      name: "Final Breath Hold",
      method: "mouth",
      transition: "Let's go for one extended breath hold. Exhale fully, then hold to lower your heart rate.",
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
  subtitle: "~4 mins",
  duration: "~4 mins",
  introText: "Turn presence into your power.",
  descriptionPrimary: "Coherence breathing to slow your heart rate.",
  descriptionSecondary: "Extended exhales and activation inhales to restore sharp alertness.",
  introTexts: [
    { text: "Turn presence into your power.", duration: 2000 },
    { text: "Coherence breathing to slow your heart rate, extended exhales to deepen your parasympathetic state, and three deep inhales to restore sharp alertness.", duration: 4000 },
  ],
  outroText: "LET'S GO.",
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
      transition: "Let's continue with extended exhales through your mouth to deepen your parasympathetic state.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 7000, label: "EXHALE THROUGH YOUR MOUTH" },
      ],
      cycles: 6,
    },
    {
      name: "Activation",
      method: "nose",
      transition: "Three deep inhales to increase oxygen uptake and restore alertness.",
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

export const decisionClarityProtocol: Protocol = {
  id: "decision-clarity",
  title: "Decision Clarity",
  audioSrc: "/audio/decision-clarity.mp3",
  subtitle: "~3 mins",
  duration: "~3 mins",
  introText: "Clear your mind.",
  descriptionPrimary: "Physiological sighs to reduce cortisol fast.",
  descriptionSecondary: "Coherence breathing for mental clarity, then one decision breath.",
  introTexts: [
    { text: "Clear your mind.", duration: 2000 },
    { text: "We begin with a physiological sigh — double inhale through your nose, sniff at the top, then a long exhale through your mouth. The fastest way to reduce cortisol.", duration: 4000 },
  ],
  outroText: "LET'S GO.",
  stages: [
    {
      name: "Physiological Sigh",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 3000 },
        { type: "SNIFF", duration: 1000, label: "TOP UP" },
        { type: "EXHALE", duration: 5000, label: "EXHALE THROUGH YOUR MOUTH" },
      ],
      cycles: 4,
    },
    {
      name: "Coherence Breathing",
      method: "nose",
      transition: "Let's move into coherence breathing to drop your heart rate and build mental clarity.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 12,
    },
    {
      name: "Decision Pause",
      method: "nose",
      transition: "One breath before you decide.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 6000 },
        { type: "HOLD_EMPTY", duration: 8000 },
      ],
      cycles: 1,
    },
  ],
};

export const preMeetingProtocol: Protocol = {
  id: "pre-meeting",
  title: "Pre-Meeting",
  audioSrc: "/audio/pre-meeting.mp3",
  subtitle: "~2 mins",
  duration: "~2 mins",
  introText: "Leave the last thing behind.\nReset and enter with full presence.",
  descriptionPrimary: "Physiological sighs to clear residual stress.",
  descriptionSecondary: "Coherence breathing to slow your heart rate before stepping in.",
  introTexts: [
    { text: "Leave the last thing behind.\nReset and enter with full presence.", duration: 2000 },
    { text: "We begin with a physiological sigh — the fastest way to clear residual stress from your nervous system.", duration: 3000 },
  ],
  outroText: "LET'S GO.",
  stages: [
    {
      name: "Physiological Sigh",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 3000 },
        { type: "SNIFF", duration: 1000, label: "TOP UP" },
        { type: "EXHALE", duration: 5000, label: "NATURALLY EXHALE" },
      ],
      cycles: 3,
    },
    {
      name: "Reset Breathing",
      method: "nose",
      transition: "Let's move into coherence breathing to slow your heart rate.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 6,
    },
    {
      name: "Transition Breath",
      method: "nose",
      transition: "One final breath to complete your reset.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 3500, label: "NATURALLY EXHALE" },
      ],
      cycles: 1,
    },
  ],
};

export const reboundProtocol: Protocol = {
  id: "rebound",
  title: "Post-Setback Recovery",
  audioSrc: "/audio/rebound.mp3",
  subtitle: "~3 mins",
  duration: "~3 mins",
  introText: "Recovery is part of the performance.\nLet's start it now.",
  descriptionPrimary: "Physiological sighs to break the stress spike.",
  descriptionSecondary: "Extended exhales to discharge adrenaline, then re-entry inhales.",
  introTexts: [
    { text: "Recovery is part of the performance.\nLet's start it now.", duration: 2000 },
    { text: "We begin with a physiological sigh — the fastest way to break the stress spike and lower cortisol.", duration: 3000 },
  ],
  outroText: "BACK.",
  stages: [
    {
      name: "Physiological Sigh",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 3000 },
        { type: "SNIFF", duration: 1000, label: "TOP UP" },
        { type: "EXHALE", duration: 5000, label: "NATURALLY EXHALE" },
      ],
      cycles: 3,
    },
    {
      name: "Extended Exhale",
      method: "mouth",
      transition: "Let's move into extended exhales to activate your vagus nerve and discharge adrenaline.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 8000, label: "EXHALE THROUGH YOUR MOUTH" },
      ],
      cycles: 8,
    },
    {
      name: "Re-entry",
      method: "nose",
      transition: "Three deep inhales to restore alertness and bring you back.",
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
  audioSrc: "/audio/deep-focus.mp3",
  subtitle: "~4 mins",
  duration: "~4 mins",
  introText: "Full focus is a competitive advantage.\nLet's build it.",
  descriptionPrimary: "Extended exhales to reduce surface noise.",
  descriptionSecondary: "Coherence breathing for sustained deep attention.",
  introTexts: [
    { text: "Full focus is a competitive advantage.\nLet's build it.", duration: 2000 },
    { text: "We begin with extended exhales to reduce surface noise and prepare your nervous system for sustained attention.", duration: 3000 },
  ],
  outroText: "LOCKED.",
  stages: [
    {
      name: "Settle",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 7,
    },
    {
      name: "Lock-in",
      method: "nose",
      transition: "Let's move into coherence breathing — building the stable internal rhythm your brain needs to sustain deep attention.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 12,
    },
    {
      name: "Transition Breath",
      method: "nose",
      transition: "One final breath — then begin.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 1,
    },
  ],
};

export const creativeFlowProtocol: Protocol = {
  id: "creative-flow",
  title: "Creative Flow",
  audioSrc: "/audio/decision-clarity.mp3",
  subtitle: "~4 mins",
  duration: "~4 mins",
  introText: "The best ideas come to a quiet mind.\nLet's get you there.",
  descriptionPrimary: "Extended exhales to downregulate prefrontal control.",
  descriptionSecondary: "Variable breathing for cognitive flexibility and divergent thinking.",
  introTexts: [
    { text: "The best ideas come to a quiet mind.\nLet's get you there.", duration: 2000 },
    { text: "We begin with extended exhales to downregulate prefrontal control and reduce cognitive rigidity.", duration: 3000 },
  ],
  outroText: "LET IT COME.",
  stages: [
    {
      name: "Release Control",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 6000 },
      ],
      cycles: 7,
    },
    {
      name: "Variability",
      method: "nose",
      transition: "Let's move into a looser rhythm — increasing cognitive flexibility and opening divergent thinking.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 4500 },
      ],
      cycles: 12,
    },
    {
      name: "Expand",
      method: "nose",
      transition: "A few deeper breaths to open mental space.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 3000, label: "NATURALLY EXHALE" },
      ],
      cycles: 3,
    },
  ],
};

export const wakeMeUpProtocol: Protocol = {
  id: "wake-me-up",
  title: "Morning Activation",
  audioSrc: "/audio/wake-me-up.mp3",
  subtitle: "~4 mins",
  duration: "~4 mins",
  introText: "Build your energy for the day ahead.",
  descriptionPrimary: "Cyclic breathing to boost oxygen and trigger sympathetic activation.",
  descriptionSecondary: "Coherence breathing to stabilise and sharpen focus.",
  introTexts: [
    { text: "Build your energy for the day ahead.", duration: 2000 },
    { text: "We begin with cyclic breathing to boost oxygen and trigger sympathetic nervous system activation.", duration: 3000 },
  ],
  outroText: "YOU'RE ON.",
  stages: [
    {
      name: "Cyclic Activation",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 2000 },
        { type: "EXHALE", duration: 2000 },
      ],
      cycles: 25,
    },
    {
      name: "Peak Inhale Hold",
      method: "nose",
      transition: "One deep inhale — hold at the top.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "HOLD", duration: 10000 },
        { type: "EXHALE", duration: 3500, label: "NATURALLY EXHALE" },
      ],
      cycles: 1,
    },
    {
      name: "Coherence Stabilisation",
      method: "nose",
      transition: "Let's move into coherence breathing to stabilise your nervous system and sharpen your focus.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 9,
    },
    {
      name: "Final Lift",
      method: "nose",
      transition: "Two deeper breaths to maximise oxygen uptake.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 3000, label: "NATURALLY EXHALE" },
      ],
      cycles: 3,
    },
  ],
};

export const energyResetProtocol: Protocol = {
  id: "energy-reset",
  title: "Midday Energizer",
  audioSrc: "/audio/energy-reset.mp3",
  subtitle: "~4 mins",
  duration: "~4 mins",
  introText: "Beat the afternoon dip.\nGet your brain back online.",
  descriptionPrimary: "Cyclic activation to boost oxygen and trigger alertness.",
  descriptionSecondary: "Coherence breathing to stabilise and prevent an energy crash.",
  introTexts: [
    { text: "Beat the afternoon dip.\nGet your brain back online.", duration: 2000 },
    { text: "We begin with cyclic breathing to boost oxygen and activate your sympathetic nervous system.", duration: 3000 },
  ],
  outroText: "YOU'RE CLEAR. GO.",
  stages: [
    {
      name: "Cyclic Activation",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 2000 },
        { type: "EXHALE", duration: 2000 },
      ],
      cycles: 22,
    },
    {
      name: "Peak Breath Hold",
      method: "nose",
      transition: "One deep inhale — hold at the top.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "HOLD", duration: 10000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 1,
    },
    {
      name: "Coherence Stabilisation",
      method: "nose",
      transition: "Let's move into coherence breathing to stabilise your nervous system and prevent an energy crash.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 9,
    },
    {
      name: "Focus Lock",
      method: "mouth",
      transition: "Let's finish with extended exhales to bring cognitive clarity back online.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 6000, label: "EXHALE THROUGH YOUR MOUTH" },
      ],
      cycles: 4,
    },
  ],
};

export const contextSwitchProtocol: Protocol = {
  id: "context-switch",
  title: "Context Switch",
  audioSrc: "/audio/context-switch.mp3",
  subtitle: "~3 mins",
  duration: "~3 mins",
  introText: "Clear your mind.\nEnter what's next with full attention.",
  descriptionPrimary: "Physiological sighs to break the mental loop.",
  descriptionSecondary: "Extended exhales and coherence breathing to rebuild a neutral baseline.",
  introTexts: [
    { text: "Clear your mind.\nEnter what's next with full attention.", duration: 2000 },
    { text: "We begin with a physiological sigh to break the mental loop from your last task.", duration: 3000 },
  ],
  outroText: "You're ready for what's next.",
  stages: [
    {
      name: "Physiological Sigh",
      method: "nose",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "SNIFF", duration: 1500, label: "TOP UP" },
        { type: "EXHALE", duration: 7000, label: "EXHALE THROUGH YOUR MOUTH" },
      ],
      cycles: 2,
    },
    {
      name: "Extended Exhale",
      method: "mouth",
      transition: "Let's move into extended exhales to lower cortisol and clear your working memory.",
      cycle: [
        { type: "INHALE", duration: 4000 },
        { type: "EXHALE", duration: 6000, label: "EXHALE THROUGH YOUR MOUTH" },
      ],
      cycles: 13,
    },
    {
      name: "Coherence",
      method: "nose",
      transition: "Let's move into coherence breathing to rebuild a neutral baseline in your nervous system.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 5000 },
      ],
      cycles: 7,
    },
    {
      name: "Transition Breath",
      method: "nose",
      transition: "One breath to complete the shift.",
      cycle: [
        { type: "INHALE", duration: 5000 },
        { type: "EXHALE", duration: 3500, label: "NATURALLY EXHALE" },
      ],
      cycles: 1,
    },
  ],
};

export const backToBackProtocol: Protocol = {
  id: "back-to-back",
  title: "Back-to-Back",
  audioSrc: "/audio/back-to-back.mp3",
  subtitle: "~3 mins",
  duration: "~3 mins",
  introText: "Let go of what just happened.\nReset before what's next.",
  descriptionPrimary: "Extended exhales to flush residual stress.",
  descriptionSecondary: "Coherence breathing to restore autonomic balance.",
  introTexts: [
    { text: "Let go of what just happened.\nReset before what's next.", duration: 2000 },
  ],
  outroText: "LET'S GO.",
  stages: [
    {
      name: "Flush",
      method: "nose",
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

/* ── All protocols indexed by ID ── */
export const ALL_PROTOCOLS: Record<string, Protocol> = {
  "pre-pitch": prePitchProtocol,
  "pre-negotiation": preNegotiationProtocol,
  "decision-clarity": decisionClarityProtocol,
  "pre-meeting": preMeetingProtocol,
  "rebound": reboundProtocol,
  "deep-focus": deepFocusProtocol,
  "creative-flow": creativeFlowProtocol,
  "wake-me-up": wakeMeUpProtocol,
  "energy-reset": energyResetProtocol,
  "context-switch": contextSwitchProtocol,
  "back-to-back": backToBackProtocol,
};
