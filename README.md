bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

## Introduction
BPMN 2.0 Modeling, Execution and Presistence, an open source Workflow Server for Node.js 

This package is designed specifically for Node.js and TypeScript


### Documentation
- [Features](./docs/features)
- [Examples](./docs/examples.md)

## Features
### Web based Process modeller

A web based modeler is included based on http://bpmn.io , models definitions are saved at your server
![Modeller](./docs/model-demo.gif)

### Full BPMN Process Engine

bpmn-server provides an bpmnEngine to execute your workflow definition supporting all of BPMN 2.0 elements with advanced extensions

bpmn-server is highly scalable solution, allow you to run multiple nodeJS either in same machine or in a distributed mode against same MongoDB 

### Presistent Processes

provides an environment to presist execution Instances while running and communicate with your application.

Applications can monitor and communicate to Instances whether they are running or offline, allowing user interface to query and process Workflow steps

### Data Queries 

Since instances are saved in MongoDB you can easily query your instances (running or completed)

### User Assignment and Access Control

### Application Integration

### Sample Web App

Included is a sample web application (running Node.js and Express.js) to allow you to visualize your workflow 

# Installation

This package requires Node.js and an access to MongoDB ()
if you don't have MongoDB already installed you can [create a free cloud account here](http://bit.ly/cyd-atlas)

```javascript
$ mkdir myBPMN

$ cd myBPMN

$ git clone https://github.com/bpmnServer/bpmn-web.git

$ npm install 

$ npm run setup 

Edit .env file to have MongoDB point to your server or free cloud account
```javascript
# PORT # for express application
PORT=3000

#API_KEY is used for remote access
API_KEY=12345

# MongoDB Settings
MONGO_DB_URL=mongodb://0.0.0.0:27017/bpmn	
#
DEFINITIONS_PATH="./WorkflowApp/processes/"
SESSION_SECRET=omni-secret

# Used to identify Servers when using multiple servers, each server needs a unique Id
SERVER_ID=PRIMARY

# --- Mail Setting  USING google email

SITE_NAME=BPMN.SERVER
EMAIL_FROM=<your email here>	# CHANGE TO YOUR EMAIL ADDRESS
SMTP_USER=<your email here>		# CHANGE TO YOUR GOOGLE EMAIL ADDRESS
SMTP_PASSWORD=<your application password here>	# CHANGE TO YOUR GOOGLE EMAIL PASSWORD  - see this link https://miracleio.me/snippets/use-gmail-with-nodemailer/


# -- Security Setting
# if true, would direct users to login page, requires registration
# valid values:	true	flase

REQUIRE_AUTHENTICATION=true		# set to false if you just want to run in DEV environment
ENFORCE_SECURITY=true


```
Run Setup one more time

```
$ npm run setup 
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

### Command Line Interface

bpmnServer provide some basic functionalities using CLI
```
$ npm run cli


server started..
Commands:
        q       to quit
        s       start process
        lo      list outstanding items
        li      list items
        l       list instances for a process
        di      display Instance information
        i       Invoke Task
        sgl     Signal Task
        msg     Message Task
        d       delete instnaces
        lm      List of Models
        lme     List of Models
        ck      Check locked instnaces
        re      Recover hung processes
        lu      List Users
        spw     Set User Password
        ?       repeat this list
Enter Command, q to quit, or ? to list commands
>
```

## to update to latest release

```
$ npm update bpmn-server
```

# Deployment Modes

BPMNServer is a backend server aimed to execute BPMN Models
You can deploy in several scenarios:
## Web Application 
We Provide a full demo @ http://bpmn.omniworkflow.com

Or installation above to install on your environemnt

## as a MicroService 

By running the WebApplication described above and access only the API

## Remote Access to WebServer

Using bpmnClient app

## Stand-alone

You can deploy a stand alone app using NodeJs scripts
for example:

```javascript
/* Most simple Script to start a process 
*/
    const api = new BPMNAPI(new BPMNServer(configuration));

    let response=await api.engine.start('Leave Request',{type:'Vacation'},SystemUser);

    const items = response.items.filter(item => {
        return (item.status == 'wait');
    });

    items.forEach(item => {
        console.log(`  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });

    console.log('Invoking Buy');

    response = await api.engine.invoke({instanceId: response.execution.id, elementId: 'task_Buy' },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false },SystemUser);

    console.log("Ready to drive");

    response = await api.engine.invoke({ instanceId: response.execution.id, elementId: 'task_Drive' },{},SsytemUser);

    console.log(`that is it!, process is now complete status=<${response.execution.status}>`)

```
for more complete examples see [Examples](./docs/examples.md)

# License 

This project is licensed under the terms of the MIT license.

# Acknowledgments

The **bpmn-server** resides upon the excellent library [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) developed by [bpmn.io](http://bpmn.io/)

The **bpmn-server** is inspired by the library [bpmn-engine](https://github.com/paed01/bpmn-engine) 
