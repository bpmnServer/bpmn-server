# HR demo

The HR application of a professional services firm (employees, departments, clients, projects, assignments,
performance reviews) with BPMN Server (owf) installed in it: one server has the HR pages and API, and the workflows that
call them. The HR data is fictional and in memory: every start begins from `server/data.js` again.

```
npm install
npm start          # builds the HR pages, then http://localhost:3100
```

Open http://localhost:3100: the demo's home page explains it and lists its accounts (password `demo1234`).

| Address | What |
|---|---|
| `/hr/welcome` | the home page (where `/` and `/hr/` go before signing in); `/hr/login` signs in |
| `/hr/` | the HR pages: Dashboard, Employees, Performance Reviews, Clients, Projects, Assignments; Users and My Account |
| `/hr/workflow/...` | BPMN Server's pages in the HR layout: the Workbench, My Work, Design, Administration, Integration |
| `/` (signed in) | BPMN Server's pages on their own |
| `/api/hr/...` | the HR REST API; `/api/hr/openapi.json` describes it |

The HR pages show owf's pages too: the sidebar's **Workflow** section (Workbench, My Work, Design, Administration, Integration) opens
them in the HR layout, at `/hr/workflow/<owf address>` (`src/pages/Workflow.jsx`), with owf's own menu
bar hidden. Moving inside them keeps the address in step, so a refresh or a link opens the same page.

Each shows only to whoever may open it, as BPMN Server says (`/api/v3/me`): the Workbench to administrators and
designers, Design and the model editors to designers, Administration to administrators (here the HR Administrator,
group ADMIN), Integration (the settings of the connector, the policies, notifications, the API) to both. Everyone has My Work and their tasks. An address they may not open goes to My Work
(`mayOpenWorkflow`, `src/auth.jsx`); BPMN Server refuses those pages to them anyway.

The environment (`APP_ENV`, `APP_ENV_LABEL` in `.env`) shows in the sidebar, as BPMN Server's pages show it. For a public
demo, `READ_ONLY=true`: visitors start cases and complete tasks, but the processes, the settings, the users and their
passwords stay as they are (docs/docs/environments.md).

The notification policy `LeaveNotices` tells the approver and the employee. The workflows hand each notification to
the delegate's `notify`, which keeps it in the HR application's own database: table `notifications` of `data/hr.sqlite`
(`server/notifications.js`). BPMN Server keeps its own record of every one, delivered or not: **Notifications**, under
Workflow, lists those to you (all of them for an administrator), and a case's page lists its own.

The models (`workflow/processes/`) call the HR API through the connector `hr`, made from `/api/hr/openapi.json` and
pointed at this server at every start, with the key `HR_SERVICE_KEY`. Assign Employee's assignment shows on the HR
pages.

## Signing in: the HR application's

The HR application has its own users, sessions and sign-in page (`/hr/login`); BPMN Server keeps none, and takes the
person the HR application signed in (`server/userManager.js`, bpmn-web's `IUserManager`: `start({ userManager })`).

- Its users and sessions are in `data/hr.sqlite` (`HR_DATA`); passwords hashed. HR Administrators manage them on the
  Users page; everyone changes their own password on My Account.
- A role gives the workflow groups: HR Administrator `Employee`, `HR`, `ADMIN`; Manager `Employee`, `Manager`; Employee
  `Employee` (Leave Application's lanes are these groups).
- The workflow API (`/api/v3`) takes the HR session too (`apiUser`): BPMN Server issues no tokens or AI links here.
- The first start makes the demo's accounts, `admin`, `sarah.chen`, `michael.brown` and `david.kim`, with the password
  `HR_DEMO_PASSWORD` (default `demo1234`). The home page (`/hr/welcome`, where `/` goes before signing in) shows them;
  `HR_DEMO_ACCOUNTS=false` hides them.

## The folder

| | |
|---|---|
| `index.ts` | starts the server: BPMN Server, with the HR application's sign-in, API and pages in it |
| `server/` | the HR application: `routes.js` (its API and the connector), `userManager.js` and `users.js` (its sign-in, users and sessions), `data.js`, `pages.js`, `openapi.json` |
| `src/`, `index.html`, `vite.config.js` | the HR pages (React), built into `dist` |
| `data/` | the HR users and sessions (`hr.sqlite`); not in git |
| `workflow/` | everything of the workflows: `processes/` (the models and their tests), `settings/config.ts`, `delegates/` (the delegate, its services and variables), `connectors/` (the element templates), `test/` (runs the models' tests) |
| `.env` | the settings: `PORT` (3100), the database (`MONGO_DB_URL`, `mongodb://localhost:27017/hrdemo`), the keys |

## Commands

- `npm start`: build the HR pages and start the server.
- `npm run setup`: the settings step by step, then prepare the database.
- `npm test`: the models' tests, in memory (the `hr` connector answers them from its own answers: `APP_ENV=test`), then
  the HR server's sign-in tests (`npm run test:server`: with `READ_ONLY=true`, no user or password changed).
- `npm run dev`: the HR application on its own, nothing else needed: http://localhost:5173/hr/, the pages (changes shown
  as they are saved) and the HR API. With `HR_API=http://localhost:3100`, the API of the running server instead, with
  the data the workflows see.
- `npm run hr`: the HR application alone, without BPMN Server, on `HR_PORT` (default 3101).
- `npm run cli`, `npm run mcp`, `npm run verify`: the console, the MCP server, a check of the models.
- `npm run demo:video`: records a read-only My Work and Leave Application process-guide walkthrough to `scripts/out/`.

BPMN Server comes from this repository's packages (`file:../../packages/...`), so it runs the code as built here
(`npm run build` at the root). This application is separate from `apps/sampleApp`: it shares no code or data with it.
