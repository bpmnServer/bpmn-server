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
| 5 | **The Integration Workbench**, version 1: the contract card on the Settings page (the application's APIs, pages, roles, and how it connects), **Make connector** from an API's own document, and **Test**; manual, with the user's own AI agent through MCP as an option | Built: the card, Make connector and Test | Decision 1 below: the rest of the guided flow is not in 3.8 |
| 6 | **Progressive integration**: each capability proposed, simulated (a stub tied to a real or proposed interface) or connected; no production writes by default | Part: Gherkin test stubs | Interactive simulation, the state per capability |
| 7 | **A small module in the application**: it calls OWF for events (start a process, send a message or signal, complete a task) as the signed-in user, hands OWF the identity it vouches for (item 2), and answers the pages OWF sends a person to (the identifiers in the address, the task read and completed through the API, then back to `returnTo`) | Part: `BPMNClient3` (a token per user, every API v3 operation), the form-key page protocol, `AssignmentForm.jsx` in the HR demo as the example | The module itself, small and in one package (bpmn-client, or beside it); events from OWF back to the application (task events, webhooks) are the part not designed yet |
| 8 | **Documents and journeys**: model-first and application-first | Part: the integration guide, `building-workflows.md` for agents | One path in the docs for each |

## The working prototype: two servers, side by side

`apps/hrdemo2` (the business application, on its own) and `apps/sampleApp2` (OWF beside it) establish the communication
first, in both directions:

- **Application to OWF:** hrdemo2 asks OWF for a token for the person signed in (with OWF's service key, which stays on
  its server) and passes its pages' calls on to OWF's API v3 as that person (`server/owf.js`: only tasks, cases, the
  processes to start and who they are). Its To do panel lists the tasks that way. Checked: signed in as an HR user, it
  starts *Leave Application* and lists the task, and `/users` and a call with no session are refused.
- **OWF to application:** sampleApp2's connector `hr` is made from the application's own `/api/hr/openapi.json`, with the key
  `HR_SERVICE_KEY` kept by OWF. Checked: the model *List Employees* returns the application's employees.

- **A person sent to OWF's own form, with no second sign-in** ([handoffs](../docs/handoffs.md)): a task with no HR form opens
  through `GET /api/hr/owf/task/:id` on hrdemo2, which asks OWF for a one-visit link (`POST /api/v3/handoffs`) and sends the
  browser to it; OWF shows the form with no menu, completes it as that person and sends them back. Checked end to end: the
  link is spent, the form's fields are drawn, the submit moves the case on, and the session ends.

- **Start forms the same way:** hrdemo2's **Start a process** page lists what the person may start (OWF's API v3 through its
  proxy) and opens a start form in OWF by a handoff (`GET /api/hr/owf/start/:process`); OWF starts it as that person and sends
  them back with `?instance=`. `BPMNClient3.handoffs.task` and `.start` are the application-side call.

Not in the prototype yet: a page in a frame, and OWF's other pages (a case's diagram, the guide) from the application. Events
are out of scope for now (the outbox later), and sending notifications is the application's.

## Decisions (2026-11-26)

The open questions of 2026-11-25, settled so the work can go on. Each can be reopened; the reason is given.

1. **The Workbench in 3.8 is manual discovery, with the AI route documented.** Its first version is what the contract card
   already does and one step more: the application's contract lists its APIs, and an administrator **makes the connector** from
   the API's own document with one button (**Make connector**: the document is read from the address the contract gives, the
   connector's address is taken from where it is), sets its key, and presses **Test**. The user's own AI agent (MCP, the
   building guide) may do the same through the API; nothing in 3.8 needs it. *Why:* the pieces were already there (connectors from
   an OpenAPI document, `verify`, test stubs); a guided wizard is more screens than the problem needs, and discovery by an AI
   agent is the user's tool, not ours.
2. **Pages are reached by a handoff and a redirect, not in a frame.** The person's browser goes to OWF's page and comes back to
   the application's (`returnTo`). A page in a frame is a documented later option; it needs the application's origin allowed to
   frame OWF's pages (`frame-ancestors`), and the session cookie sent across sites (`SameSite=None; Secure`, so HTTPS), neither of
   which is in 3.8. *Why:* it works on any deployment with nothing to configure, and the application keeps its own navigation.
3. **The identity adapter is not built in 3.8's first cut.** The application's identity reaches OWF in two ways that already
   exist and are checked: its back end asks for a **token** with the service key (every API call then acts as that person), and
   a **handoff** takes the person's browser to a page. Neither takes a user or a role from a browser. A way for the application to
   *sign* a person's identity, so the browser or a second server can call OWF with no call to the token endpoint first, is the
   adapter; if it is built, the first format is a **JWT signed by the application, checked for its issuer, audience, signature and
   expiry**, with a shared secret (HS256) first and a published key set (RS256, JWKS) after, never a user name or a group from
   the request itself. *Why:* nothing in the prototype needs it, and each extra way in is one more to secure and document.
4. **Events are out of scope, and notifying people is the application's.** OWF does not poll or push; after a person completes or
   starts something, the application reads the answer and sees the next task. When events are built they are recorded by the
   engine as an outbox (a durable record, the item and event as its duplicate key) that the application reads by cursor. `notify`
   (email or anything else) is the application's.
5. **API v3 stays as it is.** Handoffs and the contract card are additions.
6. **The work is on branches, not released.** `3.7.6` (export and import of several models, the license of bpmn-web) and `3.8`
   (this) are pushed as branches for safety; no tag, and `main` is not changed, until each is judged ready.

## What is not in 3.8, and why

Tenants and quotas serve a shared public server, not an application integrating with OWF. Work Management is an optional
second subsystem with its own store; the architecture does not need it to release 3.8. Both stay in the design notes and
come after.
