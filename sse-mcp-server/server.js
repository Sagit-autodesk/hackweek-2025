const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Store active SSE connections
const connections = new Map();

// MCP Server Implementation
class MCPServer {
  constructor() {
    this.tools = [
      {
        name: "echo",
        description: "Echo back the provided text",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "Text to echo back"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "get_time",
        description: "Get current server time",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "add_numbers",
        description: "Add two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number"
            },
            b: {
              type: "number",
              description: "Second number"
            }
          },
          required: ["a", "b"]
        }
      }
    ];
  }

  // Handle MCP requests
  async handleRequest(method, params) {
    switch (method) {
      case 'initialize':
        return {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {
              listChanged: false
            }
          },
          serverInfo: {
            name: "sse-mcp-server",
            version: "1.0.0"
          }
        };

      case 'tools/list':
        return {
          tools: this.tools
        };

      case 'tools/call':
        return this.callTool(params.name, params.arguments || {});

      case 'ping':
        return {};

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  // Execute tool calls
  async callTool(name, args) {
    switch (name) {
      case 'echo':
        return {
          content: [
            {
              type: "text",
              text: `Echo: ${args.text}`
            }
          ]
        };

      case 'get_time':
        return {
          content: [
            {
              type: "text",
              text: `Current server time: ${new Date().toISOString()}`
            }
          ]
        };

      case 'add_numbers':
        const result = args.a + args.b;
        return {
          content: [
            {
              type: "text",
              text: `${args.a} + ${args.b} = ${result}`
            }
          ]
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}

const mcpServer = new MCPServer();

// SSE endpoint for MCP communication
app.get('/sse', (req, res) => {
  const connectionId = uuidv4();
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Store connection
  connections.set(connectionId, res);

  // Send initial connection event
  res.write(`data: ${JSON.stringify({
    type: 'connection',
    id: connectionId,
    message: 'Connected to MCP SSE server'
  })}\n\n`);

  // Handle client disconnect
  req.on('close', () => {
    connections.delete(connectionId);
    console.log(`Client ${connectionId} disconnected`);
  });

  console.log(`Client ${connectionId} connected via SSE`);
});

// HTTP endpoint to send MCP requests
app.post('/mcp', async (req, res) => {
  try {
    const { method, params, id } = req.body;
    
    console.log(`Received MCP request: ${method}`, params);
    
    const result = await mcpServer.handleRequest(method, params);
    
    const response = {
      jsonrpc: "2.0",
      id: id || null,
      result
    };

    // Send response via SSE to all connected clients
    const message = JSON.stringify({
      type: 'mcp_response',
      data: response
    });

    connections.forEach((connection, connectionId) => {
      try {
        connection.write(`data: ${message}\n\n`);
      } catch (error) {
        console.error(`Error sending to client ${connectionId}:`, error);
        connections.delete(connectionId);
      }
    });

    res.json(response);
  } catch (error) {
    console.error('MCP request error:', error);
    
    const errorResponse = {
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -32603,
        message: error.message
      }
    };

    res.status(500).json(errorResponse);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    connections: connections.size,
    timestamp: new Date().toISOString()
  });
});

// Basic info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SSE MCP Server',
    version: '1.0.0',
    endpoints: {
      sse: '/sse',
      mcp: '/mcp',
      health: '/health'
    },
    activeConnections: connections.size
  });
});

app.listen(PORT, () => {
  console.log(`SSE MCP Server running on port ${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`Health check: http://localhost:${PORT}/health`);
}); 