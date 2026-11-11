# Tutorial 9: Release

**The requirement:** the workflow reaches real users on a server, and every later change is checked the same way
before it does.

## The checks on every change

The model, its tests and your services are files: keep them in Git. Before each release, and in CI on each change:

```sh
npm ci
npm run verify        # every model checked, as the Problems tab does
npm test              # every model's tests, in memory
```

Either fails, nothing is released. For a CI service such as GitHub Actions, these are its steps after
`actions/setup-node`.

## The server

The sample application is a skeleton: its sign-in and its pages (My work, task forms) are bpmn-web's. Released as it is,
they serve a team that works inside it. For other users, your own application replaces them, and the server below becomes
bpmn-web on a private network, for your application's API calls and your administrators, with the model editor on a
design server of its own: [From the skeleton to your application](../architecture.md#from-the-skeleton-to-your-application).

On a new Ubuntu server (22.04 or 24.04), one line installs Node.js, MongoDB, your application as a service, and nginx in
front of it, and prints the administrator's password:

```sh
curl -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh | sudo bash -s -- --domain leave.example.com --email you@example.com
```

With `--domain`, it is served over HTTPS as soon as the domain points at the server. Then put your application on it
(your `processes/`, `connectors/`, `delegates/` and `settings/`, from Git), in `/opt/owf/my-app`, and
`owf restart`. Docker, and other ways: [Installation](../setup.md).

## Production settings

In the server's `.env`:

| Setting | For production |
|---|---|
| `NODE_ENV=production` | The server refuses to start without the secrets below |
| `SESSION_SECRET`, `API_KEY` | Long random values (the installer makes them) |
| `REQUIRE_AUTHENTICATION`, `ENFORCE_SECURITY` | `true` |
| `DISABLE_DESIGN=true` | No model editor and no test runs on the production server: models arrive from Git, tested |

Every setting: [Settings](../settings.md).

## Running it

- `owf status`, `owf logs`, `owf monitor`: the services, the log, and the server's load.
- **Dashboard → Administration**: users, locked instances, and **Backup** of everything.
- `owf update`: a new bpmn-server version, after its tests passed on yours.

## What you have

A leave request in which every path is designed, assigned, checked, documented and tested; an application whose
checks run on every change; and a server that runs it for real users.

Previous: [Tutorial 8](review.md). More, beyond the leave request: [Execute from Node.js](tutorial-script.md),
[Integrate an existing application](tutorial-integrate.md), [Connect external services](tutorial-connectors.md).
