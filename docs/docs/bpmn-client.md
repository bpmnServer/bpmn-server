bpmn-client
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

This is a light-weight package to allow remote access to [bpmn-server](https://github.com/bpmnServer/bpmn-server)

# Installation

In the application that calls bpmn-server (a new folder, or an existing Node.js project):

```sh
npm init -y && npm pkg set type=module      # a new project; skip in an existing one
npm install bpmn-client
npx bpmn-client-setup                       # writes .env: API_KEY, HOST, PORT
```

Set `.env` to the server: `API_KEY` is the server's (from its `.env`; `ADMIN_API_KEY` too, for model
administration), `HOST` and `PORT` where it runs. Then:

```sh
npx bpmn-client-cli                         # a console on the server: start processes, list and invoke items
```

A complete example application: [bpmn-client-sample](https://github.com/bpmnServer/bpmn-client-sample).

### to update to latest release

```
$ npm update bpmn-client
```

