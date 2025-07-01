console.log("[background.js] Loaded");

if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener((tab) => {
    const url = tab.url || "";

    // Allow extension to work on all websites (except chrome:// and extension pages)
    if (url.startsWith("chrome://") || url.startsWith("chrome-extension://") || url.startsWith("moz-extension://")) {
      console.warn("[background.js] Cannot inject on browser pages:", url);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          alert("Copilot Extension cannot run on browser internal pages");
        },
      });
    } else {
      console.log("[background.js] Injecting content.js on:", url);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
    }
  });
} else {
  console.error("[background.js] chrome.action is undefined");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "STORE_PAGE_TEXT") {
    console.log("[background.js] Saving page text...");
    chrome.storage.local.set({ copilot_page_text: request.text });
  }

  if (request.type === "CLEAR_PAGE_TEXT") {
    console.log("[background.js] Clearing page text...");
    chrome.storage.local.set({ copilot_page_text: "" });
  }

  if (request.type === "GET_PAGE_TEXT") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.id) return sendResponse({ text: "[Tab not found]" });

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => document.body.innerText,
        },
        (results) => {
          const text = results?.[0]?.result || "[No text]";
          sendResponse({ text });
        }
      );
    });

    return true;
  }
});
