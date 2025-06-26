import { CopilotChat } from "@copilotkit/react-ui";
import { useEffect, useRef } from "react";

export default function InlineCopilotChat() {
  const chatContainerRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Simplified auto-scroll that respects user interaction
  useEffect(() => {
    let isComponentMounted = true;

    const scrollToBottom = () => {
      if (!isComponentMounted || !chatContainerRef.current || isUserScrollingRef.current) {
        return;
      }

      try {
        // Find the scrollable container
        const container = chatContainerRef.current.querySelector('[data-copilot-chat-container]') ||
                         chatContainerRef.current.querySelector('.copilot-chat-container') ||
                         chatContainerRef.current;
        
        if (container && container.scrollHeight > container.clientHeight) {
          container.scrollTop = container.scrollHeight;
        }
      } catch (error) {
        // Silently handle any DOM access errors
        console.debug('Scroll error (safely ignored):', error);
      }
    };

    const handleScroll = (e) => {
      if (!isComponentMounted) return;
      
      try {
        const target = e.target;
        const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 5;
        isUserScrollingRef.current = !isAtBottom;
        
        // Clear any pending auto-scroll when user scrolls
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }
      } catch (error) {
        console.debug('Scroll handler error (safely ignored):', error);
      }
    };

    // Simple interval-based approach for auto-scrolling
    const checkAndScroll = () => {
      if (!isComponentMounted) return;
      
      scrollToBottom();
      
      // Reset user scrolling flag after a delay if they haven't scrolled recently
      if (isUserScrollingRef.current) {
        scrollTimeoutRef.current = setTimeout(() => {
          if (isComponentMounted) {
            isUserScrollingRef.current = false;
          }
        }, 3000); // Reset after 3 seconds of no scrolling
      }
    };

    // Set up scroll listener on a simple interval
    const setupScrollListener = () => {
      if (!chatContainerRef.current) return null;

      try {
        const container = chatContainerRef.current.querySelector('[data-copilot-chat-container]') ||
                         chatContainerRef.current.querySelector('.copilot-chat-container') ||
                         chatContainerRef.current;
        
        if (container) {
          container.addEventListener('scroll', handleScroll, { passive: true });
          return () => {
            try {
              container.removeEventListener('scroll', handleScroll);
            } catch (error) {
              // Ignore cleanup errors
            }
          };
        }
      } catch (error) {
        console.debug('Listener setup error (safely ignored):', error);
      }
      return null;
    };

    // Initial setup
    const cleanupListener = setupScrollListener();
    
    // Simple interval for checking new messages
    const intervalId = setInterval(checkAndScroll, 500);

    // Initial scroll
    setTimeout(scrollToBottom, 100);

    return () => {
      isComponentMounted = false;
      
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      
      if (cleanupListener) {
        try {
          cleanupListener();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <div style={{ 
      flex: 1,
      display: "flex",
      flexDirection: "column",
      marginTop: "8px",
      minHeight: 0
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
          minHeight: 0,
          paddingTop: "8px",
          overflow: "auto"
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

              /* Make suggestions text 14px */
              .copilot-chat-suggestions button,
              .copilot-chat-suggestions .suggestion,
              [data-copilot-suggestions] button,
              [data-copilot-suggestions] .suggestion {
                font-size: 14px !important;
              }

              /* Make placeholder text 14px */
              .copilot-chat-input input::placeholder,
              .copilot-chat-input textarea::placeholder,
              [data-copilot-input] input::placeholder,
              [data-copilot-input] textarea::placeholder,
              input[placeholder*="Ask anything"]::placeholder,
              textarea[placeholder*="Ask anything"]::placeholder {
                font-size: 14px !important;
              }

              /* Make typed text 14px */
              .copilot-chat-input input,
              .copilot-chat-input textarea,
              [data-copilot-input] input,
              [data-copilot-input] textarea,
              input[type="text"],
              textarea {
                font-size: 14px !important;
                line-height: 1.5 !important;
              }

              /* More comprehensive targeting for input fields */
              div[class*="copilot"] input,
              div[class*="copilot"] textarea,
              [class*="input"] input,
              [class*="input"] textarea,
              [data-testid*="input"] input,
              [data-testid*="input"] textarea {
                font-size: 14px !important;
                line-height: 1.5 !important;
              }

              /* Target suggestions specifically */
              button[class*="suggestion"],
              div[class*="suggestion"],
              .copilot-suggestion,
              [data-suggestion] {
                font-size: 14px !important;
              }
              
              /* Ensure chat messages are 14px */
              .copilot-message,
              [data-copilot-message],
              div[class*="message"],
              p, span, div {
                font-size: 14px;
                line-height: 1.5;
              }

              /* Global font size for all CopilotKit components set to 14px */
              [class*="copilot"],
              [data-copilot] {
                font-size: 14px !important;
                line-height: 1.5 !important;
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
