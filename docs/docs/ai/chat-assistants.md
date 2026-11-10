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

## Today: a link for your agent

A signed-in user gets a link for their agent: **Link for an AI agent**, in the menu under their name (`/ai/key`). The
page shows the link, with a Copy button and an example request:

> Using https://your-site.example/ai/ai_… Use curl only, not a browser, and only its /api2 API.
>
> Build a workflow named "leave-request" for employee leave requests: ... Give me the model's link.

What the link does:

- **It acts as the user who got it**, on `/api2`, with their groups and no more: an agent with a staff member's link
  can start and work on processes as they can, but can not change models; a designer's or an administrator's link can.
- **It works on `/api2` only.** `/api` and the administration APIs refuse it.
- **It expires**, after 30 minutes by default (`AI_KEY_TTL_GROUPS` sets minutes by group, the shortest wins), and goes
  at once when the user signs out or presses **Revoke all my links**.
- **The agent opens the link first.** The page there says whom it acts as, until when, and its rules: curl (or its own
  HTTP calls) only, never a browser or computer use; `/api2` only; the key in the `x-api-key` header on every call;
  start with `/llms.txt`.
- **It stays out of the logs.** The server keeps only the key's hash; the request log shows `/ai/ai_***`, and
  `API_TRACE` records the kind of credential, never its value.

Whoever has the link acts as the user until it expires: keep it to the conversation with the agent.

### The site's API key

A client can also call the API with the site's key, `API_KEY` in `.env`, in the header `x-api-key`: it acts as the
site's service account (`API_SERVICE_USER_NAME`, `API_SERVICE_USER_GROUPS`). Anyone with that key can change the site's
models: use it for the site's own integrations and for a test site, not for people's agents.

### ChatGPT, agent mode: no setup

In a chat, choose **Agent** in the tools, and paste the request from the link's page. The agent calls the API from its
own computer. ChatGPT without agent mode only browses pages, and can not send the key: it gets a sign-in page.

### Not a custom GPT

ChatGPT retires custom GPTs on December 11, 2026, and their custom actions (an OpenAPI document and a key, the way a
GPT called a service) do not carry over to the plugins that replace them. Plugins, like Claude's connectors, connect a
service as a remote MCP server: see below.

### Claude, and other agents that run commands

Claude Code, Codex and other coding agents call the API themselves (`curl`): give them the link and the request, as
the link's page shows.

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
