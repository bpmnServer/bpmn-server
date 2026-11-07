# BPMN Server MCP

Connects AI clients, such as Claude or GitHub Copilot, to a running BPMN Server over MCP (stdio). It offers what `bpmn-client-cli` does, and the API's model administration.

## Configuration

It reads the same `.env` as the CLI, from the directory it is launched in, or from the file `BPMN_ENV_FILE` names:

```env
HOST=localhost
PORT=3000
API_KEY=your-runtime-key
ADMIN_API_KEY=your-admin-key
```

There are no modes: `.env` says which server to use, and its keys decide what the MCP may do. Without `ADMIN_API_KEY`, saving, renaming or deleting models and deleting instances are refused. Everything else, including reading a model's XML, needs only `API_KEY`.

This package has not been published to npm, so it runs from this repository.

## Install

1. In the repository's root, run `npm install`.
2. Start the server the MCP will talk to, such as `npm run dev` on port 3000. It has to be running while you use the MCP.
3. Put the `.env` above in `packages/bpmn-mcp/`, with the keys the server uses. Keep it out of git: it holds your keys.
4. Register the MCP with your AI client, below, and restart the client.

`BPMN_ENV_FILE` is needed because a client may launch the MCP from any directory. Use the full paths of your own copy; these are examples.

### Claude Code

```shell
claude mcp add bpmn --env BPMN_ENV_FILE=/path/to/bpmnServer4/packages/bpmn-mcp/.env -- node /path/to/bpmnServer4/packages/bpmn-mcp/src/index.mjs
```

`/mcp` in Claude Code shows whether it connected.

### Codex

```shell
codex mcp add bpmn --env BPMN_ENV_FILE=/path/to/bpmnServer4/packages/bpmn-mcp/.env -- node /path/to/bpmnServer4/packages/bpmn-mcp/src/index.mjs
```

Or in `~/.codex/config.toml`:

```toml
[mcp_servers.bpmn]
command = "node"
args = ["/path/to/bpmnServer4/packages/bpmn-mcp/src/index.mjs"]
env = { BPMN_ENV_FILE = "/path/to/bpmnServer4/packages/bpmn-mcp/.env" }
```

### Claude Desktop, and clients with a JSON configuration

```json
{
  "mcpServers": {
    "bpmn": {
      "command": "node",
      "args": ["/path/to/bpmnServer4/packages/bpmn-mcp/src/index.mjs"],
      "env": { "BPMN_ENV_FILE": "/path/to/bpmnServer4/packages/bpmn-mcp/.env" }
    }
  }
}
```

On Windows, write the paths in JSON and TOML with forward slashes, such as `C:/bp/github/bpmnServer4/...`.

## Use

Ask in plain language; the client chooses the tools:

- "List my models."
- "Start Leave Application with days 5."
- "What tasks are waiting?"
- "Complete the approval task with approved true."
- "Check this BPMN and save it as order-approval."

## Tools

| Tool | | CLI |
| --- | --- | --- |
| `list_models` | The models' names | `lm` |
| `get_model` | A model's BPMN XML | |
| `list_model_events` | The events models wait for | |
| `validate_model` | Checks BPMN XML, without saving it. Checks of connectors need the server and are not made | |
| `save_model` | Validates and saves a model, replacing one of that name | |
| `rename_model`, `delete_model` | Model administration | |
| `start_process` | Starts an instance | `s` |
| `invoke_task` | Completes a waiting task | `i` |
| `assign_task` | Changes who a waiting task is for | |
| `throw_signal`, `throw_message` | Signals and messages | `sgl`, `msg` |
| `start_event` | Starts a secondary start event | `se` |
| `restart_instance` | Takes an instance back to one of its items. It must have kept save points (`keepSavePoints` on `start_process`) | `rs` |
| `list_instances` | Finds instances: the newest 20 unless `limit` says otherwise, and the total. Without their steps, unless `steps` is set | `l`, `di` |
| `find_items` | Finds items, such as the tasks waiting: the newest 20 unless `limit` says otherwise, and the total | `lo`, `li` |
| `delete_instances` | Deletes the instances a query matches | `d` |
| `engine_status` | What is running | `es` |

Not offered, because the server's API does not have them: connectors, users, and locked or hung instances. They are in the server's own console (`npm run cli`).

## Safety

**This gives an AI what the keys allow, including deleting instances and replacing models.** Tools carry MCP's read-only and destructive hints, and clients use them to decide what to ask you about; whether they ask is the client's choice. Give it keys for a server you are willing to let it change. Stdout is the MCP protocol, so what the client libraries print goes to stderr. Do not expose this stdio server publicly.

The MCP also refuses, whatever the keys:

- `delete_instances` with an empty query, unless `all` is set.
- Query operators that run code in the database (`$where`, `$function`, `$accumulator`). This is the MCP's own check: the API takes them from whoever holds its key.
- Answers over 100,000 characters: a listing is cut to fit, and says so.

**The keys travel unencrypted unless `PORT` is 443**, which is what makes the client use HTTPS. For a server on another machine, put it behind TLS on 443, or an encrypted tunnel.

## Tests

In `testSampleApp`, both against a test server and a database of their own:

- `node --import tsx --test test/web/mcp.test.mjs` runs each tool over stdio, and is part of `npm run test:web`. It needs MongoDB.
- `npm run test:mcp-prompts` asks an AI: plain requests that name no tool, graded on the tools it called, what changed on the server and what it answered. It needs the Claude Code CLI, spends model usage, and is not part of `npm test`. `-- --dry-run` lists the cases without a model.
