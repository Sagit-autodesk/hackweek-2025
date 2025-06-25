# SSE MCP Server

A minimal Model Context Protocol (MCP) server implementation using Server-Sent Events (SSE) transport for testing purposes.

## Features

- SSE-based transport for real-time communication
- Three basic tools for testing:
  - `echo`: Echo back provided text
  - `get_time`: Get current server time
  - `add_numbers`: Add two numbers together
- Health check endpoint
- CORS enabled for browser testing

## Installation

```bash
npm install
```

## Usage

Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## Endpoints

- `GET /`: Server info and status
- `GET /sse`: SSE endpoint for real-time communication
- `POST /mcp`: HTTP endpoint for MCP requests
- `GET /health`: Health check

## Testing

### 1. Connect to SSE stream
```bash
curl -N http://localhost:3001/sse
```

### 2. Send MCP requests
```bash
# Initialize
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "initialize", "params": {}, "id": 1}'

# List tools
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list", "params": {}, "id": 2}'

# Call echo tool
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/call", "params": {"name": "echo", "arguments": {"text": "Hello World"}}, "id": 3}'

# Call add_numbers tool
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/call", "params": {"name": "add_numbers", "arguments": {"a": 5, "b": 3}}, "id": 4}'
```

## Browser Testing

Open your browser's developer console and run:

```javascript
// Connect to SSE
const eventSource = new EventSource('http://localhost:3001/sse');
eventSource.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};

// Send MCP request
fetch('http://localhost:3001/mcp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    method: 'tools/call',
    params: {
      name: 'echo',
      arguments: { text: 'Hello from browser!' }
    },
    id: 1
  })
});
``` 