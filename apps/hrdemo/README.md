# HR demo

The HR application of a professional services firm (employees, departments, clients, projects, assignments,
performance reviews) with BPMN Server (owf) installed in it: one server has the HR pages and API, and the workflows that
call them. The HR data is fictional and in memory: every start begins from `server/data.js` again.

```
npm install
npm start          # builds the HR pages, then http://localhost:3100
```

At the first start the server prints a setup token: open http://localhost:3100/setup and create the administrator.

| Address | What |
|---|---|
| `/` | BPMN Server: the Workbench, tasks, instances, the model editor, administration |
| `/hr/` | the HR pages: Dashboard, Employees, Performance Reviews, Clients, Projects, Assignments |
| `/api/hr/...` | the HR REST API; `/api/hr/openapi.json` describes it |

The HR pages show owf's pages too: the sidebar's **Workflow** section (Workbench, My Work, Design, Administration, My
Account) opens them in the HR layout, at `/hr/workflow/<owf address>` (`src/pages/Workflow.jsx`), with owf's own menu
bar hidden. Moving inside them keeps the address in step, so a refresh or a link opens the same page.

The models (`processes/`) call the HR API through the connector `hr`, made from `/api/hr/openapi.json` and pointed at
this server at every start. What a model records (an assignment, a leave) shows on the HR pages.

## The folder

| | |
|---|---|
| `index.ts` | starts the server: BPMN Server, with the HR API and pages mounted in it |
| `server/` | the HR application: `routes.js` (its API and the connector), `data.js`, `pages.js`, `openapi.json` |
| `src/`, `index.html`, `vite.config.js` | the HR pages (React), built into `dist` |
| `processes/` | the models and their tests |
| `settings/config.ts`, `delegates/`, `connectors/` | the workflow application's settings, delegate and services |
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
