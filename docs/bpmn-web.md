bpmn-server
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

# Sample Web App

This is a sample web application (running Node.js and Express.js) to allow you to visualize your workflow, it is inteded as a front-end for `bpmn-server`. 

Please [see bpmn-server for full documentation](https://github.com/bpmnserver/bpmn-server)

# Installation

This package requires Node.js and an access to MongoDB ()
if you don't have MongoDB already installed you can [create a free cloud account here](http://bit.ly/cyd-atlas)

```sh

git clone https://github.com/bpmnServer/bpmn-web.git

cd bpmn-web

npm install

npm run setup
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

Run Setup one more time

```sh
npm run setup
```

## To start server

```sh
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
