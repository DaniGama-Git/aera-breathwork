// content.js — injects / removes the āera breathing overlay iframe

const IFRAME_ID = "aera-breathe-overlay";
const WRAPPER_ID = "aera-breathe-wrapper";
const IFRAME_WIDTH = 290;
const IFRAME_HEIGHT = 400;

function injectOverlay(protocolId) {
  // Don't double-inject
  if (document.getElementById(WRAPPER_ID)) {
    const existing = document.getElementById(WRAPPER_ID);
    existing.style.display = "block";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = WRAPPER_ID;
  wrapper.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  `;

  const iframe = document.createElement("iframe");
  iframe.id = IFRAME_ID;
  iframe.src = chrome.runtime.getURL("popup.html?triggered=true&iframe=true");
  iframe.setAttribute("allow", "autoplay");
  iframe.style.cssText = `
    width: ${IFRAME_WIDTH}px;
    height: ${IFRAME_HEIGHT}px;
    border: none;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15);
    background: transparent;
    overflow: hidden;
    flex-shrink: 0;
  `;

  wrapper.appendChild(iframe);
  document.body.appendChild(wrapper);

  // Listen for close message from iframe
  window.addEventListener("message", handleIframeMessage);
}

function handleIframeMessage(event) {
  if (event.data?.type === "close-overlay") {
    removeOverlay();
  }
}

function removeOverlay() {
  const wrapper = document.getElementById(WRAPPER_ID);
  if (wrapper) wrapper.remove();
  window.removeEventListener("message", handleIframeMessage);
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
