// content.js — injects / removes the āera breathing overlay iframe

const IFRAME_ID = "aera-breathe-overlay";
const IFRAME_WIDTH = 290;
const IFRAME_HEIGHT = 400;

function injectOverlay(protocolId) {
  // Don't double-inject
  if (document.getElementById(IFRAME_ID)) {
    const existing = document.getElementById(IFRAME_ID);
    existing.style.display = "block";
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.id = IFRAME_ID;
  iframe.src = chrome.runtime.getURL("popup.html?triggered=true&iframe=true");
  iframe.setAttribute("allow", "autoplay");
  iframe.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: ${IFRAME_WIDTH}px;
    height: ${IFRAME_HEIGHT}px;
    border: none;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15);
    z-index: 2147483647;
    background: transparent;
    overflow: hidden;
  `;

  document.body.appendChild(iframe);
}

function removeOverlay() {
  const iframe = document.getElementById(IFRAME_ID);
  if (iframe) iframe.remove();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "show-breathe-overlay") {
    injectOverlay(message.protocolId);
    sendResponse({ ok: true });
  }
  if (message?.type === "hide-breathe-overlay") {
    removeOverlay();
    sendResponse({ ok: true });
  }
});
