bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

## Introduction
BPMN 2.0 Modeling, Execution and Presistence, an open source Workflow Server for Node.js 

## Table of Contents
- [Process modeller](#process-modeller)
- [Execution]
- [Installation](#Installation)
- [Demo](#Demo)
- [Acknowledgments](#acknowledgments)

### Documentation
- [Featuers](./docs/features)
- [Concepts](./docs/concepts)
- [API](/docs/.API.md)
- [Examples](./docs/example.md)

# Process modeller

A web based modeler is included based on http://bpmn.io , models definitions are saved at your server

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

This package requires Node.js and an access to MongoDB 

1) Download this package in a seperate folder
2) Run:

npm install

3) Edit configuration file to have MongoDB point to your server or free cloud account

4) run the app

node app

# Demo

a full demo site is available @ http://bpmn.omniworkflow.com

# Example

```javascript
import { BPMNServer } from '../src/BPMNServer';

const config = require('../configuration.js').configuration;

test();
async function test() {
    let name = 'Buy Used Car';

    server = new BPMNServer(config);
    let execution = await server.execute(name, {user:'rhanna'}, { caseId: 999 });
    let instance = execution.instance;
    let items = execution.instance.items;
    console.log(items);

```
for more complete examples see [Examples](./docs/example.md)

# Acknowledgments

The **bpmn-server** resides upon the excellent library [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) developed by [bpmn.io](http://bpmn.io/)

The **bpmn-server** is inspired by the library [bpmn-engine](https://github.com/paed01/bpmn-engine) 
