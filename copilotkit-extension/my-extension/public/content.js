(function () {
  const existing = document.getElementById("copilot-sidebar");
  if (existing) {
    existing.remove();
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.id = "copilot-sidebar";
  iframe.src = chrome.runtime.getURL("sidebar.html");

  Object.assign(iframe.style, {
    position: "fixed",
    top: "0",
    right: "0",
    height: "100vh",
    width: "400px",
    border: "none",
    zIndex: "999999",
    background: "white",
    boxShadow: "-2px 0 6px rgba(0,0,0,0.2)",
  });

  document.body.appendChild(iframe);

  const sendPageText = () => {
    const text = document.body.innerText;
    chrome.runtime.sendMessage({ type: "STORE_PAGE_TEXT", text }, () => {
      // 🔍 Optional debug log
      console.log("[content.js] Page text sent to background");
    });
  };

  iframe.onload = () => {
    sendPageText();
  };

  const observer = new MutationObserver(() => {
    sendPageText();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  window.addEventListener("beforeunload", () => {
    observer.disconnect();
  });
})();
