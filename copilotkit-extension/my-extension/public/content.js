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

  // ✅ Send page text to the iframe after it loads
  iframe.onload = () => {
    const text = document.body.innerText;
  
    // ✅ Use the extension origin to scope it safely
    const origin = new URL(chrome.runtime.getURL("/")).origin;
  
    iframe.contentWindow.postMessage({ type: "PAGE_TEXT", text }, origin);
  };
  
})();
