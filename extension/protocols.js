// Extension protocol definitions — mirrors web app protocols in a flat timeline format.
// Each protocol is an array of { phase, duration, label? } objects.

const PROTOCOLS = {
  "pre-pitch": {
    title: "Pre-Pitch",
    phases: [
      // Stage 1: Coherence Breathing × 6 (mid-set hold after cycle 3)
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 5000 },
      ], 3),
      { phase: "hold", duration: 6000, label: "HOLD" },
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 5000 },
      ], 3),
      // Stage 2: Extended Exhale × 6
      ...repeat([
        { phase: "inhale", duration: 4000 },
        { phase: "hold", duration: 2000 },
        { phase: "exhale", duration: 8000 },
      ], 6),
      // Final sequence
      { phase: "exhale", duration: 4000 },
      { phase: "hold", duration: 8000, label: "HOLD" },
    ],
  },

  "pre-negotiation": {
    title: "Pre-Negotiation",
    phases: [
      // Stage 1: Coherence × 7
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 5000 },
      ], 7),
      // Stage 2: Extended Exhale × 6
      ...repeat([
        { phase: "inhale", duration: 4000 },
        { phase: "exhale", duration: 7000 },
      ], 6),
      // Stage 3: Activation × 3
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
      ], 3),
      // Final
      { phase: "hold", duration: 8000, label: "HOLD" },
    ],
  },

  "creative-flow": {
    title: "Creative Flow",
    phases: [
      // Stage 1: Release Control × 7
      ...repeat([
        { phase: "inhale", duration: 4000 },
        { phase: "exhale", duration: 6000 },
      ], 7),
      // Stage 2: Add Variability × 12
      ...repeat([
        { phase: "inhale", duration: 4000 },
        { phase: "exhale", duration: 4500 },
      ], 12),
      // Stage 3: Expand × 3
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
      ], 3),
    ],
  },

  "deep-focus": {
    title: "Deep Focus",
    phases: [
      // Stage 1: Settle × 7
      ...repeat([
        { phase: "inhale", duration: 4000 },
        { phase: "exhale", duration: 6000 },
      ], 7),
      // Stage 2: Lock-in × 12
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 5000 },
      ], 12),
      // Stage 3: Transition × 1
      { phase: "inhale", duration: 5000 },
      { phase: "exhale", duration: 5000 },
    ],
  },

  "wake-me-up": {
    title: "Wake Me Up",
    phases: [
      // Stage 1: Activate × 25
      ...repeat([
        { phase: "inhale", duration: 2000 },
        { phase: "exhale", duration: 2000 },
      ], 25),
      // Stage 2: Peak Inhale
      { phase: "inhale", duration: 5000 },
      { phase: "hold", duration: 10000 },
      // Stage 3: Stabilise × 9
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 5000 },
      ], 9),
      // Stage 4: Final Lift × 3
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
      ], 3),
    ],
  },

  "energy-reset": {
    title: "Energy Reset",
    phases: [
      // Stage 1: Activate × 22
      ...repeat([
        { phase: "inhale", duration: 2000 },
        { phase: "exhale", duration: 2000 },
      ], 22),
      // Stage 2: Peak Breath
      { phase: "inhale", duration: 5000 },
      { phase: "hold", duration: 10000 },
      { phase: "exhale", duration: 5000 },
      // Stage 3: Stabilise × 9
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 5000 },
      ], 9),
      // Stage 4: Focus Lock × 4
      ...repeat([
        { phase: "inhale", duration: 4000 },
        { phase: "exhale", duration: 6000 },
      ], 4),
    ],
  },

  "rebound": {
    title: "Rebound",
    phases: [
      // Stage 1: Discharge (physiological sighs) × 3
      ...repeat([
        { phase: "inhale", duration: 3000 },
        { phase: "inhale", duration: 1000, label: "TOP UP" },
        { phase: "exhale", duration: 6000, label: "NATURALLY EXHALE" },
      ], 3),
      // Stage 2: Regulate × 8
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 8000 },
      ], 8),
      // Stage 3: Re-entry × 3
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 3000, label: "NATURALLY EXHALE" },
      ], 3),
    ],
  },

  "context-switch": {
    title: "Context Switch",
    phases: [
      // Stage 1: Interrupt (sighs) × 2
      ...repeat([
        { phase: "inhale", duration: 4000 },
        { phase: "inhale", duration: 1500, label: "TOP UP" },
        { phase: "exhale", duration: 7000, label: "NATURALLY EXHALE" },
      ], 2),
      // Stage 2: Clear × 13
      ...repeat([
        { phase: "inhale", duration: 4000 },
        { phase: "exhale", duration: 6000 },
      ], 13),
      // Stage 3: Re-align × 8
      ...repeat([
        { phase: "inhale", duration: 5000 },
        { phase: "exhale", duration: 5000 },
      ], 8),
    ],
  },
};

function repeat(phases, n) {
  const result = [];
  for (let i = 0; i < n; i++) result.push(...phases);
  return result;
}

// Build timeline: array of { phase, duration, label, startMs, endMs }
function buildProtocolTimeline(protocolId) {
  const proto = PROTOCOLS[protocolId] || PROTOCOLS["deep-focus"];
  let offset = 0;
  return proto.phases.map((p) => {
    const entry = { ...p, startMs: offset, endMs: offset + p.duration };
    offset += p.duration;
    return entry;
  });
}

function getProtocolTitle(protocolId) {
  return (PROTOCOLS[protocolId] || PROTOCOLS["deep-focus"]).title;
}

function getProtocolTotalDuration(timeline) {
  return timeline.length > 0 ? timeline[timeline.length - 1].endMs : 0;
}
