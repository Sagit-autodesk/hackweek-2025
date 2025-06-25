console.log("[background.js] Loaded");

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
