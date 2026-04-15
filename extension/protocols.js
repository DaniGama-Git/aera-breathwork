// Extension protocol definitions — each protocol has introTexts, stages, and outroText

const PROTOCOLS = {
  "pre-pitch": {
    title: "Pre-Pitch",
    audioSrc: "audio/pre-pitch.mp3",
    introTexts: [
      { text: "you're about to step in.\nlet's get you sharp.", duration: 2000 },
      { text: "we'll start with a few rounds of box breathing through your nose to balance your nervous system.", duration: 3000 },
    ],
    outroText: "LET'S GO.",
    stages: [
      {
        name: "Box Breathing",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "hold", duration: 4000, label: "HOLD" },
          { phase: "exhale", duration: 4000 },
          { phase: "hold_empty", duration: 4000, label: "HOLD" },
        ],
        cycles: 9,
      },
      {
        name: "Extended Exhale",
        transition: "let's continue with extended exhales through your mouth to reduce your blood pressure and cortisol.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "hold", duration: 2000, label: "HOLD" },
          { phase: "exhale", duration: 8000, label: "EXHALE THROUGH YOUR MOUTH" },
        ],
        cycles: 6,
      },
      {
        name: "Final Breath Hold",
        transition: "let's go for one extended breath hold. exhale fully, then hold to lower your heart rate.",
        cycle: [],
        cycles: 0,
      },
    ],
    finalSequence: [
      { phase: "exhale", duration: 4000 },
      { phase: "hold_empty", duration: 8000, label: "HOLD" },
    ],
  },

  "pre-negotiation": {
    title: "Pre-Negotiation",
    audioSrc: "audio/pre-negotiation.mp3",
    introTexts: [
      { text: "turn presence into your power.", duration: 2000 },
      { text: "coherence breathing to slow your heart rate, extended exhales to deepen your parasympathetic state, and three deep inhales to restore sharp alertness.", duration: 4000 },
    ],
    outroText: "LET'S GO.",
    stages: [
      {
        name: "Coherence Breathing",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 7,
      },
      {
        name: "Extended Exhale",
        transition: "let's continue with extended exhales through your mouth to deepen your parasympathetic state.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 7000, label: "EXHALE THROUGH YOUR MOUTH" },
        ],
        cycles: 6,
      },
      {
        name: "Activation",
        transition: "three deep inhales to increase oxygen uptake and restore alertness.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
        ],
        cycles: 3,
      },
    ],
    finalSequence: [
      { phase: "hold_empty", duration: 8000, label: "HOLD" },
    ],
  },

  "decision-clarity": {
    title: "Decision Clarity",
    audioSrc: "audio/decision-clarity.mp3",
    introTexts: [
      { text: "clear your mind.", duration: 2000 },
      { text: "we begin with a physiological sigh — double inhale through your nose, sniff at the top, then a long exhale through your mouth. the fastest way to reduce cortisol.", duration: 4000 },
    ],
    outroText: "LET'S GO.",
    stages: [
      {
        name: "Physiological Sigh",
        cycle: [
          { phase: "inhale", duration: 3000 },
          { phase: "sniff", duration: 1000, label: "TOP UP" },
          { phase: "exhale", duration: 5000, label: "EXHALE THROUGH YOUR MOUTH" },
        ],
        cycles: 4,
      },
      {
        name: "Coherence Breathing",
        transition: "let's move into coherence breathing to drop your heart rate and build mental clarity.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 12,
      },
      {
        name: "Decision Pause",
        transition: "one breath before you decide.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 6000 },
          { phase: "hold_empty", duration: 8000, label: "HOLD" },
        ],
        cycles: 1,
      },
    ],
  },

  "pre-meeting": {
    title: "Pre-Meeting",
    audioSrc: "audio/pre-meeting.mp3",
    introTexts: [
      { text: "leave the last thing behind.\nreset and enter with full presence.", duration: 2000 },
      { text: "we begin with a physiological sigh — the fastest way to clear residual stress from your nervous system.", duration: 3000 },
    ],
    outroText: "LET'S GO.",
    stages: [
      {
        name: "Physiological Sigh",
        cycle: [
          { phase: "inhale", duration: 3000 },
          { phase: "sniff", duration: 1000, label: "TOP UP" },
          { phase: "exhale", duration: 5000, label: "NATURALLY EXHALE" },
        ],
        cycles: 3,
      },
      {
        name: "Reset Breathing",
        transition: "let's move into coherence breathing to slow your heart rate.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 6,
      },
      {
        name: "Transition Breath",
        transition: "one final breath to complete your reset.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 3500, label: "NATURALLY EXHALE" },
        ],
        cycles: 1,
      },
    ],
  },

  "rebound": {
    title: "Post-Setback Recovery",
    audioSrc: "audio/rebound.mp3",
    introTexts: [
      { text: "recovery is part of the performance.\nlet's start it now.", duration: 2000 },
      { text: "we begin with a physiological sigh — the fastest way to break the stress spike and lower cortisol.", duration: 3000 },
    ],
    outroText: "BACK.",
    stages: [
      {
        name: "Physiological Sigh",
        cycle: [
          { phase: "inhale", duration: 3000 },
          { phase: "sniff", duration: 1000, label: "TOP UP" },
          { phase: "exhale", duration: 5000, label: "NATURALLY EXHALE" },
        ],
        cycles: 3,
      },
      {
        name: "Extended Exhale",
        transition: "let's move into extended exhales to activate your vagus nerve and discharge adrenaline.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 8000, label: "EXHALE THROUGH YOUR MOUTH" },
        ],
        cycles: 8,
      },
      {
        name: "Re-entry",
        transition: "three deep inhales to restore alertness and bring you back.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
        ],
        cycles: 3,
      },
    ],
  },

  "deep-focus": {
    title: "Deep Focus",
    audioSrc: "audio/deep-focus.mp3",
    introTexts: [
      { text: "full focus is a competitive advantage.\nlet's build it.", duration: 2000 },
      { text: "we begin with extended exhales to reduce surface noise and prepare your nervous system for sustained attention.", duration: 3000 },
    ],
    outroText: "LOCKED.",
    stages: [
      {
        name: "Settle",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 7,
      },
      {
        name: "Lock-in",
        transition: "let's move into coherence breathing — building the stable internal rhythm your brain needs to sustain deep attention.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 12,
      },
      {
        name: "Transition Breath",
        transition: "one final breath — then begin.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 1,
      },
    ],
  },

  "creative-flow": {
    title: "Creative Flow",
    audioSrc: "audio/decision-clarity.mp3",
    introTexts: [
      { text: "the best ideas come to a quiet mind.\nlet's get you there.", duration: 2000 },
      { text: "we begin with extended exhales to downregulate prefrontal control and reduce cognitive rigidity.", duration: 3000 },
    ],
    outroText: "LET IT COME.",
    stages: [
      {
        name: "Release Control",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 7,
      },
      {
        name: "Variability",
        transition: "let's move into a looser rhythm — increasing cognitive flexibility and opening divergent thinking.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 4500 },
        ],
        cycles: 12,
      },
      {
        name: "Expand",
        transition: "a few deeper breaths to open mental space.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
        ],
        cycles: 3,
      },
    ],
  },

  "wake-me-up": {
    title: "Morning Activation",
    audioSrc: "audio/wake-me-up.mp3",
    introTexts: [
      { text: "build your energy for the day ahead.", duration: 2000 },
      { text: "we begin with cyclic breathing to boost oxygen and trigger sympathetic nervous system activation.", duration: 3000 },
    ],
    outroText: "YOU'RE ON.",
    stages: [
      {
        name: "Cyclic Activation",
        cycle: [
          { phase: "inhale", duration: 2000 },
          { phase: "exhale", duration: 2000 },
        ],
        cycles: 25,
      },
      {
        name: "Peak Inhale Hold",
        transition: "one deep inhale — hold at the top.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "hold", duration: 10000, label: "HOLD" },
          { phase: "exhale", duration: 3500, label: "NATURALLY EXHALE" },
        ],
        cycles: 1,
      },
      {
        name: "Coherence Stabilisation",
        transition: "let's move into coherence breathing to stabilise your nervous system and sharpen your focus.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 9,
      },
      {
        name: "Final Lift",
        transition: "two deeper breaths to maximise oxygen uptake.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
        ],
        cycles: 3,
      },
    ],
  },

  "context-switch": {
    title: "Context Switch",
    audioSrc: "audio/context-switch.mp3",
    introTexts: [
      { text: "clear your mind.\nenter what's next with full attention.", duration: 2000 },
      { text: "we begin with a physiological sigh to break the mental loop from your last task.", duration: 3000 },
    ],
    outroText: "you're ready for what's next.",
    stages: [
      {
        name: "Physiological Sigh",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "sniff", duration: 1500, label: "TOP UP" },
          { phase: "exhale", duration: 7000, label: "EXHALE THROUGH YOUR MOUTH" },
        ],
        cycles: 2,
      },
      {
        name: "Extended Exhale",
        transition: "let's move into extended exhales to lower cortisol and clear your working memory.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 6000, label: "EXHALE THROUGH YOUR MOUTH" },
        ],
        cycles: 13,
      },
      {
        name: "Coherence",
        transition: "let's move into coherence breathing to rebuild a neutral baseline in your nervous system.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 7,
      },
      {
        name: "Transition Breath",
        transition: "one breath to complete the shift.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 3500, label: "NATURALLY EXHALE" },
        ],
        cycles: 1,
      },
    ],
  },

  "energy-reset": {
    title: "Midday Energizer",
    audioSrc: "audio/energy-reset.mp3",
    introTexts: [
      { text: "beat the afternoon dip.\nget your brain back online.", duration: 2000 },
      { text: "we begin with cyclic breathing to boost oxygen and activate your sympathetic nervous system.", duration: 3000 },
    ],
    outroText: "YOU'RE CLEAR. GO.",
    stages: [
      {
        name: "Cyclic Activation",
        cycle: [
          { phase: "inhale", duration: 2000 },
          { phase: "exhale", duration: 2000 },
        ],
        cycles: 22,
      },
      {
        name: "Peak Breath Hold",
        transition: "one deep inhale — hold at the top.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "hold", duration: 10000, label: "HOLD" },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 1,
      },
      {
        name: "Coherence Stabilisation",
        transition: "let's move into coherence breathing to stabilise your nervous system and prevent an energy crash.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 9,
      },
      {
        name: "Focus Lock",
        transition: "let's finish with extended exhales to bring cognitive clarity back online.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 6000, label: "EXHALE THROUGH YOUR MOUTH" },
        ],
        cycles: 4,
      },
    ],
  },

  "back-to-back": {
    title: "Back-to-Back",
    audioSrc: "audio/deep-focus.mp3",
    introTexts: [
      { text: "let go of what just happened.\nreset before what's next.", duration: 2000 },
    ],
    outroText: "LET'S GO.",
    stages: [
      {
        name: "Flush",
        cycle: [
          { phase: "inhale", duration: 3000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 5,
      },
      {
        name: "Reset",
        transition: "good. now even out the breath.\nsmooth and steady.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 8,
      },
      {
        name: "Ready",
        transition: "one final breath. deep inhale, long full exhale. you're ready.",
        cycle: [],
        cycles: 0,
      },
    ],
    finalSequence: [
      { phase: "inhale", duration: 5000 },
      { phase: "exhale", duration: 7000, label: "FULL EXHALE" },
    ],
  },
};
