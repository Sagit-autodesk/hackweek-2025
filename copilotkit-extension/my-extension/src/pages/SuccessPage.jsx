import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [token, setToken] = useState("");
  const [pageText, setPageText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get("copilot_api_key", (result) => {
      if (result.copilot_api_key) {
        setToken(result.copilot_api_key);
      } else {
        navigate("/");
      }
    });

    const handleMessage = (event) => {
        if (event.data?.type === "PAGE_TEXT") {
          setPageText(event.data.text);
        }
      };
    
      window.addEventListener("message", handleMessage);
  }, [navigate]);

  const handleReset = () => {
    chrome.storage.local.remove("copilot_api_key", () => {
      navigate("/");
    });
  };

  return (
    <>
      <h3 style={{ marginTop: 0 }}>Page Text</h3>
      <div
        style={{
          background: "#fff",
          padding: 5,
          border: "1px solid #ccc",
          borderRadius: 4,
          fontSize: 12,
          height: "200px",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        {pageText || "Loading page text..."}
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
