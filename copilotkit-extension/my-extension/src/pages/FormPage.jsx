import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const [text, setText] = useState("");
  const [existingKey, setExistingKey] = useState("");
  const [mcpServers, setMcpServers] = useState([]);
  const [newServer, setNewServer] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get(["copilot_api_key", "copilot_from_settings", "copilot_mcp_servers"], (result) => {
      if (result.copilot_api_key && !result.copilot_from_settings) {
        navigate("/success");
        return;
      }
  
      if (result.copilot_api_key) {
        setExistingKey(result.copilot_api_key);
        setText(result.copilot_api_key);
      }
  
      if (result.copilot_mcp_servers) {
        setMcpServers(result.copilot_mcp_servers.map((s) => s.endpoint));
      }
  
      // Clean the flag so it only works once
      chrome.storage.local.remove("copilot_from_settings");
    });
  }, []);

  const handleAddServer = () => {
    if (newServer && !mcpServers.includes(newServer)) {
      setMcpServers([...mcpServers, newServer]);
      setNewServer("");
    }
  };

  const handleRemoveServer = (server) => {
    setMcpServers(mcpServers.filter((s) => s !== server));
  };

  const handleSave = () => {
    if (!text) return;

    chrome.storage.local.set({
      copilot_api_key: text,
      copilot_mcp_servers: mcpServers.map(endpoint => ({ endpoint })),
    }, () => {
      navigate("/success");
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "white",
    transition: "all 0.2s ease",
    outline: "none",
    fontFamily: "inherit",
  };

  const inputFocusStyle = {
    borderColor: "#0ea5e9",
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: text ? "#0ea5e9" : "#9ca3af",
    color: "white",
    boxShadow: text ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" : "none",
    cursor: text ? "pointer" : "not-allowed",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4b5563",
    color: "white",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  };

  const removeButtonStyle = {
    padding: "4px 8px",
    fontSize: "12px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "8px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: "24px",
          fontWeight: "700",
          color: "#1f2937",
          marginBottom: "8px"
        }}>
          Settings
        </h2>
        <div style={{
          padding: "12px",
          backgroundColor: "#fef3c7",
          border: "1px solid #fcd34d",
          borderRadius: "8px",
          fontSize: "13px",
          color: "#92400e"
        }}>
          <strong>⚠️ Important:</strong> You must have a valid CopilotKit API key for the chat to work properly.
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* API Key Section */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151"
          }}>
            🔑 CopilotKit API Key
          </label>
          <input
            type="password"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your CopilotKit API key"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: "#e5e7eb", boxShadow: "none" })}
          />
          <div style={{
            marginTop: "8px",
            padding: "12px",
            backgroundColor: "#f0f9ff",
            border: "1px solid #e0f2fe",
            borderRadius: "6px",
            fontSize: "13px",
            color: "#0369a1"
          }}>
            <p style={{ margin: "0 0 8px 0", fontWeight: "500" }}>
              💡 How to get your CopilotKit API key:
            </p>
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              <li>Visit <a href="https://cloud.copilotkit.ai/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: "500" }}>cloud.copilotkit.ai/dashboard</a></li>
              <li>Sign up for a <strong>free account</strong> if you don't have one</li>
              <li>Navigate to <strong>API Keys</strong> section and create a new key</li>
              <li>CopilotKit offers generous free tier limits to get started</li>
            </ul>
          </div>
        </div>

        {/* MCP Servers Section */}
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: "0 0 16px 0", 
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            🔌 MCP Servers
          </h3>
          
          {mcpServers.length > 0 && (
            <div style={{ 
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              marginBottom: "16px",
              overflow: "hidden"
            }}>
              {mcpServers.map((server, i) => (
                <div key={i} style={{ 
                  padding: "12px 16px",
                  borderBottom: i < mcpServers.length - 1 ? "1px solid #f3f4f6" : "none",
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  color: "#4b5563"
                }}>
                  <span style={{ 
                    fontFamily: "monospace",
                    backgroundColor: "#f3f4f6",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    wordBreak: "break-all"
                  }}>
                    {server}
                  </span>
                  <button
                    onClick={() => handleRemoveServer(server)}
                    style={removeButtonStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Enter MCP server URL"
              value={newServer}
              onChange={(e) => setNewServer(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, { borderColor: "#e5e7eb", boxShadow: "none" })}
              onKeyPress={(e) => e.key === 'Enter' && handleAddServer()}
            />
          </div>
          
          <button
            onClick={handleAddServer}
            style={secondaryButtonStyle}
            disabled={!newServer || mcpServers.includes(newServer)}
            onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = "#374151")}
            onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = "#4b5563")}
          >
            ➕ Add Server
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={!text}
          style={primaryButtonStyle}
          onMouseEnter={(e) => text && (e.target.style.backgroundColor = "#0284c7")}
          onMouseLeave={(e) => text && (e.target.style.backgroundColor = "#0ea5e9")}
        >
          🚀 Start Chat
        </button>
      </div>
    </div>
  );
}
