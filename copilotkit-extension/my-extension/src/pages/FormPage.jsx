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

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Copilot Settings</h3>

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

      <h4>MCP Servers</h4>
      <ul style={{ paddingLeft: 0 }}>
        {mcpServers.map((server, i) => (
          <li key={i} style={{ listStyle: "none", marginBottom: 6 }}>
            {server}
            <button
              style={{ marginLeft: 8 }}
              onClick={() => handleRemoveServer(server)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Enter MCP server URL"
        value={newServer}
        onChange={(e) => setNewServer(e.target.value)}
        style={{
          width: "100%",
          padding: 5,
          marginBottom: 8,
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <button
        onClick={handleAddServer}
        style={{
          width: "100%",
          padding: 6,
          backgroundColor: "#4b5563",
          color: "white",
          border: "none",
          borderRadius: 4,
          marginBottom: 12,
        }}
      >
        Add Server
      </button>

      <button
        onClick={handleSave}
        disabled={!text}
        style={{
          width: "100%",
          padding: 6,
          backgroundColor: text ? "#1e40af" : "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: text ? "pointer" : "not-allowed",
        }}
      >
        Let's Go
      </button>
    </div>
  );
}
