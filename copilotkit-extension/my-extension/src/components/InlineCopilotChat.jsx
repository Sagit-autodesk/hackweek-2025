import { CopilotChat } from "@copilotkit/react-ui";
import { useEffect, useRef } from "react";

export default function InlineCopilotChat() {
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        const scrollElement = chatContainerRef.current.querySelector('[data-copilot-chat-container]') || 
                             chatContainerRef.current.querySelector('.copilot-chat-container') ||
                             chatContainerRef.current;
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    };

    // Scroll to bottom on mount and periodically check for new messages
    const intervalId = setInterval(scrollToBottom, 100);
    scrollToBottom();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ 
      flex: 1,
      display: "flex",
      flexDirection: "column",
      marginTop: "16px",
      minHeight: 0 // Important for flex children to shrink
    }}>
      <div
        ref={chatContainerRef}
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          position: "relative",
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)"
        }} />
        
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          fontSize: "16px", // Making text bigger
          minHeight: 0,
          paddingTop: "8px", // Add some space from the top gradient line
          overflow: "auto" // Enable scrolling
        }}>
          <style>
            {`
              /* Custom scrollbar styles */
              .copilot-chat-container::-webkit-scrollbar,
              div[data-copilot-chat-container]::-webkit-scrollbar {
                width: 6px;
              }
              .copilot-chat-container::-webkit-scrollbar-track,
              div[data-copilot-chat-container]::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 3px;
              }
              .copilot-chat-container::-webkit-scrollbar-thumb,
              div[data-copilot-chat-container]::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
              }
              .copilot-chat-container::-webkit-scrollbar-thumb:hover,
              div[data-copilot-chat-container]::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
              
              /* Ensure CopilotChat takes full height and is scrollable */
              .copilot-chat-wrapper {
                height: 100%;
                display: flex;
                flex-direction: column;
              }
              
              /* Make the chat messages container scrollable */
              .copilot-chat-messages {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
              }
            `}
          </style>
          <CopilotChat
            labels={{
              placeholder: "Ask anything about this page...",
            }}
          />
        </div>
      </div>
    </div>
  );
}
