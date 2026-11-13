# Settings: `.env` and configuration

An application has two places for settings. One rule decides which:

| | `.env` | `settings/config.ts` |
|---|---|---|
| **Holds** | What differs per machine, and secrets | How the application behaves, everywhere |
| **In Git** | Never. `.env.example` lists what can go in it | Yes |
| **Examples** | Database address, port, keys, `DISABLE_ADMIN` | Models folder, timer settings, components |
| **Changes need** | A restart | A restart, and usually a release |

**Ask: would this be different on another machine, or would it be a problem if someone read it?** If so, it goes in `.env`. Otherwise it goes in `settings/config.ts`. Your code stays in `delegates/` and `connectors/`.

**Which one wins:**

1. A real environment variable wins over the same name in `.env`.
2. A value in `settings/config.ts` wins over bpmn-web's defaults, including defaults that come from `.env`, such as `MODEL_HISTORY`. So a setting belongs in one place only.

**With a separate engine,** give the host and the engine the same `.env`. Only the settings marked *engine* below have to be on the engine, but sharing one file keeps them in step. `ENGINE_AT` is only read by the host.

## Everything `.env` can hold

All are optional unless marked. Made from bpmn-web's settings schema
([settings.schema.json](https://github.com/bpmnServer/bpmn-server/blob/main/packages/bpmn-web/settings/settings.schema.json))
by `npm run features`: edit the schema, not these tables.

### The server

| Setting | Means |
|---|---|
| `APP_ENV` | The environment: `test` makes the sample application use its test services (`connectors/testServices.ts`: the same names, nothing sent or recorded); `/llms.txt` says which. Default: production |
| `BODY_LIMIT` | The largest request. Default `50mb` |
| `DOCS_PATH` | The folder of the docs pages the server shows |
| `HTTPS`, `SSL_CERT_PATH`, `SSL_KEY_PATH` | Serve HTTPS directly |
| `ITSM_HOST` | The origin allowed to call the server from a browser (CORS) |
| `NODE_ENV` | `production` stops the server from starting with unsafe settings: see [Security](security.md) |
| `PORT` | The web server's port. Default `3000` |
| `RESTART_ON_EXIT` | `true`: something restarts this process when it exits |
| `SECURE_COOKIES` | Cookies only over HTTPS, when something in front of the server handles it |
| `SERVE` | `both`, `api` (the REST APIs only) or `ui` (the web pages only) |
| `SITE_NAME`, `SITE_URL` | The name and address used in emails |

### The database *(host and engine)*

| Setting | Means |
|---|---|
| `DATABASE` | `sqlite:<file>` keeps everything (instances, models, users, sessions) in one SQLite file, such as `sqlite:./data/bpmn.sqlite`: no database server (Node 22.5 or later). Unset: MongoDB, at `MONGO_DB_URL` |
| `DEFINITIONS_PATH` | The models folder, in place of the one in `settings/config.ts`. Used for tests and separate deployments |
| `MONGO_DB_NAME` | The database's name, when the URL has none |
| `MONGO_DB_URL` | **Required, unless `DATABASE` is SQLite.** The MongoDB database, or `memory` to try without one |

### The engine

| Setting | On | Means |
|---|---|---|
| `DEMO_MODE` | Engine | `true` gives `TIMERS`, `SERVICE_TASKS`, `SCRIPT_SANDBOX` and `SCRIPT_SANDBOX_SERVICES` their public demo values, unless they are set |
| `ENGINE_AT` | Host | The engine's address. Unset or `local`: in this process. `none`: no engine |
| `ENGINE_KEY` | Both | **A secret.** Required for a separate engine |
| `ENGINE_LISTEN`, `ENGINE_PORT` | Engine | Its port (`3001`) and listening address (`127.0.0.1`) |
| `ENGINE_SHUTDOWN_TIMEOUT_MS` | Both | How long running executions get to finish on shutdown. Default `10000` |
| `ENGINE_TIMEOUT_MS` | Host | How long to wait for an answer. Default and most `300000`, five minutes. The call isn't tried again: the engine may still be running it |
| `LOCK_MAX_TRIES`, `LOCK_RETRY_DELAY_MS`, `LOCK_STALE_AFTER_MS` | Both | Instance locks: time between tries, tries before giving up, and the age at which a lock is taken over |
| `PYTHON_CMD` | Engine | The command that runs Python scripts. Default `python` |
| `SCRIPT_SANDBOX`, `SCRIPT_SANDBOX_SERVICES` | Engine | `true` runs scripts in a sandbox, and lets sandboxed scripts call services |
| `SERVER_ID` | Both | This process's name in the locks it takes |
| `SERVICE_TASKS`, `TIMERS` | Engine | `false` stops timers or service tasks from running |

### Signing in and access

| Setting | Means |
|---|---|
| `ADMIN_PASSWORD` | **A secret.** Set, a server with no users creates the user `admin` with it. Unset (the default), its first page asks for the administrator, with a setup token it prints: [The first start](setup.md#the-first-start). A server that has users already is not changed |
| `AI_ACCESS` | The levels of AI links (`/ai/key`) this server offers: `off`, or some of `work`, `design`, `administer`, comma separated. Unset: all. A person is offered only the levels their rights allow. See [Chatting with your server](ai/chat-assistants.md) |
| `AI_GUIDE` | A Markdown file: this site's own guide for AI agents, in its `/llms.txt`. Default `settings/ai-guide.md` |
| `AI_KEY_TTL_GROUPS` | How long a user's link for an AI agent (`/ai/key`) lasts, in minutes, by group: `{"ADMIN":10,"staff":60}`. A user in several of the groups gets the shortest; in none, 30 minutes. See [Chatting with your server](ai/chat-assistants.md) |
| `ALLOW_INSECURE_NO_AUTH` | `true` allows `REQUIRE_AUTHENTICATION=false` in production |
| `AUTH_RATE_LIMIT` | Sign-in attempts allowed in the rate window. Default `50` |
| `DISABLE_ADMIN` | `true`: no administration pages or `/admin` APIs |
| `DISABLE_DESIGN` | `true`: no model editor or test runs, and **no test calls on the engine**. Set it on both for production |
| `DISABLE_SIGNUP` | `true`: no self-registration |
| `ENFORCE_SECURITY`, `REQUIRE_AUTHENTICATION` | On unless set to `false` (`init` writes `true`). `false` turns off sign-in and the security rules: for development only |
| `NOTIFICATIONS` | Notification policies (docs/design/notification-policies.md): `record` keeps every notification in wf_notifications without delivering it (the application's notify is not called), for a test or staging server; unset, they are delivered (a test run's are only kept) |
| `SECURITY_POLICY` | Security policies (docs/design/security-policies.md): unset, they are on when the models folder has `policies/security/`; `default` turns them on with the built-in default policy; `off` turns them off |
| `SESSION_SECRET` | **A secret, required in production.** Secures sessions and CSRF tokens |
| `SIGNUP_GROUPS`, `SIGNUP_VERIFY_EMAIL` | Sign-up sends a verification email, and gives these groups once verified |

### REST APIs

| Setting | Means |
|---|---|
| `ADMIN_API_KEY` | **A secret.** Also changes models |
| `API_ACTING_USER_KEY` | **A secret.** Turns on `/api2/tasks`. Must differ from `API_KEY` |
| `API_IMPERSONATION` | `true`: `/api` acts as the user a call names (`userName`, or `options.userName`), with no security rules, as before 3.7. For integrations that need time to move to `/api2/tasks`; goes at 4.0. Default off: the name is ignored, and the answer's `Warning` header says so |
| `API_KEY` | **A secret, required in production.** Runs processes |
| `API_RATE_LIMIT` | Calls a minute one address may make to the APIs (`/api`, `/api2`, `/api/v3`, the administration APIs); over it, `429`. Unset, no limit |
| `API_SERVICE_MODELS_OWNER`, `API_SERVICE_TENANT_ID` | The tenant and models owner of that account |
| `API_SERVICE_USER_GROUPS`, `API_SERVICE_USER_NAME` | Who `/api` and `/api2` calls run as. `init` sets `integration` and `SYSTEM`; without them, those APIs answer 500 |

### Models and connectors

| Setting | Means |
|---|---|
| `CATALOG_URL` | The model catalog to browse |
| `CONNECTORS_ALLOW_HOSTS` | A comma list of the hosts connectors may call |
| `CONNECTORS_KEY` | **A secret.** Encrypts connectors' keys. Required to give a connector a key, and keep it: backups need the same one |
| `CONNECTOR_CATALOG_URL` | The connector catalog to offer |
| `MODEL_HISTORY` | `false` keeps no saved versions of models |
| `VERIFY_MODELS_ON_IMPORT` | `warn`, `enforce` or `off`, for models saved through the APIs |

### Email

| Setting | Means |
|---|---|
| `EMAIL_ENABLE` | `true` sends notifications |
| `EMAIL_FROM`, `SMTP_PASSWORD`, `SMTP_USER` | The account they're sent through. The password is a secret |
| `EMAIL_LOG` | A file that also gets each message |

### Diagnostics

| Setting | Means |
|---|---|
| `API_TRACE` | A file: every API call (`/api`, `/api2`) and its answer, one JSON line each (when, how long, method, path, status, the kind of credential, the bodies cut at `API_TRACE_MAX` characters, default 4000, with passwords, keys and tokens masked). To see what a client, an AI agent, did. Off by default |
| `API_TRACE_MAX` | With API_TRACE: the most characters of a request or answer body kept. Default `4000` |
| `ENABLE_PROFILER` | `true` turns on the database profiler for queries |
| `MODELER` | `classic` uses the old model editor |

### Clients of the server

`bpmn-mcp` and `bpmn-client`'s command line read their own `.env`, from the folder they start in. An application's `.env` already works for them: they read `PORT`, `API_KEY` and `ADMIN_API_KEY` (above), and these.

| Setting | Means |
|---|---|
| `BPMN_ENV_FILE` | `bpmn-mcp` only: another file to read in place of `.env` |
| `HOST` | Where the server is. `HOST` defaults to `localhost` for `bpmn-mcp` |

## What `settings/config.ts` can hold

Anything in [Options](setup.md#options), such as `definitionsPath`, `timers` and the server's components. Leave out what you don't change.
