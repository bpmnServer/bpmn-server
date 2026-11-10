# Setup: one schema for every setting, one wizard, and an AI that helps the administrator

Status: draft for 3.7 (items 8 of the 3.7 plan). Related: [API v3](api-v3.md) (the door, tokens),
[several applications and tenants](multi-app-tenants.md) (a workspace's settings), PR #286 (application settings in
`settings/config.ts`).

## 1. Why

- **Four setups, none complete.** Docker's `setup.sh`, the native `install.sh` options, `npx bpmn-server init`, and
  the browser's first-start page each ask some questions, differently. Email, API keys, design on or off and the
  sample models are left to editing `.env` by hand.
- **No list of the settings.** The code reads 56 `.env` variables, each where it is used; `settings.md` describes
  them by hand. Nothing checks a value's type, nothing says which are secrets, and the docs can drift.
- **An AI agent can build and test workflows** (the person's link, `/ai/key`), but can not help set a server up.

## 2. The schema: every setting, once

One file, `settings.schema.json` (JSON Schema 2020-12, with a few keywords of ours), in bpmn-web, describes every
setting:

```json
{
  "MONGO_DB_URL": {
    "type": "string", "title": "Database",
    "description": "MongoDB's URL, or memory to try without one (emptied when the server stops)",
    "examples": ["mongodb://localhost:27017/bpmn", "memory"],
    "x-where": "env", "x-group": "database", "x-step": 1, "x-restart": true,
    "x-check": "database"
  },
  "API_KEY": {
    "type": "string", "minLength": 24, "title": "API key",
    "x-where": "env", "x-group": "api", "x-secret": true, "x-generate": "key"
  },
  "MODEL_HISTORY": { "type": "boolean", "default": true, "x-where": "env", "x-group": "models" },
  "display.label": { "type": "string", "x-where": "config", "x-group": "application", "description": "PR #286" }
}
```

| Keyword | What it says |
|---|---|
| `type`, `enum`, `default`, `minLength`, `pattern`, `format` | JSON Schema's own: the value's shape |
| `title`, `description`, `examples` | What the wizard shows, and the docs |
| `x-where` | `env` (`.env`: what differs per machine, secrets) or `config` (`settings/config.ts`: how the application behaves) |
| `x-group`, `x-step` | Where it is asked: the wizard's steps, the docs' sections |
| `x-secret` | Never shown back, never logged, masked in every answer (`***`) |
| `x-generate` | The wizard can make it: `key` (random), `password` |
| `x-restart` | A change takes effect on restart |
| `x-check` | A check the wizard runs: `database` (reached), `email` (a test message), `url` (answers), `engine` (answers) |
| `x-host`, `x-engine` | Which process reads it (with a separate engine) |
| `x-deprecated` | Its replacement; still read, with a warning, until it goes |

**`settings/config.ts` is described by the same schema**, not replaced: its keys (`x-where: "config"`) are
typed and documented beside `.env`'s. Its values stay in TypeScript, in the application's code (PR #286: no new
JSON configuration file). A JSON file of values could come later for a workspace's settings (§9); the schema would
describe it unchanged.

**From the schema:**

- `settings.md`'s tables are generated (as `features.md` is from `features.yaml`): the docs can not drift.
- At start, every value is checked: a wrong type or an unknown name is one clear line naming the setting; a value
  unsafe in production stops the start, as today.
- `.env.example` is generated, with each setting's description as its comment.
- One typed object, `settings()`, replaces scattered `process.env` reads, step by step (and is what a workspace
  gives its own values to: multi-app-tenants.md §8).
- The wizard's steps, and what the AI may read and change (§5).

## 3. The wizard

Two faces, one definition: the schema's groups and steps.

- **In the terminal:** `npm run setup` in the application (asking when there is a terminal; with `--yes`, the
  defaults). The Docker and native commands' `setup` run it. `init` and `install.sh` keep their options, for scripts
  and CI, and write the same `.env`.
- **In the browser:** the first-start page becomes these steps, after the setup token. Settings that need a restart
  are written to `.env`, and the page says so.

**The steps:** the database (checked: reached), the first administrator, the site's address (checked: answers), email
(checked: a test message), the API keys (generated), sign-in and design on or off, the sample models, and AI access
(§4: on, which levels, how long). Each step can be skipped, keeping today's default. A step's settings are written
only when its check passes, or when the person says to keep them anyway.

**Any time:** Administration ▸ Settings shows every setting by group, from the schema, with its value (secrets
masked), its source (`.env`, `settings/config.ts`, default) and whether it waits for a restart; and runs the wizard,
or one of its steps, again. `npm run setup` does the same in the terminal.

### Profiles

The wizard starts by asking for a profile. A profile pre-fills settings, so only what is left is asked; each
pre-filled value can still be changed. The schema says each setting's value per profile (`x-profiles`).

| Profile | For | Pre-fills (examples) |
|---|---|---|
| **Production** | a server people rely on | MongoDB required (no memory); sign-in and security on; `SECURE_COOKIES` with HTTPS; keys and the first password generated; `APP_ENV=production`; `API_TRACE` off |
| **Development and test** | a developer's machine, a test server | memory or a local MongoDB; `APP_ENV=test` (the test services); design on; the sample models; `API_TRACE` on |
| **Several tenants** | one site, many workspaces ([multi-app-tenants.md](multi-app-tenants.md)) | the host's settings, then each workspace's entry in `TENANTS_FILE` (its database, models folder, engine, keys); built with tenants, in 3.8 |

A profile dictates nothing: it is a starting point, and `AI_ACCESS`, like every setting, is the installation's choice.

## 4. The AI, at three levels

Today a signed-in person gets a link for their agent (`/ai/key`), and the agent acts as them on `/api2`, with their
groups. The link is the same whoever asks; what the agent may do follows the person.

**Proposed:** the person **chooses the level** when making the link, among those they have. Each level is a set of
operations; a link never has more than its level, even when its person has more.

| Level | Who may make it | The agent may | The link lasts (default) |
|---|---|---|---|
| **Work** | everyone | start processes, list and complete their tasks, read their instances and the Rationale | 30 minutes |
| **Design** | designers, administrators | as Work, and read, check, save and test models | 30 minutes |
| **Administer** | administrators | as Work, and read the settings (secrets masked), run the checks, read the logs and the health, and advise | 10 minutes |

- **The default is the lowest level that is enough**: an administrator who wants a workflow built makes a Design link;
  an Administer link is asked for on purpose.
- **Separate links, separate keys:** each link is a user token (api-v3.md) carrying its level as a scope (`work`,
  `design`, `administer`); the door refuses an operation outside it. The agent's page (`/ai/<key>`) tells it its level
  and what it may do.
- **Levels and lasting** are settings in the schema: `AI_ACCESS` (`off`, or the levels offered), and how long each
  lasts (today's `AI_KEY_TTL_GROUPS`, by level).

## 5. What the AI may do as an administrator

Kept simple: the agent advises; a person changes the settings.

- **Read:** every setting from the schema, with its source and value; secrets as `***`, never their values.
- **Check:** run the schema's checks (the database reached, a test email to the administrator, the site's address).
- **Diagnose:** read the health (`/healthz`), the recent log and a failed start's message.
- **Advise:** say which settings to change, to what, and why. Any setting that is not a secret may be advised; for a
  secret, the agent asks the administrator to enter it themselves.
- **The administrator applies** the change through the setup: Administration ▸ Settings, or `npm run setup`.
- **Never:** change a setting, see or set a secret, delete data, change users' rights.

The API (v3): `GET /settings` (by group, secrets masked), `GET /settings/schema`, `POST /settings/checks/{name}`.

## 6. Security

- Secrets never leave the server: not in answers (masked by the schema's `x-secret`), not in logs, not in the AI's
  pages.
- An Administer link changes nothing (§5); it is short-lived, revoked on sign-out, and every call it makes is logged with the person who made
  it (the API trace, `API_TRACE`).
- `AI_ACCESS` (optional, in `.env`) says which levels a server offers: all, some, or none. Nothing is dictated by
  profile or environment.
- The checks send nothing outside but a test email to the administrator's own address.

## 7. Steps

1. **The schema** of every `.env` variable and `settings/config.ts` key: generated from today's `settings.md` and the
   code's reads, then reviewed; a test that every `process.env` read in the code is in it.
2. **From it:** the settings page generated, the start's checks, `.env.example`.
3. **The wizard** in the terminal (`npm run setup`), then the browser's steps; Docker's and the native commands'
   `setup` call it.
4. **Administration ▸ Settings**: the values, their sources, a step again.
5. **Profiles**: production, development and test (several tenants with 3.8's tenants).
6. **AI levels**: the scopes on tokens, the level chosen on `/ai/key`, the agent's page by level.
7. **The Administer level**: settings read, checks, diagnosis.

## 8. Decisions (2026-11-10)

1. The wizard runs any time: at first start, and from Administration ▸ Settings (or `npm run setup`).
2. Kept simple: the agent applies nothing; it advises, and the administrator changes settings through the setup.
3. The agent may advise on every setting that is not a secret; for a secret, it asks the administrator to enter it.
4. `AI_ACCESS` is optional in `.env`: no level is dictated for production or any other environment.
5. Three profiles pre-fill the setup: production; development and test; several tenants.
