// background.js — Smart Calendar Trigger Engine
// Polls Google Calendar iCal feed and triggers context-aware breathwork sessions

const CHECK_INTERVAL_MINUTES = 1;

// Keyword-stem → protocol-ID mapping
const KEYWORD_PROTOCOL_MAP = {
  "pitch":        "pre-pitch",
  "present":      "pre-pitch",
  "demo":         "pre-pitch",
  "interview":    "pre-pitch",
  "negotiat":     "pre-negotiation",
  "review":       "pre-negotiation",
  "feedback":     "pre-negotiation",
  "board":        "pre-negotiation",
  "brainstorm":   "creative-flow",
  "ideate":       "creative-flow",
  "creative":     "creative-flow",
  "workshop":     "creative-flow",
  "focus":        "deep-focus",
  "focus block":  "deep-focus",
  "deep work":    "deep-focus",
  "writing":      "deep-focus",
  "standup":      "context-switch",
  "stand-up":     "context-switch",
  "sync":         "context-switch",
  "1:1":          "pre-meeting",
  "one-on-one":   "pre-meeting",
  "all hands":    "pre-meeting",
  "meeting":      "pre-meeting",
  "call":         "pre-meeting",
  "check-in":     "pre-meeting",
  "morning":      "wake-me-up",
  "wake":         "wake-me-up",
  "energy":       "energy-reset",
  "recharge":     "energy-reset",
  "reset":        "rebound",
  "recover":      "rebound",
};

function resolveProtocol(matchedKeyword) {
  const kw = matchedKeyword.toLowerCase();
  for (const [stem, protocolId] of Object.entries(KEYWORD_PROTOCOL_MAP)) {
    if (kw.includes(stem)) return protocolId;
  }
  return "deep-focus";
}

// Protocol → category label for debug log display
const PROTOCOL_CATEGORY = {
  "pre-pitch": "Perform",
  "pre-negotiation": "Perform",
  "pre-meeting": "Perform",
  "decision-clarity": "Perform",
  "creative-flow": "Perform",
  "deep-focus": "Perform",
  "wake-me-up": "Activate",
  "energy-reset": "Activate",
  "back-to-back": "Recover",
  "rebound": "Recover",
  "context-switch": "Recover",
  "quick-recovery": "Recover",
  "anxiety-reset": "Recover",
  "conflict-reset": "Recover",
  "wind-down": "Ground",
  "travel-reset": "Ground",
  "deep-decompression": "Ground",
};

function categoryFor(protocolId) {
  return PROTOCOL_CATEGORY[protocolId] || "Perform";
}

const ALARM_NAME = "check-calendar";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: CHECK_INTERVAL_MINUTES });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  await checkCalendar();
  setTimeout(() => checkCalendar(), 30000);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "validate-calendar-url") {
    validateCalendarUrl(message.icalUrl)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error?.message || "Could not reach calendar. Check the URL.",
        });
      });
    return true;
  }

  if (message?.type === "open-breathe-session") {
    const protocolId = message.protocolId || "back-to-back";
    const targetTabId = message.targetTabId || null;
    (async () => {
      await chrome.storage.local.set({ activeProtocol: protocolId });
      await openBreathPanel(protocolId, targetTabId);
      sendResponse({ ok: true });
    })();
    return true;
  }
});

async function validateCalendarUrl(icalUrl) {
  if (!icalUrl || !/^https:\/\/calendar\.google\.com\/calendar\/ical\//i.test(icalUrl)) {
    return { ok: false, error: "Please enter a valid Google Calendar public iCal URL." };
  }
  const res = await fetch(icalUrl, { redirect: "follow" });
  if (!res.ok) return { ok: false, error: `Calendar request failed (${res.status}).` };
  const text = await res.text();
  if (!text.includes("BEGIN:VCALENDAR")) {
    return { ok: false, error: "This URL does not return a valid iCal feed." };
  }
  return { ok: true };
}

// ─── Smart Calendar Trigger Engine ───

async function fetchWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function resilientFetch(url) {
  try {
    return await fetchWithTimeout(url);
  } catch (e) {
    console.warn("āera: first fetch attempt failed, retrying in 2s…", e.name);
    await new Promise(r => setTimeout(r, 2000));
    return await fetchWithTimeout(url);
  }
}

async function checkCalendar() {
  const data = await chrome.storage.local.get([
    "icalUrl", "keywords", "triggers", "triggeredEvents",
  ]);
  const { icalUrl, keywords = [], triggers = [], triggeredEvents = {} } = data;

  // DEBUG-START
  const _logEntry = { ts: new Date().toISOString(), events: 0, summaries: [], triggers, keywords, result: null, error: null, matchedTriggers: [] };
  async function _pushLog(entry) {
    try {
      const d = await chrome.storage.local.get(["_debugLog"]);
      const logs = d._debugLog || [];
      logs.unshift(entry);
      await chrome.storage.local.set({ _debugLog: logs.slice(0, 30) });
    } catch (_) {}
  }
  // DEBUG-END

  if (!icalUrl) {
    // DEBUG-START
    _logEntry.result = "skip — no iCal URL configured";
    await _pushLog(_logEntry);
    // DEBUG-END
    return;
  }
  if (triggers.length === 0 && keywords.length === 0) {
    // DEBUG-START
    _logEntry.result = "skip — no triggers or keywords configured";
    await _pushLog(_logEntry);
    // DEBUG-END
    return;
  }

  // Validate URL format before fetching
  if (!/^https:\/\/calendar\.google\.com\/calendar\/ical\//i.test(icalUrl)) {
    console.warn("āera: stored iCal URL is not a valid Google Calendar URL, skipping check");
    // DEBUG-START
    _logEntry.result = "skip — invalid URL format";
    _logEntry.error = "URL does not match Google Calendar pattern";
    await _pushLog(_logEntry);
    // DEBUG-END
    return;
  }

  try {
    const res = await resilientFetch(icalUrl);
    if (!res.ok) {
      console.warn("āera: calendar fetch returned", res.status);
      // DEBUG-START
      _logEntry.result = "error — fetch failed";
      _logEntry.error = `HTTP ${res.status}`;
      await _pushLog(_logEntry);
      // DEBUG-END
      return;
    }
    const text = await res.text();

    const allEvents = parseIcal(text);
    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Filter to today's events only
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
    const todayEvents = allEvents
      .filter(e => e.start >= todayStart.getTime() && e.start <= todayEnd.getTime())
      .sort((a, b) => a.start - b.start);

    // DEBUG-START
    _logEntry.events = todayEvents.length;
    _logEntry.summaries = todayEvents.slice(0, 8).map(e => {
      const t = new Date(e.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return `${t} — ${e.summary.slice(0, 40)}`;
    });
    // Compute planned triggers
    const _planned = [];
    const _fmt = ts => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const _rel = ts => {
      const diff = ts - now;
      if (diff < 0) return `${Math.round(-diff / 60000)} min ago`;
      if (diff < 3600000) return `in ${Math.round(diff / 60000)} min`;
      return `in ${(diff / 3600000).toFixed(1)}h`;
    };

    // Plan: before_critical
    if (triggers.includes("before_critical") && keywords.length > 0) {
      for (const evt of todayEvents) {
        const matchedKw = keywords.find(kw => evt.summary.toLowerCase().includes(kw.toLowerCase()));
        if (matchedKw) {
          const protocolId = resolveProtocol(matchedKw);
          const status = triggeredEvents[evt.uid] ? "✓ fired" : "⏳ pending";
          _planned.push(`before_critical: '${matchedKw}' @ ${_fmt(evt.start)} → ${protocolId} (${_rel(evt.start)}) — ${status}`);
        }
      }
    }

    // Plan: back_to_back
    if (triggers.includes("back_to_back") && todayEvents.length >= 3) {
      const b2bKey = `b2b-${today}`;
      const block = detectBackToBack(todayEvents);
      if (block) {
        const blockNames = block.map(e => e.summary.slice(0, 20)).join(" → ");
        const gapTime = findFirstGap(block, 3 * 60 * 1000);
        const status = triggeredEvents[b2bKey] ? "✓ fired" : "⏳ pending";
        _planned.push(`back_to_back: ${block.length} events [${blockNames}], gap @ ${_fmt(gapTime)} (${_rel(gapTime)}) — ${status}`);
      } else {
        // Show gaps so user can see why no block was detected
        const gaps = [];
        for (let i = 1; i < todayEvents.length; i++) {
          const prevEnd = todayEvents[i - 1].end || (todayEvents[i - 1].start + 3600000);
          const gapMin = Math.round((todayEvents[i].start - prevEnd) / 60000);
          gaps.push(`${todayEvents[i - 1].summary.slice(0, 15)}→${todayEvents[i].summary.slice(0, 15)} ${gapMin}min`);
        }
        _planned.push(`back_to_back: no 3+ block (need <30min gaps) — ${gaps.join(", ")}`);
      }
    }

    // Plan: high_density
    if (triggers.includes("high_density") && todayEvents.length >= 4) {
      const densityKey = `density-${today}`;
      const firstStart = todayEvents[0].start;
      const lastEnd = todayEvents[todayEvents.length - 1].end || todayEvents[todayEvents.length - 1].start + 3600000;
      const midpoint = firstStart + (lastEnd - firstStart) / 2;
      const status = triggeredEvents[densityKey] ? "✓ fired" : "⏳ pending";
      _planned.push(`high_density: schedule ${_fmt(firstStart)}–${_fmt(lastEnd)}, midpoint @ ${_fmt(midpoint)} (${_rel(midpoint)}) → energy-reset — ${status}`);
    }

    // Plan: daily load cap
    if (triggers.includes("high_density")) {
      const loadKey = `load-${today}`;
      const totalMinutes = todayEvents.reduce((sum, e) => {
        const end = e.end || (e.start + 3600000);
        return sum + (end - e.start) / 60000;
      }, 0);
      if (totalMinutes > 390 || todayEvents.length >= 5) {
        const firstStart = todayEvents[0].start;
        const lastEnd = todayEvents[todayEvents.length - 1].end || todayEvents[todayEvents.length - 1].start + 3600000;
        const firePoint = firstStart + (lastEnd - firstStart) * 0.6;
        const status = triggeredEvents[loadKey] ? "✓ fired" : "⏳ pending";
        _planned.push(`load_cap: 60% @ ${_fmt(firePoint)} (${_rel(firePoint)}) — ${status}`);
      }
    }

    // Plan: end_of_day
    if (triggers.includes("end_of_day") && todayEvents.length > 0) {
      const eodKey = `eod-${today}`;
      const lastEvt = todayEvents[todayEvents.length - 1];
      const lastEnd = lastEvt.end || (lastEvt.start + 3600000);
      const fireTime = lastEnd + 60000;
      const status = triggeredEvents[eodKey] ? "✓ fired" : "⏳ pending";
      _planned.push(`end_of_day: last ends @ ${_fmt(lastEnd)} (fires ~${_fmt(fireTime)}, ${_rel(fireTime)}) — ${status}`);
    }

    // Plan: morning activation
    if (triggers.includes("energy_boost") && todayEvents.length > 0) {
      const morningKey = `morning-${today}`;
      const firstEvent = todayEvents[0];
      const fireTime = firstEvent.start - 10 * 60 * 1000;
      const status = triggeredEvents[morningKey] ? "✓ fired" : "⏳ pending";
      _planned.push(`morning: first @ ${_fmt(firstEvent.start)} (fires ~${_fmt(fireTime)}, ${_rel(fireTime)}) — ${status}`);
    }

    // Plan: mid-day energy
    if (triggers.includes("energy_boost") && todayEvents.length >= 4) {
      const midKey = `midday-${today}`;
      const firstStart = todayEvents[0].start;
      const lastEnd = todayEvents[todayEvents.length - 1].end || todayEvents[todayEvents.length - 1].start + 3600000;
      const midpoint = firstStart + (lastEnd - firstStart) / 2;
      const status = triggeredEvents[midKey] ? "✓ fired" : "⏳ pending";
      _planned.push(`midday_energy: schedule ${_fmt(firstStart)}–${_fmt(lastEnd)}, midpoint @ ${_fmt(midpoint)} (${_rel(midpoint)}) → energy-reset — ${status}`);
    }

    _logEntry.planned = _planned;
    // Compute which trigger types have planned entries
    const _matchedTriggerTypes = [];
    for (const p of _planned) {
      if (p.startsWith("before_critical:")) _matchedTriggerTypes.push("before_critical");
      else if (p.startsWith("back_to_back:") && !p.includes("no 3+ block")) _matchedTriggerTypes.push("back_to_back");
      else if (p.startsWith("high_density:")) _matchedTriggerTypes.push("high_density");
      else if (p.startsWith("load_cap:")) _matchedTriggerTypes.push("high_density");
      else if (p.startsWith("end_of_day:")) _matchedTriggerTypes.push("end_of_day");
      else if (p.startsWith("morning:")) _matchedTriggerTypes.push("energy_boost");
      else if (p.startsWith("midday_energy:")) _matchedTriggerTypes.push("energy_boost");
    }
    _logEntry.matchedTriggers = [...new Set(_matchedTriggerTypes)];
    // DEBUG-END

    let triggered = false;

    // ─── a) Pre-event (keyword match) ───
    if (triggers.includes("before_critical") && keywords.length > 0) {
      const leadMs = 5 * 60 * 1000 + 30000; // 5 min + 30s buffer
      for (const evt of todayEvents) {
        const timeDiff = evt.start - now;
        if (timeDiff > -60000 && timeDiff <= leadMs) {
          const matchedKw = keywords.find(kw =>
            evt.summary.toLowerCase().includes(kw.toLowerCase())
          );
          if (matchedKw && !triggeredEvents[evt.uid]) {
            const protocolId = resolveProtocol(matchedKw);
            triggeredEvents[evt.uid] = now;
            await fireTrigger(protocolId, evt.summary, triggeredEvents);
            triggered = true;
            // DEBUG-START
            _logEntry.result = `✓ triggered — before_critical: "${matchedKw}" → ${protocolId}`;
            // DEBUG-END
            break; // one trigger per check cycle
          }
        }
      }
    }

    // ─── b) Back-to-back blocks ───
    if (!triggered && triggers.includes("back_to_back") && todayEvents.length >= 3) {
      const b2bKey = `b2b-${today}`;
      if (!triggeredEvents[b2bKey]) {
        const block = detectBackToBack(todayEvents);
        if (block) {
          const blockNames = block.map(e => e.summary.slice(0, 20)).join(" → ");
          // Find the first gap >= 3 min in the block to schedule recovery
          const gapTime = findFirstGap(block, 3 * 60 * 1000);
          if (gapTime && Math.abs(gapTime - now) < 2 * 60 * 1000) {
            // We're within 2 min of the gap — fire now
            triggeredEvents[b2bKey] = now;
            await fireTrigger("back-to-back", "Back-to-back recovery", triggeredEvents);
            triggered = true;
            // DEBUG-START
            _logEntry.result = `✓ triggered — back_to_back: ${block.length} events [${blockNames}], gap @ ${_fmt(gapTime)} → back-to-back`;
            // DEBUG-END
          } else if (gapTime && gapTime > now && (gapTime - now) < 5 * 60 * 1000) {
            // Gap is coming up within 5 min — fire now so user gets it before the gap
            triggeredEvents[b2bKey] = now;
            await fireTrigger("back-to-back", "Back-to-back recovery", triggeredEvents);
            triggered = true;
            // DEBUG-START
            _logEntry.result = `✓ triggered — back_to_back (gap approaching): ${block.length} events [${blockNames}], gap @ ${_fmt(gapTime)} → back-to-back`;
            // DEBUG-END
          }
        }
      }
    }

    // ─── c) High-density day ───
    if (!triggered && triggers.includes("high_density")) {
      const densityKey = `density-${today}`;
      const b2bKey = `b2b-${today}`;
      if (!triggeredEvents[densityKey] && !triggeredEvents[b2bKey] && todayEvents.length >= 4) {
        const firstStart = todayEvents[0].start;
        const lastEnd = todayEvents[todayEvents.length - 1].end || todayEvents[todayEvents.length - 1].start + 3600000;
        const midpoint = firstStart + (lastEnd - firstStart) / 2;
        // Fire if we're within 2 min of the midpoint
        if (Math.abs(midpoint - now) < 2 * 60 * 1000) {
          triggeredEvents[densityKey] = now;
          await fireTrigger("energy-reset", "High-density day reset", triggeredEvents);
          triggered = true;
          // DEBUG-START
          _logEntry.result = `✓ triggered — high_density: schedule ${_fmt(firstStart)}–${_fmt(lastEnd)}, midpoint @ ${_fmt(midpoint)} → energy-reset`;
          // DEBUG-END
        }
      }
    }

    // ─── d) Daily load cap ───
    if (!triggered && triggers.includes("high_density")) {
      const loadKey = `load-${today}`;
      if (!triggeredEvents[loadKey]) {
        const totalMinutes = todayEvents.reduce((sum, e) => {
          const end = e.end || (e.start + 3600000);
          return sum + (end - e.start) / 60000;
        }, 0);
        if (totalMinutes > 390 || todayEvents.length >= 5) { // 6.5 hours = 390 min
          // Fire at ~60% through the day's schedule
          const firstStart = todayEvents[0].start;
          const lastEnd = todayEvents[todayEvents.length - 1].end || todayEvents[todayEvents.length - 1].start + 3600000;
          const firePoint = firstStart + (lastEnd - firstStart) * 0.6;
          if (Math.abs(firePoint - now) < 2 * 60 * 1000) {
            triggeredEvents[loadKey] = now;
            await fireTrigger("rebound", "Daily load cap reset", triggeredEvents);
            triggered = true;
            // DEBUG-START
            _logEntry.result = "✓ triggered — daily load cap → rebound";
            // DEBUG-END
          }
        }
      }
    }

    // ─── e) End-of-day ───
    if (!triggered && triggers.includes("end_of_day") && todayEvents.length > 0) {
      const eodKey = `eod-${today}`;
      if (!triggeredEvents[eodKey]) {
        const lastEvt = todayEvents[todayEvents.length - 1];
        const lastEnd = lastEvt.end || (lastEvt.start + 3600000);
        const timeSinceEnd = now - lastEnd;
        // Fire 1-2 min after last event ends
        if (timeSinceEnd >= 60000 && timeSinceEnd <= 3 * 60 * 1000) {
          triggeredEvents[eodKey] = now;
          await fireTrigger("back-to-back", "End-of-day recovery", triggeredEvents);
          triggered = true;
          // DEBUG-START
          _logEntry.result = `✓ triggered — end_of_day: last event "${lastEvt.summary.slice(0, 25)}" ended @ ${_fmt(lastEnd)} → back-to-back`;
          // DEBUG-END
        }
      }
    }

    // ─── f) Morning activation ───
    if (!triggered && triggers.includes("energy_boost") && todayEvents.length > 0) {
      const morningKey = `morning-${today}`;
      if (!triggeredEvents[morningKey]) {
        const firstEvent = todayEvents[0];
        const timeBefore = firstEvent.start - now;
        // 10 min before first event (with 2 min window)
        if (timeBefore > 0 && timeBefore <= 11 * 60 * 1000 && timeBefore >= 8 * 60 * 1000) {
          triggeredEvents[morningKey] = now;
          await fireTrigger("wake-me-up", "Morning activation", triggeredEvents);
          triggered = true;
          // DEBUG-START
          _logEntry.result = `✓ triggered — morning: first event "${firstEvent.summary.slice(0, 25)}" @ ${_fmt(firstEvent.start)} → wake-me-up`;
          // DEBUG-END
        }
      }
    }

    // ─── g) Mid-day energy boost ───
    if (!triggered && triggers.includes("energy_boost") && todayEvents.length >= 4) {
      const midKey = `midday-${today}`;
      const b2bKey = `b2b-${today}`;
      if (!triggeredEvents[midKey]) {
        const firstStart = todayEvents[0].start;
        const lastEnd = todayEvents[todayEvents.length - 1].end || todayEvents[todayEvents.length - 1].start + 3600000;
        const midpoint = firstStart + (lastEnd - firstStart) / 2;
        // Check no b2b fired within 90 min of midpoint
        const b2bTime = triggeredEvents[b2bKey];
        const b2bTooClose = b2bTime && Math.abs(b2bTime - midpoint) < 90 * 60 * 1000;
        if (!b2bTooClose && Math.abs(midpoint - now) < 2 * 60 * 1000) {
          triggeredEvents[midKey] = now;
          await fireTrigger("energy-reset", "Mid-day energy boost", triggeredEvents);
          triggered = true;
          // DEBUG-START
          _logEntry.result = `✓ triggered — midday_energy: schedule ${_fmt(firstStart)}–${_fmt(lastEnd)}, midpoint @ ${_fmt(midpoint)} → energy-reset`;
          // DEBUG-END
        }
      }
    }

    // DEBUG-START
    if (!triggered) {
      const pendingCount = _planned.filter(p => p.includes("⏳ pending")).length;
      const firedCount = _planned.filter(p => p.includes("✓ fired")).length;
      if (pendingCount > 0) {
        _logEntry.result = `${pendingCount} trigger${pendingCount !== 1 ? "s" : ""} planned${firedCount > 0 ? `, ${firedCount} already fired` : ""}`;
      } else if (firedCount > 0) {
        _logEntry.result = `${firedCount} trigger${firedCount !== 1 ? "s" : ""} already fired today`;
      } else {
        _logEntry.result = "no match — no trigger conditions met";
      }
    }
    await _pushLog(_logEntry);
    // DEBUG-END

    // Clean up old triggered events (>24h)
    const cutoff = now - 24 * 60 * 60 * 1000;
    for (const uid of Object.keys(triggeredEvents)) {
      if (triggeredEvents[uid] < cutoff) delete triggeredEvents[uid];
    }
    await chrome.storage.local.set({ triggeredEvents });
  } catch (e) {
    const redacted = icalUrl ? icalUrl.slice(0, 50) + "…" : "(no URL)";
    console.error(`āera: calendar check failed [${e.name}] for ${redacted}`, e.message);
    // DEBUG-START
    _logEntry.result = "error — exception";
    _logEntry.error = `${e.name}: ${e.message}`;
    await _pushLog(_logEntry);
    // DEBUG-END
  }
}

async function fireTrigger(protocolId, eventName, triggeredEvents) {
  await chrome.storage.local.set({
    triggeredEvents,
    autoStart: true,
    activeProtocol: protocolId,
    activeEventName: eventName,
  });
  openBreathPanel(protocolId);
}

// Detect back-to-back: 3+ consecutive events with <10 min gaps
function detectBackToBack(events) {
  let block = [events[0]];
  for (let i = 1; i < events.length; i++) {
    const prevEnd = block[block.length - 1].end || (block[block.length - 1].start + 3600000);
    const gap = events[i].start - prevEnd;
    if (gap < 30 * 60 * 1000) { // <30 min gap
      block.push(events[i]);
    } else {
      if (block.length >= 3) return block;
      block = [events[i]];
    }
  }
  return block.length >= 3 ? block : null;
}

// Find first gap >= minGap ms within a back-to-back block
function findFirstGap(block, minGap) {
  for (let i = 0; i < block.length - 1; i++) {
    const end = block[i].end || (block[i].start + 3600000);
    const gap = block[i + 1].start - end;
    if (gap >= minGap) return end; // return the start of the gap
  }
  // After the block ends
  const lastEnd = block[block.length - 1].end || (block[block.length - 1].start + 3600000);
  return lastEnd;
}

// ─── iCal Parser (with DTEND support) ───

function parseIcal(text) {
  const events = [];
  const blocks = text.split("BEGIN:VEVENT");

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split("END:VEVENT")[0];
    const summary = extractField(block, "SUMMARY") || "";
    const dtstart = extractField(block, "DTSTART");
    const dtend = extractField(block, "DTEND");
    const uid = extractField(block, "UID") || `evt-${i}`;

    if (dtstart) {
      const start = parseIcalDate(dtstart);
      const end = dtend ? parseIcalDate(dtend) : (start ? start + 3600000 : null); // default 1h
      if (start) events.push({ summary, start, end, uid });
    }
  }
  return events;
}

function extractField(block, field) {
  const regex = new RegExp(`^${field}[;:](.*)$`, "m");
  const match = block.match(regex);
  if (!match) return null;
  let value = match[1];
  if (match[0].includes(";")) {
    const colonIdx = value.indexOf(":");
    if (colonIdx !== -1) value = value.substring(colonIdx + 1);
  }
  return value.trim().replace(/\\n/g, " ").replace(/\r/g, "");
}

function parseIcalDate(str) {
  const clean = str.replace(/[^0-9TZ]/g, "");
  const m = clean.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}${clean.endsWith("Z") ? "Z" : ""}`;
  return new Date(iso).getTime();
}

// ─── Tab injection ───

function isInjectableTab(tab) {
  return !!tab?.id && /^https?:\/\//.test(tab.url || "");
}

async function findInjectableTab() {
  const lastFocusedTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const lastFocusedTab = lastFocusedTabs.find(isInjectableTab);
  if (lastFocusedTab) return lastFocusedTab;
  const activeTabs = await chrome.tabs.query({ active: true });
  return activeTabs.find(isInjectableTab) || null;
}

async function showOverlayInTab(tabId, protocolId) {
  try {
    return await chrome.tabs.sendMessage(tabId, {
      type: "show-breathe-overlay",
      protocolId,
    });
  } catch (_error) {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"],
    });
    return chrome.tabs.sendMessage(tabId, {
      type: "show-breathe-overlay",
      protocolId,
    });
  }
}

async function openBreathPanel(protocolId, preferredTabId) {
  if (preferredTabId) {
    try {
      const tab = await chrome.tabs.get(preferredTabId);
      if (isInjectableTab(tab)) {
        console.log("āera: using preferred tab", tab.id, tab.url);
        const result = await showOverlayInTab(tab.id, protocolId);
        if (result?.ok) {
          chrome.storage.local.remove(["autoStart"]);
          return;
        }
      }
    } catch (e) {
      console.log("āera: preferred tab lookup failed", e.message);
    }
  }

  if (preferredTabId) {
    await new Promise(r => setTimeout(r, 150));
  }

  try {
    const tab = await findInjectableTab();
    if (tab?.id) {
      console.log("āera: discovered tab", tab.id, tab.url);
      const result = await showOverlayInTab(tab.id, protocolId);
      if (result?.ok) {
        chrome.storage.local.remove(["autoStart"]);
        return;
      }
    }
  } catch (e) {
    console.log("āera: tab discovery/injection failed", e.message);
  }

  console.log("āera: no injectable tab available, doing nothing");
  chrome.storage.local.remove(["autoStart"]);
}