# Configuration: every parameter, where it is defined, how it is set

Generated from the code (scratchpad inventory.py), for discussion. "init" is set before the server starts and
read at start; "Settings ▸ <area>" is changed on the Settings page (written to `.env`, applied on restart).

## 1. Settings in settings.schema.json (packages/bpmn-web/settings/)

| Group | Name | Defined in | Set by | What |
|---|---|---|---|---|
| access | `ADMIN_PASSWORD` | `.env` (or the environment) | init: `.env` only | **A secret.** Set, a server with no users creates the user `admin` with it. Unset (the default), its first page asks for the administrator,  |
| access | `AI_ACCESS` | `.env` (or the environment) | Settings ▸ AI Agents (add-on) | The levels of AI links (`/ai/key`) this server offers: `off`, or some of `work`, `design`, `administer`, comma separated. Unset: all. A pers |
| access | `AI_GUIDE` | `.env` (or the environment) | Settings ▸ AI Agents (add-on) | A Markdown file: this site's own guide for AI agents, in its `/llms.txt`. Default `settings/ai-guide.md` |
| access | `AI_KEY_TTL_GROUPS` | `.env` (or the environment) | init: `.env` only | How long a user's link for an AI agent (`/ai/key`) lasts, in minutes, by group: `{"ADMIN":10,"staff":60}`. A user in several of the groups g |
| access | `ALLOW_INSECURE_NO_AUTH` | `.env` (or the environment) | init: `.env` only | `true` allows `REQUIRE_AUTHENTICATION=false` in production |
| access | `AUTH_RATE_LIMIT` | `.env` (or the environment) | init: `.env` only | Sign-in attempts allowed in the rate window. Default `50` |
| access | `DISABLE_ADMIN` | `.env` (or the environment) | init: `.env` only | `true`: no administration pages or `/admin` APIs |
| access | `DISABLE_DESIGN` | `.env` (or the environment) | init: `.env` only | `true`: no model editor or test runs, and **no test calls on the engine**. Set it on both for production |
| access | `DISABLE_SIGNUP` | `.env` (or the environment) | init: `.env` only | `true`: no self-registration |
| access | `ENFORCE_SECURITY` | `.env` (or the environment) | Settings ▸ The application, on restart | On unless set to `false` (`init` writes `true`). `false` turns off sign-in and the security rules: for development only |
| access | `NOTIFICATIONS` | `.env` (or the environment) | Settings ▸ Notifications (add-on) | Notification policies (docs/design/notification-policies.md): `record` keeps every notification in wf_notifications without delivering it (t |
| access | `READ_ONLY` | `.env` (or the environment) | Settings ▸ The application, on restart | `true`: people use the server but can't change it. They start cases and complete tasks; the models, decision tables, policies, tests, roles, |
| access | `REQUIRE_AUTHENTICATION` | `.env` (or the environment) | init: `.env` only | On unless set to `false` (`init` writes `true`). `false` turns off sign-in and the security rules: for development only |
| access | `SECURITY_POLICY` | `.env` (or the environment) | Settings ▸ Access Control (add-on) | Security policies (docs/design/security-policies.md): unset, they are on when the models folder has `policies/security/`; `default` turns th |
| access | `SESSION_SECRET` | `.env` (or the environment) | init: `.env` only | **A secret, required in production.** Secures sessions and CSRF tokens |
| access | `SIGNUP_GROUPS` | `.env` (or the environment) | init: `.env` only | Sign-up sends a verification email, and gives these groups once verified |
| access | `SIGNUP_VERIFY_EMAIL` | `.env` (or the environment) | init: `.env` only | Sign-up sends a verification email, and gives these groups once verified |
| api | `ADMIN_API_KEY` | `.env` (or the environment) | Settings ▸ The API the application calls, on restart | **A secret.** Also changes models |
| api | `API_ACTING_USER_KEY` | `.env` (or the environment) | Settings ▸ The API the application calls, on restart | **A secret.** Turns on `/api2/tasks`. Must differ from `API_KEY` |
| api | `API_IMPERSONATION` | `.env` (or the environment) | Settings ▸ The API the application calls | `true`: `/api` acts as the user a call names (`userName`, or `options.userName`), with no security rules, as before 3.7. For integrations th |
| api | `API_KEY` | `.env` (or the environment) | Settings ▸ The API the application calls, on restart | **A secret, required in production.** Runs processes |
| api | `API_RATE_LIMIT` | `.env` (or the environment) | Settings ▸ The API the application calls, on restart | Calls a minute one address may make to the APIs (`/api`, `/api2`, `/api/v3`, the administration APIs); over it, `429`. Unset, no limit |
| api | `API_SERVICE_MODELS_OWNER` | `.env` (or the environment) | Settings ▸ The API the application calls, on restart | The tenant and models owner of that account |
| api | `API_SERVICE_TENANT_ID` | `.env` (or the environment) | Settings ▸ The API the application calls, on restart | The tenant and models owner of that account |
| api | `API_SERVICE_USER_GROUPS` | `.env` (or the environment) | Settings ▸ The API the application calls, on restart | Who `/api` and `/api2` calls run as. `init` sets `integration` and `SYSTEM`; without them, those APIs answer 500 |
| api | `API_SERVICE_USER_NAME` | `.env` (or the environment) | Settings ▸ The API the application calls, on restart | Who `/api` and `/api2` calls run as. `init` sets `integration` and `SYSTEM`; without them, those APIs answer 500 |
| clients | `BPMN_ENV_FILE` | `.env` (or the environment) | init: `.env` only | `bpmn-mcp` only: another file to read in place of `.env` |
| clients | `HOST` | `.env` (or the environment) | init: `.env` only | Where the server is. `HOST` defaults to `localhost` for `bpmn-mcp` |
| database | `DATABASE` | `.env` (or the environment) | init: `.env` only | `sqlite:<file>` keeps everything (instances, models, users, sessions) in one SQLite file, such as `sqlite:./data/bpmn.sqlite`: no database s |
| database | `DEFINITIONS_PATH` | `.env` (or the environment) | init: `.env` only | The models folder, in place of the one in `settings/config.ts`. Used for tests and separate deployments |
| database | `MONGO_DB_NAME` | `.env` (or the environment) | init: `.env` only | The database's name, when the URL has none |
| database | `MONGO_DB_URL` | `.env` (or the environment) | init: `.env` only | **Required, unless `DATABASE` is SQLite.** The MongoDB database, or `memory` to try without one |
| database | `config:database.MongoDB` | `start({ config })` / `webConfiguration()` | init: code | `db_url`, `db`, and optionally the collections: `Locks_collection`, `Instance_collection`, `Archive_collection` |
| diagnostics | `API_TRACE` | `.env` (or the environment) | init: `.env` only | A file: every API call (`/api`, `/api2`) and its answer, one JSON line each (when, how long, method, path, status, the kind of credential, t |
| diagnostics | `API_TRACE_MAX` | `.env` (or the environment) | init: `.env` only | With API_TRACE: the most characters of a request or answer body kept. Default `4000` |
| diagnostics | `ENABLE_PROFILER` | `.env` (or the environment) | init: `.env` only | `true` turns on the database profiler for queries |
| diagnostics | `MODELER` | `.env` (or the environment) | init: `.env` only | `classic` uses the old model editor |
| email | `EMAIL_ENABLE` | `.env` (or the environment) | Settings ▸ Notifications (add-on), on restart | `true` sends notifications |
| email | `EMAIL_FROM` | `.env` (or the environment) | Settings ▸ Notifications (add-on), on restart | The account they're sent through. The password is a secret |
| email | `EMAIL_LOG` | `.env` (or the environment) | Settings ▸ Notifications (add-on), on restart | A file that also gets each message |
| email | `SMTP_PASSWORD` | `.env` (or the environment) | Settings ▸ Notifications (add-on), on restart | The account they're sent through. The password is a secret |
| email | `SMTP_USER` | `.env` (or the environment) | Settings ▸ Notifications (add-on), on restart | The account they're sent through. The password is a secret |
| engine | `DEMO_MODE` | `.env` (or the environment) | init: `.env` only | `true` gives `TIMERS`, `SERVICE_TASKS`, `SCRIPT_SANDBOX` and `SCRIPT_SANDBOX_SERVICES` their public demo values, unless they are set |
| engine | `ENGINE_AT` | `.env` (or the environment) | init: `.env` only | The engine's address. Unset or `local`: in this process. `none`: no engine |
| engine | `ENGINE_KEY` | `.env` (or the environment) | init: `.env` only | **A secret.** Required for a separate engine |
| engine | `ENGINE_LISTEN` | `.env` (or the environment) | init: `.env` only | Its port (`3001`) and listening address (`127.0.0.1`) |
| engine | `ENGINE_PORT` | `.env` (or the environment) | init: `.env` only | Its port (`3001`) and listening address (`127.0.0.1`) |
| engine | `ENGINE_SHUTDOWN_TIMEOUT_MS` | `.env` (or the environment) | init: `.env` only | How long running executions get to finish on shutdown. Default `10000` |
| engine | `ENGINE_TIMEOUT_MS` | `.env` (or the environment) | init: `.env` only | How long to wait for an answer. Default and most `300000`, five minutes. The call isn't tried again: the engine may still be running it |
| engine | `LOCK_MAX_TRIES` | `.env` (or the environment) | init: `.env` only | Instance locks: time between tries, tries before giving up, and the age at which a lock is taken over |
| engine | `LOCK_RETRY_DELAY_MS` | `.env` (or the environment) | init: `.env` only | Instance locks: time between tries, tries before giving up, and the age at which a lock is taken over |
| engine | `LOCK_STALE_AFTER_MS` | `.env` (or the environment) | init: `.env` only | Instance locks: time between tries, tries before giving up, and the age at which a lock is taken over |
| engine | `PYTHON_CMD` | `.env` (or the environment) | init: `.env` only | The command that runs Python scripts. Default `python` |
| engine | `SCRIPT_SANDBOX` | `.env` (or the environment) | Settings ▸ Models and scripts, on restart | `true` runs scripts in a sandbox, and lets sandboxed scripts call services |
| engine | `SCRIPT_SANDBOX_SERVICES` | `.env` (or the environment) | Settings ▸ Models and scripts, on restart | `true` runs scripts in a sandbox, and lets sandboxed scripts call services |
| engine | `SERVER_ID` | `.env` (or the environment) | init: `.env` only | This process's name in the locks it takes |
| engine | `SERVICE_TASKS` | `.env` (or the environment) | Settings ▸ Connectors: the application's APIs, on restart | `false` stops timers or service tasks from running |
| engine | `TIMERS` | `.env` (or the environment) | Settings ▸ Models and scripts, on restart | `false` stops timers or service tasks from running |
| engine | `config:locks.maxTries` | `start({ config })` / `webConfiguration()` | init: code | tries before a lock gives up (20) |
| engine | `config:locks.retryDelay` | `start({ config })` / `webConfiguration()` | init: code | milliseconds between lock tries (1500) |
| engine | `config:locks.staleAfter` | `start({ config })` / `webConfiguration()` | init: code | milliseconds after which a lock or timer claim is stale and another server may take it (300000) |
| engine | `config:serverId` | `start({ config })` / `webConfiguration()` | init: code | this server's identity as a lock owner (default `SERVER_ID`, else the host, the process id and a random suffix) |
| engine | `config:shutdownTimeout` | `start({ config })` / `webConfiguration()` | init: code | how long `shutdown()` waits for running executions, in milliseconds (10000) |
| engine | `config:timers.forceTimersDelay` | `start({ config })` / `webConfiguration()` | init: code | milliseconds; every timer fires after this delay (for testing). When `timers` is not given at all, the default is `{ forceTimersDelay: 1000, |
| engine | `config:timers.pollInterval` | `start({ config })` / `webConfiguration()` | init: code | milliseconds between re-reads of waiting timers, so a timer another server scheduled fires here when that server is gone (default 60000; 0:  |
| engine | `config:timers.precision` | `start({ config })` / `webConfiguration()` | init: code | milliseconds; timers due within it fire together |
| models | `CATALOG_URL` | `.env` (or the environment) | Settings ▸ Models and scripts, on restart | The model catalog to browse |
| models | `CONNECTORS_ALLOW_HOSTS` | `.env` (or the environment) | Settings ▸ Connectors: the application's APIs, on restart | A comma list of the hosts connectors may call |
| models | `CONNECTORS_KEY` | `.env` (or the environment) | Settings ▸ Connectors: the application's APIs, on restart | **A secret.** Encrypts connectors' keys. Required to give a connector a key, and keep it: backups need the same one |
| models | `CONNECTOR_CATALOG_URL` | `.env` (or the environment) | Settings ▸ Connectors: the application's APIs, on restart | The connector catalog to offer |
| models | `ELEMENT_TEMPLATES` | `.env` (or the environment) | Settings ▸ Model Options (add-on) | `on` offers the application's element templates (configured tasks) in the model editor and lists them on the Design page. Off by default in  |
| models | `EXTENDED_FORMS` | `.env` (or the environment) | Settings ▸ Model Options (add-on), on restart | `false`: a form field's choices from a source (`owf:list`, `owf:lookup`) are not offered; the fields are plain ones |
| models | `FORM_RULES` | `.env` (or the environment) | Settings ▸ Models and scripts, on restart | `false`: a form's rules (a field's type, its constraints, a list's choices) are not checked when a task is completed |
| models | `MODEL_HISTORY` | `.env` (or the environment) | Settings ▸ Model Options (add-on), on restart | `false` keeps no saved versions of models |
| models | `MODEL_TESTS` | `.env` (or the environment) | Settings ▸ Model Options (add-on), on restart | `false`: the model editor has no Test tab (a model's scenarios, run in the engine) |
| models | `VERIFY_MODELS_ON_IMPORT` | `.env` (or the environment) | Settings ▸ Models and scripts, on restart | `warn`, `enforce` or `off`, for models saved through the APIs |
| models | `config:definitionsPath` | `start({ config })` / `webConfiguration()` | init: code | the folder of model files |
| server | `APP_ENV` | `.env` (or the environment) | Settings ▸ The application, on restart | The environment: `development`, `test` or `production`. The pages show it as a band (Development blue, Test amber), and API v3's `/me` says  |
| server | `APP_ENV_LABEL` | `.env` (or the environment) | Settings ▸ The application, on restart | What the environment's band says instead of its name, in any environment: `Staging`, `Public demo`. Shown in production too |
| server | `BODY_LIMIT` | `.env` (or the environment) | init: `.env` only | The largest request. Default `50mb` |
| server | `DOCS_PATH` | `.env` (or the environment) | init: `.env` only | The folder of the docs pages the server shows |
| server | `HTTPS` | `.env` (or the environment) | init: `.env` only | Serve HTTPS directly |
| server | `ITSM_HOST` | `.env` (or the environment) | init: `.env` only | The origin allowed to call the server from a browser (CORS) |
| server | `NODE_ENV` | `.env` (or the environment) | init: `.env` only | `production` stops the server from starting with unsafe settings: see [Security](security.md) |
| server | `PORT` | `.env` (or the environment) | init: `.env` only | The web server's port. Default `3000` |
| server | `RESTART_ON_EXIT` | `.env` (or the environment) | init: `.env` only | `true`: something restarts this process when it exits |
| server | `SECURE_COOKIES` | `.env` (or the environment) | init: `.env` only | Cookies only over HTTPS, when something in front of the server handles it |
| server | `SERVE` | `.env` (or the environment) | init: `.env` only | `both`, `api` (the REST APIs only) or `ui` (the web pages only) |
| server | `SITE_NAME` | `.env` (or the environment) | init: `.env` only | The name and address used in emails |
| server | `SITE_URL` | `.env` (or the environment) | Settings ▸ The application, on restart | The name and address used in emails |
| server | `SSL_CERT_PATH` | `.env` (or the environment) | init: `.env` only | Serve HTTPS directly |
| server | `SSL_KEY_PATH` | `.env` (or the environment) | init: `.env` only | Serve HTTPS directly |

## 2. Read from the environment, not in the schema

| Name | Read in |
|---|---|
| `INVOCATION_ID` | bpmn-web/src/routes/dashboards.ts |
| `OPENSHIFT_NODEJS_IP` | bpmn-web/src/app.ts |
| `OPENSHIFT_NODEJS_PORT` | bpmn-web/src/app.ts |

## 3. The engine's configuration (IConfiguration) not in the schema: code only

Given in `start({ config })`, or by bpmn-web's `webConfiguration()` defaults (some from `.env`).

| Field | From `.env` (webConfiguration) |
|---|---|
| `templatesPath` | code only (bpmn-web's emailTemplates) |
| `apiKey` | `API_KEY` |
| `moddleOptions` | code only |
| `delegateFile` | code only (default delegates/appDelegate.ts) |
| `serviceNames` | code only |
| `servicesFile` | code only |
| `logger` | code only |
| `definitions` | code only |
| `appDelegate` | code only |
| `dataStore` | `SAVE_POINTS`, `SAVE_LOGS`, `SAVE_SOURCE` |
| `scriptHandler` | `SCRIPT_SANDBOX`, `SCRIPT_SANDBOX_SERVICES` |
| `cacheManager` | code only |
| `documentStore` | `DATABASE=sqlite:` |
| `locker` | code only |
| `addOns` | `app-config.json`; `EXTENDED_FORMS` |
| `addOnManifests` | code only |
| `appConfig` | code only (default ./app-config.json) |
| `runTimers` | `TIMERS` (`DEMO_MODE`) |
| `runServiceTasks` | `SERVICE_TASKS` (`DEMO_MODE`) |
| `demo` | code only |
| `modelHistory` | `MODEL_HISTORY`; off when Model Options is off (app-config.json) |
| `formRules` | `FORM_RULES` |
| `connectors` | code only |

## 4. start() options (packages/bpmn-web/src/start.ts): code only

`config`, `appDelegate`, `api`, `ui`, `elementTemplatesPath`, `setupOnly`, `console`, `routes`, `userManager`, `hostSettings`, `envFile`, `engineCalls`

## 5. Files of the application

| File | Holds | Set by |
|---|---|---|
| `.env` | the settings of §1 and §2 | by hand, `npm run setup`, the Settings page |
| `app-config.json` | `addOns`: which add-ons are on | by hand; the Settings page (an add-on on/off) |
| `app-contract.json` | what the application offers: expressions, types, roles, APIs, pages | by hand (the application's developer) |
| `roles.json` (models folder) | the roles | the Administration page |
| `settings/config.ts` | paths: models, delegate, connectors | code (§3, §4) |
| `bpmn-server DefaultConfiguration.ts` | the engine's defaults, the engine on its own | bpmn-server |

## 6. What makes it confusing

- **Five places**: `.env`, `start({ config })` / config.ts, `start()` options, `app-config.json`, `app-contract.json` (and `roles.json`).
- **Two names for one thing**: `.env` names (`MODEL_HISTORY`) become configuration fields (`modelHistory`) in `webConfiguration()`; the schema lists the `.env` name only, the engine’s field only in code (§3).
- **Paths are code**: the models folder, the delegate, the connectors and the element templates are `config.ts` / `start()` options, except `DEFINITIONS_PATH`.
- **Not on the Settings page**: 55 of the schema’s 92 (§1, "init"): some on purpose (secrets, sign-in safety, the engine’s placement), some only because no area lists them.
- **`roles.json` and `app-contract.json`** both hold the roles.

## 7. Fewer settings: a proposal, row by row

92 settings in the schema, 23 engine fields, 12 `start()` options. Each row below is decided on its own. An old name
stays read for a release or two, with a warning at start naming the new one (`settingsProblems`).

| # | Today | Instead | Fewer | Decision |
|---|---|---|---|---|
| 1 | `DATABASE`, `MONGO_DB_URL`, `MONGO_DB_NAME` | `DATABASE` = `mongodb://…/name` \| `sqlite:<file>` \| `memory` | 2 | |
| 2 | `SITE_NAME`, `SITE_URL` (the same description) | `SITE_URL` | 1 | |
| 3 | `HTTPS`, `SSL_CERT_PATH`, `SSL_KEY_PATH` | the two paths: set, HTTPS | 1 | |
| 4 | `SECURE_COOKIES` | from `SITE_URL` being `https:` | 1 | |
| 5 | `NODE_ENV`, `APP_ENV`, `APP_ENV_LABEL` | `APP_ENV` (`NODE_ENV` is Node's, still read) | 2 | |
| 6 | `DEMO_MODE` (deprecated) | `TIMERS`, `SERVICE_TASKS` | 1 | |
| 7 | `ENGINE_AT`, `ENGINE_LISTEN`, `ENGINE_PORT`, `ENGINE_KEY`, `ENGINE_TIMEOUT_MS`, `ENGINE_SHUTDOWN_TIMEOUT_MS` | `ENGINE_AT` (with its port), `ENGINE_KEY`; the timeouts defaults | 4 | |
| 8 | `LOCK_MAX_TRIES`, `LOCK_RETRY_DELAY_MS`, `LOCK_STALE_AFTER_MS`, `SERVER_ID` | defaults; `locks` in code to tune | 4 | |
| 9 | `EMAIL_ENABLE`, `EMAIL_LOG` | `EMAIL` = `off` \| `log` \| `send` | 1 | |
| 10 | `SCRIPT_SANDBOX`, `SCRIPT_SANDBOX_SERVICES` | `SCRIPT_SANDBOX` = `off` \| `on` \| `with-services` | 1 | |
| 11 | `DISABLE_SIGNUP`, `SIGNUP_GROUPS`, `SIGNUP_VERIFY_EMAIL` | `SIGNUP` = `off` \| `open` \| `verify`; its groups in `owf-config.json` | 2 | |
| 12 | `REQUIRE_AUTHENTICATION`, `ALLOW_INSECURE_NO_AUTH` | `AUTH` = `on` \| `off-insecure` | 1 | |
| 13 | `API_SERVICE_USER_NAME`, `API_SERVICE_USER_GROUPS`, `API_SERVICE_TENANT_ID`, `API_SERVICE_MODELS_OWNER` | `serviceAccount` in `owf-config.json` | 3 | |
| 14 | `ENFORCE_SECURITY`, `SECURITY_POLICY`, `NOTIFICATIONS` | the add-ons' on/off, and their own settings | 2–3 | |
| 15 | `API_TRACE_MAX`, `ENABLE_PROFILER`, `MODELER`, `AI_KEY_TTL_GROUPS`, `RESTART_ON_EXIT` (detected) | defaults, not settings | 5 | |
| 16 | `HOST`, `BPMN_ENV_FILE` (`bpmn-mcp`'s) | the clients' own docs, not the server's | 2 | |
| 17 | `DEFINITIONS_PATH` | `paths` in `owf-config.json` (the variable stays, the tests' override) | 1 | |
| 18 | engine fields `servicesFile`, `serviceNames`, `demo`, `apiKey` | gone (dead, runtime state, deprecated, `API_KEY`'s twin) | 4 | |
| 19 | `OPENSHIFT_NODEJS_IP`, `OPENSHIFT_NODEJS_PORT` | gone; `LISTEN_HOST` if wanted | 2 | |

About 40 fewer: some 55 settings left.

### Three tiers

1. **Must set** (`.env`, about 5): `DATABASE`, `SITE_URL`, `SESSION_SECRET`, `API_KEY`, `APP_ENV`; in production
   `ENGINE_AT` and `ENGINE_KEY` too.
2. **The application's** (`owf-config.json`, the Settings page): the add-ons and their options, the paths, the roles,
   the contract, how models and forms are checked, the catalogs.
3. **Tuning** (defaults, documented, seldom set): ports, limits, timeouts, locks, diagnostics.

### Detected, not settings

`INVOCATION_ID` (systemd), `pm_id` (pm2), `/.dockerenv` (Docker): the Administration page reads them to know whether
something restarts the server.
