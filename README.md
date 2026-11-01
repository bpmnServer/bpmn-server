# bpmnServer4 (monorepo trial)

Experiment: bpmn-server, bpmn-client, bpmn-web, docs and docker in one repository, each brought in with its
history (`git subtree add` from the local repos). Local only.


1.  to publish
    > bpmn-server
    > bpmn-web
2.  install


npx bpmn-server init my-app          # or: npm create bpmn-app my-app

my-app/
  package.json      deps: bpmn-server, bpmn-web; scripts: start, setup, verify
  .env              generated keys, database URL
  src/
    config.ts         only the settings you override; bpmn-web supplies the defaults
    appDelegate.ts    extends bpmn-web's delegate (services, loadDataObject, ...)
    index.ts          start({ config, appDelegate, api: true, ui: true }) 
  processes/        one or two sample models
