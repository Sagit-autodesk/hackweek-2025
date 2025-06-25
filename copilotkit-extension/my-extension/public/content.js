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
    width: "300px",
    border: "none",
    zIndex: "999999",
    background: "white",
    boxShadow: "-2px 0 6px rgba(0,0,0,0.2)",
  });

  document.body.appendChild(iframe);

  // ✅ Function to send page text
  const sendPageText = () => {
    const text = document.body.innerText;
    const targetOrigin = new URL(iframe.src).origin;
    iframe.contentWindow?.postMessage({ type: "PAGE_TEXT", text }, targetOrigin);
  };

  // ✅ Send once when iframe loads
  iframe.onload = () => {
    sendPageText();
  };

  // ✅ Watch for DOM changes and re-send text
  const observer = new MutationObserver(() => {
    sendPageText();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Optional cleanup if iframe is removed
  window.addEventListener("beforeunload", () => {
    observer.disconnect();
  });
})();
