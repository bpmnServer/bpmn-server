bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

## Introduction
BPMN 2.0 Modeling, Execution and Presistence, an open source Workflow Server for Node.js 

This package is designed specifically for Node.js and TypeScript


## Table of Contents
- [Process modeller](#process-modeller)
- [Execution](#Process-execution)
- [Installation](#Installation)
- [Demo](#Demo)
- [Acknowledgments](#acknowledgments)

### Documentation
- [Featuers](./docs/features)
- [Examples](./docs/examples.md)

# Process modeller

A web based modeler is included based on http://bpmn.io , models definitions are saved at your server
![Modeller](./docs/model-demo.gif)


# Process Execution

bpmn-server provides an bpmnEngine to execute your workflow definition supporting most of BPMN 2.0 elements

# Process Server

provides an environment to presist execution Instances while running and communicate with your application.

Applications can monitor and communicate to Instances whether they are running or offline, allowing user interface to query and process Workflow steps

# Data Queries 

Since instances are saved in MongoDB you can easily query your instances (running or completed)

# Sample Web App

Included is a sample web application (running Node.js and Express.js) to allow you to visualize your workflow 

# Installation

This package requires Node.js and an access to MongoDB ()
if you don't have MongoDB already installed you can [create a free cloud account here](http://bit.ly/cyd-atlas)

```javascript
$ mkdir myBPMN

$ cd myBPMN

$ npm install bpmn-server

$ cp node_modules/bpmn-server/WebApp/. ./  -r

Windows: 
xcopy /e /i /s /y node_modules\bpmn-server\WebApp\*.* .
```
Edit .env file to have MongoDB point to your server or free cloud account
```javascript
API_KEY=12345
MONGO_DB_URL=mongodb://0.0.0.0:27017/bpmn <---- point to your MONGODB
MONGO_DB_NAME=bpmn
DEFINITIONS_PATH="./processes/"
SESSION_SECRET=omni-secret
```
## To start server
```
npm run start
```
Console will display:
```text 
bpmn-server WebApp.ts version 1.4.0
MongoDB URL mongodb://0.0.0.0:27017/bpmn
db connection open

App is running at http://localhost:3000 in development mode
  Press CTRL-C to stop

```
Use your browser to view the bpmn-server running

## to update to latest release

```
$ npm update bpmn-server
```
# Full Demo

a full demo site is available @ http://bpmn.omniworkflow.com

# Example Script

```javascript
    const server = new BPMNServer(configuration, logger);

    let response = await server.execute('Buy Used Car');

    // let us get the items
    const items = response.items.filter(item => {
        return (item.status == 'wait');
    });

    items.forEach(item => {
        console.log(`  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });

    console.log('Invoking Buy');

    response = await server.invoke({instanceId: response.execution.id, elementId: 'task_Buy' },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");

    response = await server.invoke({ instanceId: response.execution.id, elementId: 'task_Drive' });

    console.log(`that is it!, process is now complete status=<${response.execution.status}>`)

```
for more complete examples see [Examples](./docs/examples.md)

# Acknowledgments

The **bpmn-server** resides upon the excellent library [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) developed by [bpmn.io](http://bpmn.io/)

The **bpmn-server** is inspired by the library [bpmn-engine](https://github.com/paed01/bpmn-engine) 
