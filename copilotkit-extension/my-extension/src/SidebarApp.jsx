import { useState, useEffect } from "react";

export default function SidebarApp() {
  const [view, setView] = useState("loading"); // 'loading' | 'form' | 'success'
  const [text, setText] = useState("");

  useEffect(() => {
    chrome.storage.local.get("copilot_api_key", (result) => {
      if (result.copilot_api_key) {
        setText(result.copilot_api_key);
        setView("success");
      } else {
        setView("form");
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ copilot_api_key: text }, () => {
      setView("success");
    });
  };

  const handleReset = () => {
    chrome.storage.local.remove("copilot_api_key", () => {
      setText("");
      setView("form");
    });
  };

  if (view === "loading") return null;

  return (
    <div
      style={{
        width: 300,
        height: "100vh",
        background: "#f0f0f0",
        padding: 12,
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      {view === "form" && (
        <>
          <label style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
            Copilot API Key
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your API key"
            style={{
              width: "100%",
              padding: 5,
              marginBottom: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          <button
            onClick={handleSave}
            style={{
              width: "100%",
              padding: 6,
              backgroundColor: "#1e40af",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
            Save
          </button>
        </>
      )}

      {view === "success" && (
        <>
          <h3 style={{ marginTop: 0 }}>Hello World</h3>
          <div>
            <strong>Saved Token:</strong>
            <div
              style={{
                background: "#fff",
                padding: 5,
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 12,
                marginTop: 4,
                wordBreak: "break-all",
              }}
            >
              {text}
            </div>
          </div>
          <button
            onClick={handleReset}
            style={{
              marginTop: 12,
              width: "100%",
              padding: 6,
              backgroundColor: "#9ca3af",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
            Reset
          </button>
        </>
      )}
    </div>
  );
}
