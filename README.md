bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

## Introduction
BPMN 2.0 Modeling, Execution and Presistence Server. Open source for Node.js workflow server.

## Table of Contents
- [Supported elements](#supported-elements)
- [Process modeller](#process-modeller)
- [Debug](#debug)
- [Acknowledgments](#acknowledgments)
- [Changelog](/Changelog.md)

### Documentation
- [Featuers](/docs/features)
- [Concepts](/docs/concepts)
- [API](/docs/API.md)
- [Examples](/docs/Examples.md)

# Supported elements

See [bpmn-elements](https://github.com/paed01/bpmn-elements) for supported elements.

# Process modeller

A web based modeler is included based on http://bpmn.io 

# Installation

1) Download this package in a seperate folder
2) Run:

npm -install

3) Edit configuration file to have MongoDB point to your server or free cloud account

4) run the app

node app

# Demo

a full demo site is available @ http://bpmn.omniworkflow.com

# Acknowledgments

The **bpmn-Server** resides upon the library [bpmn-engine](https://github.com/paed01/bpmn-engine) 
The **bpmn-engine** resides upon the excellent library [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) developed by [bpmn.io](http://bpmn.io/)
