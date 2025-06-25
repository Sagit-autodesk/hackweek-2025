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

    if (pageText === null) return "Loading page...";
  
    return (
      <CopilotLayout>
        <MainContent
          pageText={pageText}
          mcpServers={mcpList}
          onSettings={handleSettings}
        />
        <InlineCopilotChat />
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
      <div>
        <p><strong>{name}</strong></p>
        <p>Status: {status}</p>
        <pre>{JSON.stringify(args, null, 2)}</pre>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    ),
  });

  return (
    <div>
      <div
        style={{
          fontSize: 12,
          marginBottom: 12,
          padding: 8,
          backgroundColor: "#fef3c7",
          border: "1px solid #fcd34d",
          borderRadius: 4,
        }}
      >
        <strong>Debug:</strong> First 100 characters:{" "}
        <code>{pageText.slice(0, 100) || "No page text found"}</code>
      </div>

      <button
        onClick={onSettings}
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
        Settings
      </button>

      <button
        onClick={() => {
          chrome.storage.local.remove("copilot_chat_messages", () => {
            location.reload();
          });
        }}
        style={{
          width: "100%",
          padding: 6,
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Clear
      </button>
    </div>
  );
}
