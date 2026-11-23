# Tutorial 11: Connect external services

A process often needs another system: check a balance, create a ticket, wait for a payment. In this tutorial a service task calls GitHub's REST API with no code, a missing repository takes another path, and then the process hears back from outside.

The sample application has the model: **GitHub repository**. It needs the internet: the server calls `api.github.com`.

## Add the connector

A connector is a REST API, described by an OpenAPI document, that an administrator adds once. As the administrator, open **Dashboard → Administration → Connectors**. Under **From the catalog**, filter for `Github`, and choose **Add**.

**You should see** the connector's page, saying *Connector 'github' added*, with GitHub's operations (more than a thousand), each one enabled for designers or not. Its id is `github`: models call its operations as `github/<operation>`.

GitHub's public repositories need no key: calls without one are allowed 60 an hour. A key (a token) would be kept encrypted with `SECRETS_KEY` from `.env`, and never in a model. If `.env` sets `CONNECTORS_ALLOW_HOSTS`, it must include `api.github.com`. See [Connectors](../connectors.md#adding-a-connector-administrators).

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

```sh
curl -X POST https://your-server/api/v3/messages/PaymentReceived \
  -H "x-api-key: $API_KEY" -H "content-type: application/json" \
  -d '{ "data": { "amount": 250 }, "matchingKey": { "data.orderNo": "I-7" } }'
```

From Node.js, with [bpmn-client](../bpmn-client.md):

```ts
import { BPMNClient3 } from 'bpmn-client';

const service = new BPMNClient3({ url: 'https://your-server', apiKey: process.env.API_KEY });
const { instance } = await service.messages.throw('PaymentReceived', { amount: 250 }, { 'data.orderNo': 'I-7' });
if (!instance) console.log('nothing was waiting for it');
```

What delivery does:

- **One receiver.** The message goes to one waiting item. The **matching key** says which: a query over the waiting
  cases, such as `{ "data.orderNo": "I-7" }`. Without one, the first case found waiting receives it. A **signal**
  (`POST /signals/{id}`) reaches every case the key matches.
- **Nothing waiting starts a process.** If no case waits for it and a model has a message start event for it, that
  model is started, **each time the message is delivered**. A sender that retries, as webhooks do, can start a second
  case: send each event once, or have your handler check first.
- **Nothing at all** answers `{ instance: null }`: no case, nothing done.
- **Who may deliver.** The service key (`API_KEY`), whose account must include `SYSTEM` in
  `API_SERVICE_USER_GROUPS`. Messages and signals are system work, not a user's.
- **Where it went** is recorded in the case's Rationale, on both sides: what the message reached, and where the
  receiving case got it from. See [Messages](../examples/msg-throw-catch.md).

OmniWorkflow has no inbound webhook routes: the other system's webhook calls this API, directly or through a small handler in your application. Named webhook routes, with retries that never start a second process, are a proposal: see [the integration design](https://github.com/bpmnServer/bpmn-server/blob/main/docs/design/application-integration-design.md#5-inbound-webhooks-and-api).

Previous: [Tutorial 10, integrate an existing application](tutorial-integrate.md). Next: [Tutorial 12, release](release.md).
