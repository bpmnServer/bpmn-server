# Change Log

Released with bpmn-server, bpmn-web and bpmn-client, with the same version.

## [Unreleased]
### Added
- **bpmn-mcp**: a running server's API as MCP tools over stdio, for AI clients: models, processes, tasks, signals and messages, instances, and the engine's status. What it may do is what the keys in `.env` allow.
- Published to npm, and installed with every application `npx bpmn-server init` creates, registered for AI clients in its `.mcp.json`.
- zod 4, for its fix of a memory exhaustion advisory.
