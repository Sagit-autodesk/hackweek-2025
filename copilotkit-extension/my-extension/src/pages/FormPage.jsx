import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const [text, setText] = useState("");
  const [existingKey, setExistingKey] = useState("");
  const [mcpServers, setMcpServers] = useState([]);
  const [newServer, setNewServer] = useState("");
  const [useLocalRuntime, setUseLocalRuntime] = useState(false);
  const [approvedPages, setApprovedPages] = useState({});
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get(["copilot_api_key", "copilot_from_settings", "copilot_mcp_servers", "copilot_use_local_runtime", "approved_pages"], (result) => {
      // Always require API key, regardless of runtime mode
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

      if (result.copilot_use_local_runtime) {
        setUseLocalRuntime(result.copilot_use_local_runtime);
      }

      if (result.approved_pages) {
        // Clean up expired pages and set state
        const now = Date.now();
        const validPages = Object.fromEntries(
          Object.entries(result.approved_pages).filter(([_, expiry]) => expiry > now)
        );
        setApprovedPages(validPages);
        
        // Update storage if we cleaned up any expired pages
        if (Object.keys(validPages).length !== Object.keys(result.approved_pages).length) {
          chrome.storage.local.set({ approved_pages: validPages });
        }
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
    // Always require API key
    if (!text) return;

    chrome.storage.local.set({
      copilot_api_key: text,
      copilot_mcp_servers: mcpServers.map(endpoint => ({ endpoint })),
      copilot_use_local_runtime: useLocalRuntime,
    }, () => {
      navigate("/success");
    });
  };

  const handleClearApprovedPages = () => {
    chrome.storage.local.set({ approved_pages: {} }, () => {
      setApprovedPages({});
    });
  };

  const handleRemoveApprovedPage = (pageUrl) => {
    const updatedPages = { ...approvedPages };
    delete updatedPages[pageUrl];
    
    chrome.storage.local.set({ approved_pages: updatedPages }, () => {
      setApprovedPages(updatedPages);
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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
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
          <strong>⚠️ Important:</strong> You must have a valid CopilotKit API key for the chat to work properly in production runtime.
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        gap: "20px",
        overflow: "auto",
        paddingRight: "4px" 
      }}>
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

        {/* Advanced Settings Toggle */}
        <div>
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              backgroundColor: "white",
              color: "#4b5563",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f9fafb";
              e.target.style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.borderColor = "#d1d5db";
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              ⚙️ Advanced Settings
            </span>
            <span style={{ 
              fontSize: "12px", 
              transform: showAdvancedSettings ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease"
            }}>
              ▼
            </span>
          </button>
        </div>

        {/* Advanced Settings Content */}
        {showAdvancedSettings && (
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#fafbfc",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            {/* Local Runtime Mode Section */}
            <div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer"
                }} onClick={() => setUseLocalRuntime(!useLocalRuntime)}>
                  <div style={{
                    width: "44px",
                    height: "24px",
                    backgroundColor: useLocalRuntime ? "#0ea5e9" : "#d1d5db",
                    borderRadius: "12px",
                    position: "relative",
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                      left: useLocalRuntime ? "22px" : "2px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
                    }} />
                  </div>
                  <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                    Local Runtime Mode
                  </span>
                </div>
              </div>
              <div style={{
                marginTop: "8px",
                padding: "12px",
                backgroundColor: useLocalRuntime ? "#fef3c7" : "#f0f9ff",
                border: `1px solid ${useLocalRuntime ? "#fcd34d" : "#e0f2fe"}`,
                borderRadius: "6px",
                fontSize: "13px",
                color: useLocalRuntime ? "#92400e" : "#0369a1"
              }}>
                <p style={{ margin: "0 0 8px 0", fontWeight: "500" }}>
                  {useLocalRuntime ? "⚠️ Local Runtime:" : "🌐 Production Runtime:"}
                </p>
                <ul style={{ margin: 0, paddingLeft: "16px" }}>
                  {useLocalRuntime ? (
                    <>
                      <li>Requires local CopilotKit server running on <code>localhost:4000</code></li>
                      <li>Better for development and testing</li>
                      <li>Uses your own LLM adapter configuration</li>
                    </>
                  ) : (
                    <>
                      <li>Uses CopilotKit cloud service</li>
                      <li>Requires valid API key with available credits</li>
                      <li>Ready to use without local setup</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* MCP Servers Section */}
            <div>
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

            {/* Approved Pages Section */}
            <div>
              <h3 style={{ 
                margin: "0 0 16px 0", 
                fontSize: "16px",
                fontWeight: "600",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                🔐 Approved Pages
              </h3>
              
              {Object.keys(approvedPages).length > 0 ? (
                <div style={{ 
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  overflow: "hidden"
                }}>
                  {Object.entries(approvedPages).map(([pageUrl, expiry], i) => {
                    const timeLeft = Math.max(0, expiry - Date.now());
                    const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
                    const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                    
                    // Get display name for the URL
                    let displayUrl = pageUrl;
                    try {
                      const url = new URL(pageUrl);
                      displayUrl = url.hostname + url.pathname;
                      if (url.search) displayUrl += url.search;
                    } catch (e) {
                      // Keep original if URL parsing fails
                    }
                    
                    return (
                      <div key={pageUrl} style={{ 
                        padding: "12px 16px",
                        borderBottom: i < Object.keys(approvedPages).length - 1 ? "1px solid #f3f4f6" : "none",
                        display: "flex", 
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        color: "#4b5563"
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontFamily: "monospace",
                            backgroundColor: "#f3f4f6",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            wordBreak: "break-all",
                            marginBottom: "4px",
                            fontSize: "11px",
                            lineHeight: "1.4"
                          }}>
                            {displayUrl}
                          </div>
                          <div style={{ fontSize: "10px", color: "#9ca3af" }}>
                            Expires in {hoursLeft}h {minutesLeft}m
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveApprovedPage(pageUrl)}
                          style={{...removeButtonStyle, marginLeft: "8px", flexShrink: 0}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  padding: "16px",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "13px"
                }}>
                  No approved pages yet. Specific pages you approve will appear here.
                </div>
              )}
              
              {Object.keys(approvedPages).length > 0 && (
                <button
                  onClick={handleClearApprovedPages}
                  style={{
                    ...secondaryButtonStyle,
                    backgroundColor: "#ef4444"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                >
                  🗑️ Clear All Approved Pages
                </button>
              )}
            </div>
          </div>
        )}

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
