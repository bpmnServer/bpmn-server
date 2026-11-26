# hrdemo2: the HR application on its own, beside OWF

The HR demo's business application, without OWF inside it: its sign-in and users (`server/userManager.js`, SQLite), its API
at `/api/hr`, its pages at `/hr` (React). The workflows are OWF's, on a server beside it ([sampleApp2](../sampleApp2)).

What it takes from OWF is in `server/owf.js`: for the person signed in here it asks OWF for a **token** (with the service key,
which stays on this server) and passes the pages' calls on to OWF's **API v3** as that person. The browser calls `/api/v3` on
this site, as it would on OWF's own; only what the pages need is passed on (a person's tasks and cases, the processes they may
start, who they are). The To do panel lists the tasks that way.

A task whose model names an HR form (`camunda:formKey`) opens on HR's own page. Any other opens in **OWF's own form**, by a
[handoff](../../docs/docs/handoffs.md): `GET /api/hr/owf/task/:id` asks OWF for a one-visit link for the person signed in
here and sends the browser to it; OWF shows the form with no menu and no second sign-in, completes the task as that person
and sends them back to the page they came from. Reach OWF by a different host name than this site (`OWF_URL=http://127.0.0.1:3020`
while this one is `localhost:3200`): a browser shares cookies by host, not port, and both keep a session.

## Run

`.env`: `PORT` (default 3101), `HR_SERVICE_KEY` (what OWF's connector sends as `x-hr-key`), `OWF_URL` (http://127.0.0.1:3020),
`OWF_SERVICE_KEY` (OWF's `API_KEY`), `SESSION_SECRET`. Then `npm install`, `npm start`: http://localhost:3200/hr/.

## Not yet

OWF's other pages (a case's diagram and replay, the guide, a start form) are not opened from here; a page in a frame, and the
event feed that refreshes the To do panel when OWF changes something, are next ([the 3.8 roadmap](../../docs/design/roadmap-3.8.md)).
