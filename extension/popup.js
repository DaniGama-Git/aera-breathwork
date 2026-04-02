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

async function loadSettings() {
  const data = await chrome.storage.local.get(["icalUrl", "keywords", "leadMinutes"]);
  icalInput.value = data.icalUrl || "";
  keywordsInput.value = (data.keywords || []).join(", ");
  leadInput.value = data.leadMinutes ?? 2;
  updateConnectionStatus(!!data.icalUrl);
}

function updateConnectionStatus(connected) {
  connectionDot.classList.toggle("connected", connected);
  connectionText.textContent = connected ? "Calendar connected" : "Not configured";
}

saveBtn.addEventListener("click", async () => {
  const icalUrl = icalInput.value.trim();
  const keywords = keywordsInput.value.split(",").map(k => k.trim()).filter(Boolean);
  const leadMinutes = parseInt(leadInput.value) || 2;

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
  showStatus(`Saved. Watching for: ${keywords.join(", ")}`);
});

function showStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.className = "status visible" + (isError ? " error" : "");
  setTimeout(() => (statusEl.className = "status"), 4000);
}

chrome.storage.local.get(["icalUrl"], data => updateConnectionStatus(!!data.icalUrl));

// ─── Wave Breathing ───
const canvas = document.getElementById("wave-canvas");
const ctx = canvas.getContext("2d");
const card = document.getElementById("card");
const startOverlay = document.getElementById("start-overlay");
const doneOverlay = document.getElementById("done-overlay");
const startBtnEl = document.getElementById("start-btn");
const phaseLabel = document.getElementById("phase-label");
const roundLabel = document.getElementById("round-label");
const progressFill = document.getElementById("progress-fill");

// Session config
const TOTAL_ROUNDS = 3;
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

let running = false;
let sessionStart = 0;
let raf = 0;

// Wave level: 0 = wave at bottom (white card), 1 = wave at top (dark card)
// Inhale = wave rises (dark fills card) → exhale = wave falls (white shows)
let waveLevel = 0.45; // resting position
let targetLevel = 0.45;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = card.clientWidth;
  const h = card.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);
}

function drawWave(time) {
  const w = card.clientWidth;
  const h = card.clientHeight;

  ctx.clearRect(0, 0, w, h);

  // Smoothly approach target
  waveLevel += (targetLevel - waveLevel) * 0.04;

  // Wave Y position (0=top, h=bottom)
  const baseY = h * (1 - waveLevel);

  // Draw dark region from top to wave
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, baseY);

  // Smooth wave curve
  const amplitude = 12 + 6 * Math.sin(time * 0.0008);
  const freq = 0.012;
  const speed = time * 0.0012;

  for (let x = w; x >= 0; x -= 2) {
    const y = baseY
      + Math.sin(x * freq + speed) * amplitude
      + Math.sin(x * freq * 1.8 + speed * 1.3) * (amplitude * 0.4);
    ctx.lineTo(x, y);
  }

  ctx.closePath();

  // Dark fill
  ctx.fillStyle = "#3a3a3c";
  ctx.fill();
}

function getPhaseAt(elapsed) {
  const cycleTime = elapsed % CYCLE_MS;
  if (cycleTime < INHALE_MS) return "inhale";
  if (cycleTime < INHALE_MS + HOLD_MS) return "hold";
  return "exhale";
}

function getRoundAt(elapsed) {
  return Math.min(Math.floor(elapsed / CYCLE_MS), TOTAL_ROUNDS - 1);
}

function animate(time) {
  if (!running) return;

  const elapsed = Date.now() - sessionStart;
  const totalDuration = CYCLE_MS * TOTAL_ROUNDS;

  if (elapsed >= totalDuration) {
    // Session done
    running = false;
    targetLevel = 0.45;
    doneOverlay.classList.add("visible");
    phaseLabel.textContent = "";
    roundLabel.textContent = "";
    drawWave(time);
    return;
  }

  const phase = getPhaseAt(elapsed);
  const round = getRoundAt(elapsed);
  const cycleElapsed = elapsed % CYCLE_MS;

  // Update wave target based on phase
  if (phase === "inhale") {
    // Rise from 0.35 to 0.85
    const t = cycleElapsed / INHALE_MS;
    targetLevel = 0.35 + 0.5 * easeInOut(t);
  } else if (phase === "hold") {
    targetLevel = 0.85;
  } else {
    // Exhale: fall from 0.85 to 0.35
    const t = (cycleElapsed - INHALE_MS - HOLD_MS) / EXHALE_MS;
    targetLevel = 0.85 - 0.5 * easeInOut(t);
  }

  // Update labels
  const labels = { inhale: "INHALE", hold: "HOLD", exhale: "EXHALE" };
  phaseLabel.textContent = labels[phase];
  roundLabel.textContent = `ROUND ${round + 1}/${TOTAL_ROUNDS}`;
  progressFill.style.width = `${((elapsed / totalDuration) * 100).toFixed(1)}%`;

  drawWave(time);
  raf = requestAnimationFrame(animate);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function startSession() {
  running = true;
  sessionStart = Date.now();
  waveLevel = 0.35;
  targetLevel = 0.35;
  startOverlay.classList.add("hidden");
  doneOverlay.classList.remove("visible");
  phaseLabel.textContent = "INHALE";
  roundLabel.textContent = `ROUND 1/${TOTAL_ROUNDS}`;
  progressFill.style.width = "0%";
  raf = requestAnimationFrame(animate);
}

// Idle wave animation
function idleAnimate(time) {
  if (running) return;
  // Gentle breathing idle
  targetLevel = 0.45 + 0.05 * Math.sin(time * 0.001);
  drawWave(time);
  requestAnimationFrame(idleAnimate);
}

// Init
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
startBtnEl.addEventListener("click", startSession);

// Start idle animation
requestAnimationFrame(idleAnimate);

// Auto-start if triggered by calendar
chrome.storage.local.get(["autoStart"], data => {
  if (data.autoStart) {
    chrome.storage.local.remove("autoStart");
    startSession();
  }
});