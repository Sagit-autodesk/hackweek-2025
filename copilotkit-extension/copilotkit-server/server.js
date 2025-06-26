import express from "express";
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  OpenAIAdapter
} from "@copilotkit/runtime";
import dotenv from "dotenv";
import { experimental_createMCPClient } from "ai";

dotenv.config();

const app = express();

// 🤖 Use OpenAI as the default adapter
// Todo: use AutodeskAdapter for Autodesk
const serviceAdapter = new OpenAIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
  });

app.use("/copilotkit", (req, res, next) => {
    console.log('request received');
    (async () => {
        const runtime = new CopilotRuntime({
            createMCPClient: async (config) => {
            return await experimental_createMCPClient({
                transport: {
                type: "sse",
                url: config.endpoint,
                headers: config.apiKey
                    ? { Authorization: `Bearer ${config.apiKey}` }
                    : undefined,
                },
            });
            },  
        });
        const handler = copilotRuntimeNodeHttpEndpoint({
            endpoint: "/copilotkit",
            runtime,
            serviceAdapter,
          });
        
          return handler(req, res, next);
  })();
});

app.listen(4000, () => {
  console.log("Listening at http://localhost:4000/copilotkit");
});