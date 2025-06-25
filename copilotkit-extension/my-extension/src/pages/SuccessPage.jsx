import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCopilotChat, useCopilotAction } from "@copilotkit/react-core";
import { CopilotSidebar, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import CopilotLayout from "../components/CopilotLayout";

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
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  const handleReset = () => {
    chrome.storage.local.remove("copilot_api_key", () => {
      navigate("/");
    });
  };

  return (
    <CopilotLayout>
      <MainContent
        pageText={pageText}
        onReset={handleReset}
      />
      <CopilotSidebar
        defaultOpen={true}
        clickOutsideToClose={false}
        labels={{
          title: "Copilot Assistant",
          initial: "👋 Welcome! Ask anything or use tools on this page.",
        }}
      />
    </CopilotLayout>
  );
}

function MainContent({ pageText, onReset }) {
  const { mcpServers, setMcpServers } = useCopilotChat();
  const [newMcpServer, setNewMcpServer] = useState("");

  useEffect(() => {
    setMcpServers([
      // Add predefined MCP servers here if needed
    ]);
  }, []);

  const addMcpServer = (server) => {
    setMcpServers([...mcpServers, server]);
  };

  const removeMcpServer = (url) => {
    setMcpServers(mcpServers.filter((s) => s.endpoint !== url));
  };

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
    <div style={{ paddingBottom: 16 }}>
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

      <h3>MCP Servers</h3>
      <ul style={{ paddingLeft: 0 }}>
        {mcpServers.map((server, i) => (
          <li key={i} style={{ listStyle: "none", marginBottom: 6 }}>
            {server.endpoint}
            <button
              style={{ marginLeft: 8 }}
              onClick={() => removeMcpServer(server.endpoint)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Enter MCP server URL"
        value={newMcpServer}
        onChange={(e) => setNewMcpServer(e.target.value)}
      />
      <button
        onClick={() => {
          if (newMcpServer) {
            addMcpServer({ endpoint: newMcpServer });
            setNewMcpServer("");
          }
        }}
      >
        Add Server
      </button>

      <button
        onClick={onReset}
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
    </div>
  );
}
