# Chrome AI Assistant Extension

An intelligent Chrome extension that provides AI assistance with automatic page context and integrations with LLM services and MCP servers.

## 🎯 Motivation

This Chrome extension serves as an AI Assistant that:
- Automatically captures your browsing context from any website
- Requires explicit page approval for privacy protection
- Assists with LLM integration and MCP server configurations
- Helps create Jira tickets, interact with Slack, and use internal MCPs
- Provides seamless AI assistance directly in your browser

Built with **CopilotKit** for a modern, interactive AI experience.

## 🔒 Privacy-First Design

- **Page Approval System**: AI assistant only accesses content from explicitly approved pages
- **24-hour Expiration**: All page permissions expire automatically after 24 hours
- **User Control**: Full management of approved pages in settings
- **No Auto-Collection**: Extension won't "drink" content from pages without permission

## 🚀 Extension Setup

### Building the Extension

The main extension code is located in `copilotkit-extension/my-extension/`.

1. Navigate to the extension directory:
   ```bash
   cd copilotkit-extension/my-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

### Installing in Chrome (Development Mode)

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable **Developer mode** by toggling the switch in the top-right corner

3. Click **"Load unpacked"** button

4. Navigate to and select the `copilotkit-extension/my-extension/dist` folder

5. The extension should now appear in your Chrome extensions list and be ready to use

### Production Deployment

For production use, this extension can be uploaded to the Chrome Web Store. The codebase contains no private keys or sensitive URLs, making it safe for distribution.

## 🔧 CopilotKit Server

### Purpose
Located in `copilotkit-extension/copilot-server/`, this is a simple Express server that replaces the default CopilotKit production runtime (which is free).

### Current Implementation
- Uses OpenAI API key tokens (prepaid model)
- Provides custom LLM adapter functionality

### 📋 TODO - Production Requirements
- **Replace OpenAI adapter with Autodesk LLM adapter** for better security when processing Chrome page content
- This is **required for production use** to ensure sensitive page data doesn't leave Autodesk infrastructure

## 🔌 MCP Integration

### Current Status
- MCP integration is **not currently working** (TODO)
- CopilotKit currently supports only SSE transports (which is deprecated and being transformed to HTTP streaming)

### Implementation Requirements

To implement MCP server integrations, we need:

1. **Transform HTTP streaming MCP servers** (like those from [composio.com](https://composio.com)) into SSE MCP servers

2. **Ensure public MCP endpoints** - for local development, ngrok can be used to expose local servers

3. **Bridge the transport gap** between HTTP streaming (new standard) and SSE (current CopilotKit support)

## 📁 Development Folders

The remaining folders in the project root are experimental attempts to create local SSE MCP servers for development purposes. These should be **removed later if not used**.

## 🛠️ Technology Stack

- **Frontend**: React, CopilotKit UI
- **Backend**: Express.js, CopilotKit Runtime
- **AI Integration**: LLM adapters (OpenAI → Autodesk LLM)
- **Transport**: SSE (transitioning to HTTP streaming)
- **Privacy**: Page-level approval system with automatic expiration
- **Compatibility**: Works on all websites (user approval required)

## 📝 Development Notes

- Extension contains no sensitive data and is safe for development use
- Works on all websites with user-controlled page approval system
- Local development with MCP servers can use ngrok for public endpoints
- CopilotKit transport layer is in transition - monitor for HTTP streaming support
- Page approval system prevents unauthorized data collection

---

**Note**: This is a development version. Production deployment requires implementing the Autodesk LLM adapter for security compliance. 