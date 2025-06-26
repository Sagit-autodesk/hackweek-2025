import { LLMServiceAdapter } from "@copilotkit/runtime";

class AutodeskAdapter extends LLMServiceAdapter {
  constructor({ apiKey }) {
    super();
    this.apiKey = apiKey;
    this.endpoint = process.env.AUTODESK_LLM_ENDPOINT;
  }

  async generate({ messages }) {
    const payload = {
      requests: [
        {
          targetModel: "CLAUDE_SONET_3_7_v1", // you can make this dynamic if needed
          parameters: {
            messages,
          },
        },
      ],
    };

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`, // adapt if your service requires headers
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    // Assuming this shape based on your example:
    const reply = data?.responses?.[0]?.candidates?.[0]?.content ?? "[No reply]";

    return {
      type: "text",
      content: reply,
    };
  }
}

export { AutodeskAdapter };
