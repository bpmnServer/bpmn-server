# Upgrading from 3.6 to 3.7.5

For an application on bpmn-server and bpmn-web 3.6 (tested from 3.6.1). Your models, your running cases, your users and
their passwords carry over as they are. What needs your attention is how API clients name a user, a renamed setting, and
two things a server with guests or old `/user` links must do first. Read [What changes behavior](#what-changes-behavior)
before you start; the rest is a checklist.

## Before you start

1. **Back up** the database (`mongodump`, or a copy of the SQLite file), the models folder (commit it) and `.env`.
2. **Node.js 20 or later** (22.5 or later for a SQLite database), as before.
3. **A server with guest access** (`GUEST_ACCESS`): delete its guest users (group `GUEST`) first. Guest access is gone, and a
   kept session would otherwise sign one in as a designer of the shared models.
4. **API clients that name a user** (`userName`, `options.userName`, bpmn-client's `userId`): see
   [the first row below](#what-changes-behavior). This is the one change that alters results without an error.

## Upgrade

The packages move together:

```sh
npm update bpmn-server bpmn-web bpmn-mcp      # and bpmn-client, if your code uses it
npm run verify                                # your models, against the new checker
npm start
```

The application's own files (`index.ts`, `settings/config.ts`, `delegates/`) need no change. `init` makes a newer application
than yours (its `setup` asks the database and the site, for one); you do not need to adopt it.

## What the first start does by itself

Tested on an application made by 3.6.1, with a running case, three users and seven models:

- **The database is kept and added to.** The first start creates its indexes and one new collection, `wf_tokens` (API v3's
  tokens). Nothing is removed, not even `wf_test_scenarios`. Users are not touched: the same ObjectId ids, groups and password
  hashes, so everyone signs in with their old password.
- **A case waiting at a task goes on.** The case 3.6.1 left at *Approve* was offered to its manager, completed on 3.7.5, and its
  script and service ran: the case ended with its data.
- **Connectors kept in the database are written out as files**: `connectors/hr.connector.json` in the models folder, and the
  log says so. Commit them. A connector's own key and its test stay with the server.
- **Policy folders move** (from the changelog): `policies/assignment/`, `notification/` and `security/` become `assignment/`,
  `notification/` and `security/` in the models folder, the first time each is read, and the log says so once. A file already
  in the new folder is kept, and the old one is left where it is.
- **Sessions** are kept in the same collection, in the same shape: nobody is signed out (from the changelog; not tested).

## What changes behavior

| Change | Who it affects | What to do |
|---|---|---|
| **`/api` and `/api2` act as the service account.** A user a call names is ignored, and the answer has a `Warning` header saying so (the changelog). | Any client that starts or completes work for a user through `/api` or `/api2`. | Use the task API (`POST /api2/tasks/start/:name`, with `API_ACTING_USER_KEY` and `x-acting-user`), or move to [API v3](api-v3.md): a token for each user. To keep the old behavior while you move, set `API_IMPERSONATION=true` (it goes at 4.0). |
| **`/api` and `/api2` are deprecated** until 4.0: fixes only. The log notes each deprecated call. | Every client of the old APIs. | Plan the move to API v3 (`/api/v3`). |
| **`SECRETS_KEY` is `CONNECTORS_KEY`'s new name** (the key the server encrypts its stored secrets with). | Servers that gave a connector a key. | Rename it in `.env`, keeping its value; until then the old name is read and the log says to rename it. A server with neither cannot store a connector's key; `init` and `setup` now make a `SECRETS_KEY` for a new one. |
| **Roles belong in `app-contract.json`**, not the models folder's `roles.json`. | Applications that check lanes against `roles.json`. | Nothing is required: `roles.json` is read when the contract declares none. Move them when you add a contract. |
| **Guest access is gone**: `GUEST_ACCESS`, `GUEST_SAVE`, `GUESTS_PATH`, `GUEST_MAX_MODELS`, `GUEST_RATE_LIMIT`. | Servers that used it. | Delete the guest users before upgrading (above), and the settings from `.env`. |
| **`/user`, a second copy of the workflow pages, is gone.** Its addresses go to the same page of the one set, so an old link still works. | Bookmarks and links to `/user/...`. | None. |
| **`demo` is deprecated**; `runTimers` and `runServiceTasks` are settings of their own. | Servers run in demo mode. | Set the two where you set `demo`. |
| **A new server has no setup page and no default admin.** It makes `admin` the first time it starts, with `ADMIN_PASSWORD` or a password it prints once. | New installations only: an existing one has its users. | None for an upgrade. |
| **Users and sessions are kept on the engine's store**, not through mongoose. On MongoDB they stay where they were. | Code that used mongoose features of the `User` model beyond `find`, `findOne`, `findById`, `countDocuments`, `create`, `updateOne`, `deleteOne`, `save`, `comparePassword`. | Change that code. |

## After the upgrade

1. Sign in as an administrator and as an ordinary user; open **Dashboard > Settings** and **Settings > Security**.
2. Open a case that was running, and complete a task as the person it is offered to.
3. Run `npm run verify`: models that checked clean before still do (tested: no errors or warnings on the 3.6.1 sample models).
4. Run your application's own scenario tests (`npm test`): the 3.6.1 sample application's seven passed unchanged.
5. Try each API client against a test server first, and read the `Warning` header and the log's deprecation lines.
6. Commit the connector files the first start wrote.
7. `npm run cli -- lu` lists the users; `npm run cli -- spw <user> <password>` sets a password
   ([the console](advanced.md)).

## If you must go back

Restore the database backup and the models folder, and install 3.6.1 again. Moving back without restoring was not tested,
and a case that went on under 3.7.5 is in the state 3.7.5 left it.

## How this was tested

An application made by `npx bpmn-server@3.6.1 init` on MongoDB: two users added from its administration page, a leave
request started and filled in, left waiting at *Approve*. Its dependencies were then pointed at 3.7.5 and nothing else
was changed. The checks above passed; the one result that differs is the first row of the table: a case started through
`/api` naming `user1` had `integration`, the service account, as its requester, and `user1` again with
`API_IMPERSONATION=true`.
