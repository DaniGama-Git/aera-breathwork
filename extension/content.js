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
    width: ${IFRAME_WIDTH}px;
    height: ${IFRAME_HEIGHT}px;
    z-index: 2147483647;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  `;

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  closeBtn.style.cssText = `
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(8px);
    color: rgba(255,255,255,0.85);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    margin-right: 2px;
    transition: background 0.2s;
    padding: 0;
    line-height: 0;
  `;
  closeBtn.addEventListener("mouseenter", () => { closeBtn.style.background = "rgba(0,0,0,0.75)"; });
  closeBtn.addEventListener("mouseleave", () => { closeBtn.style.background = "rgba(0,0,0,0.55)"; });
  closeBtn.addEventListener("click", removeOverlay);

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

  wrapper.appendChild(closeBtn);
  wrapper.appendChild(iframe);
  document.body.appendChild(wrapper);
}

function removeOverlay() {
  const wrapper = document.getElementById(WRAPPER_ID);
  if (wrapper) wrapper.remove();
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
