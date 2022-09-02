bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

## Introduction
bpmn-server provides BPMN 2.0 Modeling, Execution and Persistence, as an open source Workflow Server for Node.js 

This package is designed specifically for Node.js and developed entirely in TypeScript 

A WebApp provides a UI from modeling and developing your workflow

## Table of Contents
- [Process modeller](#process-modeller)
- [Execution](#process-execution)
- [Installation](#installation)
- [Demo](#demo)
- [Acknowledgments](#acknowledgments)

### Documentation
- [Features](./docs/features.md)
- [Examples](./docs/examples.md)
- [API](./docs/api-summary.md)
- [BPMNClient /WebAPI](./docs/client-api.md)

# Process modeller

A web based modeler is included based on http://bpmn.io , models definitions are saved at your server
![Modeller](./docs/model-demo.gif)

Also included is BPMN-Properties-Panel to define the entire BPMN definition on-line, without the need to edit bpmn files.

![Modeller](./docs/bb-1.PNG)

# Process Execution

bpmn-server provides an bpmnEngine to execute your workflow definition supporting BPMN 2.0

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

## Installing Server and Web UI
```javascript
$ mkdir myBPMN

$ cd myBPMN

$ npm install bpmn-server

$ cp node_modules/bpmn-server/WebApp/. ./  -r

Windows: 
xcopy /e /i /s /y node_modules\bpmn-server\WebApp\*.* .

npm install

```
Edit .env file to point to MongoDB and set api-key

the change would look like this:

    MONGO_DB_URL=//localhost:27017?retryWrites=true&w=majority
or:
    MONGO_DB_URL=mongodb://<userName>:<password>@ip?retryWrites=true&w=majority

```javascript
node app
```
## Installing Client (for remote access)
```javascript
$ mkdir myClient

$ cd myClient

$ npm install bpmn-client

$ cp node_modules/bpmn-client/Sample/. ./  -r

Windows: 
xcopy /e /i /s /y node_modules\bpmn-client\Sample\*.* .

npm update

```

Edit .env file to point to the server and set api-key 

Add your own code in this directory

```javascript
node test

```


# Demo

a full demo site is available @ http://bpmn.omniworkflow.com

# Example

```javascript
    const server = new BPMNServer(configuration, logger);

    let response = await server.engine.start('Buy Used Car');

    // let us get the items
    const items = response.items.filter(item => {
        return (item.status == 'wait');
    });

    items.forEach(item => {
        console.log(`  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });

    console.log('Invoking Buy');

    response = await server.engine.invoke({ id: response.execution.id, "items.elementId": 'task_Buy' },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");

    response = await server.engine.invoke({ id: response.execution.id, "items.elementId": 'task_Drive' });


    console.log(`that is it!, process is now complete status=<${response.execution.status}>`)

```
for more complete examples see [Examples](./docs/examples.md)
# RoadMap and Project status
see [RoadMap](https://github.com/ralphhanna/bpmn-server/projects/1)
# Change Log

see [CHANGELOG](./docs/CHANGELOG.md)

# Acknowledgments

The **bpmn-server** resides upon the excellent library [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) developed by [bpmn.io](http://bpmn.io/)

The **bpmn-server** is inspired by the library [bpmn-engine](https://github.com/paed01/bpmn-engine) 
