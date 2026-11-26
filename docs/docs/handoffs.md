# Handoffs: sending a person to one page of OWF

An application that runs OWF beside it signs its people in and keeps their sessions. When it wants a person to work in
one of OWF's own pages (a task's form or a process's start form, drawn from the model, with its lists, lookups and rules),
it **hands them off**:
its back end asks OWF for a one-visit link, and the person's browser opens it. They are not asked to sign in again, and
the link opens that page and nothing else.

```
person's browser            the application (back end)                 OWF
  open this task   ----->   POST /api/v3/handoffs   (service key)  ->  a link for ann, task 7
                   <-----   302 to the link
  GET the link     ------------------------------------------------>   spent; a short session for that one task
                   <------------------------------------------------   the form, no menu
  submit the form  ------------------------------------------------>   completed as ann: the model's rules apply
                   <------------------------------------------------   302 to returnTo (the application)
```

## Asking for a handoff

`POST /api/v3/handoffs`, with the service key (`x-api-key`):

```json
{ "userName": "ann", "groups": ["Employee"], "page": { "type": "task", "id": "4d89d791-…" },
  "returnTo": "https://hr.example.com/hr/assignments", "minutes": 1 }
```

or, for a process's start form:

```json
{ "userName": "ann", "groups": ["Employee"], "page": { "type": "start", "process": "Leave Application", "startNodeId": "Begin" },
  "returnTo": "https://hr.example.com/hr/start" }
```

Answer `201`: `{ "handoff": "bph_…", "url": "https://owf.example.com/embed/task/4d89d791-…?handoff=bph_…", "expiresAt": "…" }`.
Send the person's browser to `url`.

- **Who it is for:** `userName` and `groups`, as for a [token](api-v3.md#post-tokens): the groups the application gives
  them, never `SYSTEM`, `ADMIN` or `DESIGNER`.
- **Which page:** a task (`{ "type": "task", "id" }`), or a process's start form (`{ "type": "start", "process",
  "startNodeId" }`: the start event, or the first the person may use). The form must be OWF's: a task or a start event whose
  model names the application's own form (`camunda:formKey`) is the application's to open, and answers 409. A start form for a
  process the person may not start is refused (403), as it is in `GET /api/v3/processes/startable`.
- **Where they go when done:** `returnTo`, an `http`/`https` address (the application's) or a path. A start form adds
  `?instance=<id>`, the case that was made. None: a page that says it is done.
- **How long:** `minutes`, default 1, at most 5. The link is **spent by its first visit**, whoever makes it.

With `bpmn-client`'s `BPMNClient3` (the application's side):

```ts
const service = new BPMNClient3({ url: process.env.OWF_URL, apiKey: process.env.OWF_SERVICE_KEY });
const { url } = await service.handoffs.task('ann', ['Employee'], task.id, { returnTo: 'https://hr.example.com/hr/' });
// or a start form: service.handoffs.start('ann', ['Employee'], 'Leave Application', { startNodeId: 'Begin', returnTo })
response.redirect(url);
```

## What the link opens

`/embed/task/<id>` is a task's form and `/embed/start/<process>` a process's start form, with no menu, for that person, as the
pages draw them, with their choices (`<owf:list>`, `<owf:lookup>`). Opening the link gives the browser a short session (15
minutes) that holds the person, that one page and `returnTo`; it opens that page, its choices and its submit, and **nothing
else** of OWF: the dashboards, the editor, the API and every other page ask for a sign-in or refuse. Submitting ends the session.

A task is completed through the same operations as `POST /api/v3/tasks/{id}/complete`, and a process is started as
`POST /api/v3/processes/{name}/start`, as that person: their part in the task or their lane, the case's security policy and
the form's rules apply, and a refused form says why.

## Not in this version

The page in a frame (it is a page the browser goes to and returns from; a frame needs the application's origin allowed and
cookies that cross sites), and pages other than a task's and a start form (a case's diagram, the guide). A browser keeps cookies by host, not port: when the
application and OWF run on one machine, reach them by different host names (`localhost` and `127.0.0.1`) or their sessions
will share one cookie name.

The working example is `apps/hrdemo2` (`server/owf.js`) beside `apps/sampleApp2`.
