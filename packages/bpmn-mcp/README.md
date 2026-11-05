# BPMN Server MCP (initial implementation)

An MCP stdio adapter for AI clients such as GitHub Copilot and Claude.

## Install

From this repository run `npm install` in `packages/bpmn-mcp`, or install the package dependencies in your own Node.js project. This initial package has not been published to npm.

## Configuration

The MCP adapter reads the application's existing `.env` at process startup. Set `BPMN_ENV_FILE` only when it is not launched from the application directory.

**Client mode** connects to the running BPMN app through its existing web API:

```env
MCP_MODE=client
HOST=localhost
PORT=3000
API_KEY=your-runtime-key
ADMIN_API_KEY=your-admin-key
```

**Server mode** operates on a local definition directory (does not start a second web service):

```env
MCP_MODE=server
DEFINITIONS_PATH=./processes
MCP_ALLOW_WRITES=false
```

Run with `node packages/bpmn-mcp/src/index.mjs` or register that command as an MCP stdio server in your AI client. Stdout is reserved for MCP protocol messages.

## Tools

| Tool | Client | Server |
| --- | --- | --- |
| list_models | Running app API | Local definitions directory |
| get_model | Running app API | Local BPMN XML |
| validate_model | Static BPMN Server verifier | Static BPMN Server verifier |
| save_model | Not yet supported | Explicit opt-in, validates first |
| list_instances | Running app API | Not yet supported |
| find_items | Running app API | Not yet supported |

This is an **initial integration slice**, not yet the full standalone-engine MCP envisioned for the server CLI. Server-mode process execution and full model-editing APIs are subsequent work.

## Safety

The MCP adapter never returns `.env` content. Do not expose this stdio server publicly. Client-mode permissions are enforced by the application's API credentials. Server mode writes are disabled by default; enable `MCP_ALLOW_WRITES=true` only for a trusted agent, and approve each `save_model` call. Test in a disposable application before using production data.
