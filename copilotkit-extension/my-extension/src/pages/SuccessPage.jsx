import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCopilotChat, useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
import CopilotLayout from "../components/CopilotLayout";
import InlineCopilotChat from "../components/InlineCopilotChat";

export default function SuccessPage() {
    const [pageText, setPageText] = useState(null); // null to detect when it's ready
    const [mcpList, setMcpList] = useState([]);
    const [isLocalRuntime, setIsLocalRuntime] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");
    const [isPageAllowed, setIsPageAllowed] = useState(false);
    const [isCheckingApproval, setIsCheckingApproval] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      chrome.storage.local.get(["copilot_api_key", "copilot_page_text", "copilot_mcp_servers", "copilot_use_local_runtime"], (res) => {
        if (!res.copilot_api_key) {
          navigate("/");
        } else {
          // Set page text (even if empty) to stop loading state
          setPageText(res.copilot_page_text || "");
          setMcpList(res.copilot_mcp_servers || []);
          setIsLocalRuntime(!!res.copilot_use_local_runtime);
        }
      });

      // Get current tab URL and check approval status
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          const fullUrl = tabs[0].url;
          setCurrentUrl(fullUrl);
          
          // Check if this page is approved
          checkPageApproval(fullUrl);
        }
      });
    }, [navigate]);

    const checkPageApproval = (pageUrl) => {
      chrome.storage.local.get(['approved_pages'], (result) => {
        const approvedPages = result.approved_pages || {};
        const now = Date.now();
        
        // Check if page is approved and not expired
        if (approvedPages[pageUrl] && approvedPages[pageUrl] > now) {
          setIsPageAllowed(true);
        } else {
          setIsPageAllowed(false);
          // Clean up expired entries
          const cleanedPages = Object.fromEntries(
            Object.entries(approvedPages).filter(([_, expiry]) => expiry > now)
          );
          chrome.storage.local.set({ approved_pages: cleanedPages });
        }
        setIsCheckingApproval(false);
      });
    };

    const handleAllowPage = () => {
      const pageUrl = currentUrl;
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      
      chrome.storage.local.get(['approved_pages'], (result) => {
        const approvedPages = result.approved_pages || {};
        approvedPages[pageUrl] = expiryTime;
        
        chrome.storage.local.set({ approved_pages: approvedPages }, () => {
          setIsPageAllowed(true);
        });
      });
    };

    const handleSettings = () => {
        chrome.storage.local.set({ copilot_from_settings: true }, () => {
          navigate("/");
        });
      };

    if (pageText === null || isCheckingApproval) {
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
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            {isCheckingApproval ? "Checking page approval..." : "Loading page..."}
          </p>
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      );
    }

    // Show page approval interface if page is not allowed
    if (!isPageAllowed) {
      return (
        <div style={{ 
          height: "100%", 
          display: "flex", 
          flexDirection: "column",
          position: "relative",
          padding: "20px"
        }}>
          {/* Top corner buttons */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginBottom: "20px"
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
          </div>

          {/* Page approval content */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "24px"
          }}>
            <div style={{
              padding: "32px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              maxWidth: "320px"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#fef3c7",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto"
              }}>
                <span style={{ fontSize: "24px" }}>🔒</span>
              </div>
              
              <h3 style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937"
              }}>
                Page Access Required
              </h3>
              
              <p style={{
                margin: "0 0 20px 0",
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: "1.5"
              }}>
                To protect your privacy, this page requires explicit permission before the AI assistant can access its content.
              </p>
              
              <div style={{
                padding: "12px",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                marginBottom: "20px"
              }}>
                <p style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  color: "#4b5563",
                  fontWeight: "500"
                }}>
                  Current page:
                </p>
                <p style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "#1f2937",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  lineHeight: "1.4"
                }}>
                  {currentUrl}
                </p>
              </div>
              
              <button
                onClick={handleAllowPage}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  backgroundColor: "#0ea5e9",
                  color: "white",
                  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#0284c7"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#0ea5e9"}
              >
                🔓 Allow Page (24h)
              </button>
              
              <p style={{
                margin: "12px 0 0 0",
                fontSize: "11px",
                color: "#9ca3af"
              }}>
                Permission expires automatically after 24 hours
              </p>
            </div>
          </div>
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
            Powered by CopilotKit {isLocalRuntime ? "- local runtime" : "- production runtime"}
          </div>
        </div>
      </CopilotLayout>
    );
}

function MainContent({ pageText, mcpServers, onSettings }) {
  const { setMcpServers } = useCopilotChat();
  const [isPageStillApproved, setIsPageStillApproved] = useState(true);

  useEffect(() => {
    if (Array.isArray(mcpServers)) {
      setMcpServers(mcpServers);
    }
  }, [mcpServers, setMcpServers]);

  // Double-check page approval before sending content to CopilotKit
  useEffect(() => {
    const checkCurrentApproval = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          const currentUrl = tabs[0].url;
          
          chrome.storage.local.get(['approved_pages'], (result) => {
            const approvedPages = result.approved_pages || {};
            const now = Date.now();
            
            if (approvedPages[currentUrl] && approvedPages[currentUrl] > now) {
              setIsPageStillApproved(true);
            } else {
              setIsPageStillApproved(false);
            }
          });
        }
      });
    };

    checkCurrentApproval();
    
    // Check every minute to catch expiry quickly
    const interval = setInterval(checkCurrentApproval, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useCopilotReadable({
    description: "The visible text content of the current page",
    value: isPageStillApproved ? (pageText || "") : "",
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
