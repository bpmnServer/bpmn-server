# Development Environemnt

bpmn-server, bpmn-client, bpmn-web, the docs and the sample application are one repository, [bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server); npm
workspaces link the packages to each other, so a change to bpmn-server is what bpmn-web runs on.

```sh
git clone https://github.com/bpmnServer/bpmn-server.git
cd bpmn-server
npm install
npm run build                    # bpmn-server, bpmn-client, bpmn-web
cd testSampleApp
cp .env.example .env             # set MONGO_DB_URL
npm run setup
npm run debug                    # the sample application with the Node inspector; npm start without it
```

While working on bpmn-server or bpmn-web, run `npm run dev` at the root instead: testSampleApp runs on the
packages' TypeScript sources (the `bpmn-source` export condition) and restarts when any of them changes, and
the model editor is rebuilt as it changes. In VS Code, the launch configuration **testSampleApp: dev (debug)**
does the same under the debugger.

Tests: `npm test` at the root (bpmn-server, bpmn-client, testSampleApp); in testSampleApp also `npm run test:ui`.

Releases to npm are published by the maintainers.


New Status:
----------

Action: start/invoke etc.
Internal Action:
    -   execute a node completed from wait
    -   gotoNext Node
    -   goto wait state
    -   end parent node (like as subprocess)
    -   cancel /terminate node (like boundary)

New Debugger
------------
server.engine.debug(queryForItem,scriptToRun)