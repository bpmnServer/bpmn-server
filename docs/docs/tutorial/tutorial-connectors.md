# Connect external services

A process often needs another system: check a balance, create a ticket, wait for a payment. In this tutorial a service task calls GitHub's REST API with no code, a missing repository takes another path, and then the process hears back from outside.

The sample application has the model: **GitHub repository**. It needs the internet: the server calls `api.github.com`.

## Add the connector

A connector is a REST API, described by an OpenAPI document, that an administrator adds once. As the administrator, open **Dashboard → Administration → Connectors**. Under **From the catalog**, filter for `Github`, and choose **Add**.

**You should see** the connector's page, saying *Connector 'github' added*, with GitHub's operations (more than a thousand), each one enabled for designers or not. Its id is `github`: models call its operations as `github/<operation>`.

GitHub's public repositories need no key: calls without one are allowed 60 an hour. A key (a token) would be kept encrypted with `CONNECTORS_KEY` from `.env`, and never in a model. If `.env` sets `CONNECTORS_ALLOW_HOSTS`, it must include `api.github.com`. See [Connectors](../connectors.md#adding-a-connector-administrators).

## The service task

Open **GitHub repository** in the model editor and select **Get the repository**. Its panel shows what it calls:

| | |
|---|---|
| Operation | `github/repos/get`: `GET /repos/{owner}/{repo}` |
| Inputs | `owner` and `repo`, from the instance's data of the same names |
| Outputs | `description`, and `starsCount` from the answer's `stargazers_count` |

The **connector wizard** (**Calls → Connector**) builds this: it finds the operation by a search, fills required inputs from the data of the same name, and keeps the parts of the answer you tick. The model names `github/repos/get` and never a URL or a key, so it moves between servers.

## Run it

Choose **Run**. The start form has `owner` **bpmnServer** and `repo` **bpmn-server**: choose **Start**.

**You should see** the instance end at its end event, with GitHub's answer in its data: `description` (*BPMN 2.0 server for Node.js…*) and `starsCount`, the repository's stars.

## When the call fails

An HTTP error status comes back as the BPMN error `HTTP_<status>`. **No such repository** is a boundary error event on the task for `HTTP_404`. Run it again with `repo` **no-such-repository**.

**You should see** the instance end at **Not found**: GitHub answered 404, and the boundary event took the other path. A timeout or a server error is retried for operations that are safe to repeat. See [When the process runs](../connectors.md#when-the-process-runs).

The **Problems** tab checks connector tasks as you edit: a connector or operation this server doesn't have, a required input with no value, a connector turned off.

## Hearing back from outside

The other system tells a process that something happened, such as a payment that arrived, by **delivering a message** through the API. The process waits for it with a message catch event, or a receive task, named for that message:

```ts
import { BPMNClient } from 'bpmn-client';

const server = new BPMNClient('localhost', 3000, process.env.API_KEY);
const result = await server.engine.throwMessage('PaymentReceived', { amount: 250 }, { id: instanceId });
if (!result.id) console.log('nothing received it');
```

What delivery does:

- **One receiver.** The first waiting item for that message that the third argument matches (here, the instance `instanceId`) receives it, with the data. A **signal** (`throwSignal`) reaches every one waiting.
- **Nothing waiting starts a process.** If no instance waits for it and a model has a message start event for it, that model is started, each time the message is delivered. A sender that retries, as webhooks do, can start a second one: send each event once, or have your handler check first.
- **Nothing at all** answers an empty object: no instance, nothing done.
- **Errors come back in the body**, with HTTP status 200: `{ "errors": "..." }`. bpmn-client throws them as errors; a plain HTTP call must check for them.
- **Who may deliver.** Through `/api` (`BPMNClient`, `API_KEY`), any caller with the key. Through `/api2` (`BPMNClient2`), only a system account: the service account's `API_SERVICE_USER_GROUPS` must include `SYSTEM`.

BPMN Server has no inbound webhook routes: the other system's webhook calls this API, directly or through a small handler in your application. Named webhook routes, with retries that never start a second process, are a proposal: see [the integration design](../application-integration-design.md#5-inbound-webhooks-and-api).

One of the walkthroughs after the [tutorials](start.md): previous, [Integrate an existing application](tutorial-integrate.md).
