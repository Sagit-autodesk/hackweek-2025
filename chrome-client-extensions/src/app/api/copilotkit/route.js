import {
    CopilotRuntime,
    OpenAIAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
  } from "@copilotkit/runtime";
  import { experimental_createMCPClient } from "ai";
  
  // 👇 Create the CopilotKit runtime
  const runtime = new CopilotRuntime({
      async createMCPClient(config) {
        return await experimental_createMCPClient({
          transport: {
            type: "sse",
            url: config.endpoint,
            headers: config.apiKey
              ? { Authorization: `Bearer ${config.apiKey}` }
              : undefined,
          },
        });
      }
  });
  
  // 👇 Adapter to talk to OpenAI (no need to host your own LLM)
  const serviceAdapter = new OpenAIAdapter({apiKey:process.env.OPENAI_API_KEY});
  
  export const POST = async (req) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({     
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });
  
    return handleRequest(req);
  }; 