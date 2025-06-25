import { CopilotChat } from "@copilotkit/react-ui";

export default function InlineCopilotChat() {
  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 8 }}>Ask the Assistant</h3>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 12,
          background: "#f9f9f9",
        }}
      >
        <CopilotChat
          labels={{
            placeholder: "Ask anything about this page...",
          }}
        />
      </div>
    </div>
  );
}
