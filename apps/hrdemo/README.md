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
| `/hr/workflow/...` | BPMN Server's pages in the HR layout: the Workbench, My Work, Design, Administration |
| `/` (signed in) | BPMN Server's pages on their own |
| `/api/hr/...` | the HR REST API; `/api/hr/openapi.json` describes it |

The HR pages show owf's pages too: the sidebar's **Workflow** section (Workbench, My Work, Design, Administration) opens
them in the HR layout, at `/hr/workflow/<owf address>` (`src/pages/Workflow.jsx`), with owf's own menu
bar hidden. Moving inside them keeps the address in step, so a refresh or a link opens the same page.

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
| `workflow/` | everything of the workflows: `processes/` (the models and their tests), `settings/config.ts`, `delegates/`, `connectors/` (the services and the element templates), `services.json`, `test/` (runs the models' tests) |
| `.env` | the settings: `PORT` (3100), the database (`MONGO_DB_URL`, `mongodb://localhost:27017/hrdemo`), the keys |

## Commands

- `npm start`: build the HR pages and start the server.
- `npm run setup`: the settings step by step, then prepare the database.
- `npm test`: the models' tests, in memory.
- `npm run dev`: the HR application on its own, nothing else needed: http://localhost:5173/hr/, the pages (changes shown
  as they are saved) and the HR API. With `HR_API=http://localhost:3100`, the API of the running server instead, with
  the data the workflows see.
- `npm run hr`: the HR application alone, without BPMN Server, on `HR_PORT` (default 3101).
- `npm run cli`, `npm run mcp`, `npm run verify`: the console, the MCP server, a check of the models.

BPMN Server comes from this repository's packages (`file:../../packages/...`), so it runs the code as built here
(`npm run build` at the root). This application is separate from `apps/sampleApp`: it shares no code or data with it.
