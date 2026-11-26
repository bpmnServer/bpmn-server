# hrdemo2: the HR application on its own, beside OWF

The HR demo's business application, without OWF inside it: its sign-in and users (`server/userManager.js`, SQLite), its API
at `/api/hr`, its pages at `/hr` (React). The workflows are OWF's, on a server beside it ([sampleApp2](../sampleApp2)).

What it takes from OWF is in `server/owf.js`: for the person signed in here it asks OWF for a **token** (with the service key,
which stays on this server) and passes the pages' calls on to OWF's **API v3** as that person. The browser calls `/api/v3` on
this site, as it would on OWF's own; only what the pages need is passed on (a person's tasks and cases, the processes they may
start, who they are). The To do panel lists the tasks that way.

## Run

`.env`: `PORT` (default 3101), `HR_SERVICE_KEY` (what OWF's connector sends as `x-hr-key`), `OWF_URL` (http://localhost:3020),
`OWF_SERVICE_KEY` (OWF's `API_KEY`), `SESSION_SECRET`. Then `npm install`, `npm start`: http://localhost:3200/hr/.

## Not yet

A task whose model names no HR form opens in OWF's own pages, which are not shown here yet (the To do panel lists it,
greyed): embedding them is next ([the 3.8 roadmap](../../docs/design/roadmap-3.8.md)).
