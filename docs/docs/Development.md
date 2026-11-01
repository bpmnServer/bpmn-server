# Development Environemnt

bpmn-server, bpmn-client, bpmn-web, the docs and the sample application are one repository, bpmnServer4; npm
workspaces link the packages to each other, so a change to bpmn-server is what bpmn-web runs on.

```sh
git clone <repository URL> bpmnServer4
cd bpmnServer4
npm install
npm run build                    # bpmn-server, bpmn-client, bpmn-web
cd testSampleApp
cp .env.example .env             # set MONGO_DB_URL
npm run setup
npm run debug                    # the sample application with the Node inspector; npm start without it
```

Tests: `npm test` at the root (bpmn-server, bpmn-client, testSampleApp); in testSampleApp also `npm run test:ui`.

To publish: `npm publish -w bpmn-server` (or `-w bpmn-client`, `-w bpmn-web`) after `npm run build`.


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