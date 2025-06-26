import React, { useEffect, useState } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function CopilotLayout({ children }) {
  const [publicApiKey, setPublicApiKey] = useState(null);

  useEffect(() => {
    chrome.storage.local.get("copilot_api_key", (result) => {
      if (result.copilot_api_key) {
        setPublicApiKey(result.copilot_api_key);
      }
    });
  }, []);

  console.log("publicApiKey", publicApiKey);
  if (!publicApiKey) return "No API Key";

  // Todo: for local runtime pass runtimeUrl="http://localhost:4000/copilotkit"
  
  return (
    <CopilotKit publicApiKey={publicApiKey}>
      {children}
    </CopilotKit>
  );
}
