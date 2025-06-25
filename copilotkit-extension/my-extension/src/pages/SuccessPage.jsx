import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [savedToken, setSavedToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get("copilot_api_key", (result) => {
      if (result.copilot_api_key) {
        setSavedToken(result.copilot_api_key);
      }
    });
  }, []);

  const handleReset = () => {
    chrome.storage.local.remove("copilot_api_key", () => {
      navigate("/");
    });
  };

  return (
    <div style={{ padding: 10, width: 250 }}>
      <h2>Hello World</h2>
      <div>
        <strong>Saved Token:</strong>
        <div
          style={{
            background: "#f3f4f6",
            padding: 5,
            borderRadius: 4,
            marginTop: 4,
            fontSize: 12,
            wordBreak: "break-all",
          }}
        >
          {savedToken}
        </div>
      </div>
      <button
        onClick={handleReset}
        style={{
          marginTop: 12,
          padding: 5,
          width: "100%",
          backgroundColor: "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Reset
      </button>
    </div>
  );
}
