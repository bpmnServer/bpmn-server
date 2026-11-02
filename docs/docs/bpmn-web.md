bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

# Sample Web App

This is a sample web application (running Node.js and Express.js) to allow you to visualize your workflow, it is inteded as a front-end for `bpmn-server`. 

Please [see bpmn-server for full documentation](https://github.com/bpmnserver/bpmn-server)

# Installation

This package requires Node.js and an access to MongoDB ()
if you don't have MongoDB already installed you can [create a free cloud account here](http://bit.ly/cyd-atlas)

bpmn-web is a package an application starts with its own settings, delegate and models. Create one:

```sh
npx bpmn-server init my-app      # asks for the database; --memory to try it without MongoDB
cd my-app
npm start
```

The application's `.env` names the database and the keys:

```env
PORT=3000
MONGO_DB_URL=mongodb://localhost:27017/my-app
API_KEY=...                      # generated; callers of the REST APIs send it
```

Open http://localhost:3000 and sign in as `admin`, password `admin`, then change the password.

`init` creates the sample application: a few models, the services they call, the app delegate and settings
(`--minimal`: a one-model Hello application). The repository,
[bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server), has it as `sampleApp`, and the working
application with more models and the tests as `testSampleApp`: see [Installation](setup.md).

### Docker installation
bpmn-web and MongoDB in two containers, from [bpmnServer/docker](https://github.com/bpmnServer/docker):

```sh
git clone https://github.com/bpmnServer/docker.git
cd docker
up.cmd          # Windows
sh up.sh        # Linux, macOS
```

Open http://localhost:3000 and sign in as `admin`, password `admin`, then change the password. The first start
creates `.env` next to `docker-compose.yml` with random API keys; see the repository's README.

### Command Line Interface

bpmnServer provide some basic functionalities using CLI

```sh
npm run cli


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
npm update bpmn-server
```
