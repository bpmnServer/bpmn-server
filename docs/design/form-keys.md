# Form keys: a task's form from the application

Status: draft for 3.7 (the 3.7 plan, part 5: "a task can name the app's own form instead"). Related:
[host-users.md](host-users.md) (the application signs people in), [api-v3.md](api-v3.md) (a task's form), `apps/hrdemo`.

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

## 3. The form key names a form of the application

```xml
<bpmn:userTask id="Assign" name="Assign the employee" camunda:formKey="app:assignment">
```

| Form key | Means |
|---|---|
| `app:<name>` | a form the application registered under `<name>` (§4) |
| none | the task's fields, drawn by owf (today, unchanged) |

Only `app:` in 3.7; Camunda's other prefixes (`embedded:`, `camunda-forms:`) are not supported, and verify says so. A
form key the application has not registered is a verify warning ("no form app:x on this server"), and the task falls
back to its fields.

## 4. The application registers its forms

At start, as it gives its user manager:

```ts
start({
    userManager,
    forms: {
        // a form: the page that shows it, for a task (or a start event) that names it
        assignment: { url: '/hr/forms/assignment', title: 'Assign an employee' },
        'leave-request': { url: '/hr/forms/leave-request' },
    },
});
```

- The page is the application's: its route, its components, its checks. owf only sends people to it.
- owf adds the task to the address: `/hr/forms/assignment?task=<id>` (a start event's: `?process=<name>&start=<id>`).
- The list is in `GET /api/v3/forms` too, for the model editor (the Form Key field offers them) and for agents.

## 5. The page and the task: API v3, as the person

The form's page reads and completes the task through API v3, with the application's own credential (host-users.md):

1. `GET /api/v3/tasks/{id}`: the task, its data (`data`: the instance's), its fields if any, who may complete it.
2. The person fills the form; the application checks it its own way.
3. `POST /api/v3/tasks/{id}/complete` with `{ data }`: the engine moves on. A start form: `POST
   /api/v3/processes/{name}/start`.
4. The page goes back where the person came from (`returnTo`), or to My Work.

The form may also do the application's own work on submit (save the assignment in its database), then complete the
task with what the process needs (the assignment's id). Which one writes the record, the form or a later service task,
is the model's choice; the demo shows both.

## 6. Where the person meets the form

- **owf's task page** (`/invokeItem`, My Work, the Workbench): a task with `app:<name>` sends the person to the form's
  page instead of drawing fields.
- **The application's own lists** (the HR demo's To do panel): it reads `form.formKey` and opens its own page directly.
- **A test, an agent** (no page): they complete the task through the API with `data`, as today; the form is not
  needed. The `.feature`'s data for such a task comes from the form's fields when the model lists them, else from the
  test as written: listing the fields beside the form key keeps both (the form for people, the fields for tests and
  verify).

## 7. The HR demo

- **Assign Employee**: a user task "Choose the assignment" with `camunda:formKey="app:assignment"`: the HR assignment
  form (employee and project pickers, role, allocation, dates), which fills the task's data; the connector then creates
  the assignment.
- **Leave Application's Request**: `app:leave-request`, a form of the HR application's, with the employee already
  known and the days counted as the dates are chosen.
- The forms are routes of the HR pages (`/hr/forms/...`), drawn in the HR layout, opened from the To do panel and from
  owf's task page.

## 8. Questions

1. **The registration**: in `start({ forms })` (proposed), or in the application's settings (`settings/config.ts`), or
   a file beside the models (`forms.json`, in git, as connectors should be)? Proposed: `start({ forms })`, with the
   same object readable from `settings/config.ts`.
2. **The prefix**: `app:<name>` (proposed), or a plain name, or a URL in the model (`/hr/forms/x`)? A URL ties the
   model to one application's routes; a name lets each application map it.
3. **Data in and out**: the form gets the instance's data (proposed), or only what the task's input parameters give
   it? And it completes with any data, or only the fields it lists?
4. **Start forms** in 3.7 too (a start event's `formKey`), or user tasks first?
