// ─── Tabs ───
const tabBreathe = document.getElementById("tab-breathe");
const tabSettings = document.getElementById("tab-settings");
const breathePanel = document.getElementById("breathe-panel");
const settingsPanel = document.getElementById("settings-panel");

tabBreathe.addEventListener("click", () => {
  tabBreathe.classList.add("active");
  tabSettings.classList.remove("active");
  breathePanel.classList.remove("hidden");
  settingsPanel.classList.remove("visible");
});
tabSettings.addEventListener("click", () => {
  tabSettings.classList.add("active");
  tabBreathe.classList.remove("active");
  breathePanel.classList.add("hidden");
  settingsPanel.classList.add("visible");
  loadSettings();
});

// ─── Settings ───
const icalInput = document.getElementById("ical-url");
const keywordsInput = document.getElementById("keywords");
const leadInput = document.getElementById("lead-minutes");
const saveBtn = document.getElementById("save-btn");
const statusEl = document.getElementById("status");
const connectionDot = document.getElementById("connection-dot");
const connectionText = document.getElementById("connection-text");
const urlValidated = document.getElementById("url-validated");

async function loadSettings() {
  const data = await chrome.storage.local.get(["icalUrl", "keywords", "leadMinutes", "defaultsApplied"]);

  // On first run, check for bundled defaults.json
  if (!data.defaultsApplied) {
    try {
      const resp = await fetch(chrome.runtime.getURL("defaults.json"));
      if (resp.ok) {
        const defaults = await resp.json();
        if (defaults.keywords?.length && !data.keywords?.length) {
          await chrome.storage.local.set({
            keywords: defaults.keywords,
            leadMinutes: defaults.leadMinutes ?? 15,
            defaultsApplied: true,
          });
          data.keywords = defaults.keywords;
          data.leadMinutes = defaults.leadMinutes ?? 15;
        }
      }
    } catch (_) { /* no defaults.json bundled — skip */ }
    await chrome.storage.local.set({ defaultsApplied: true });
  }

  icalInput.value = data.icalUrl || "";
  keywordsInput.value = (data.keywords || []).join(", ");
  leadInput.value = data.leadMinutes ?? 15;
  updateConnectionStatus(!!data.icalUrl);
}

function updateConnectionStatus(connected) {
  connectionDot.classList.toggle("connected", connected);
  connectionText.textContent = connected ? "Calendar connected" : "Not configured";
}

saveBtn.addEventListener("click", async () => {
  const icalUrl = icalInput.value.trim();
  const keywords = keywordsInput.value.split(",").map(k => k.trim()).filter(Boolean);
  const leadMinutes = parseInt(leadInput.value) || 15;

  if (!icalUrl) { showStatus("Please enter your iCal URL", true); return; }
  if (keywords.length === 0) { showStatus("Please enter at least one keyword", true); return; }

  try {
    const result = await chrome.runtime.sendMessage({ type: "validate-calendar-url", icalUrl });
    if (!result?.ok) { showStatus(result?.error || "Could not reach calendar.", true); return; }
  } catch (e) {
    showStatus("Could not validate calendar. Reload and try again.", true);
    return;
  }

  await chrome.storage.local.set({ icalUrl, keywords, leadMinutes });
  updateConnectionStatus(true);
  urlValidated.classList.add("visible");
  showStatus(`Connected. Watching for: ${keywords.join(", ")}`);
});

function showStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.className = "status visible" + (isError ? " error" : "");
  setTimeout(() => (statusEl.className = "status"), 4000);
}

chrome.storage.local.get(["icalUrl"], data => updateConnectionStatus(!!data.icalUrl));

// ─── Wave-style Breathing (Image + Gradient Mask) ───
const card = document.getElementById("card");
const bgLogo = document.getElementById("bg-logo");
const bgIntro = document.getElementById("bg-intro");
const bgBreathing = document.getElementById("bg-breathing");
const gradientMask = document.getElementById("gradient-mask");
const screenLoading = document.getElementById("screen-loading");
const screenLogo = document.getElementById("screen-logo");
const screenIntro = document.getElementById("screen-intro");
const screenDone = document.getElementById("screen-done");
const breathingUI = document.getElementById("breathing-ui");
const progressLine = document.getElementById("progress-line");
const phaseLabel = document.getElementById("phase-label");
const sessionProgressWrap = document.getElementById("session-progress-wrap");
const sessionProgressFill = document.getElementById("session-progress-fill");
const transitionOverlay = document.getElementById("transition-overlay");
const transitionTextEl = document.getElementById("transition-text");
const scienceOverlay = document.getElementById("science-overlay");
const scienceTextEl = document.getElementById("science-text");
const againBtn = document.getElementById("again-btn");
const introTitle = document.getElementById("intro-title");
const introSubtitle = document.getElementById("intro-subtitle");
const introText = document.getElementById("intro-text");
const sessionControls = document.getElementById("session-controls");
const ctrlStop = document.getElementById("ctrl-stop");
const ctrlClose = document.getElementById("ctrl-close");

let running = false;
let sessionStart = 0;
let raf = 0;
let activeTimeline = [];
let activeTotalMs = 0;
let activeProtocolId = "back-to-back";
let hasStartedBreathing = false;
let startsWithOverlay = false;
let triggeredMode = false;

const BAR_TOP = 10;
const BAR_BOTTOM = 92;
const TRANSITION_DURATION = 4500;
const SCIENCE_DURATION = 5000;

// ─── Preload images ───
const ALL_IMAGES = [
  "wave-bg-logo.png",
  "wave-bg-intro.png",
  "wave-bg-description.png",
  "wave-bg-inhale.png",
  "lightbulb.png",
];

function preloadImages(srcs) {
  return Promise.all(
    srcs.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    }))
  );
}

// ─── Build full timeline from protocol (with TRANSITION/SCIENCE entries) ───
function buildFullTimeline(protocolId) {
  const proto = PROTOCOLS[protocolId] || PROTOCOLS["back-to-back"];
  const entries = [];
  let cursor = 0;

  proto.stages.forEach((stage, stageIdx) => {
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

    for (let c = 0; c < (stage.cycles || 0); c++) {
      if (stage.midSetHold && c === stage.midSetHold.afterCycle) {
        const hp = stage.midSetHold.phase;
        entries.push({
          type: hp.type || "HOLD",
          duration: hp.duration,
          startMs: cursor,
          endMs: cursor + hp.duration,
          displayLabel: hp.label || "HOLD",
          stageIndex: stageIdx,
        });
        cursor += hp.duration;
      }
      for (const phase of stage.cycle) {
        const label = phase.label || phase.phase.toUpperCase();
        entries.push({
          type: phase.phase.toUpperCase(),
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

  if (proto.finalSequence) {
    for (const phase of proto.finalSequence) {
      entries.push({
        type: phase.phase.toUpperCase(),
        duration: phase.duration,
        startMs: cursor,
        endMs: cursor + phase.duration,
        displayLabel: phase.label || phase.phase.toUpperCase(),
        stageIndex: proto.stages.length,
      });
      cursor += phase.duration;
    }
  }

  return entries;
}

function setProtocol(protocolId) {
  activeProtocolId = protocolId || "back-to-back";
  activeTimeline = buildFullTimeline(activeProtocolId);
  activeTotalMs = activeTimeline.length > 0 ? activeTimeline[activeTimeline.length - 1].endMs : 0;

  const proto = PROTOCOLS[activeProtocolId] || PROTOCOLS["back-to-back"];
  const mins = Math.round(activeTotalMs / 60000);
  introTitle.textContent = proto.title.toUpperCase();
  introSubtitle.textContent = `~${mins} MINS`;
  introText.textContent = proto.introText || "";

  startsWithOverlay = activeTimeline.length > 0 &&
    (activeTimeline[0].type === "SCIENCE" || activeTimeline[0].type === "TRANSITION");
}

// ─── Gradient mask ───
function buildMask(barTop) {
  return `linear-gradient(180deg,
    rgba(255,255,255,0) ${Math.max(0, barTop - 12)}%,
    rgba(255,255,255,0.15) ${Math.max(0, barTop - 4)}%,
    rgba(255,255,255,0.35) ${barTop}%,
    rgba(255,255,255,0.55) ${Math.min(100, barTop + 6)}%,
    rgba(255,255,255,0.75) ${Math.min(100, barTop + 14)}%,
    rgba(255,255,255,0.9) 100%)`;
}

function getBarPosition(type, progress, prevType) {
  switch (type) {
    case "INHALE": return BAR_BOTTOM - progress * (BAR_BOTTOM - BAR_TOP);
    case "EXHALE": return BAR_BOTTOM - (1 - progress) * (BAR_BOTTOM - BAR_TOP);
    case "HOLD": return BAR_TOP;
    case "HOLD_EMPTY": return BAR_BOTTOM;
    case "SNIFF": {
      // Sniff starts where inhale left off (top) and moves just a tiny bit higher
      const sniffRange = (BAR_BOTTOM - BAR_TOP) * 0.08; // 8% of total range
      return BAR_TOP - progress * sniffRange;
    }
    case "TRANSITION":
    case "SCIENCE":
      return (prevType === "INHALE" || prevType === "HOLD" || prevType === "SNIFF") ? BAR_TOP : BAR_BOTTOM;
    default: return BAR_BOTTOM;
  }
}

// ─── Screen management ───
function showScreen(name) {
  [screenLoading, screenLogo, screenIntro, screenDone].forEach(el => el.classList.remove("active"));
  [bgLogo, bgIntro, bgBreathing].forEach(el => el.classList.remove("active"));
  breathingUI.classList.remove("active");
  gradientMask.classList.remove("active");
  transitionOverlay.classList.remove("active");
  scienceOverlay.classList.remove("active");
  if (!triggeredMode) sessionControls.classList.remove("active");

  if (name === "loading") {
    screenLoading.classList.add("active");
  } else if (name === "logo") {
    screenLogo.classList.add("active");
    bgLogo.classList.add("active");
  } else if (name === "intro") {
    screenIntro.classList.add("active");
    bgIntro.classList.add("active");
  } else if (name === "breathing") {
    bgBreathing.classList.add("active");
    breathingUI.classList.add("active");
    gradientMask.classList.add("active");
    sessionControls.classList.add("active");
  } else if (name === "done") {
    screenDone.classList.add("active");
    bgLogo.classList.add("active");
  }
}

// ─── Session controls ───
ctrlStop.addEventListener("click", () => {
  running = false;
  cancelAnimationFrame(raf);
  showScreen("done");
});

ctrlClose.addEventListener("click", () => {
  running = false;
  cancelAnimationFrame(raf);
  window.close();
});


function fadeTransition(from, to, delay) {
  setTimeout(() => {
    showScreen(to);
  }, delay);
}

// ─── Breathing animation ───
let prevEntryType = undefined;

function animate() {
  if (!running) return;

  const elapsed = Date.now() - sessionStart;

  if (elapsed >= activeTotalMs) {
    running = false;
    showScreen("done");
    return;
  }

  const entry = activeTimeline.find(e => elapsed >= e.startMs && elapsed < e.endMs);
  if (!entry) {
    raf = requestAnimationFrame(animate);
    return;
  }

  const progress = (elapsed - entry.startMs) / entry.duration;
  const isOverlay = entry.type === "TRANSITION" || entry.type === "SCIENCE";

  if (entry.type === "TRANSITION") {
    transitionTextEl.textContent = entry.transitionText || "";
    transitionOverlay.classList.add("active");
    scienceOverlay.classList.remove("active");
    phaseLabel.textContent = "";
  } else if (entry.type === "SCIENCE") {
    scienceTextEl.textContent = entry.scienceText || "";
    scienceOverlay.classList.add("active");
    transitionOverlay.classList.remove("active");
    phaseLabel.textContent = "";
  } else {
    if (!hasStartedBreathing) hasStartedBreathing = true;
    transitionOverlay.classList.remove("active");
    scienceOverlay.classList.remove("active");
    phaseLabel.textContent = entry.displayLabel;
  }

  const barTop = getBarPosition(entry.type, progress, prevEntryType);
  progressLine.style.top = barTop + "%";
  gradientMask.style.background = buildMask(barTop);

  // Hide bar/label during overlays or before first breath
  const hideBar = isOverlay || (!hasStartedBreathing && startsWithOverlay);
  progressLine.style.opacity = hideBar ? "0" : "1";
  phaseLabel.style.opacity = hideBar ? "0" : "1";
  sessionProgressWrap.style.opacity = hideBar ? "0" : "1";

  // Update session progress bar
  const pct = Math.min(100, (elapsed / activeTotalMs) * 100);
  sessionProgressFill.style.width = pct.toFixed(1) + "%";

  prevEntryType = entry.type;
  raf = requestAnimationFrame(animate);
}

function startSession() {
  running = true;
  sessionStart = Date.now();
  hasStartedBreathing = false;
  prevEntryType = undefined;
  showScreen("breathing");
  gradientMask.style.background = buildMask(BAR_BOTTOM);
  progressLine.style.top = BAR_BOTTOM + "%";
  sessionProgressFill.style.width = "0%";
  raf = requestAnimationFrame(animate);
}

function restart() {
  showScreen("intro");
  setTimeout(() => {
    startSession();
  }, 3000);
}

againBtn.addEventListener("click", restart);

// ─── Init ───
// Show loading immediately so Chrome sizes the popup correctly
setProtocol("back-to-back");
showScreen("loading");

chrome.storage.local.get(["autoStart", "activeProtocol"], data => {
  if (data.autoStart) {
    // Calendar-triggered: borderless standalone mode
    triggeredMode = true;
    document.body.classList.add("triggered-mode");
    chrome.storage.local.remove(["autoStart", "activeProtocol"]);
    setProtocol(data.activeProtocol || "back-to-back");
    sessionControls.classList.add("active");
  }

  preloadImages(ALL_IMAGES).then(() => {
    showScreen("logo");
    setTimeout(() => {
      showScreen("intro");
      setTimeout(() => startSession(), 3000);
    }, 2200);
  });
});
