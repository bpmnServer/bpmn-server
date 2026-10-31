# Tutorial
In this tutorial we will go through a complete Workflow Example.
But First let us see what is an already built Workflow will behave like to the end-user

Without any installation, let us go to bpmnServer [Demo Website](https://bpmn.omniworkflow.com)

1. Select Model `Leave Application'
2. Execute the model
3. Fill the form with requested input
4. You will see now the new `instance` of the model been created along with the data and items

# Installation

<!--include "index.md/#local-install" -->
### Local Install
This package requires Node.js and an access to MongoDB ()
if you don't have MongoDB already installed you can [create a free cloud account here](http://bit.ly/cyd-atlas) or can be [installed locally](https://www.mongodb.com/docs/manual/installation/)

-1 git clone
```sh
 git clone https://github.com/bpmnServer/bpmn-web.git
 cd bpmn-web
```
-2 install packages
```sh
 npm install
```
-3 setup the app
```sh
 npm run setup
```
 
-4 Edit .env file to have MongoDB point to your server or free cloud account

```sh
# MongoDB Settings
MONGO_DB_URL=mongodb://0.0.0.0:27017/bpmn
#
```
-5 Run Setup again to create db objects

```sh
npm run setup
```

Your installation is now complete.

- Start server

```sh
 npm run start
```

Console will display:

```{ .text .no-copy }
bpmn-server WebApp.ts version 1.4.0
MongoDB URL mongodb://0.0.0.0:27017/bpmn
db connection open

App is running at http://localhost:3000 in development mode
  Press CTRL-C to stop
```

Use your browser to view the bpmn-server running

<!--include -->

## Initialize data
