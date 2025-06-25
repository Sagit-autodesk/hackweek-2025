import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const [text, setText] = useState("");
  const [existingKey, setExistingKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get("copilot_api_key", (result) => {
      if (result.copilot_api_key) {
        setExistingKey(result.copilot_api_key);
        setText(result.copilot_api_key); // pre-fill input
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ copilot_api_key: text }, () => {
        navigate("/success");
      });
  };

  return (
    <div>
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

      {existingKey && (
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
          Current saved key: <code>{existingKey}</code>
        </p>
      )}

      {(text || existingKey) && (
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
          Let's Go
        </button>
      )}
    </div>
  );
}
