# Installation

## installation of bpmn-server along with bpmn-web

```sh
git clone .../bpmn-web
npm install
copy sample.env .env
# edit .env file

npm run setup
npm start
```

### To Update

```sh
git pull
npm update
```

## installation of bpmn-client

create a folder or use an existing project

```sh
git clone .../bpmn-client-sample
copy sample.env .env
edit .env file

npm install
# To Update
git pull
npm update
```

# Setup bpmn Application with bpmn-server

## Configuration

Every project must have a configuration file that is an instance of [Configuration class](api/classes/common_DefaultConfiguration.Configuration.md)

This configuration file is passed to the BPMNServer constructor.

For testing purposes, you can have a different configuration than production in same environemnt by passign a different object.

## Environment

things that vary between dev and production

- timers:
  - forceTimersDelay
  - precision
- database:
  - MongoDB:
    db_url
    db

```ts
import { Configuration, ModelsDatastore, DataStore, Logger } from './';
import { MyAppDelegate } from './appDelegate';

let definitionsPath = __dirname + '/processes/';
var configuration = new Configuration({
  definitionsPath: definitionsPath,
  timers: {
    forceTimersDelay: 1000,
    precision: 3000,
  },
  database: {
    MongoDB: {
      db_url: 'mongodb://localhost:27017?retryWrites=true&w=majority',
      db: 'bpmn',
    },
  },
  /* Define Server Components */
  logger: function (server) {
    new Logger(server);
  },
  definitions: function (server) {
    return new ModelsDatastore(server);
  },
  appDelegate: function (server) {
    return new MyAppDelegate(server);
  },
  dataStore: function (server) {
    return new DataStore(server);
  },
});

export { configuration };
```

Example of usage in javascript

```ts
const { configuration } = require('../configuration.js');

const server = new BPMNServer(configuration, logger);
```

or in Typesciprt

```ts
import { configuration } from '../configuration.js';

const server = new BPMNServer(configuration, logger);
```

## Processes Folder

This is where the definition files reside, the demo WebApp contains a set of those file for you to start with.

## AppDelegate Class

This class handles application specific calls

```ts
moddleOptions;
servicesProvider;       // to respond to all named services
sendEmail(to, msg, body);
executionStarted(execution);
executionEvent({ event, item, execution });
messageThrown(signalId, data, messageMatchingKey: any, item: IItem);
signalThrown(signalId, data, messageMatchingKey: any, item: IItem);
issueMessage(messageId, data);
issueSignal(messageId, data);
serviceCalled(serviceName,data,item: IItem);
scopeEval(scope, script);
scopeJS(scope, script);
```
