# Overview Home

`bpmn-server` provides a Workflow component based on **Business Process Model and Notation** that can be easily integrated into your application.


As workflow application can outlive Node.js applications, `bpmn-server` has out-of-the-box state presistence and variables, with concurrency across Node.js cluster and process instances
to make them ideal platform to do long running business processes, durable services or scheduled backgound tasks.


## Modeling
`bpmn-server` provides a modeling tool based on `bpmn.io` with customized property panel, no need to edit bpmn files

![](./docs/images/Modeler.png)

Typically your application has multiple bpmn models, a model is represented in a bpmn definition (xml).

Each Model is made of various elements, an `element` can be a `node` in the diagram (events/tasks/gateway) or a  `flow`

Models are saved by `bpmn-server` and can be queried [see API.model](./docs/api/interfaces/IAPIModel.md)

`bpmn-server` support all bpmn 2.0 elements [see Modeling Support](./docs/examples.md)

## Execution
`bpmn-server` is primiraly an execution engine for bpmn models.

Everytime a model is executed (started), an `instance` is created, and for each `element` that is executed it creates an `item' 

Execution is based on the model logic that is enhanced by various extensions that allow scripting and access to your application.

During Execution, Model Listeners and Application Listeners are invoked.

The execution `engine` is availabe through an API [see API.engine](./docs/api/interfaces/IAPIEngine.md).

For more details about Invoking Execution Engine [see](./docs/invokation.md)

For more details about Execution behaviour [see](./docs/execution.md)

## Datastore

At various stages of execution, instance object with its parts is saved into a datastore (defaults to MongoDB)

Instances and Items can be queried through an API [see API.data](./docs/api/interfaces/IAPIData.md)

For more details about data management [see Data](./docs/data.md)

# Demo Web Application

<details>
<summary>
A Demo Web application `bpmn-web` provides full front-end along with security features to demonstrate and test the capabilities of `bpmn-server`.
</summary>

The web app provides:
- Presistent Modeling tool, using bpmn.io 
- Model property panel supporting all features of `bpmn-server` , no need to edit bpmn file
- Execution with input form for defined fields

![](./docs/images/inputFields.png)

- List of outstanding/recent tasks and workflow
- Viewing of `instance` details

![](./docs/images/instance-details1.png)

- View of Model specification
![](./docs/images/instance-details2.png)

</details>

# User Management and Security

`bpmn-server` is relying on the front-end applicaton authenticate users and to pass user information through the API.
1. Model designer/developr can define assignee, candidateUsers, candidateUserGroups as static string or JavaScript expressions

2. Application fron-end need to pass the implementation of `userService' 

```ts
       let user1 =new SecureUser({ userName: 'user1', userGroups: ['Owner', 'Others']});
       let response = await api.engine.start('Vacation Request', {reason:'I like it',type:'Vacation'}, user1);
``` 
   
3. `bpmnServer` will enforce security rules based on the current user passed by the application

Demo Application(Express or NestJS) , provides a complete implementation of users management using Passport and MongoDB

# Application Integration

`bpmn-server` is intended to be integrated into your application[see](./docs/customization.md)

# Full Demo Web Application

We Provide a full demo @ https://bpmn.omniworkflow.com

# Installation

This package requires Node.js and an access to MongoDB ()
if you don't have MongoDB already installed you can [create a free cloud account here](http://bit.ly/cyd-atlas)

```sh

> git clone https://github.com/bpmnServer/bpmn-web.git

> npm install

> npm run setup
```
Edit .env file to have MongoDB point to your server or free cloud account

```env
# PORT # for express application
PORT=3000

#API_KEY is used for remote access
API_KEY=12345

# MongoDB Settings
MONGO_DB_URL=mongodb://0.0.0.0:27017/bpmn
#
... more settings
```

- Run Setup one more time

```sh
> npm run setup
```

Your installation is now complete.

## To start server

```sh
> npm run start
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

## Command Line Interface

bpmnServer provide some basic functionalities using CLI

```sh
>npm run cli


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

```sh
> npm update bpmn-server
```

# Documentation

- [Invoking Workflows](./docs/invokation.md) 
- [Execution](./docs/execution.md) 
- [Scripting](./docs/scripting.md) 
- [Security](./docs/security.md)
- [Data](./docs/data.md)
  -  [Input/Output](./docs/data#input-output-data.md)
  -  [Data Query](./docs/data#dataQuery.md) 
- [Examples](./docs/examples.md)
- [API Summary](./docs/api-summary.md)
- [API](./docs/api) 
- [Setup](./docs/setup.md) 
- [Application Integration](./docs/customization.md) 

# License

This project is licensed under the terms of the MIT license.

# Acknowledgments

The **bpmn-server** resides upon the excellent library [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) developed by [bpmn.io](http://bpmn.io/)

The **bpmn-server** is inspired by the library [bpmn-engine](https://github.com/paed01/bpmn-engine)
