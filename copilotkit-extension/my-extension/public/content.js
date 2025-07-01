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

  let observer = null;
  let pageApproved = false;

  const sendPageText = () => {
    // Only send page text if the page is approved
    if (!pageApproved) {
      console.log("[content.js] Page not approved, not capturing content");
      return;
    }
    
    const text = document.body.innerText;
    chrome.runtime.sendMessage({ type: "STORE_PAGE_TEXT", text }, () => {
      console.log("[content.js] Page text sent to background");
    });
  };

  const startContentCapture = () => {
    if (pageApproved && !observer) {
      console.log("[content.js] Starting content capture");
      
      // Send initial page text
      sendPageText();
      
      // Set up mutation observer
      observer = new MutationObserver(() => {
        sendPageText();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  };

  const stopContentCapture = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
      console.log("[content.js] Stopped content capture");
    }
    
    // Clear stored page text
    chrome.runtime.sendMessage({ type: "CLEAR_PAGE_TEXT" });
  };

  // Check if page is approved
  const checkPageApproval = () => {
    const currentUrl = window.location.href;
    
    chrome.storage.local.get(['approved_pages'], (result) => {
      const approvedPages = result.approved_pages || {};
      const now = Date.now();
      
      // Check if page is approved AND not expired
      if (approvedPages[currentUrl] && approvedPages[currentUrl] > now) {
        pageApproved = true;
        startContentCapture();
      } else {
        pageApproved = false;
        stopContentCapture();
        
        // Clean up this expired entry if it exists
        if (approvedPages[currentUrl] && approvedPages[currentUrl] <= now) {
          console.log("[content.js] Page approval expired, cleaning up");
          delete approvedPages[currentUrl];
          chrome.storage.local.set({ approved_pages: approvedPages });
        }
      }
    });
  };

  // Periodically check approval status (every 5 minutes)
  const startPeriodicCheck = () => {
    setInterval(() => {
      if (pageApproved) {
        console.log("[content.js] Periodic approval check");
        checkPageApproval();
      }
    }, 5 * 60 * 1000); // 5 minutes
  };

  // Listen for approval status changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.approved_pages) {
      checkPageApproval();
    }
  });

  // Initial check when iframe loads
  iframe.onload = () => {
    checkPageApproval();
    startPeriodicCheck();
  };

  window.addEventListener("beforeunload", () => {
    stopContentCapture();
  });
})();
