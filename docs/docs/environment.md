# The environment (.env)

`.env`, or the real environment, holds a server's **installation**: its port, its database, its secrets and its
deployment switches. This page lists every variable, and a test keeps the list complete: every variable the code
reads, and every one in the sample `.env.example` files, has a row here.

## What belongs in .env, and what doesn't

| Layer | Where | Examples |
|---|---|---|
| The installation | `.env` or environment variables | The port, the database, logging, deployment switches, secrets, where the application's configuration is |
| The application | The application's configuration (code today: `settings/config.ts`, `start({ ... })`) | How cases and tasks are labeled, roles and the user directory, assignment policies, what the pages show, connectors and hooks |
| A process | The BPMN model | Its own labels, the roles it needs, its assignment, its behavior |

- **Don't add application behavior to `.env`.** A setting that describes the business, or what the pages show,
  belongs to the application. One server may later host several applications, and a global `.env` can't tell
  them apart.
- **Secrets stay in the environment**, or in a secret store. An application's configuration may name a secret,
  but never contains one.
- **Some variables are application behavior today, for history's sake:**
    - `MODEL_HISTORY`, `VERIFY_MODELS_ON_IMPORT`;
    - `SAVE_LOGS`, `SAVE_POINTS`, `SAVE_SOURCE`;
    - `EMAIL_ENABLE`, `SITE_NAME`, `MODELER`;
    - `CATALOG_URL`, `CONNECTOR_CATALOG_URL`.

  They work as listed below, and are candidates to move to the application's configuration when it has a file
  of its own. Code given the same setting wins over them: for example, a `dataStore` factory in the
  configuration sets `saveLogs` itself.

## The rules

1. **Where values come from.** At start, bpmn-web reads `.env` in the current folder. The scripts (`npm run cli`,
   `setup`, `verify`, `upgrade`) and the bpmn-client command line read it too. A variable already set in the real
   environment wins over `.env`, so Docker, systemd and CI can override any line.
2. **When values are read.** Most are read once, when the server starts: change `.env`, then restart. A few are
   read on each use, and the table says so.
3. **Switches.** Write `true` or `false` in lowercase. Other spellings aren't guaranteed: some switches accept
   `TRUE`, others treat it as unset.
4. **Unset means the default.** An empty value (`NAME=`) is the same as no line.
5. **Security fails closed.** A switch that turns protection off acts only on exactly `false`
   (`REQUIRE_AUTHENTICATION`, `ENFORCE_SECURITY`). A missing or misspelled value leaves protection on.
6. **Numbers.** Whole numbers, in the unit the name says (`_MS`: milliseconds). The engine settings (`LOCK_*`,
   `ENGINE_SHUTDOWN_TIMEOUT_MS`) warn with `[config]` and use the default when a value isn't a positive whole
   number.
7. **Lists.** Comma-separated; spaces around commas are ignored.
8. **Checked at start.** bpmn-web reports problems as `[config]` lines. With `NODE_ENV=production`, a setting
   that leaves the server open stops the start:
     - no `SESSION_SECRET`;
     - no `API_KEY` while serving the APIs;
     - `REQUIRE_AUTHENTICATION=false` without `ALLOW_INSECURE_NO_AUTH=true`.

   Elsewhere these are warnings. `GUEST_ACCESS=true` refuses to start unless `DEMO_MODE`, `DISABLE_ADMIN`,
   `REQUIRE_AUTHENTICATION` and `ENFORCE_SECURITY` are all `true`.
9. **Secrets.** Several variables are secrets: `SESSION_SECRET`, `API_KEY`, `ADMIN_API_KEY`, `CONNECTORS_KEY`,
   `ADMIN_PASSWORD`, `SMTP_PASSWORD` and `SENDGRID_API_KEY`. They belong in `.env` or the real environment,
   never in code or a repository. `.env` is not committed; `.env.example` is, with placeholders.
   `npx bpmn-server init` writes a `.env` with fresh random secrets.

In the tables, "Read by" names the package that reads the variable: **web** is bpmn-web, **server** is
bpmn-server, **client** is bpmn-client, and **app** is the sample application.

## The server and the database

| Variable | Default | What it does | Read by |
|---|---|---|---|
| `PORT` | `3000` | The port the web server listens on. The client uses it to reach the server. | web, client |
| `HOST` | — | The server's address, for the client. | client |
| `MONGO_DB_URL` | **required** | The MongoDB database, `mongodb://host:27017/name`. `memory` starts a MongoDB in the process (needs `mongodb-memory-server`); its data is lost when the server stops. | web |
| `MONGO_DB_NAME` | the URL's | The database, when `MONGO_DB_URL` names none. | web |
| `DEFINITIONS_PATH` | `./processes/` | The models folder. | web, app |
| `SERVER_ID` | host, process id, random | This server's name in the locks it takes. Give each server of a cluster its own. | server |
| `LOCK_RETRY_DELAY_MS` | engine's | Wait between tries for a locked instance. | web |
| `LOCK_MAX_TRIES` | engine's | Tries before giving up on a locked instance. | web |
| `LOCK_STALE_AFTER_MS` | engine's | A lock older than this is taken over; its owner is presumed dead. | web |
| `ENGINE_SHUTDOWN_TIMEOUT_MS` | `10000` | On SIGTERM, how long running executions get to finish. | web |
| `SAVE_LOGS` | `false` | `true`: each instance keeps its log, shown on its page. | web |
| `SAVE_POINTS` | `false` | `true`: a save point at each save, so a restart can go back to any earlier item. | web |
| `SAVE_SOURCE` | `false` | `true`: each instance keeps the model source it started with, so later changes to the model don't reach it until it is upgraded (`npm run upgrade`). | web |
| `MODEL_HISTORY` | `true` | `false`: model saves keep no versions in `processes/.history`, and the editor has no History tab. | web |
| `VERIFY_MODELS_ON_IMPORT` | `warn` | The model import and save APIs: `warn` saves and logs problems, `enforce` refuses a model with errors (422), `off` skips the check. | web |
| `BODY_LIMIT` | `50mb` | The largest request body. | web |
| `SERVE` | `both` | `api`: the REST APIs only. `ui`: the web pages only. `both`: everything. | app |
| `RESTART_ON_EXIT` | `false` | `true`: a supervisor of your own restarts the server, so Administration may stop it. | web |
| `NODE_ENV` | — | `production`: the start checks become errors, and request logs use the combined format. | web |

## Security

| Variable | Default | What it does | Read by |
|---|---|---|---|
| `SESSION_SECRET` | **required** | Signs sessions and CSRF tokens. | web |
| `REQUIRE_AUTHENTICATION` | on | `false`: no sign-in; everyone uses the pages as an administrator. Development only. | web, server |
| `ENFORCE_SECURITY` | on | `false`: the engine skips its access rules (who may see, assign and do a task). | server |
| `ALLOW_INSECURE_NO_AUTH` | `false` | `true`: lets `REQUIRE_AUTHENTICATION=false` start in production. | web |
| `API_KEY` | none | The key for `/api` and `/api2`. Unset, both reject every request. | web, client |
| `ADMIN_API_KEY` | none | The key for the administration API (`/admin/api`: models). | web, client |
| `API_SERVICE_USER_NAME` | none | The user that `/api2` calls act as. | web |
| `API_SERVICE_USER_GROUPS` | none | That user's groups (a list). | web |
| `API_SERVICE_TENANT_ID` | none | That user's tenant. | web |
| `API_SERVICE_MODELS_OWNER` | none | That user's models owner. | web |
| `ADMIN_PASSWORD` | `admin` | The password of the first user, `admin`, made by setup when there are no users. | web |
| `DISABLE_ADMIN` | `false` | `true`: no administration pages or administration APIs for anyone. Administer with `npm run cli`. | web |
| `DISABLE_DESIGN` | `false` | `true`: no model design in the web pages; models arrive only through the administration API. | web |
| `DISABLE_SIGNUP` | `false` | `true`: no self-registration; administrators add the accounts. | web |
| `AUTH_RATE_LIMIT` | `50` | Sign-in and sign-up attempts per address per 15 minutes. | web |
| `HTTPS` | `false` | `true`: secure cookies and trust of the proxy; with `SSL_KEY_PATH` and `SSL_CERT_PATH`, the server serves HTTPS itself. | web |
| `SSL_KEY_PATH` | none | The TLS key file, for `HTTPS=true`. | web |
| `SSL_CERT_PATH` | none | The TLS certificate file, for `HTTPS=true`. | web |
| `SECURE_COOKIES` | `false` | `true`: secure cookies behind a TLS-terminating proxy, without `HTTPS`. | web |
| `ITSM_HOST` | none | Another site allowed to embed the model editor and call the server (CORS and `frame-ancestors`). | web |

## A public demo

See [A public demo](security.md#a-public-demo).

| Variable | Default | What it does | Read by |
|---|---|---|---|
| `DEMO_MODE` | `false` | `true`: scripts run in a sandbox, and timers and service tasks don't run ([Where scripts run](scripting.md#where-scripts-run-in-the-server-or-in-a-sandbox)). | web |
| `GUEST_ACCESS` | `false` | `true`: visitors try models without signing in, as guests. | web |
| `GUESTS_PATH` | `./guests` | The guests' models folders. | web |
| `GUEST_MAX_MODELS` | `50` | Models per guest. | web |
| `GUEST_RATE_LIMIT` | `20` | New guests per address per hour. | web |

## Connectors and catalogs

| Variable | Default | What it does | Read by |
|---|---|---|---|
| `CONNECTORS_KEY` | none | Encrypts connectors' keys at rest. Needed to set a key. Changing it makes the stored keys unreadable. | server |
| `CONNECTORS_ALLOW_HOSTS` | any | The only hosts connectors may call (a list; `*.example.com` covers its subdomains). Read on each call. | server |
| `CONNECTOR_CATALOG_URL` | bpmn-server's on GitHub | The catalog of APIs the Connectors page offers: a web address or a local file. Read on each use. | web |
| `CATALOG_URL` | `https://catalog.omniworkflow.com/` | The catalog of models and templates: a web address or a local folder. Read on each use. | web |

## Email

| Variable | Default | What it does | Read by |
|---|---|---|---|
| `EMAIL_ENABLE` | `false` | `true`: task notifications are sent by email (Gmail, with `SMTP_USER` and `SMTP_PASSWORD`). | web |
| `EMAIL_FROM` | none | The sender's address. | web |
| `SMTP_USER` | none | The mail account. | web |
| `SMTP_PASSWORD` | none | Its password (an application password for Gmail). | web |
| `EMAIL_LOG` | none | A file that every email is also written to. | web |
| `SITE_NAME` | none | The site's name in account emails (verify, reset password). | web |
| `SENDGRID_API_KEY` | none | The sample application's delegate sends its emails through SendGrid. | app |

## Tools and development

| Variable | Default | What it does | Read by |
|---|---|---|---|
| `MODELER` | the new editor | `classic`: the old model editor. | web |
| `DOCS_PATH` | a bpmn-server checkout next to this one | The documentation folder the Docs pages show. | web |
| `PYTHON_CMD` | `python` | The Python for `$py` scripts, a prototype ([Python](scripting.md#python)). | server |
| `ENABLE_PROFILER` | `false` | `true`: instance queries log how long they take. | server |

## Set by the platform

These are read, not set by you.

| Variable | Set by | What it does | Read by |
|---|---|---|---|
| `INVOCATION_ID` | systemd | Shows Administration that systemd restarts the server. | web |
| `OPENSHIFT_NODEJS_IP` | OpenShift | The address to listen on (default `0.0.0.0`). | web |
| `OPENSHIFT_NODEJS_PORT` | OpenShift | The port, when `PORT` isn't set. | web |

## Adding a variable

1. Read it in one place, and give it a default that is safe when it's unset.
2. Add its row here, and a commented line to both `.env.example` files when an operator is likely to set it.
3. If a wrong value would leave the server open, check it at start (`runtime/bootConfig.ts`).

`testSampleApp/test/unit/environment.test.mjs` fails when the code reads a variable this page doesn't list.
