# Webhook Receiver

A lightweight Express.js application that receives and processes webhooks, automatically saving payload data organized by type.

## Overview

This webhook receiver listens for incoming HTTP requests (both GET and POST) and saves the received payloads to JSON files. Payloads are organized into directories based on their (optional) `type` field, making it easy to manage and review webhook data from various sources.

**Key Features:**
- Accepts webhook data via GET query parameters or POST request body
- Automatically saves payloads with ISO timestamp filenames
- Organizes data by webhook type into separate directories
- Handles large payloads (up to 50MB)
- Built with TypeScript for better type safety
- Auto-reloading development server with Nodemon

## Setup & Installation

```bash
npm install
npm start
```

The server will start on the default port `3000` and automatically reload when you make changes to the source files.

## API Usage

### POST Request (Recommended)
Send a POST request with JSON payload:
```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"type": "<type>", "data": {...}}'
```

### GET Request
Send data via query parameters:
```bash
curl "http://localhost:3000?type=Balluff_contact&data=example"
```

## Data Storage

Received payloads are saved to the `data/` directory, organized by type:
- `data/{type}/{timestamp}.json` - Each webhook creates a timestamped JSON file
- Timestamps use ISO format (e.g., `2026-01-23T09_57_38.083Z.json`)

## Remote Access via Tunnel

To expose your local webhook receiver to external services:
1. Use VS Code's integrated port forwarding (https://code.visualstudio.com/docs/editor/port-forwarding)
2. Forward port `3000` (the default configured port)
3. Set port visibility to `public`

This allows external services to send webhooks to your local development environment.

## Development

This project uses:
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Nodemon** - Auto-reload during development
- **ts-node** - TypeScript runtime for Node.js

### Project Structure
```
src/
  index.ts          - Main server and webhook handler
data/               - Webhook payloads organized by type
nodemon.json        - Nodemon configuration
package.json        - Project dependencies and scripts
tsconfig.json       - TypeScript configuration
```

## Configuration

The default port is `3000`. To change it, modify the `port` variable in `src/index.ts`.

### Features You Can Enable
Several useful features are commented out in the code:
- Print partial payloads to console for debugging
- Simulate response delays
- Return error responses instead of success
- Additional console logging

Uncomment lines in `src/index.ts` to enable these features during development.