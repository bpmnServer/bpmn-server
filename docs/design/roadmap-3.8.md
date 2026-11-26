# 3.8: application integration

**Status:** scope agreed November 25, 2026. This page replaces the 3.8 items scattered through other notes; the
architecture it serves is [target-architecture.md](target-architecture.md), the contract it extends is
[integration-protocol.md](integration-protocol.md) (on `main`).

## Scope

3.8 is about **one thing: integrating an existing application with OWF, side by side**. The application keeps its users,
authentication and business data. OWF runs beside it, not inside it, and the two meet through an identity the application
vouches for, OWF's API and pages, and connectors OWF uses to call the application back.

**Held past 3.8:** tenants and quotas, workspaces per user, fencing, the console and backup per workspace
([multi-app-tenants.md](multi-app-tenants.md)), and Work Management with its own store and a unified My Work page. The
engine's isolation from the host is done in 3.7 ([engine-isolation.md](engine-isolation.md)), but for its step 6, the console on the API.

## What 3.8 contains

| # | Item | State today | To do |
|---|---|---|---|
| 1 | **A portable package** (export and import of several models with their dependencies; 3.7.6) | Designed ([target-architecture.md](target-architecture.md) section 8) | Built in 3.7.6, before 3.8 |
| 2 | **An identity adapter**: the application's signed, short-lived token (or a shared identity provider, or a server-to-server call for a user) validated for issuer, audience, signature and expiry; no user id or role from a browser is trusted | Part: API v3 tokens for a user, the user manager, the service key | A validating adapter, and its settings |
| 3 | **The OWF Host beside the application**: OWF's pages embedded in or linked from the application, its API called by the application's back end | Part: the separated deployment (host and engine apart), API v3, embedded pages by link | The composition: how pages are embedded (an open decision, below) |
| 4 | **The application contract as the one entry point**: the functions, roles, forms, events and permitted operations an application offers, referring to OpenAPI operations rather than copying them | Part: `app-contract.json` (functions, roles, pages), connectors with an operations allowlist, `verify` against the contract | The integration configuration that binds them ([integration-protocol.md](integration-protocol.md) section 3) |
| 5 | **The Integration Workbench**, version 1: application URL or OpenAPI, connection test, operation allowlist, roles, the contract written; manual, or with the user's own AI agent through MCP | Not built; the pieces exist (contract, connectors, `verify`, test stubs, the AI add-on and MCP) | The guided flow |
| 6 | **Progressive integration**: each capability proposed, simulated (a stub tied to a real or proposed interface) or connected; no production writes by default | Part: Gherkin test stubs | Interactive simulation, the state per capability |
| 7 | **Documents and journeys**: model-first and application-first | Part: the integration guide, `building-workflows.md` for agents | One path in the docs for each |

## Open decisions

- **Workbench scope in 3.8:** the whole of item 5, or manual discovery only, with the AI route documented?
- **Embedding the pages:** an iframe (a shared site or cookie arrangement) or a link with a token; this decides items 2 and 3.
- **The token format** the adapter accepts first: a signed JWT with a shared secret or key set, or a shared identity provider.
- **API v3:** it stays as it is (the identity adapter is additive).

## What is not in 3.8, and why

Tenants and quotas serve a shared public server, not an application integrating with OWF. Work Management is an optional
second subsystem with its own store; the architecture does not need it to release 3.8. Both stay in the design notes and
come after.
