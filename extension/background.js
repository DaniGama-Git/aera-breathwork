// background.js — polls Google Calendar iCal feed and triggers popup

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
  "deep work":    "deep-focus",
  "writing":      "deep-focus",
  "standup":      "context-switch",
  "stand-up":     "context-switch",
  "sync":         "context-switch",
  "1:1":          "pre-meeting",
  "one-on-one":   "pre-meeting",
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
  return "deep-focus"; // default fallback
}
const ALARM_NAME = "check-calendar";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: CHECK_INTERVAL_MINUTES });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  await checkCalendar();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "validate-calendar-url") return;

  validateCalendarUrl(message.icalUrl)
    .then(sendResponse)
    .catch((error) => {
      sendResponse({
        ok: false,
        error: error?.message || "Could not reach calendar. Check the URL.",
      });
    });

  return true;
});

async function validateCalendarUrl(icalUrl) {
  if (!icalUrl || !/^https:\/\/calendar\.google\.com\/calendar\/ical\//i.test(icalUrl)) {
    return { ok: false, error: "Please enter a valid Google Calendar iCal URL." };
  }

  const res = await fetch(icalUrl, { redirect: "follow" });
  if (!res.ok) {
    return { ok: false, error: `Calendar request failed (${res.status}).` };
  }

  const text = await res.text();
  if (!text.includes("BEGIN:VCALENDAR")) {
    return { ok: false, error: "This URL does not return a valid iCal feed." };
  }

  return { ok: true };
}

async function checkCalendar() {
  const data = await chrome.storage.local.get(["icalUrl", "keywords", "leadMinutes", "triggeredEvents"]);
  const { icalUrl, keywords, leadMinutes = 15, triggeredEvents = {} } = data;

  if (!icalUrl || !keywords || keywords.length === 0) return;

  try {
    const res = await fetch(icalUrl);
    if (!res.ok) return;
    const text = await res.text();

    const events = parseIcal(text);
    const now = Date.now();
    const windowMs = leadMinutes * 60 * 1000;

    for (const evt of events) {
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

          // Open as standalone floating window
          openStandalonePopup();
        }
      }
    }

    const cutoff = now - 24 * 60 * 60 * 1000;
    for (const uid of Object.keys(triggeredEvents)) {
      if (triggeredEvents[uid] < cutoff) delete triggeredEvents[uid];
    }
    await chrome.storage.local.set({ triggeredEvents });
  } catch (e) {
    console.error("āera: calendar check failed", e);
  }
}

function parseIcal(text) {
  const events = [];
  const blocks = text.split("BEGIN:VEVENT");

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split("END:VEVENT")[0];
    const summary = extractField(block, "SUMMARY") || "";
    const dtstart = extractField(block, "DTSTART");
    const uid = extractField(block, "UID") || `evt-${i}`;

    if (dtstart) {
      const start = parseIcalDate(dtstart);
      if (start) events.push({ summary, start, uid });
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

chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.notifications.clear(notificationId);
  chrome.storage.local.set({ autoStart: true });
  openStandalonePopup();
});

// Open a standalone floating popup window (not attached to toolbar)
async function openStandalonePopup() {
  const popupUrl = chrome.runtime.getURL("popup.html");

  // Check if one is already open
  const allWindows = await chrome.windows.getAll({ populate: true });
  for (const w of allWindows) {
    if (w.type === "popup" && w.tabs?.some(t => t.url?.includes("popup.html"))) {
      chrome.windows.update(w.id, { focused: true });
      return;
    }
  }

  // Get the current display work area to position top-right
  const currentWindow = await chrome.windows.getCurrent();
  const width = 360;
  const height = 520;
  const left = (currentWindow.left + currentWindow.width) - width - 24;
  const top = currentWindow.top + 60;

  chrome.windows.create({
    url: popupUrl,
    type: "popup",
    width,
    height,
    left,
    top,
    focused: true,
  });
}