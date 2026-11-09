# Chatting with your server

Your users can build and test workflows by chatting with an AI assistant (ChatGPT, Claude, ...) that works on your
BPMN Server for them: it reads the site's guide, writes the model and its tests, saves them, runs the tests, reads why
one failed, and corrects it. This page says how to connect an assistant to a server, today and with 3.7.

Today the assistant uses the same API as any client: the site's guide at `/llms.txt` (also `GET /api2/guide`), and
the operations its OpenAPI document describes, `/api2/openapi.json`. See [Building workflows with AI](building-workflows.md).

## Before you start

- **A test environment.** Give the assistant a test site, not production: `APP_ENV=test` in its `.env`, its own
  database, and its test services (nothing sent, nothing recorded). The site's `/llms.txt` tells the assistant which
  environment it is on. See [Settings](../settings.md).
- **An address it can reach.** A hosted assistant can not reach `localhost`. Put the server on the internet, or behind
  a tunnel for a test (`ngrok http 3000`). Behind a proxy, the server gives its `https` address in the guide and the
  OpenAPI document.
- **A record of what it did.** `API_TRACE=api-trace.jsonl` in `.env` writes every call and its answer, one JSON line
  each, secrets masked.

Restart the server after changing `.env`.

## Today: with the API key

Until 3.7 a client calls the API with the site's key, in the header `x-api-key` (`API_KEY` in `.env`), as the site's
service account. Anyone with the key can change the site's models: give it only for a test site, and change it after.

### ChatGPT, agent mode: no setup

In a chat, choose **Agent** in the tools, and give it the site, the key and the request:

> Using the BPMN Server at https://your-site.example (API key: *the key*, sent as the header `x-api-key` on every
> call), start by reading /llms.txt. Then build an employee leave request workflow with manager approval, with tests
> for approval and rejection. Deploy it, run the tests through the API until they pass, and give me the model's URL.

The agent calls the API from its own computer. The key is in the conversation: use a test key.

### Not a custom GPT

ChatGPT retires custom GPTs on December 11, 2026, and their custom actions (an OpenAPI document and a key, the way a
GPT called a service) do not carry over to the plugins that replace them. Plugins, like Claude's connectors, connect a
service as a remote MCP server: see below.

### Claude, and other agents that run commands

Claude Code, Codex and other coding agents call the API themselves (`curl`): give them the site's address and the key,
as in the agent-mode prompt above.

## With 3.7: users sign in, and just chat

Chat assistants connect a service as a **remote MCP server** (over HTTP), and sign its users in with **OAuth 2.1**:
ChatGPT's plugins and Claude's connectors alike. So a site will offer, beside its API:

- **an MCP endpoint**, `/mcp`: the same operations as the API (the guide, check, save, write and run tests, the
  Rationale), as MCP tools: nothing new to learn for the assistant, nothing different to maintain on the site;
- **OAuth, as an option of the site**: the assistant gets a token for the user who signed in, never a key.

The site adds it to the assistants **once**: in ChatGPT as a plugin (its developer mode for a private test, the
reviewed directory for everyone), in Claude as a connector. A user then only:

1. adds the site's plugin or connector, and asks: "create an employee leave workflow";
2. signs in, the first time, with Google or GitHub, in a browser, and approves the access asked (read models, change
   models, run tests, read instances);
3. chats. The assistant calls the site **as that user**, with their permissions, until the access expires or the user
   revokes it.

No key is handed to anyone. On a public site each user also needs a workspace of their own, so that one user's
assistant can not change another's models.

Agents that run commands themselves (agent modes, Claude Code, Codex, scripts) keep calling the API directly, with its
OpenAPI document: they need no MCP.

## What it looks like

Two assistants built a leave workflow on a test site, given only its address (and once, also the documentation):

| Asked | Calls | Scenarios | Corrections |
|---|---|---|---|
| A leave request, manager approval, approved and rejected | 12 | 2 of 2 passed | none |
| The same, dates sent back when the end is before the start, an employee who can not approve, the site's notification service | 11 | 4 of 4 passed | none |

Each read `/llms.txt`, then `openapi.json`, checked the model (`verifyModel`), saved it (`saveModel`), wrote and ran
its tests (`saveModelTests`, `runModelTests`), and read an instance's Rationale where it wanted to know why.
