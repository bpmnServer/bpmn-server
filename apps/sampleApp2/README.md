# sampleApp2: OWF beside a business application

OWF (bpmn-web) running as a server of its own, with the sample models, and a connector `hr` to the business application
beside it, [hrdemo2](../hrdemo2). Nothing of the application is inside this process: the two are side by side
([the target architecture](../../docs/design/target-architecture.md), [3.8](../../docs/design/roadmap-3.8.md)).

```
hrdemo2 (the HR application)                    sampleApp2 (OWF)
  signs people in, owns employees, ...   ---->   API v3: tasks, processes to start (a token for each person)
  /api/hr (employees, departments, ...)  <----   the connector `hr`: models call hr/listEmployees, ...
```

## Run

1. hrdemo2 first (it publishes the API the connector is made from): `cd ../hrdemo2 && npm start`.
2. Here, with `.env` set (below): `npm install`, `npm start`. This server reads hrdemo2's `/api/hr/openapi.json` and makes the
   connector `hr`, with the key `HR_SERVICE_KEY`.

`.env` here: `PORT`, `API_KEY` (hrdemo2's `OWF_SERVICE_KEY`), `HR_API_BASE_URL=http://localhost:3200/api/hr`,
`HR_SERVICE_KEY` (the same as in hrdemo2), `SECRETS_KEY` (this server keeps the key encrypted with it).

## Try it: list the employees

Start the model **List Employees**: a service task calls `hr/listEmployees`, and the employees of the HR application are in
the case's data (**My Work**, or `POST /api/v3/processes/List Employees/start`).
