import React, { useEffect, useState } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function CopilotLayout({ children }) {
  const [publicApiKey, setPublicApiKey] = useState(null);
  const [isLocalRuntime, setIsLocalRuntime] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["copilot_api_key", "copilot_use_local_runtime"], (result) => {
      if (result.copilot_api_key) {
        setPublicApiKey(result.copilot_api_key);
      }
      // Check if local runtime should be used
      setIsLocalRuntime(!!result.copilot_use_local_runtime);
    });
  }, []);

  console.log("publicApiKey", publicApiKey);
  console.log("isLocalRuntime", isLocalRuntime);
  
  // Always require API key
  if (!publicApiKey) return "No API Key";

  // Use local runtime if configured, otherwise use production
  const copilotProps = isLocalRuntime
    ? { publicApiKey, runtimeUrl: "http://localhost:4000/copilotkit" }
    : { publicApiKey };

  return (
    <CopilotKit {...copilotProps}>
      {children}
    </CopilotKit>
  );
}
