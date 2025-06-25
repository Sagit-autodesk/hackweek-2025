console.log("[background.js] Loaded");

// ✅ Inject content.js when the extension icon is clicked
if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener((tab) => {
    console.log("[background.js] Action clicked, injecting content.js");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  });
} else {
  console.error("[background.js] chrome.action is undefined");
}

// ✅ Handle messages from the sidebar (e.g., to get page text)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

    return true; // keep message channel open for async response
  }
});
