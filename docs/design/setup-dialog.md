# The setup dialog

Status: **draft, for review.** Nothing here is built. This is the dialog `bpmn-server init` and `bpmn-server setup`
should have, written down so it can be agreed before any of it is coded.

**Scope: a development server.** `init` makes one to work from. Production comes after integration and belongs to
the application the workflows run inside, not to this dialog (§3.2). Related: [setup-wizard.md](setup-wizard.md),
`packages/bpmn-web/settings/settings.schema.json` (every setting), `packages/bpmn-server/src/setup.ts` (what runs now).

## 1. Why this document

The dialog today is eight hand-written functions in `setup.ts`, each carrying its own knowledge of the settings it
asks about. The same four moves — show a heading, propose a default, ask, validate, set — are written out eight
times, so a fix in one place does not reach the others, and the wording, the defaults and the validation drift apart.

What follows is the dialog as **data**: every question, its options, its default, and what the answer writes. The
code that runs it should be one loop over this table and nothing else. No step should know the name of a setting.

**Edit this file.** Change the wording, drop questions, add them, reorder them. What is agreed here is what gets
built.

## 2. What the dialog is for

Enough to start the server, and nothing else. Four questions:

1. **Where** — the folder.
2. **What to start from** — the sample application, or the HR demo.
3. **The database** — the one thing with no safe default.
4. **The port.**

Everything else is **stated, not asked**: the dialog says what it did, and the Settings page changes it afterwards.
Each question a setup asks is a decision taken before anyone knows enough to take it, so the dialog asks as few as
it can.

**What setup never asks** — these belong to the running server, on **Dashboard ▸ Settings**:

| Not asked | Where it belongs | Why |
|---|---|---|
| The administrator's email | Settings, or My account | `admin@example.com` until someone changes it |
| Who may design, who may sign themselves up | Settings ▸ Security | the profile sets them; the table there changes them |
| What an AI agent may do (`AI_ACCESS`) | Settings ▸ Security | all of them by default |
| The keys (`API_KEY`, `ADMIN_API_KEY`, `SESSION_SECRET`) | generated; Settings ▸ Security replaces them | nobody chooses a secret by typing it |
| Recording API calls (`API_TRACE`) | Settings | the profile sets it |

## 3. The dialog

### 3.1 Where

| Ask | Default | Writes |
|---|---|---|
| Folder | `my-app` | the folder it creates |

`init` only: an existing application is its folder.

### 3.2 What to start from

`init` makes a **development server**: an application to work from, on your own machine. That is all it makes.

A production server is not something this dialog sets up. By the time there is one, the workflows are running inside
an application ([integration guide](../docs/integration-guide.md)), and it is that application which is deployed,
with its own database, its own address, its own users and its own secrets. The workflow server is a part of it, and
takes those from it. Setting up production here would be setting up the wrong thing.

```
Start from
  1) Sample application  a few models, the services they call, no pages of its own
  2) HR demo             an HR application with its own pages, users and API, and the
                         workflows that call them
  1 or 2 [1]:
```

*(Open question 4: the HR demo is a React application with a server of its own — is it a template `init` can copy,
or does that answer clone the repository?)*

**The HR demo, started here, differs from the public demo in one way: people sign in for real.** The public one
(`apps/hrdemo`, `src/pages/Welcome.jsx`) has a **Sign in as …** button on each account, which signs in without a
password — right for a demo anyone may click through, wrong for a server being built on. Started by `init`:

- **No sign-in-as buttons.** The sign-in page is the only way in: a user name and a password, typed.
- **The accounts are still listed** — user name, name, role, workflow groups — **with the password beside them**, so
  nobody has to guess. Knowing a password and being handed a session are different things: the first is a
  convenience, the second is a hole that behaves differently from the deployed server.

So what is built on it behaves as it will once deployed, and a workflow that depends on who is signed in is tested
properly.

**It signs people in for real.** A development server is not one with its guard down: sign-in is required and the
security rules are enforced, exactly as a deployed one, so a workflow written here behaves the same there. What it
does differently is keep nothing — the database is in the process and goes when it stops — and record what the APIs
were asked.

| Setting | | Why |
|---|---|---|
| `APP_ENV` | `test` | the pages show the band, and the sample applications use their test services |
| the database proposed | in memory | nothing to install; `3` or an address keeps the data |
| `REQUIRE_AUTHENTICATION` | `true` | signing in for real |
| `ENFORCE_SECURITY` | `true` | the security rules as they will be |
| `DISABLE_SIGNUP` | `false` | add yourself an account without an administrator |
| `DISABLE_DESIGN` | `false` | the model editor is the point |
| `API_TRACE` | `api-trace.jsonl` | what a client or an agent asked for, to read back |

Each is changed afterwards on **Dashboard ▸ Settings**, and `setup` asks again.

### 3.3 The database

```
The database
  where instances, models and users are kept
  1) MongoDB    a server you run; docker compose up -d brings one up
  2) In memory  a MongoDB inside this process; everything is lost when it stops
  3) SQLite     one file, no database server to run (see below)
  1, 2, 3 or an address [1]:
```

- Default: **2**, so there is nothing to install before the server runs.
- An address instead of a number says exactly where: `mongodb://…`, or `sqlite:<file>`.
- **3** uses `./data/bpmn.sqlite` and writes `DATABASE=sqlite:<file>`; **1** and **2** write `MONGO_DB_URL` and
  remove `DATABASE`. Only one of the two is ever in `.env`.
- **2** keeps nothing: the data goes when the server stops. **1** or **3** to keep it.
- The answer is **checked** (unless `--no-check`): the dialog says whether the database answered. When it did not,
  `Keep it anyway? [no]` — a typed address may be right for a server that is not up yet, and no is asking again.

**What SQLite gives up** (`SqliteDocumentStore`, [data.md](../docs/data.md)):

- **Only the unique indexes are made.** Every query reads each instance and checks it, so a large database gets slow
  where MongoDB's indexes keep it fast — the task list goes from ~30 ms to ~300 ms at 50,000 instances.
- **One writer at a time.** A write waits for another connection's (`busyTimeout`, 5 s by default), so several
  servers on one file will block each other.
- **Node 22.5 or later** (`node:sqlite`).

Good for one server, a small database, a demo or a test. Not for a busy one.

### 3.4 The port

| Ask | Default | Writes |
|---|---|---|
| Port | `3000` | `PORT` |

`SITE_URL` follows it (`http://localhost:<port>`) and is not asked; links out of the server use it, and Settings changes it.

### 3.5 What it says, having asked

Not questions — lines the dialog prints, so nothing is a surprise:

```
  Sign-in required, and the security rules enforced.
  The administrator is made the first time the server starts, and its password
  printed once where it runs. Change it on My account.
  API_KEY, ADMIN_API_KEY and SESSION_SECRET: generated.
```

- **The administrator**: `admin`, a password the server makes up and prints once, `admin@example.com`. No password is
  written to `.env`, because a secret in a file is one more place it leaks from. `ADMIN_PASSWORD` in `.env` before
  the first start still wins, for whoever wants to choose it.
- **Authentication** is the profile's, and both profiles require it. *(Open question 1.)*

### 3.6 Writing it

Nothing is written until the end. The dialog lists what will change — secrets as `set`, never their value — and asks:

```
Changes to .env:
  DATABASE                 sqlite:./data/bpmn.sqlite
  PORT                     3100
  APP_ENV                  test
  API_KEY                  set
  Write them [yes]:
```

No, and nothing is written; the application's `.env` is left as it was, with `.env.bak` beside it when one is
replaced.

## 4. How it reads, start to end

```
bpmn-server 3.7.5 from C:\...\packages\bpmn-server

  Folder [my-app]: orders

Start from
  1) Sample application  a few models, the services they call, no pages of its own
  2) HR demo             an HR application with its own pages, users and API, and the
                         workflows that call them
  1 or 2 [1]: 2

The database
  where instances, models and users are kept
  1) MongoDB    a server you run; docker compose up -d brings one up
  2) In memory  a MongoDB inside this process; everything is lost when it stops
  3) SQLite     one file, no database server to run (see below)
  1, 2, 3 or an address [2]: 3
    ok: orders/data/bpmn.sqlite: its folder can be written

  Port [3000]:

  Sign-in required, and the security rules enforced.
  The administrator is made the first time the server starts, and its password
  printed once where it runs.
  API_KEY, ADMIN_API_KEY and SESSION_SECRET: generated.

Changes to .env:
  DATABASE                 sqlite:./data/bpmn.sqlite
  APP_ENV                  test
  API_TRACE                api-trace.jsonl
  API_KEY                  set
  ADMIN_API_KEY            set
  SESSION_SECRET           set
  Write them [yes]:

Created C:\...\orders

Next:
  cd orders
  npm install
  npm start                # http://localhost:3000
```

Rules the code must follow, so the formatting cannot drift:

- **One line** under each heading saying what it is for. A setting's own description is reference text: it belongs in
  the documentation and behind `--explain`, never between two questions.
- Options are **numbered, one per line**, the description in a second column aligned by the formatter — never by
  spaces counted by hand.
- What a choice means is shown **before** it is answered.
- Every question has a default in `[...]`, and Enter takes it.
- **A question is asked at most three times**; then the default is taken and the dialog says so. The dialog must
  never loop.
- `--yes` answers everything with the default and prints the same lines.

## 5. Open questions

1. ~~**Should a development server turn sign-in off?**~~ **Settled: no.** It signs people in like any other, with
   the password the server prints, so a workflow written here behaves the same once deployed and no server is left
   in the state the Security page warns about.
2. **Where does this table live?** In `settings.schema.json` beside the `x-` keywords it already has (one source,
   shared with the Settings page), or in a table of its own in `setup.ts`.
3. ~~**How is a deployed server set up?**~~ **Settled: not in this release, and not by this dialog.** Production
   comes after integration, and it belongs to the application the workflows run inside: its database, its address,
   its users, its secrets. `setup` still changes any setting on an existing application, but it is not a
   "make this production" step and does not pretend to be one.
4. **Can `init` copy the HR demo?** The sample application is a template today: `templates/app`, packed from
   `apps/sampleApp`. The HR demo is a React application with a server, pages, its own users and an API of its own
   (`apps/hrdemo`), so it is bigger and it builds. Either it becomes a second template, or that answer clones the
   repository instead of copying a template.
