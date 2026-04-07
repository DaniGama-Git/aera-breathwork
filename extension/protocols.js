// Extension protocol definitions — matches web app protocol structure
// Each protocol has stages with optional transition/science text

const PROTOCOLS = {
  "pre-pitch": {
    title: "Pre-Pitch",
    introText: "You're about to step in.\nLet's get you sharp.",
    stages: [
      {
        name: "Coherence Breathing",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 6,
        midSetHold: {
          afterCycle: 3,
          phase: { type: "HOLD_EMPTY", duration: 6000, label: "HOLD" },
        },
      },
      {
        name: "Extended Exhale",
        transition: "Let's continue with extended exhales through your mouth to deepen your parasympathetic state.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "hold", duration: 2000, label: "HOLD" },
          { phase: "exhale", duration: 8000 },
        ],
        cycles: 6,
      },
      {
        name: "Final Breath Hold",
        transition: "Let's go for one extended breath hold. Exhale fully, then hold to lower your heart rate.",
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
    introText: "Time to lock in.\nLet's sharpen your edge.",
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
        transition: "Let's continue with extended exhales to deepen your parasympathetic state.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 7000 },
        ],
        cycles: 6,
      },
      {
        name: "Activation",
        transition: "Now, three slow deep inhales to activate your system. Exhale naturally after each.",
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

  "creative-flow": {
    title: "Creative Flow",
    introText: "Let go of control.\nLet your mind open up.",
    stages: [
      {
        name: "Release Control",
        science: "Downregulates prefrontal control and reduces cognitive rigidity.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 7,
      },
      {
        name: "Add Variability",
        transition: "Now let your breathing become less rigid. Allow natural variation in your exhales.",
        science: "Breaks rigid attentional rhythm and increases cognitive flexibility for divergent thinking.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 4500 },
        ],
        cycles: 12,
      },
      {
        name: "Expand",
        transition: "Take a few slightly deeper breaths. Relaxed, not controlled. Open up your mental space.",
        science: "Opens mental space without re-introducing control.",
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
    introText: "Settle in.\nLet's lock your attention.",
    stages: [
      {
        name: "Settle",
        science: "Reduces surface noise and prepares the nervous system for sustained attention.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 7,
      },
      {
        name: "Lock-in",
        transition: "Now settle into a steady rhythm. Same pace, no variation. Let your attention lock in.",
        science: "Builds HRV and attentional stability through consistent internal rhythm.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 12,
      },
      {
        name: "Transition Breath",
        transition: "One final breath. Inhale deeply, exhale slowly, then begin.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 1,
      },
    ],
  },

  "wake-me-up": {
    title: "Wake Me Up",
    introText: "Time to wake up.\nLet's build some clean energy.",
    stages: [
      {
        name: "Activate",
        science: "Light cyclic breathing increases oxygen uptake and triggers sympathetic activation for clean alertness.",
        cycle: [
          { phase: "inhale", duration: 2000 },
          { phase: "exhale", duration: 2000 },
        ],
        cycles: 25,
      },
      {
        name: "Peak Inhale",
        transition: "Now take one deep inhale and hold. Let the alertness build.",
        science: "Controlled breath hold after activation creates an alertness spike without overstimulation.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "hold", duration: 10000, label: "HOLD" },
        ],
        cycles: 1,
      },
      {
        name: "Stabilise",
        transition: "Let's stabilize with coherence breathing. Steady rhythm to lock in your energy.",
        science: "Coherence breathing stabilises HRV and sharpens cognition after activation — prevents energy crash.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 9,
      },
      {
        name: "Final Lift",
        transition: "A few deeper breaths to fully expand and oxygenate before you start your day.",
        science: "Expands lung capacity and restores full oxygenation before starting the day.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
        ],
        cycles: 3,
      },
    ],
  },

  "energy-reset": {
    title: "Energy Reset",
    introText: "Feeling the dip?\nLet's bring you back online.",
    stages: [
      {
        name: "Activate",
        science: "Light cyclic breathing increases oxygen uptake and triggers sympathetic nervous system activation.",
        cycle: [
          { phase: "inhale", duration: 2000 },
          { phase: "exhale", duration: 2000 },
        ],
        cycles: 22,
      },
      {
        name: "Peak Breath",
        transition: "Now take one deep inhale and hold. Let the alertness spike.",
        science: "Controlled breath hold after activation creates an alertness spike without overstimulation.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "hold", duration: 10000, label: "HOLD" },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 1,
      },
      {
        name: "Stabilise",
        transition: "Let's stabilize with coherence breathing. Steady rhythm to prevent a crash.",
        science: "Coherence breathing stabilises HRV and prevents energy crash after activation.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 9,
      },
      {
        name: "Focus Lock",
        transition: "Now a slight exhale extension to bring cognitive clarity online.",
        science: "Slight exhale extension lowers residual arousal and brings cognitive clarity online.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 4,
      },
    ],
  },

  "rebound": {
    title: "Rebound",
    introText: "That was tough.\nLet's reset your system.",
    stages: [
      {
        name: "Discharge",
        science: "Breaks the acute stress spike and rapidly lowers cortisol.",
        cycle: [
          { phase: "inhale", duration: 3000 },
          { phase: "inhale", duration: 1000, label: "TOP UP" },
          { phase: "exhale", duration: 6000, label: "NATURALLY EXHALE" },
        ],
        cycles: 3,
      },
      {
        name: "Regulate",
        transition: "Now let's regulate with extended exhales. Let the tension leave your body.",
        science: "Extended exhales activate the vagus nerve and discharge residual adrenaline.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 8000 },
        ],
        cycles: 8,
      },
      {
        name: "Re-entry",
        transition: "Three slow deep inhales to bring you back. Exhale naturally after each.",
        science: "Restores alertness and prevents flat post-regulation state.",
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
    introText: "New task, new state.\nLet's clear the slate.",
    stages: [
      {
        name: "Interrupt",
        science: "Immediately breaks the previous mental loop and interrupts cognitive carryover.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "inhale", duration: 1500, label: "TOP UP" },
          { phase: "exhale", duration: 7000, label: "NATURALLY EXHALE" },
        ],
        cycles: 2,
      },
      {
        name: "Clear",
        transition: "Now let's clear residual activation with extended exhales.",
        science: "Extended exhale clears residual cognitive activation and reduces attentional fragmentation.",
        cycle: [
          { phase: "inhale", duration: 4000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 13,
      },
      {
        name: "Re-align",
        transition: "Settle into coherence breathing. Equal pace to reset your baseline.",
        science: "Coherence breathing re-establishes neutral autonomic baseline and cognitive flexibility.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 5000 },
        ],
        cycles: 8,
      },
    ],
  },

  "pre-meeting": {
    title: "Pre-Meeting",
    introText: "Meeting coming up.\nLet's get you centered.",
    stages: [
      {
        name: "Physiological Sigh",
        science: "Double inhale activates alveolar sacs and rapidly lowers CO₂, breaking the stress loop in seconds.",
        cycle: [
          { phase: "inhale", duration: 3000 },
          { phase: "inhale", duration: 1000, label: "SNIFF" },
          { phase: "exhale", duration: 5000, label: "NATURALLY EXHALE" },
        ],
        cycles: 2,
      },
      {
        name: "Reset Breathing",
        transition: "Now settle into a smooth, continuous rhythm. No holds, just flow.",
        science: "Balanced nasal breathing at a slow cadence maximises HRV and resets the autonomic baseline.",
        cycle: [
          { phase: "inhale", duration: 5000 },
          { phase: "exhale", duration: 6000 },
        ],
        cycles: 6,
      },
      {
        name: "Transition Breath",
        transition: "One final breath. Inhale deeply through your nose, then exhale fully through your mouth.",
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
