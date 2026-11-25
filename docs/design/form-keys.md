# Form keys: a task's form from the application

> **`appVars` was removed before 3.7.5 shipped** (no released version had it): the variables class, `getAppVars`, `${appVars.<name>}` in a form key and the contract's `var` expressions are gone. Where this page describes them, read it as the design as it was; a form key is the page's address as written, and the contract's expressions are functions (`appServices.<name>`).

Status: draft for 3.7 (the 3.7 plan, part 5: "a task can name the app's own form instead"). Related:
[host-users.md](host-users.md) (the application signs people in), [api-v3.md](api-v3.md) (a task's form),
[app-contract.md](app-contract.md) (`appVars`, for the address's expression), `apps/hrdemo`.

**Decided 2026-11-23** (§8): the form key is the page's **address**, not a registered name; owf passes the task's
**identifiers only**, never its data; a start event works the same way; and the address may hold an expression
(`${appVars.hrForms}`) so the host, not the model, says where the application lives.

## 1. Why

A user task's form today is its `camunda:formField` list, drawn by owf's task page (`/invokeItem`): plain inputs in
owf's look. An application usually has the form already: the HR application's assignment form, with its employee and
project pickers, its checks, its look. A task should be able to say "use the application's form", and the person sees
the application's form, filled with the task's data, and completing it completes the task.

## 2. What is there

- The engine reads `camunda:formKey` on user tasks and start events (`Definition.getNodeInfo` → `formKey`).
- API v3 answers it: `GET /api/v3/tasks/{id}` → `form: { fields, formKey }`; `GET /processes/startable` the start
  forms the same way.
- The model editor's properties panel sets it (Forms ▸ Form Key).
- Nothing uses it: owf's task page draws the fields only; an application has no way to say which forms it has.

## 3. The form key is the page's address

```xml
<bpmn:userTask id="Assign" name="Assign the employee" camunda:formKey="/hr/forms/assignment">
```

| Form key | Means |
|---|---|
| a path or URL | the application's page at that address (§4) |
| none | the task's fields, drawn by owf (today, unchanged) |

The key is the address owf sends the person to. Nothing registers it and nothing maps it: what the model says is where
the person goes. Camunda's prefixes (`embedded:`, `camunda-forms:`) are not supported, and verify says so.

**The address may be an expression**, so the model does not carry one deployment's routes:

```xml
<bpmn:userTask id="Assign" camunda:formKey="${appVars.hrForms}/assignment">
```

`appVars.<name>` is the application's own variable ([app-contract.md](app-contract.md) §2.1): declared in
`app-contract.json`, worked out by the application's `appVarsClass`, which is free to read `process.env` — so the
prefix lives in `.env` beside the rest of the deployment's configuration:

```ts
/** Where this deployment serves the HR forms (HR_FORMS_URL in .env). */
hrForms(): string { return process.env.HR_FORMS_URL ?? '/hr/forms'; }
```

The expression is worked out when the person opens the task, not when the model is saved. An address that is still
empty after it is worked out is a verify warning, and the task falls back to its fields.

## 4. What owf sends the page

Nothing is registered, so there is nothing to keep in step: the model holds the address, and owf adds who is asking.

| | What owf adds |
|---|---|
| A user task | `?instance=<instanceId>&item=<itemId>&returnTo=<url>` |
| A start event | `?process=<name>&start=<elementId>&returnTo=<url>` |

- **Identifiers only, never data.** The page reads what it needs through API v3, as the person (§5). No case data
  rides in an address, so none of it reaches browser history, a proxy's log or a referrer header, and the security
  policy stays the one gate — it is already applied by `GET /api/v3/tasks/{id}`.
- `item` alone would do, since the task answers its own `instanceId`; `instance` is sent too so a page that only links
  to the case needs no round trip.
- A start event has no task yet, so it is named by its process and its element.
- `returnTo` is where the person was, for the page to go back to (§6).

Because nothing is registered, the editor's Form Key field is free text and `verifyModel` cannot check that a page
exists — the cost of putting the address in the model. What it can check: the prefixes it does not support, and an
expression that works out to nothing.

## 5. The page and the task: API v3, as the person

The form's page reads and completes the task through API v3, with the application's own credential (host-users.md):

1. `GET /api/v3/tasks/{id}`: the task, its data (`data`: the instance's), its fields if any, who may complete it.
2. The person fills the form; the application checks it its own way.
3. `POST /api/v3/tasks/{item}/complete` with `{ data }`: the engine moves on. A start form: `POST
   /api/v3/processes/{name}/start`.
4. The page goes back where the person came from (`returnTo`), or to My Work.

**Any data.** The engine takes the object the form sends and does not filter it to the fields the model lists: an
application's form usually lists none, and it often has a result the process needs that no field describes (the
assignment's id). What a form may send is the application's business, as the form itself is.

The form may also do the application's own work on submit (save the assignment in its database), then complete the
task with what the process needs (the assignment's id). Which one writes the record, the form or a later service task,
is the model's choice; the demo shows both.

## 6. Where the person meets the form

Five flows. A–B are the same app page reached by two doors; C and D are what happens without a form key, or without a
person; E is a start event, which works like a task throughout.

### A. An app form, from the application's own list

1. The model's user task carries `camunda:formKey="/hr/forms/assignment"` (or `${appVars.hrForms}/assignment`).
2. The application's own list (the HR demo's To do panel) reads `form.formKey` from `GET /api/v3/tasks` and, on click,
   opens that address itself — it never passes through owf.
3. The page reads the task as that person: `GET /api/v3/tasks/{item}` — the task, its `data`, its fields if any, and
   who may complete it — then draws itself. The address gave it identifiers only, so this call is where it learns
   anything.
4. The form takes over: the application's components, the application's checks.
5. The person submits.
6. The page completes the task: `POST /api/v3/tasks/{id}/complete` with `{ data }`. It may do its own work first (save
   the assignment), then complete with what the process needs.
7. It shows its own message and goes back to `returnTo`, or to My Work.

### B. An app form, from owf's task page

1. The same model.
2. The person is in owf (`/invokeItem`, My Work, the Workbench), not in the application.
3. owf sees a form key and **sends the person to that address instead of drawing fields**, working out its expression
   first: `/hr/forms/assignment?instance=<instanceId>&item=<itemId>&returnTo=<url>`.
4. From here it is A.3–A.7, with `returnTo` pointing back into owf.

In A the application owns the link; in B owf hands the person over. One page serves both.

### C. No form key: owf draws the fields (today, unchanged)

1. The task has `camunda:formData`/`camunda:formField` and no `formKey`.
2. The to-do list sends the person to owf's task page.
3. owf draws the fields itself: plain inputs, owf's look.
4. The person fills them in owf.
5. The person submits.
6. owf completes the task.
7. Back to My Work.

A form key whose expression works out to nothing falls back to this flow, with a verify warning (§3).

### D. No page at all: a test or an agent

1. Any task, form key or not.
2. –5. There is no person and no page, so these steps do not happen.
6. The caller completes the task through the API with `data`, as today.
7. It asserts, or carries on with the scenario.

The `.feature`'s data for such a task comes from the form's fields when the model lists them, else from the test as
written. Listing the fields beside the form key keeps both: the form for people, the fields for tests and verify.

### E. A start event, not a task

The same five steps as A or B, with the start event's own address and call:

1. A start event carries `camunda:formKey="/hr/forms/leave-request"`. `GET /api/v3/processes/startable` answers the
   processes this person may start, each with its start form.
2. owf (or the application's own list) opens the page as
   `/hr/forms/leave-request?process=<name>&start=<elementId>&returnTo=<url>` — the process and the element, which is
   all there is to name before an instance exists.
3. The page has no task to read: it draws itself from the start form's fields, and whatever the application knows
   (the employee is the person signed in).
4.–5. As A.
6. The page starts the process: `POST /api/v3/processes/{name}/start` with `{ data }`.
7. As A; `returnTo`, or the new instance.

### The form in a frame

When owf shows the application's page in a frame, step 7 is a message rather than a redirect: the page tells the frame
what happened with `window.parent.postMessage`, from the application's origin only — `{ type: "owf:completed", task }`,
`{ type: "owf:cancelled", task }`, `{ type: "owf:height", value }` ([app-contract.md](app-contract.md) §4.2).

## 7. The HR demo

- **Assign Employee**: a user task "Choose the assignment" with `camunda:formKey="${appVars.hrForms}/assignment"`: the HR assignment
  form (employee and project pickers, role, allocation, dates), which fills the task's data; the connector then creates
  the assignment.
- **Leave Application's Request**: `${appVars.hrForms}/leave-request`, a form of the HR application's, with the employee already
  known and the days counted as the dates are chosen.
- The forms are routes of the HR pages (`/hr/forms/...`, `HR_FORMS_URL` in `.env`, read by the contract's `hrForms`
  variable), drawn in the HR layout, opened from the To do panel and from owf's task page.

## 8. Questions

All settled; kept for why each went the way it did.

1. ~~**The registration**: in `start({ forms })`, or the application's settings, or a file beside the models?~~
   **Settled 2026-11-23: nothing is registered.** The model holds the address (§3); `app-contract.json` needs no
   `pages`.
2. ~~**The prefix**: `app:<name>`, or a plain name, or a URL in the model?~~ **Settled 2026-11-23: the address, in the
   model** — simpler, and an expression (`${appVars.<name>}`, from `.env`) keeps one deployment's routes out of it
   (§3). The cost, accepted: no `page-unknown` check and no list for the editor to offer (§4).
3. ~~**Data in**: the instance's data, or the task's input parameters?~~ **Settled 2026-11-23: neither — identifiers
   only** (`instance`, `item`, or `process` and `start`). The page reads what it needs as the person, so the security
   policy stays the one gate and no data travels in an address (§4).
4. ~~**Start forms** in 3.7 too, or user tasks first?~~ **Settled 2026-11-23: in 3.7, the same flow as a user task**
   (§6, flow E), named by its process and element.
5. ~~**Data out**: any data, or only the fields the model lists?~~ **Settled 2026-11-23: any data** (§5) — a form
   that lists no fields is the ordinary case, and a form often returns what the process needs rather than what a
   field describes.
