# Connectors

A service task can call a **connector** instead of a service. A connector is a REST API, described by an
OpenAPI document, that an administrator adds to the server with its authorization key. The model names the
connector and one of its operations, and gives the operation's inputs and the parts of the answer to keep.

- **No code:** calling an API needs no method in the application's services.
- **No credentials in models:** the server holds the API's address and key; a model only names
  `<connector>/<operation>`. Models can be exported, shared and imported without leaking a key.
- **Governed:** the administrator chooses which operations designers may use, and which groups may use them.

Services stay: a service task calls either a service (application code, as in [Service Task](examples/serviceTask.md))
or a connector, never both.

New in 3.5: see [What's new in 3.5](whats-new-3.5.md).

## In the model

The task names `<connector>/<operationId>` in `camunda:connector`, with the connector's own inputs and outputs:

```xml
<bpmn:serviceTask id="GetRepo" name="Get the repository">
  <bpmn:extensionElements>
    <camunda:connector>
      <camunda:connectorId>github/repos/get</camunda:connectorId>
      <camunda:inputOutput>
        <camunda:inputParameter name="owner">${data.owner}</camunda:inputParameter>
        <camunda:inputParameter name="repo">${data.repo}</camunda:inputParameter>
        <camunda:outputParameter name="description">${output.description}</camunda:outputParameter>
        <camunda:outputParameter name="starsCount">${output.stargazers_count}</camunda:outputParameter>
      </camunda:inputOutput>
    </camunda:connector>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

- **`connectorId`** is the administrator's id for the connector (`github`), a `/`, and the operation's
  `operationId` in the OpenAPI document (`repos/get`).
- **Inputs** are named as the operation's parameters (path, query and header parameters), each a value or an
  expression. A JSON request body is given whole as `body`, or field by field as `body.<field>`.
- **Outputs:** `${output}` is the answer's body (JSON, else text); `${output.<field>}` one of its fields. Each
  output parameter keeps it in the instance data under its name (`data.starsCount`).
- Service tasks and send tasks can call connectors.

Camunda 7's generic `http-connector` (a raw URL and method) is not supported: verify reports a `connectorId`
that is not `<connector>/<operation>`.

## In the model editor

In the **Service** group of a service or send task, **Calls** is *Service* or *Connector*. Choosing *Connector*
opens the connector wizard, a window over the editor in three steps:

1. **Operation:** every operation you may use, grouped by connector. Type to search: the connector, the
   operation's id, method, path and summary are searched, and every word must match. Enter picks the operation
   when only one is found.
2. **Inputs:** a row for each of the operation's inputs, with its description, where it is sent (path, query,
   header, body) and its type. Required inputs are marked `*` and filled in from the data field of the same name
   (`${data.owner}`); **from data** fills one in again, and an input with a list of values offers them. An empty
   input is not sent.
3. **Outputs:** every part of the answer the document describes (and the whole answer), each with a check box and
   the data name it is kept under: the field's own name at first. **All** ticks every one.

Nothing changes in the model until **Done**, which writes the connector, its inputs and its outputs as one step
(one Undo takes it back). **Cancel**, ✕ or Escape leaves the task as it was.

The Service group then shows what the task calls: the operation with its method and path, the inputs, the
outputs, the HTTP errors the operation answers (a boundary error event catches them, below) and what is wrong
(no operation chosen, a connector the server does not have, a required input with no value).
**Edit connector…** opens the wizard again, at its inputs, with the task's values.

Switching **Calls** back to *Service* removes the connector; choosing a connector removes the service name.

## Adding a connector (administrators)

**Administration → Connectors** (`/dashboard/admin/connectors`) lists the server's connectors and a catalog of
public APIs to add from. To add one:

- **From the catalog:** filter the list and add an API. The catalog is
  [catalog/connectors/api-catalog.json](https://github.com/bpmnServer/bpmn-server/blob/main/catalog/connectors/api-catalog.json);
  `CONNECTOR_CATALOG_URL` (a web address or a file) names another.
- **Another API:** an id (the name models use; it cannot change later), and the OpenAPI document as a URL or
  pasted. OpenAPI 3.0 and 3.1, JSON or YAML. Swagger 2.0 is not supported yet.

The server keeps a copy of the document: a document that changes elsewhere changes nothing until the connector
is refreshed. The base URL defaults to the document's first `servers` entry.

A connector's page sets:

| Section | |
|---|---|
| **Settings** | Name, description, base URL, the **groups** that may design with it (empty: every designer), timeout, retries, enabled. |
| **Authorization key** | The scheme from the document's `securitySchemes`, or one given by hand: bearer token, API key (its header, query parameter or cookie name), or basic (`user:password`). The key is write-only: the page shows its type, its last 4 characters and when it was set, never the key. |
| **Operations** | Which of the API's operations designers may use. A large API is narrowed to the few that matter. |
| **Test the connection** | Calls an operation (by default a GET that needs no input) with the inputs given, and shows the answer. |
| **OpenAPI document** | Refresh it from its URL, or give a new one; the operations added and removed are listed. |
| **Delete** | Lists the models that use the connector first. |

**Keys are encrypted** (AES-256-GCM) with `CONNECTORS_KEY` from `.env`, which is never stored in the database.
Without `CONNECTORS_KEY` a connector cannot be given a key, and the page says so. A backup holds the encrypted
key only: restoring it needs the same `CONNECTORS_KEY`.

### From the console

With administration off (`DISABLE_ADMIN=true`), or from a script, the console (`npm run cli`) has the same
operations:

| Command | |
|---|---|
| `co` | list the connectors |
| `coa` | add one (the OpenAPI document as a URL or a file) |
| `cok` | set its key |
| `coe` | enable or disable it |
| `cot` | test it |
| `cor` | refresh its document |
| `cod` | delete it |
| `coc` | call one of its operations with inputs |

### Who may use a connector

- **In the editor,** the wizard lists only the connectors that are enabled and allowed to the designer's groups,
  and only their enabled operations.
- **At run time,** the connector and the operation must exist and be enabled. Groups limit who may *design*
  with a connector, not who may run a model that uses it.

## When the process runs

When a token reaches a connector task, the engine:

1. evaluates the inputs, as input parameters are evaluated for a service;
2. builds the request: path parameters into the path (encoded), query and header parameters where the document
   places them, `body` or the `body.<field>` inputs as JSON, and the authorization. The URL is always the
   connector's base URL and the operation's path: no input can change the host;
3. calls it, with a timeout, and retries `GET`, `HEAD`, `PUT`, `DELETE` and `OPTIONS` (never `POST` or `PATCH`)
   on a network error, `429` or `5xx`, waiting longer each time;
4. on a **2xx** answer, sets `${output}` and keeps the outputs in the data.

**Another status** (4xx, 5xx, or a 3xx: redirects are not followed) is a BPMN error with the code
`HTTP_<status>`, and the output is `{ status, error: <the body> }`. A boundary error event with that error code
catches it:

```xml
<bpmn:error id="NotFound" name="Not found" errorCode="HTTP_404" />
...
<bpmn:boundaryEvent id="Missing" attachedToRef="GetRepo">
  <bpmn:errorEventDefinition errorRef="NotFound" />
</bpmn:boundaryEvent>
```

Without one, the instance ends, as it does for a service's BPMN error. The run's decisions say which status
raised which error.

**No answer** (the network, the timeout), or a connector or operation that is missing or disabled, fails the
task with the reason, as a service that throws does.

In **demo mode** (`DEMO_MODE=true`), connectors are not called: the task ends with no output, and the run's
decisions say so.

## Checking models

[`verifyModel`](verify.md) and the editor's Problems tab check connector tasks:

| Code | Severity | |
|---|---|---|
| `connector-not-named` | error | no connector named, or not `<connector>/<operation>` |
| `connector-and-service` | error | the task names a service as well |
| `connector-unknown` | error | the server has no such connector |
| `connector-unreadable` | error | the connector's document cannot be read |
| `connector-operation-unknown` | error | the connector has no such operation |
| `connector-input-missing` | error | a required input, or a required request body, is not given |
| `connector-disabled` | warning | the connector is disabled: the task fails until it is enabled |
| `connector-operation-disabled` | warning | the operation is disabled |
| `connector-input-unknown` | warning | an input the operation does not have (it is not sent) |

The checks that need the connectors run with a server (the editor, `api.model.verifyModel`), not from the
command line. A model imported from elsewhere that names a connector this server does not have gets
`connector-unknown`: importing never adds a connector.

## Settings

| Setting | |
|---|---|
| `CONNECTORS_KEY` (`.env`) | The key that encrypts the connectors' keys. Required to give a connector a key. |
| `CONNECTORS_ALLOW_HOSTS` (`.env`) | A comma list of the hosts a connector may call (`api.github.com,*.example.com`). Unset: any. |
| `CONNECTOR_CATALOG_URL` (`.env`) | The catalog the Connectors page offers (a web address or a file). |
| `connectors.timeout` (configuration) | A call's timeout in ms, unless the connector sets its own. Default 30000. |
| `connectors.retries` | Retries of an idempotent call, unless the connector sets its own. Default 2. |
| `connectors.retryDelay` | The first wait before a retry in ms, doubled each time. Default 200. |
| `connectors.maxResponseBytes` | The largest answer read. Default 5 MB. |

Connectors are kept in the `wf_connectors` collection of the server's storage (MongoDB, SQLite or memory), and are
in the administration backup.

## Example

testSampleApp's model **GitHub repository** calls `github/repos/get` for an `owner` and a `repo`, keeps the
repository's `description` and `starsCount`, and ends at *Not found* on a 404. Add the connector from the console
(`coa`, id `github`, document `connectors/openapi/github.json`), then start the model with
`owner bpmnServer repo bpmn-server`.
