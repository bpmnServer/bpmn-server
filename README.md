bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

## Introduction
BPMN 2.0 Modeling, Execution and Presistence Server. Open source for Node.js workflow server.

## Table of Contents
- [Process modeller](#process-modeller)
- [Installation](#Installation)
- [Demo](#Demo)
- [Acknowledgments](#acknowledgments)

### Documentation
- [Featuers](./docs/features.md)
- [Concepts](./docs/concepts.md)
- [API](/docs/API.md)
- [Examples](/docs/Examples.md)

# Process modeller

A web based modeler is included based on http://bpmn.io 

# Installation

This package requires Node.js and an access to MongoDB 

1) Download this package in a seperate folder
2) Run:

npm -install

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
for more complete examples see [Examples](/docs/Examples.md)

# Acknowledgments

The **bpmn-Server** resides upon the library [bpmn-engine](https://github.com/paed01/bpmn-engine) 
The **bpmn-engine** resides upon the excellent library [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) developed by [bpmn.io](http://bpmn.io/)
