import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function InputPage() {
  const [text, setText] = useState("");
  const [checkingToken, setCheckingToken] = useState(true); // 🛑 Prevent render until storage is checked
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get("copilot_api_key", (result) => {
      if (result.copilot_api_key) {
        navigate("/success");
      } else {
        setCheckingToken(false); // ✅ Render form now
      }
    });
  }, [navigate]);

  const handleSave = () => {
    chrome.storage.local.set({ copilot_api_key: text }, () => {
      navigate("/success");
    });
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  if (checkingToken) return null; // ⏳ Don’t render anything until token check is done

  return (
    <div style={{ padding: 10, width: 250 }}>
      <label style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
        Copilot API Key
      </label>
      <input
        type="text"
        value={text}
        onChange={handleChange}
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
          padding: 5,
          backgroundColor: "#1e40af",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Save
      </button>
    </div>
  );
}
