import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get("copilot_api_key", (result) => {
      if (result.copilot_api_key) {
        setText(result.copilot_api_key);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleReset = () => {
    chrome.storage.local.remove("copilot_api_key", () => {
      navigate("/");
    });
  };

  return (
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
  );
}
