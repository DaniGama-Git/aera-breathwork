// background.js — Smart Calendar Trigger Engine
// Polls Google Calendar iCal feed and triggers breathing sessions
// based on user-configured trigger patterns.

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

// ─── Alarm setup ───
const ALARM_NAME = "check-calendar";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: CHECK_INTERVAL_MINUTES });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  await checkCalendar();
  setTimeout(() => checkCalendar(), 30000);
});

// ─── Message handlers ───
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
    return { ok: false, error: "Please enter a valid Google Calendar iCal URL." };
  }
  const res = await fetch(icalUrl, { redirect: "follow" });
  if (!res.ok) return { ok: false, error: `Calendar request failed (${res.status}).` };
  const text = await res.text();
  if (!text.includes("BEGIN:VCALENDAR")) {
    return { ok: false, error: "This URL does not return a valid iCal feed." };
  }
  return { ok: true };
}

// ─── Helpers ───
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isSameDay(ts) {
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

// ─── Smart Calendar Trigger Engine ───
async function checkCalendar() {
  const data = await chrome.storage.local.get([
    "icalUrl", "keywords", "leadMinutes", "triggeredEvents", "triggers"
  ]);
  const {
    icalUrl,
    keywords = [],
    leadMinutes = 5,
    triggeredEvents = {},
    triggers = ["before_critical"],
  } = data;

  if (!icalUrl) return;

  try {
    const res = await fetch(icalUrl);
    if (!res.ok) return;
    const text = await res.text();

    const allEvents = parseIcal(text);
    const now = Date.now();
    const today = todayKey();

    // Filter to today's events
    const todayEvents = allEvents
      .filter(e => isSameDay(e.start))
      .sort((a, b) => a.start - b.start);

    // ─── a) Pre-event (keyword match) ───
    if (triggers.includes("before_critical") && keywords.length > 0) {
      const windowMs = leadMinutes * 60 * 1000 + 30000;
      for (const evt of allEvents) {
        const timeDiff = evt.start - now;
        if (timeDiff > -60000 && timeDiff <= windowMs) {
          const matchesKeyword = keywords.some((kw) =>
            evt.summary.toLowerCase().includes(kw.toLowerCase())
          );
          if (matchesKeyword && !triggeredEvents[evt.uid]) {
            const matchedKw = keywords.find((kw) =>
              evt.summary.toLowerCase().includes(kw.toLowerCase())
            );
            const protocolId = resolveProtocol(matchedKw || "");
            triggeredEvents[evt.uid] = Date.now();
            await chrome.storage.local.set({
              triggeredEvents,
              autoStart: true,
              activeProtocol: protocolId,
              activeEventName: evt.summary,
            });
            openBreathPanel(protocolId);
          }
        }
      }
    }

    // ─── b) Back-to-back blocks ───
    if (triggers.includes("back_to_back") && todayEvents.length >= 3) {
      const b2bKey = `b2b-${today}`;
      if (!triggeredEvents[b2bKey]) {
        // Find consecutive events with <10 min gaps
        let blockStart = 0;
        let blockLen = 1;
        let bestBlock = null;

        for (let i = 1; i < todayEvents.length; i++) {
          const prevEnd = todayEvents[i - 1].end || (todayEvents[i - 1].start + 30 * 60000);
          const gap = todayEvents[i].start - prevEnd;
          if (gap < 10 * 60000) {
            blockLen++;
            if (blockLen >= 3 && (!bestBlock || blockLen > bestBlock.length)) {
              bestBlock = { start: blockStart, length: blockLen };
            }
          } else {
            blockStart = i;
            blockLen = 1;
          }
        }

        if (bestBlock) {
          // Find first gap >= 3 min within or right after the block
          const blockEnd = bestBlock.start + bestBlock.length;
          let triggerTime = null;

          for (let i = bestBlock.start; i < Math.min(blockEnd, todayEvents.length - 1); i++) {
            const prevEnd = todayEvents[i].end || (todayEvents[i].start + 30 * 60000);
            const gapMs = todayEvents[i + 1].start - prevEnd;
            if (gapMs >= 3 * 60000) {
              triggerTime = prevEnd + 60000; // 1 min into the gap
              break;
            }
          }

          // If no gap in block, try right after block ends
          if (!triggerTime && blockEnd <= todayEvents.length) {
            const lastInBlock = todayEvents[blockEnd - 1];
            triggerTime = (lastInBlock.end || (lastInBlock.start + 30 * 60000)) + 60000;
          }

          if (triggerTime) {
            const diff = triggerTime - now;
            if (diff > -60000 && diff <= 90000) {
              triggeredEvents[b2bKey] = now;
              await chrome.storage.local.set({
                triggeredEvents,
                autoStart: true,
                activeProtocol: "back-to-back",
                activeEventName: "Back-to-back recovery",
              });
              openBreathPanel("back-to-back");
            }
          }
        }
      }
    }

    // ─── c) High-density day ───
    if (triggers.includes("high_density") && todayEvents.length >= 4) {
      const densityKey = `density-${today}`;
      const b2bKey = `b2b-${today}`;
      if (!triggeredEvents[densityKey] && !triggeredEvents[b2bKey]) {
        const firstStart = todayEvents[0].start;
        const lastEnd = todayEvents[todayEvents.length - 1].end ||
          (todayEvents[todayEvents.length - 1].start + 30 * 60000);
        const midpoint = firstStart + (lastEnd - firstStart) / 2;
        const diff = midpoint - now;

        if (diff > -60000 && diff <= 90000) {
          triggeredEvents[densityKey] = now;
          await chrome.storage.local.set({
            triggeredEvents,
            autoStart: true,
            activeProtocol: "energy-reset",
            activeEventName: "Mid-day reset",
          });
          openBreathPanel("energy-reset");
        }
      }
    }

    // ─── d) Daily load cap ───
    if (triggers.includes("high_density")) {
      const loadKey = `load-${today}`;
      if (!triggeredEvents[loadKey]) {
        const totalMinutes = todayEvents.reduce((acc, evt) => {
          const end = evt.end || (evt.start + 30 * 60000);
          return acc + (end - evt.start) / 60000;
        }, 0);

        if (totalMinutes > 390 || todayEvents.length >= 5) {
          // Fire at ~70% through the day's schedule
          const firstStart = todayEvents[0].start;
          const lastEnd = todayEvents[todayEvents.length - 1].end ||
            (todayEvents[todayEvents.length - 1].start + 30 * 60000);
          const fireAt = firstStart + (lastEnd - firstStart) * 0.7;
          const diff = fireAt - now;

          if (diff > -60000 && diff <= 90000) {
            triggeredEvents[loadKey] = now;
            await chrome.storage.local.set({
              triggeredEvents,
              autoStart: true,
              activeProtocol: "rebound",
              activeEventName: "Daily reset",
            });
            openBreathPanel("rebound");
          }
        }
      }
    }

    // ─── e) End-of-day ───
    if (triggers.includes("end_of_day") && todayEvents.length > 0) {
      const eodKey = `eod-${today}`;
      if (!triggeredEvents[eodKey]) {
        const lastEvt = todayEvents[todayEvents.length - 1];
        const lastEnd = lastEvt.end || (lastEvt.start + 30 * 60000);
        const fireAt = lastEnd + 90000; // 1.5 min after last event
        const diff = fireAt - now;

        if (diff > -60000 && diff <= 90000) {
          triggeredEvents[eodKey] = now;
          await chrome.storage.local.set({
            triggeredEvents,
            autoStart: true,
            activeProtocol: "back-to-back",
            activeEventName: "End-of-day recovery",
          });
          openBreathPanel("back-to-back");
        }
      }
    }

    // ─── f) Morning activation ───
    if (triggers.includes("energy_boost") && todayEvents.length > 0) {
      const morningKey = `morning-${today}`;
      if (!triggeredEvents[morningKey]) {
        const firstStart = todayEvents[0].start;
        const fireAt = firstStart - 10 * 60000; // 10 min before first event
        const diff = fireAt - now;

        if (diff > -60000 && diff <= 90000) {
          triggeredEvents[morningKey] = now;
          await chrome.storage.local.set({
            triggeredEvents,
            autoStart: true,
            activeProtocol: "wake-me-up",
            activeEventName: "Morning activation",
          });
          openBreathPanel("wake-me-up");
        }
      }
    }

    // ─── g) Mid-day energy boost ───
    if (triggers.includes("energy_boost") && todayEvents.length >= 4) {
      const midKey = `mid-energy-${today}`;
      const b2bKey = `b2b-${today}`;
      if (!triggeredEvents[midKey]) {
        const firstStart = todayEvents[0].start;
        const lastEnd = todayEvents[todayEvents.length - 1].end ||
          (todayEvents[todayEvents.length - 1].start + 30 * 60000);
        const midpoint = firstStart + (lastEnd - firstStart) / 2;

        // Only if no b2b recovery fired within 90 min of midpoint
        const b2bFiredAt = triggeredEvents[b2bKey];
        const b2bTooClose = b2bFiredAt && Math.abs(b2bFiredAt - midpoint) < 90 * 60000;

        if (!b2bTooClose) {
          const diff = midpoint - now;
          if (diff > -60000 && diff <= 90000) {
            triggeredEvents[midKey] = now;
            await chrome.storage.local.set({
              triggeredEvents,
              autoStart: true,
              activeProtocol: "energy-reset",
              activeEventName: "Mid-day energy boost",
            });
            openBreathPanel("energy-reset");
          }
        }
      }
    }

    // Cleanup old triggered events (>24h)
    const cutoff = now - 24 * 60 * 60 * 1000;
    for (const uid of Object.keys(triggeredEvents)) {
      if (triggeredEvents[uid] < cutoff) delete triggeredEvents[uid];
    }
    await chrome.storage.local.set({ triggeredEvents });
  } catch (e) {
    console.error("āera: calendar check failed", e);
  }
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
      const end = dtend ? parseIcalDate(dtend) : null;
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
