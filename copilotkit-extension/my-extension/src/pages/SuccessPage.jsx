import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCopilotChat, useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
import CopilotLayout from "../components/CopilotLayout";
import InlineCopilotChat from "../components/InlineCopilotChat";

export default function SuccessPage() {
    const [pageText, setPageText] = useState(null); // null to detect when it's ready
    const [mcpList, setMcpList] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      chrome.storage.local.get(["copilot_api_key", "copilot_page_text", "copilot_mcp_servers"], (res) => {
        if (!res.copilot_api_key) {
          navigate("/");
        } else {
          setPageText(res.copilot_page_text || "");
          setMcpList(res.copilot_mcp_servers || []);
        }
      });
    }, [navigate]);
  
    const handleSettings = () => {
        chrome.storage.local.set({ copilot_from_settings: true }, () => {
          navigate("/");
        });
      };

    if (pageText === null) {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "3px solid #e5e7eb",
            borderTop: "3px solid #0ea5e9",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading page...</p>
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      );
    }
  
    return (
      <CopilotLayout>
        <div style={{ 
          height: "100%", 
          display: "flex", 
          flexDirection: "column",
          position: "relative"
        }}>
          {/* Top corner buttons */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            padding: "12px 0",
            marginBottom: "8px"
          }}>
            <button
              onClick={handleSettings}
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                fontWeight: "500",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                backgroundColor: "white",
                color: "#4b5563",
                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "4px"
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
              ⚙️ Settings
            </button>

            <button
              onClick={() => {
                chrome.storage.local.remove("copilot_chat_messages", () => {
                  location.reload();
                });
              }}
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                fontWeight: "500",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                backgroundColor: "white",
                color: "#4b5563",
                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "4px"
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
              🗑️ Clear
            </button>
          </div>

          <MainContent
            pageText={pageText}
            mcpServers={mcpList}
            onSettings={handleSettings}
          />
          <InlineCopilotChat />
          
          {/* Footer */}
          <div style={{
            textAlign: "center",
            padding: "12px 0 8px 0",
            fontSize: "11px",
            color: "#9ca3af",
            borderTop: "1px solid #f3f4f6",
            marginTop: "12px"
          }}>
            Powered by CopilotKit
          </div>
        </div>
      </CopilotLayout>
    );
}

function MainContent({ pageText, mcpServers, onSettings }) {
  const { setMcpServers } = useCopilotChat();

  useEffect(() => {
    if (Array.isArray(mcpServers)) {
      setMcpServers(mcpServers);
    }
  }, [mcpServers, setMcpServers]);

  useCopilotReadable({
    description: "The visible text content of the current page",
    value: pageText || "",
  });

  useCopilotChatSuggestions({
    maxSuggestions: 3,
    instructions: "Suggest actions based on page content and available tools.",
  });

  useCopilotAction({
    name: "*",
    render: ({ name, status, args, result }) => (
      <div style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px"
        }}>
          <div style={{
            padding: "4px 8px",
            backgroundColor: "#f3f4f6",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
            color: "#374151"
          }}>
            {name}
          </div>
          <div style={{
            padding: "2px 6px",
            backgroundColor: status === 'executing' ? "#fef3c7" : 
                           status === 'complete' ? "#d1fae5" : "#fee2e2",
            color: status === 'executing' ? "#92400e" : 
                   status === 'complete' ? "#065f46" : "#991b1b",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "500",
            textTransform: "uppercase"
          }}>
            {status}
          </div>
        </div>
        <pre style={{
          fontSize: "11px",
          color: "#4b5563",
          margin: "8px 0",
          padding: "8px",
          backgroundColor: "#f9fafb",
          borderRadius: "4px",
          overflow: "auto",
          maxHeight: "100px"
        }}>
          {JSON.stringify(args, null, 2)}
        </pre>
        {result && (
          <pre style={{
            fontSize: "11px",
            color: "#059669",
            margin: "8px 0 0 0",
            padding: "8px",
            backgroundColor: "#f0fdfa",
            borderRadius: "4px",
            overflow: "auto",
            maxHeight: "100px"
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    ),
  });

  // This component no longer needs to render the buttons since they're in the parent
  return null;
}
