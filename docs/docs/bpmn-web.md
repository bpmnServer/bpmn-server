bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

# Sample Web App

This is a sample web application (running Node.js and Express.js) to allow you to visualize your workflow, it is inteded as a front-end for `bpmn-server`. 

Please [see bpmn-server for full documentation](https://github.com/bpmnserver/bpmn-server)

## The menu

Every page has the same menu: **Workbench** (the home page: models, pending tasks, instances), then
**Dashboard**. For a designer or an administrator, Dashboard is a drop-down: **My work** (their tasks and
processes), **Design** (the models and decisions, their tests) and, for administrators, **Administration**;
everyone else has **My work** alone. On the right: the user (My account, Sign out) and About. The model and
decision editors show the same places in their header. A page's own links (the Workbench's sections, the docs' pages)
are in the page, not in the menu, and pages that only say something (not found, not allowed, an error) have the menu too.

# Installation

This package requires Node.js 20 or later and MongoDB (or `--memory`, to try it without one).
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
bpmn-web and MongoDB in two containers. Docker is all you need, and two files. On Linux or macOS:

```sh
mkdir bpmn-web && cd bpmn-web
curl -O https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/docker-compose.yml
curl -O https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/up.sh
sh up.sh
```

On Windows (PowerShell):

```powershell
mkdir bpmn-web; cd bpmn-web
curl.exe -O https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/docker-compose.yml
curl.exe -O https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/up.cmd
.\up.cmd
```

Open http://localhost:3000 and sign in as `admin`. The first start creates `.env` next to `docker-compose.yml`
with random keys and the password, and prints the password; see [Docker](docker.md).

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
npm update bpmn-server bpmn-web
```
